from fastapi import APIRouter, HTTPException, Depends, Request, Query
from fastapi.responses import JSONResponse, RedirectResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from typing import Dict, List, Optional, Any
import uuid
import os
import requests

# Create router
router = APIRouter(prefix="/api/composio", tags=["composio"])

# Use composio_integration if available
# Import and initialize Composio client with proper error handling
from composio_integration.client import ComposioClient
try:
    composio_client = ComposioClient()
    print("Composio toolset initialized successfully")
except Exception as e:
    raise RuntimeError(f"ERROR: Failed to initialize Composio integration: {e}")

# Define the Composio OAuth base URL
COMPOSIO_AUTH_URL = "https://auth.composio.dev/oauth"

# In-memory storage for OAuth states.
# WARNING: This is not suitable for production environments with multiple server instances
# or where persistence across restarts is required. Use Redis or a database in such cases.
oauth_states_storage: Dict[str, str] = {}

@router.get("/oauth/url")
async def get_oauth_url(app_name: str, redirect_uri: str):
    """
    Get OAuth URL for white-label authentication
    
    Args:
        app_name: Name of the app to authenticate
        redirect_uri: URI to redirect to after authentication
    """
    try:
        print(f"Route /api/composio/oauth/url called for app: {app_name}")
        # Call the ComposioClient's get_oauth_url method.
        # This method is now expected to use toolset.initiate_connection
        # and return a dictionary: {"url": "...", "state": "..."}
        response_data = composio_client.get_oauth_url(app_name, redirect_uri)
        
        if not response_data or "url" not in response_data or "state" not in response_data:
            print(f"ERROR: composio_client.get_oauth_url did not return expected data for {app_name}")
            raise HTTPException(status_code=500, detail="Failed to get OAuth URL from Composio client")

        # Store the state generated and returned by the client for verification in the callback
        client_generated_state = response_data["state"]
        oauth_states_storage[client_generated_state] = "pending"
        print(f"OAuth state '{client_generated_state}' (from client) stored for app {app_name}.")
        
        return response_data # Contains {"url": ..., "state": ...}
    except Exception as e:
        print(f"ERROR in /api/composio/oauth/url route for app {app_name}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get OAuth URL: {str(e)}")

@router.get("/oauth/callback")
async def oauth_callback(code: str = Query(...), state: str = Query(...)):
    """
    Handle OAuth callback from Composio
    
    Args:
        code: Authorization code
        state: State parameter
    """
    try:
        print(f"--- OAUTH CALLBACK HIT: state={state}, code={code} ---") # Diagnostic print
        # Verify state parameter to prevent CSRF attacks
        if state not in oauth_states_storage:
            print(f"OAuth callback: State '{state}' not found in storage. Current storage: {oauth_states_storage}")
            raise ValueError("Invalid state parameter. Authentication flow may have expired, been tampered with, or this is an old state.")
        
        # Clear state from our in-memory dictionary
        oauth_states_storage.pop(state, None)
        print(f"OAuth state verified and removed: {state}")
        
        # Extract app name from state
        app_name = state.split("_")[0] if "_" in state else "unknown"
        
        # Handle the OAuth callback with Composio
        result = composio_client.handle_oauth_callback(code, state)
        
        # Create a VERY minimal success HTML response for debugging postMessage
        app_name_str = str(app_name)
        connection_id_str = str(result.get("id", ""))

        # Force extremely raw HTML, no DOCTYPE, html, head, or body tags initially from Python string
        # The browser will construct them, but hopefully after our script runs.
        raw_script_html = f"""
<script>
    console.log("[RAW POPUP SCRIPT] Script block started.");
    // Function to be called explicitly or on a very basic event
    function sendMessageToOpener() {{
        console.log("[RAW POPUP SCRIPT] sendMessageToOpener() called.");
        const app = '{app_name_str}';
        const connId = '{connection_id_str}';
        console.log("[RAW POPUP SCRIPT] App:", app, "ConnID:", connId);

        if (window.opener && window.opener.postMessage) {{
            console.log("[RAW POPUP SCRIPT] window.opener detected. Attempting postMessage.");
            try {{
                window.opener.postMessage({{
                    type: 'oauth_callback',
                    status: 'success',
                    app: app,
                    connectionId: connId
                }}, '*');
                console.log("[RAW POPUP SCRIPT] postMessage sent.");
                document.body.innerHTML = '<h1>Success! postMessage sent. Closing soon...</h1><p>(Raw HTML Test)</p>';
            }} catch (e) {{
                console.error("[RAW POPUP SCRIPT] Error during postMessage:", e);
                document.body.innerHTML = '<h1>Error during postMessage. See console.</h1><p>(Raw HTML Test)</p>';
            }}
        }} else {{
            console.warn("[RAW POPUP SCRIPT] window.opener or window.opener.postMessage is not available.");
            let msg = '<h1>Error: window.opener not found.</h1><p>(Raw HTML Test)</p>';
            if (!window.opener) msg = '<h1>Error: window.opener is null.</h1><p>(Raw HTML Test)</p>';
            else if (!window.opener.postMessage) msg = '<h1>Error: window.opener.postMessage is null.</h1><p>(Raw HTML Test)</p>';
            document.body.innerHTML = msg;
        }}

        console.log("[RAW POPUP SCRIPT] Scheduling self-close in 10 seconds.");
        setTimeout(function() {{
            console.log("[RAW POPUP SCRIPT] Attempting to close window.");
            window.close();
        }}, 10000); // 10 seconds
    }}

    // Attempt to run immediately, and also on load as a fallback
    if (document.readyState === 'loading') {{
        document.addEventListener('DOMContentLoaded', sendMessageToOpener);
    }} else {{
        // DOMContentLoaded has already fired or not applicable
        sendMessageToOpener();
    }}
    // Fallback if everything else fails
    // setTimeout(sendMessageToOpener, 100);
</script>
<h1>Processing... (Raw HTML Test)</h1>
        """
        # Return as text/html directly, hoping to bypass framework wrappers
        headers = {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
            "Surrogate-Control": "no-store"
        }
        return HTMLResponse(content=raw_script_html, headers=headers)
    except Exception as e:
        print(f"ERROR in /api/composio/oauth/callback generating HTML: {e}")
        # Create error HTML response with safe handling of error message
        error_message = str(e).replace('"', '&quot;').replace("'", "&apos;")
        error_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Authentication Failed</title>
            <script>
                window.onload = function() {{
                    // Notify the parent window of failure
                    if (window.opener) {{
                        window.opener.postMessage({{
                            type: 'oauth_callback',
                            status: 'error',
                            message: '{error_message}'
                        }}, '*');
                        // Close this popup window after a delay
                        setTimeout(function() {{
                            window.close();
                        }}, 2500);
                    }} else {{
                        // Redirect to the main page if not in a popup
                        window.location.href = "/?connection_status=error&message=" + encodeURIComponent("{error_message}");
                    }}
                }};
            </script>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #fef2f2;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    text-align: center;
                    padding: 20px;
                }}
                h2 {{
                    color: #b91c1c;
                    margin-bottom: 16px;
                }}
                p {{
                    color: #334155;
                    margin: 8px 0;
                }}
                .error-box {{
                    background-color: #fee2e2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    padding: 12px 20px;
                    margin: 16px 0;
                    max-width: 500px;
                    word-break: break-word;
                }}
                .error-icon {{
                    width: 64px;
                    height: 64px;
                    background-color: #ef4444;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 24px;
                    color: white;
                    font-size: 40px;
                    font-weight: bold;
                }}
            </style>
        </head>
        <body>
            <div class="error-icon">!</div>
            <h2>Authentication Failed</h2>
            <div class="error-box">
                <p>{error_message}</p>
            </div>
            <p>This window will close automatically.</p>
        </body>
        </html>
        """
        
        return HTMLResponse(content=error_html)

@router.get("/connections")
async def list_connections():
    """
    List all available connections for the current user
    """
    try:
        connections = composio_client.list_connections()
        return {"connections": connections}
    except Exception as e:
        print(f"Error listing connections: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list connections: {str(e)}")

@router.post("/tools/{tool_name}/execute")
async def execute_tool(tool_name: str, params: Dict[str, Any]):
    """
    Execute a Composio tool with the given parameters
    
    Args:
        tool_name: Name of the tool to execute
        params: Tool parameters
    """
    try:
        result = composio_client.execute_tool(tool_name, params)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute tool: {str(e)}")

@router.get("/tools")
async def get_tools(apps: Optional[str] = None):
    """
    Get available tools for specified apps
    
    Args:
        apps: Comma-separated list of app names
    """
    try:
        app_list = apps.split(",") if apps else None
        tools = composio_client.get_tools(app_list)
        return {"tools": tools}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get tools: {str(e)}")

@router.get("/gmail/tools")
async def get_gmail_tools():
    """
    Get Gmail-specific tools
    """
    try:
        tools = composio_client.get_gmail_tools()
        return {"tools": tools}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get Gmail tools: {str(e)}")

@router.delete("/connections/{connection_id}")
async def delete_connection(connection_id: str):
    """
    Delete a Composio connection by its ID.
    """
    try:
        if not composio_client:
            raise HTTPException(status_code=500, detail="Composio client not initialized")

        # This assumes a method 'delete_connection' will be added to ComposioClient
        success = composio_client.delete_connection(connection_id)
        
        if success:
            return JSONResponse(content={"message": "Connection deleted successfully"}, status_code=200)
        else:
            # If delete_connection returns False, it implies a handled failure (e.g., not found, API error)
            raise HTTPException(status_code=404, detail=f"Failed to delete connection {connection_id}. It might not exist or an error occurred.")
            
    except HTTPException as http_exc:
        # Re-raise HTTPExceptions directly
        raise http_exc
    except Exception as e:
        # Catch any other unexpected errors
        print(f"Error deleting connection {connection_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete connection: {str(e)}")
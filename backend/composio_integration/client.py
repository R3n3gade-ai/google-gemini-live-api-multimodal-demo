import os
import json
import uuid
from typing import Dict, List, Optional, Any, Union
# Removed google.genai imports as self.client is no longer used
from composio_gemini import Action, ComposioToolSet, App
import requests

class ComposioClient:
    """
    Client for Composio API integration with Gemini
    Handles OAuth authentication, tool calling, and agent features
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the Composio client with API key"""
        self.api_key = api_key or os.environ.get("COMPOSIO_API_KEY")
        if not self.api_key:
            raise ValueError("COMPOSIO_API_KEY environment variable is required")
            
        # Removed GEMINI_API_KEY loading and self.client initialization
        # as they are no longer used in this class after refactoring execute_tool.
        
        # Initialize Composio toolset
        self.toolset = ComposioToolSet(api_key=self.api_key)
        print("Composio toolset initialized successfully")
        # Removed diagnostic print for dir(self.toolset)
        
    def get_tools(self, apps: List[str] = None) -> List[Dict[str, Any]]:
        """
        Get available tools for specified apps.
        Fetches ALL actions for the specified apps, not just default important ones.

        Args:
            apps: List of app names to get tools for (e.g., ["gmail", "github"])
                  If None, returns tools for all connected apps.

        Returns:
            List of tool definitions in Gemini-compatible format.
        """
        try:
            # Convert string app names to App enum values
            apps_enum = []
            if apps:
                for app_name in apps:
                    app_name_upper = app_name.upper()
                    if hasattr(App, app_name_upper):
                        apps_enum.append(getattr(App, app_name_upper))
                    else:
                        print(f"Warning: App enum member for '{app_name}' not found.")

            if not apps_enum:
                print("No valid apps specified or found. Returning no tools.")
                return []

            # Get ALL actions for the specified apps
            all_relevant_actions = []
            # Iterate through all possible actions in the Action enum
            for action_name in dir(Action):
                if not action_name.startswith('__'): # Skip built-in attributes
                    try:
                        action_enum_member = getattr(Action, action_name)
                        # Check if this action belongs to one of the connected apps
                        if hasattr(action_enum_member, 'app') and action_enum_member.app in apps_enum:
                             all_relevant_actions.append(action_enum_member)
                    except Exception as e:
                        print(f"Error processing Action {action_name}: {e}")
                        # Continue to next action

            print(f"Fetching {len(all_relevant_actions)} relevant actions for apps: {[app.name for app in apps_enum]}")

            # Fetch tool definitions for ALL relevant actions
            # Using actions=[...] should bypass the default 'important' filtering
            tools = self.toolset.get_tools(actions=all_relevant_actions)

            print(f"Successfully fetched {len(tools)} tool definitions.")
            return tools
        except Exception as e:
            print(f"Error getting tools: {e}")
            return []
    
    def execute_tool(self, tool_name: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a Composio tool with the given parameters
        
        Args:
            tool_name: Name of the tool to execute
            params: Tool parameters
            
        Returns:
            Tool execution results
        """
        try:
            # Directly execute the tool using the ComposioToolSet.
            # Assumes a method like 'execute(name=tool_name, props=params)' exists in ComposioToolSet.
            # The actual method name and signature should be verified against the composio-gemini library.
            # Changed from 'execute' to 'execute_action' based on dir() output.
            # Assuming 'props' is the correct parameter name for the arguments.
            print(f"ComposioClient: Executing action '{tool_name}' with props: {params}")
            execution_result = self.toolset.execute_action(action_name=tool_name, props=params)
            
            # The result from self.toolset.execute_action should ideally be a dictionary (JSON response).
            # If it's a string, it might need parsing or further processing depending on the library's behavior.
            # Assuming it returns a dictionary or a type that can be directly returned.
            print(f"ComposioClient: Action '{tool_name}' execution result: {execution_result}")
            return execution_result
        except Exception as e:
            print(f"Error executing action {tool_name} with props {params}: {e}")
            # Return a structured error message
            return {"error": str(e), "tool_name": tool_name, "details": "Failed during direct execution via ComposioToolSet"}
    
    def get_oauth_url(self, app_name: str, redirect_uri: str) -> str:
        """
        Get OAuth URL for white-label authentication
        
        Args:
            app_name: Name of the app to authenticate (e.g., "gmail", "github")
            redirect_uri: URI to redirect to after authentication
            
        Returns:
            A dictionary containing "url" (the OAuth URL) and "state" (the generated state string)
        """
        try:
            print(f"ComposioClient: Attempting get_oauth_url for app: {app_name}") # Moved to very top of try
            state = f"{app_name}_{uuid.uuid4().hex}"
            
            print(f"ComposioClient: Generated state: {state} for app: {app_name}")
            print(f"ComposioClient: Available App enums: {dir(App)}") # Log available App members

            app_enum_member = None
            app_name_upper = app_name.upper()
            
            if hasattr(App, app_name_upper):
                app_enum_member = getattr(App, app_name_upper)
                print(f"ComposioClient: Found App enum member: {app_enum_member} for {app_name_upper}")
            else:
                print(f"ComposioClient: App enum member for '{app_name_upper}' not found directly. Available: {[member for member in dir(App) if not member.startswith('__')]}")
                # Attempt a case-insensitive match as a fallback, though exact match is preferred
                for member_name in dir(App):
                    if not member_name.startswith('__') and member_name.upper() == app_name_upper:
                        app_enum_member = getattr(App, member_name)
                        print(f"ComposioClient: Found App enum member (case-insensitive): {app_enum_member} for {app_name_upper} as {member_name}")
                        break
            
            if not app_enum_member:
                raise ValueError(f"Unsupported app for integration: {app_name}. '{app_name_upper}' not found in App enum.")

            # Try to use the `initiate_connection` method.
            # Based on the TypeError, it doesn't take `redirect_uri` or `state` when `app` is specified.
            # It's possible that the redirect_uri is picked from the integration configured on Composio's dashboard
            # that corresponds to this `app_enum_member` when using a generic app identifier.
            # Or, we might need to find a specific `integration_id` that has our custom redirect_uri.

            # Let's try to pass the `state` to `initiate_connection` as it's crucial for security.
            # The `redirect_uri` might be inferred by Composio from the integration tied to the API key or app.
            print(f"ComposioClient: Attempting self.toolset.initiate_connection(app={app_enum_member}, entity_id='default', state='{state}')")
            try:
                connection_request = self.toolset.initiate_connection(
                    app=app_enum_member,
                    entity_id="default", # As per Composio example
                    state=state # Attempting to pass state
                )
            except TypeError as te:
                if "unexpected keyword argument 'state'" in str(te):
                    print("ComposioClient: `initiate_connection` does not accept 'state'. Trying without it.")
                    connection_request = self.toolset.initiate_connection(
                        app=app_enum_member,
                        entity_id="default"
                    )
                else:
                    raise # Re-raise other TypeErrors

            print(f"ComposioClient: Received connection_request: {connection_request}")

            if not connection_request or not hasattr(connection_request, 'redirectUrl'):
                raise Exception("Failed to get redirectUrl from initiate_connection or connection_request is invalid")

            oauth_url = connection_request.redirectUrl
            
            # Check if connection_request contains a state parameter we should use.
            # This depends on the structure of ConnectionRequestModel from composio-gemini.
            returned_state = None
            if hasattr(connection_request, 'state') and connection_request.state:
                returned_state = connection_request.state
                print(f"ComposioClient: State returned from initiate_connection: {returned_state}")
            else:
                # If Composio doesn't return a state here, we must rely on the one we generated earlier (state variable in this method)
                # for our own CSRF check in the callback, assuming Composio passes it through.
                # Or, if Composio handles state entirely server-side for this flow, our state check might be problematic.
                # For now, we will use the state generated at the beginning of this method.
                returned_state = state # Use the state generated at the start of this function
                print(f"ComposioClient: No state in connection_request, using originally generated state: {returned_state}")

            print(f"Generated OAuth URL for {app_name} via initiate_connection: {oauth_url}, using state: {returned_state}")
            return {"url": oauth_url, "state": returned_state}
        except Exception as e:
            print(f"Error generating OAuth URL via initiate_connection for {app_name}: {e}")
            # Fallback or re-raise: For now, re-raise to make the error visible.
            raise e
    
    def handle_oauth_callback(self, code: str, state: str) -> Dict[str, Any]:
        """
        Handle OAuth callback and exchange code for token
        
        Args:
            code: Authorization code from OAuth callback
            state: State parameter from OAuth callback
            
        Returns:
            Connection information
        """
        try:
            # Extract the app name from the state
            app_name = state.split("_")[0] if "_" in state else None
            
            if not app_name:
                raise ValueError("Invalid state parameter")
                
            # Use the ComposioToolSet to handle the OAuth callback if possible
            # Use the real Composio API to handle the OAuth callback
            connection = self.toolset.handle_oauth_callback(
                code=code,
                state=state
            )
            
            if not connection:
                raise Exception(f"Failed to create connection for {app_name}")
            
            print(f"Successfully created connection for {app_name}")
            return connection
        except Exception as e:
            print(f"Error handling OAuth callback: {e}")
            return {"error": str(e)}
    
    def list_connections(self) -> List[Dict[str, Any]]:
        """
        List all available connections for the current user
        
        Returns:
            List of connection objects
        """
        try:
            # Use the ComposioToolSet to list connections if possible
            # Get connections from the real Composio API
            # Changed from get_connections to get_connected_accounts based on dir() output
            raw_connections = self.toolset.get_connected_accounts()
            print(f"ComposioClient: Raw get_connected_accounts() response: {raw_connections}")

            if not isinstance(raw_connections, list):
                print(f"Unexpected connections format: {type(raw_connections)}")
                return []

            active_connections = []
            print(f"ComposioClient: Iterating through {len(raw_connections)} raw connections from SDK...")
            for i, conn in enumerate(raw_connections):
                print(f"ComposioClient: Raw connection #{i}: {conn}")
                try:
                    # Attempt to convert to dict if it's a model object, for better logging
                    conn_dict = conn if isinstance(conn, dict) else conn.__dict__
                    print(f"ComposioClient: Raw connection #{i} (dict): {conn_dict}")
                except AttributeError:
                    print(f"ComposioClient: Raw connection #{i} could not be converted to dict for logging.")

                conn_app_name = getattr(conn, 'appName', getattr(conn, 'app', 'UnknownApp'))
                conn_id = getattr(conn, 'id', 'UnknownID')
                conn_status = getattr(conn, 'status', 'UnknownStatus')
                print(f"ComposioClient: Conn #{i} Details - AppName: {conn_app_name}, ID: {conn_id}, Status: {conn_status}")

                if conn_status == 'ACTIVE':
                    active_connections.append(conn)
                elif conn_status == 'UnknownStatus' and not hasattr(conn, 'status'): # If no status attribute, include it
                    print(f"ComposioClient: Conn #{i} has no 'status' attribute, including it.")
                    active_connections.append(conn)
                else:
                    print(f"ComposioClient: Conn #{i} has status '{conn_status}', not including it.")
            
            print(f"ComposioClient: Filtered active_connections (count: {len(active_connections)}): {active_connections}")
            return active_connections
        except Exception as e:
            print(f"Error listing connections: {e}")
            # Return empty list on error
            return []

    def delete_connection(self, connection_id: str) -> bool:
        """
        Delete a Composio connection by its ID.

        Args:
            connection_id: The ID of the connection to delete.

        Returns:
            True if deletion was successful or the connection didn't exist, False otherwise.
        """
        try:
            print(f"ComposioClient: Received request to delete connection ID: {connection_id}")
            # Construct the URL for the Composio API delete endpoint
            # Assuming the base API URL is https://api.composio.dev
            composio_api_url = f"https://api.composio.dev/connections/{connection_id}"

            headers = {
                "Authorization": f"Bearer {self.api_key}"
            }

            print(f"ComposioClient: Making DELETE request to Composio API: {composio_api_url}")
            response = requests.delete(composio_api_url, headers=headers)

            print(f"ComposioClient: Received response status code: {response.status_code}")

            if response.status_code == 200 or response.status_code == 204:
                print(f"ComposioClient: Successfully deleted connection {connection_id} via Composio API.")
                return True
            elif response.status_code == 404:
                print(f"ComposioClient: Connection {connection_id} not found on Composio API (might already be deleted).")
                return True # Treat as success if it's already gone
            else:
                # Log error details from response if available
                try:
                    error_details = response.json()
                    print(f"ComposioClient: Composio API returned error details: {error_details}")
                except json.JSONDecodeError:
                    print(f"ComposioClient: Composio API returned non-JSON error response: {response.text}")

                print(f"ComposioClient: Failed to delete connection {connection_id}. Composio API returned status: {response.status_code}")
                return False

        except requests.exceptions.RequestException as e:
            print(f"ComposioClient: Network or request error during delete_connection for {connection_id}: {e}")
            return False
        except Exception as e:
            print(f"ComposioClient: Unexpected error during delete_connection for {connection_id}: {e}")
            return False
            
    def get_gmail_tools(self) -> List[Dict[str, Any]]:
        """
        Get Gmail-specific tools
        
        Returns:
            List of Gmail tool definitions in Gemini-compatible format
        """
        return self.get_tools(apps=["gmail"])
    
    def format_for_gemini_config(self, tools: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Format tools for Gemini configuration
        
        Args:
            tools: List of tool definitions
            
        Returns:
            Gemini-compatible tools configuration
        """
        return {"tools": tools}
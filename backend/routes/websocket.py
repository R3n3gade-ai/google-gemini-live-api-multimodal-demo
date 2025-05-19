import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict
from gemini.client import GeminiConnection
import os # Added
from dotenv import load_dotenv # Added

# Create router
router = APIRouter()

# Store active connections
connections: Dict[str, GeminiConnection] = {}

# --- Composio Client Initialization ---
load_dotenv() # Load .env file to get environment variables
composio_client = None
has_composio = False

composio_api_key = os.getenv("COMPOSIO_API_KEY")
gemini_api_key = os.getenv("GEMINI_API_KEY")

if not composio_api_key:
    # This will be caught by app.py, but good to be explicit if this module were used alone.
    print("WEBSOCKET: WARNING - COMPOSIO_API_KEY not found. Tool execution will fail.")
    # We don't raise here to allow the app to potentially start if app.py handles it,
    # but Composio features will be non-functional.

try:
    if composio_api_key: # Only proceed if the key is actually set
        from composio_integration.client import ComposioClient
        composio_client = ComposioClient() # This will raise ValueError if keys are missing
        has_composio = True
        print("WEBSOCKET: Composio client initialized successfully")
    else:
        # This path means composio_api_key was not set.
        # The app.py should have already raised an error.
        # If somehow execution reaches here without the key, Composio is disabled.
        print("WEBSOCKET: Composio API key not set. Composio features disabled.")

except ImportError as e:
    print(f"WEBSOCKET: ERROR: Composio integration not available due to ImportError: {e}")
    # Depending on strictness, you might want to raise e here too.
    # For now, let app.py be the main gatekeeper for startup.
except ValueError as e: # Catch specific error from ComposioClient if keys are missing
    print(f"WEBSOCKET: ERROR: Composio client initialization failed: {e}")
    # Let app.py handle the startup failure.
except Exception as e:
    print(f"WEBSOCKET: ERROR: Unexpected Composio initialization error: {e}")
# --- End Composio Client Initialization ---

# Create a dictionary to store tool execution results
tool_executions: Dict[str, Dict] = {}

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """
    WebSocket endpoint for real-time communication with Gemini API

    Args:
        websocket: WebSocket connection
        client_id: Unique client identifier
    """
    await websocket.accept()
    print(f"Client connected: {client_id}")

    # Create Gemini connection for this client
    gemini = GeminiConnection()
    connections[client_id] = gemini

    # Set up tools for this client
    tool_executions[client_id] = {}

    try:
        # 1) The first message from front-end must be "config"
        initial_msg = await websocket.receive_json()
        if initial_msg.get("type") != "config":
            raise ValueError("First WebSocket message must be configuration.")

        # Extract and apply configuration
        config_data = initial_msg.get("config", {})
        gemini.set_config(config_data)
        print(f"Received config for client {client_id}")

        # 2) Connect to Gemini (sends 'setup' message)
        await gemini.connect()
        print(f"Gemini connected for client {client_id}")

        # 3) Start tasks: reading from client and reading from Gemini
        receive_task = asyncio.create_task(receive_from_client(websocket, gemini))
        send_task = asyncio.create_task(send_to_frontend(websocket, gemini))

        # Wait for either task to complete (or fail)
        done, pending = await asyncio.wait(
            [receive_task, send_task],
            return_when=asyncio.FIRST_EXCEPTION
        )

        # Cancel any pending tasks
        for task in pending:
            task.cancel()

        # Re-raise exceptions from completed tasks
        for task in done:
            if task.exception():
                raise task.exception()

    except WebSocketDisconnect:
        print(f"Client disconnected: {client_id}")
    except ValueError as e:
        print(f"Validation error for client {client_id}: {e}")
        await websocket.send_json({"type": "error", "message": str(e)})
    except Exception as e:
        print(f"Error in WebSocket handler for client {client_id}: {e}")
        try:
            await websocket.send_json({"type": "error", "message": f"Server error: {str(e)}"})
        except:
            pass
    finally:
        # Clean up resources
        await gemini.close()
        if client_id in connections:
            del connections[client_id]
        print(f"Connection closed for client {client_id}")


async def receive_from_client(websocket: WebSocket, gemini: GeminiConnection):
    """
    Process incoming messages from the client browser

    Args:
        websocket: WebSocket connection
        gemini: GeminiConnection instance for this client
    """
    while True:
        try:
            # Receive WebSocket message
            message = await websocket.receive()

            # Handle disconnection
            if message["type"] == "websocket.disconnect":
                print("Client disconnected.")
                return

            # Parse the message content
            content = json.loads(message["text"])
            msg_type = content["type"]

            # Route to appropriate handler based on message type
            if msg_type == "audio":
                await gemini.send_audio(content["data"])
            elif msg_type == "image":
                await gemini.send_image(content["data"])
            elif msg_type == "text":
                await gemini.send_text(content["data"])
            # The "execute_tool" message type from client is removed as per Step 3 of the plan.
            # Tool execution is now initiated by the backend when Gemini issues a functionCall.
            else:
                print(f"Unknown message type from client: {msg_type}")

        except json.JSONDecodeError:
            print("Received invalid JSON from client")
        except KeyError as e:
            print(f"Missing required field in client message: {e}")
        except Exception as e:
            print(f"Error processing client message: {e}")
            break


async def send_to_frontend(websocket: WebSocket, gemini: GeminiConnection):
    """
    Forward Gemini responses to the client browser

    Args:
        websocket: WebSocket connection
        gemini: GeminiConnection instance for this client
    """
    while True:
        try:
            # Get next message from Gemini
            msg = await gemini.receive()
            if not msg:
                continue

            # Parse response
            response = json.loads(msg)

            # Extract and forward parts (audio, text, or tool calls)
            try:
                parts = response["serverContent"]["modelTurn"]["parts"]
                for part in parts:
                    if "inlineData" in part:
                        # Audio data from Gemini (base64 PCM)
                        audio_data = part["inlineData"]["data"]
                        await websocket.send_json({"type": "audio", "data": audio_data})
                    elif "text" in part:
                        # Text from Gemini
                        text_data = part["text"]
                        print("Gemini text part:", text_data)
                        await websocket.send_json({"type": "text", "text": text_data})
                    elif "functionCall" in part:
                        # Handle tool/function calls
                        function_call = part["functionCall"]
                        tool_name = function_call.get("name", "")
                        # Ensure args are parsed correctly, defaulting to an empty dict if args is missing or not a string
                        raw_args = function_call.get("args", "{}")
                        try:
                            tool_params = json.loads(raw_args) if isinstance(raw_args, str) else raw_args
                            if not isinstance(tool_params, dict): # Ensure it's a dictionary
                                tool_params = {}
                        except json.JSONDecodeError:
                            print(f"Warning: Could not parse tool_params from args: {raw_args}. Defaulting to empty dict.")
                            tool_params = {}


                        print(f"Gemini functionCall: {tool_name} with params: {tool_params}")

                        # Send tool call notification to frontend (can remain for UI purposes)
                        await websocket.send_json({
                            "type": "tool_call",
                            "data": {
                                "name": tool_name,
                                "parameters": tool_params
                            }
                        })

                        # Execute the tool using Composio (directly, no more round trip from client)
                        result = await execute_composio_tool(
                            websocket, # Still needed to send tool_result/tool_error to frontend
                            tool_name,
                            tool_params,
                            client_id # client_id is used by execute_composio_tool
                        )

                        # Send the structured FunctionResponse back to Gemini
                        # The actual structure of 'result' from composio_client.execute_tool matters here.
                        # Assuming 'result' is a dictionary that can be directly used as content.
                        function_response_payload = {
                            "client_content": {
                                "turns": [{
                                    "role": "model", # Role for function response part
                                    "parts": [{
                                        "functionResponse": {
                                            "name": tool_name,
                                            "response": {
                                                # Gemini expects the 'response' to contain the actual tool output,
                                                # often as a JSON object.
                                                "content": result
                                            }
                                        }
                                    }]
                                }],
                                "turn_complete": True # Typically true after a function call
                            }
                        }
                        print(f"Sending FunctionResponse to Gemini for tool {tool_name}: {json.dumps(function_response_payload)}")
                        await gemini.send_text(json.dumps(function_response_payload))
                        # Note: The global 'tool_executions' dictionary is no longer updated here
                        # as its previous usage pattern is removed with the streamlined flow.
            except KeyError:
                # Not all responses have parts
                pass

            # Handle turn completion
            try:
                if response["serverContent"]["turnComplete"]:
                    await websocket.send_json({"type": "turn_complete", "data": True})
            except KeyError:
                # Not all responses indicate turn completion
                pass

        except Exception as e:
            print(f"Error processing Gemini response: {e}")
            break

async def execute_composio_tool(websocket: WebSocket, tool_name: str, parameters: Dict, client_id: str):
    """
    Execute a Composio tool and return the result

    Args:
        websocket: WebSocket connection
        tool_name: Name of the tool to execute
        parameters: Tool parameters
        client_id: Client ID for tracking execution

    Returns:
        Tool execution result
    """
    try:
        if not has_composio or composio_client is None:
            error_message = f"Composio client not available. Cannot execute tool {tool_name}."
            print(error_message)
            await websocket.send_json({"type": "tool_error", "error": error_message})
            if client_id in connections and connections[client_id]:
                 await connections[client_id].send_text(f"Tool {tool_name} error: {error_message}")
            return {"error": error_message}

        print(f"Executing Composio tool: {tool_name}")
        print(f"Parameters: {parameters}")

        # Import the ComposioClient from the correct location
        from composio_integration.client import ComposioClient

        # Create a new client instance if needed
        if composio_client is None:
            try:
                # Initialize the client with API keys from environment
                client = ComposioClient()
                print("Created new Composio client for tool execution")
            except Exception as e:
                error_message = f"Failed to create Composio client: {str(e)}"
                print(error_message)
                await websocket.send_json({"type": "tool_error", "error": error_message})
                return {"error": error_message}
        else:
            client = composio_client

        # Execute the tool
        result = client.execute_tool(tool_name, parameters)

        # Send the result back to the client
        await websocket.send_json({
            "type": "tool_result",
            "data": result
        })

        # Responding to Gemini with the tool result is now handled by the caller (send_to_frontend)
        # by constructing a FunctionResponse.
        # This function now just returns the result.

        return result
    except Exception as e:
        error_message = f"Failed to execute tool {tool_name}: {str(e)}"
        print(error_message)

        # Send error back to client
        await websocket.send_json({
            "type": "tool_error",
            "error": error_message
        })

        # Informing Gemini about the error is now handled by the caller (send_to_frontend)
        # by constructing a FunctionResponse (which might indicate an error if needed,
        # or the tool execution itself returns an error structure that Gemini understands).
        # For now, execute_composio_tool returns the error structure, and send_to_frontend
        # will package that into the FunctionResponse.

        return {"error": error_message}
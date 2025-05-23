import json
import os
from websockets import connect
from typing import Dict, Optional, Any

class GeminiConnection:
    """
    Client for connecting to the Gemini Multimodal API
    Handles WebSocket communication, audio/video streaming, and response processing
    """

    def __init__(self):
        """Initialize the Gemini connection with API key from environment"""
        # Get API key from environment
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")

        self.model = "gemini-2.0-flash-exp"  # Default model
        self.uri = (
            "wss://generativelanguage.googleapis.com/ws/"
            "google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent"
            f"?key={self.api_key}"
        )
        self.ws = None
        self.config = None

    def set_config(self, config_data: Dict[str, Any]) -> None:
        """
        Store systemPrompt, voice, etc.

        Args:
            config_data: Dict containing configuration like:
                {
                  'systemPrompt': 'You are a friendly AI Assistant...',
                  'voice': 'Puck',
                  'googleSearch': True,
                  'allowInterruptions': False,
                  'functionCalling': True,
                  'autoFunctionResponse': True,
                  'codeExecution': True,
                  'toolUsage': True,
                  'temperature': 0.6
                }
        """
        self.config = config_data
        print(f"Configuration set: {json.dumps(config_data)}")

    async def connect(self) -> None:
        """
        Establish WebSocket connection and send initial setup message
        Must send the 'setup' message as the first message to Gemini,
        describing model, voice, system instructions, etc.

        Raises:
            ValueError: If configuration is not set
            ConnectionError: If connection fails
        """
        if not self.config:
            raise ValueError("Configuration must be set before connecting.")

        try:
            self.ws = await connect(
                self.uri,
                additional_headers={"Content-Type": "application/json"}
            )

            # Build 'setup' payload from config
            response_modalities = ["TEXT"]
            # Request AUDIO modality if a multimodal input mode is active
            current_mode = self.config.get("currentMode")
            if current_mode in ["audio", "camera", "screen"]:
                response_modalities.append("AUDIO")

            # Get temperature from config or use default
            temperature = float(self.config.get("temperature", 0.6))
            
            # Get model ID from config or use default
            model_id = self.config.get("modelId", self.model)
            print(f"Using model: {model_id}")
            
            setup_message = {
                "setup": {
                    "model": f"models/{model_id}",
                    "generation_config": {
                        "response_modalities": response_modalities,
                        "temperature": temperature,
                        "speech_config": {
                            "voice_config": {
                                "prebuilt_voice_config": {
                                    "voice_name": self.config.get("voice", "Puck")
                                }
                            }
                        },
                        "allow_interruptions": self.config.get("allowInterruptions", False)
                    },
                    "system_instruction": {
                        "parts": [
                            {
                                "text": self.config.get(
                                    "systemPrompt",
                                    "You are a friendly AI Assistant..."
                                )
                            }
                        ]
                    }
                }
            }

            # Add tool_config if tools are available in the config
            # self.config["tools"] is expected to be a list of Tool objects/dictionaries
            # as prepared by the frontend and Composio client.
            client_provided_tools = self.config.get("tools")
            
            # Only add tool_config if toolUsage is enabled
            if self.config.get("toolUsage", True) and client_provided_tools and isinstance(client_provided_tools, list) and len(client_provided_tools) > 0:
                setup_message["setup"]["tool_config"] = {
                    "tools": client_provided_tools,
                    "function_calling_config": {
                        "mode": "AUTO" if self.config.get("functionCalling", True) else "NONE",
                        "auto_function_response": self.config.get("autoFunctionResponse", True)
                    }
                }
                print(f"Gemini setup: Including {len(client_provided_tools)} tools in tool_config.")
            
            # Add Google Search grounding if enabled
            if self.config.get("googleSearch", False):
                setup_message["setup"]["grounding_config"] = {
                    "google_search_config": {
                        "enable_search": True
                    }
                }
                print("Gemini setup: Google Search grounding enabled.")
                
            # Add code execution config if enabled
            if self.config.get("codeExecution", False):
                setup_message["setup"]["code_execution_config"] = {
                    "enabled": True
                }
                print("Gemini setup: Code execution enabled.")
                
            # Add structured output config if enabled
            structured_output = self.config.get("structuredOutput", {})
            if structured_output.get("enabled", False):
                format_type = structured_output.get("format", "json").upper()
                schema = structured_output.get("schema", "")
                strict = structured_output.get("strict", True)
                
                structured_output_config = {
                    "enabled": True,
                    "response_mime_type": f"application/{format_type.lower()}"
                }
                
                # Add schema if provided
                if schema:
                    try:
                        # Parse schema to ensure it's valid JSON
                        schema_json = json.loads(schema)
                        structured_output_config["schema"] = schema_json
                    except json.JSONDecodeError:
                        print("Warning: Invalid JSON schema provided for structured output. Using without schema.")
                
                # Add strict validation setting
                structured_output_config["strict_validation"] = strict
                
                setup_message["setup"]["structured_response_config"] = structured_output_config
                print(f"Gemini setup: Structured output enabled with format {format_type}")

            # Send setup as the first message
            await self.ws.send(json.dumps(setup_message))

            # Read the initial response from Gemini (often just an ack)
            setup_response = await self.ws.recv()
            print("Gemini setup response:", setup_response)

        except Exception as e:
            raise ConnectionError(f"Failed to connect to Gemini API: {str(e)}")

    async def send_audio(self, base64_pcm: str) -> None:
        """
        Send 16-bit PCM audio (base64) to Gemini under 'realtime_input'.

        Args:
            base64_pcm: Base64 encoded 16-bit PCM audio data
        """
        if not self.ws:
            return

        payload = {
            "realtime_input": {
                "media_chunks": [
                    {
                        "data": base64_pcm,
                        "mime_type": "audio/pcm"
                    }
                ]
            }
        }
        await self.ws.send(json.dumps(payload))

    async def send_text(self, text: str) -> None:
        """
        Send text message to Gemini.

        Args:
            text: Text content to send
        """
        if not self.ws:
            return

        text_msg = {
            "client_content": {
                "turns": [
                    {
                        "role": "user",
                        "parts": [{"text": text}]
                    }
                ],
                "turn_complete": True
            }
        }
        await self.ws.send(json.dumps(text_msg))

    async def send_image(self, base64_jpeg: str) -> None:
        """
        Send image data to Gemini.

        Args:
            base64_jpeg: Base64 encoded JPEG image data
        """
        if not self.ws:
            return

        payload = {
            "realtime_input": {
                "media_chunks": [
                    {
                        "data": base64_jpeg,
                        "mime_type": "image/jpeg"
                    }
                ]
            }
        }
        await self.ws.send(json.dumps(payload))

    async def receive(self) -> Optional[str]:
        """
        Wait for next message from Gemini.

        Returns:
            JSON response string or None if connection is closed
        """
        if not self.ws:
            return None
        return await self.ws.recv()

    async def close(self) -> None:
        """Close the WebSocket connection."""
        if self.ws:
            await self.ws.close()
            self.ws = None

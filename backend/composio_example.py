"""
Example of using Composio with Gemini

This example demonstrates how to use the Composio integration with Gemini
to perform tool-based actions, such as starring a repository on GitHub.
"""

import os
from google.genai import types
from google import genai
from composio_gemini import Action, ComposioToolSet, App

def main():
    # Set API keys
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    composio_api_key = os.environ.get("COMPOSIO_API_KEY")

    # Check if API keys are set
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY environment variable is required")
    if not composio_api_key:
        raise ValueError("COMPOSIO_API_KEY environment variable is required")

    # Initialize Gemini and Composio clients
    client = genai.Client(api_key=gemini_api_key)
    toolset = ComposioToolSet(api_key=composio_api_key)

    print("Clients initialized successfully")

    # Get GitHub tools
    print("Getting GitHub tools...")
    tools = toolset.get_tools(
        apps=[
            App.GITHUB
        ]
    )

    # Create configuration with tools
    config = types.GenerateContentConfig(tools=tools)

    # Create a chat session
    print("Creating chat session...")
    chat = client.chats.create(model="gemini-2.0-flash", config=config)

    # Execute the agent to star a repository
    print("Sending message to star repository...")
    response = chat.send_message(
        "Can you star composiohq/composio repository on github",
    )

    # Print the response
    print("\nGemini Response:")
    print(response.text)

if __name__ == "__main__":
    print("Starting Composio with Gemini example...")
    main()
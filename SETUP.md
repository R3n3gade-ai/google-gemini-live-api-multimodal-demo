# Setting up the Gemini Multimodal Demo with Composio Integration

## Prerequisites

1. **Python 3.11+**: The backend requires Python 3.11 or newer
2. **Gemini API Key**: You need a valid API key for Google's Gemini API
3. **Composio API Key**: You need a valid Composio API key for tool integrations
4. **Modern Web Browser**: Chrome, Firefox, or Edge with modern web APIs support

## Required Environment Variables

For full functionality, you must set the following environment variables:

```
# Google Gemini API - Required
GEMINI_API_KEY=your_gemini_api_key_here

# Composio Integration - Required for tool extensions
COMPOSIO_API_KEY=your_composio_api_key_here
```

## How to get API Keys

1. **Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/)
2. **Composio API Key**: Register at [Composio Developer Portal](https://composio.dev)

## Installation Steps

1. **Clone or download the project**:
   Create the project structure as described earlier, with `frontend` and `backend` directories.

2. **Install backend dependencies**:
   Navigate to the `backend` directory and install the required packages:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Configure API keys**:
   Create a `.env` file in the `backend` directory with your API keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   COMPOSIO_API_KEY=your_composio_api_key_here
   ```

## Running the Application

### Windows
```
powershell -ExecutionPolicy Bypass -File start-app.ps1
```

### Linux/Mac
```
bash start-app.sh
```

## Using the Application

1. Once the application is running, navigate to http://localhost:8000 in your browser
2. The application features several modes:
   - Text chat with Gemini
   - Voice conversations
   - Image/video analysis
   - Composio tool integrations

## Troubleshooting

### Composio Integration Issues

If you encounter errors with Composio integration:

1. **Check environment variables**: Ensure COMPOSIO_API_KEY is correctly set
2. **Verify API key validity**: Test your key at the Composio developer portal
3. **Check logs**: Look for error messages in the terminal running the backend
4. **Network connectivity**: Ensure your machine can reach Composio's authentication and API servers

### WebSocket Connection Failures

If WebSocket connections fail:

1. **Verify the backend is running**: Make sure the FastAPI server is active at http://localhost:8000
2. **Check browser console**: Look for error messages in the browser's developer tools (F12)
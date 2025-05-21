# AI Workstation Developer Guide

This guide provides a concise overview of the AI Workstation application, its structure, and how to work with it as a developer.

## Application Overview

AI Workstation is an advanced web application that provides a seamless interface to interact with Google's Gemini 2.0 AI model through text, audio, video, and screen sharing. The application features:

- Real-time chat with Gemini AI
- Voice conversations with audio input/output
- Visual context through camera or screen sharing
- Composio integrations for connecting to external services (Gmail, Google Drive, etc.)
- Customizable settings for AI behavior

## Project Structure

The project follows a client-server architecture with clear separation between frontend and backend:

```
r3n3gade-repo/
├── frontend/                  # Frontend web application
│   ├── index.html             # Main HTML structure
│   ├── css/                   # CSS stylesheets
│   │   ├── styles.css         # Main styles
│   │   ├── feature-panels.css # Feature panel styles
│   │   └── ...                # Other CSS files
│   ├── js/                    # JavaScript modules
│   │   ├── main.js           # Application entry point
│   │   ├── audio-manager.js  # Audio capture and playback
│   │   ├── video-manager.js  # Video and screen capture
│   │   ├── websocket-client.js # WebSocket communication
│   │   ├── ui-controller.js  # UI updates and interactions
│   │   └── ...               # Other JS modules
│   └── static/               # Static assets and duplicated files for modules
│       ├── css/              # CSS files for modules
│       ├── js/               # JS files for modules
│       └── ...               # Other static assets
├── backend/                  # Backend server
│   ├── app.py                # FastAPI application entry point
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Environment variables (API keys)
│   ├── gemini/              # Gemini API client
│   │   ├── __init__.py
│   │   └── client.py        # Gemini API client implementation
│   └── routes/              # API routes
│       ├── __init__.py
│       └── websocket.py     # WebSocket endpoint handlers
├── scripts/                 # Utility scripts
│   ├── start-agent-builder.sh
│   ├── start-app-builder.sh
│   └── start-video-editor.sh
├── start-app.ps1            # PowerShell script to start the app (Windows)
└── start-app.sh             # Shell script to start the app (Linux/Mac)
```

## Key Components

### Frontend

1. **UI Controller (`ui-controller.js`)**: Manages the user interface, updates the DOM, and handles user interactions.

2. **WebSocket Client (`websocket-client.js`)**: Handles communication with the backend server via WebSockets.

3. **Audio Manager (`audio-manager.js`)**: Manages audio capture from the microphone and playback of audio responses.

4. **Video Manager (`video-manager.js`)**: Handles camera access and screen sharing functionality.

5. **Main Application (`main.js`)**: Orchestrates the overall flow and initializes other components.

### Backend

1. **FastAPI Application (`app.py`)**: The entry point for the backend server, sets up routes and middleware.

2. **Gemini Client (`gemini/client.py`)**: Handles communication with the Gemini API, including setup, sending messages, and receiving responses.

3. **WebSocket Handler (`routes/websocket.py`)**: Manages WebSocket connections from clients and relays messages between clients and the Gemini API.

## Getting Started

### Prerequisites

1. **Python 3.11+**: Required for the backend server.
2. **Gemini API Key**: You need a valid API key for Google's Gemini API.
3. **Modern Web Browser**: Chrome, Firefox, or Edge with support for modern web APIs.

### Setup

1. **Configure API Keys**:
   - Open `backend/.env` and set your Gemini API key:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
   - For Composio integration, add your Composio API key:
     ```
     COMPOSIO_API_KEY=your_composio_api_key_here
     ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Starting the Application

#### Windows

Run the PowerShell script:
```powershell
powershell -ExecutionPolicy Bypass -File start-app.ps1
```

#### Linux/Mac

Run the shell script:
```bash
./start-app.sh
```

The script will:
1. Stop any existing Python processes
2. Check dependencies
3. Start the backend server
4. Open the application in your default browser

The application will be available at: http://localhost:8000

## Making Changes

### Frontend Changes

1. **HTML Structure**: Modify `frontend/index.html` to change the overall structure.

2. **Styling**: Update CSS files in `frontend/css/` for visual changes.

3. **JavaScript Logic**: 
   - Modify files in `frontend/js/` to change functionality.
   - After making changes, refresh the browser to see the updates.

4. **Static Assets**: 
   - Add or modify files in `frontend/static/` for images, fonts, etc.
   - Note that some files are duplicated between `frontend/` and `frontend/static/` for module support.

### Backend Changes

1. **API Endpoints**: Modify or add routes in `backend/routes/` directory.

2. **Gemini Integration**: Update `backend/gemini/client.py` to change how the application interacts with the Gemini API.

3. **Configuration**: Adjust environment variables in `backend/.env` for API keys and other settings.

4. **Dependencies**: Update `backend/requirements.txt` if you add new Python packages.

After making backend changes, restart the application for the changes to take effect.

## Common Issues and Solutions

### WebSocket Connection Failures

If the WebSocket connection fails:

1. Check that the backend server is running.
2. Verify your Gemini API key is valid and correctly set in `.env`.
3. Check browser console for specific error messages.

### Audio/Video Permission Issues

If audio or video doesn't work:

1. Ensure the browser has permission to access the microphone/camera.
2. Check browser settings to confirm the correct devices are selected.

### Missing Static Files

If you see 404 errors for static files:

1. Verify the file exists in the correct location.
2. Check that the path in HTML/CSS/JS references is correct.
3. Restart the backend server to ensure it's serving the latest files.

## Advanced Configuration

### Changing the Default Port

The default port is 8000. To change it:

1. Open `backend/app.py`
2. Modify the port number in the `uvicorn.run()` call

### Customizing the Gemini Model

To use a different Gemini model:

1. Open `backend/gemini/client.py`
2. Modify the `self.model` value in the `__init__` method

## Adding New Features

### Adding a New UI Component

1. Create a new JavaScript file in `frontend/js/`
2. Import it in `frontend/index.html` or the appropriate module
3. Initialize the component in `main.js` if needed

### Adding a New API Endpoint

1. Create a new route handler in `backend/routes/`
2. Register the route in `backend/app.py`

### Adding Composio Integrations

1. Update the Composio client configuration in `frontend/js/composio-client.js`
2. Add UI elements for the new integration in `frontend/index.html`
3. Ensure the backend has the necessary permissions to access the integration

## Deployment Considerations

For production deployment:

1. Use HTTPS for secure communication
2. Implement proper authentication
3. Set up rate limiting to prevent abuse
4. Use environment-specific API keys
5. Consider containerization with Docker for easier deployment

## Contributing

When contributing to this project:

1. Follow the existing code style and organization
2. Test changes thoroughly before submitting
3. Document any new features or significant changes
4. Update this guide if you change the project structure or setup process

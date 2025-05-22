# AI Workstation

AI Workstation is an advanced web application that provides a seamless interface to interact with Google's Gemini 2.0 AI model through text, audio, video, and screen sharing.

![AI Workstation Interface](https://github.com/user-attachments/assets/d5de66af-b3f8-405b-9fe6-9215938aa8fc)

## Features

- **Real-time Chat**: Engage in text conversations with Gemini AI
- **Voice Conversations**: Talk with Gemini using audio input/output
- **Visual Context**: Share your camera feed or screen for more contextual interactions
- **Composio Integrations**: Connect to external services like Gmail, Google Drive, and more
- **Customizable Settings**: Configure AI behavior, voice, language, and more

## Quick Start

### Prerequisites

- Python 3.11+
- Gemini API Key
- Modern web browser (Chrome, Firefox, Edge)

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

```powershell
powershell -ExecutionPolicy Bypass -File start-app.ps1
```

#### Linux/Mac

```bash
./start-app.sh
```

The application will be available at: http://localhost:8000

## Using the Application

1. **Start a Conversation**: Type in the text input field or click the microphone button to start voice input
2. **Share Visual Context**: Click the camera or screen sharing buttons to provide visual context
3. **Configure Settings**: Use the right panel to adjust AI settings, voice, language, etc.
4. **Connect Services**: Click on the Connections tab to integrate with external services via Composio

## Architecture

The application follows a client-server architecture:

- **Frontend**: Modern vanilla JavaScript with ES6 modules
- **Backend**: Python FastAPI server that communicates with Gemini API
- **Communication**: WebSockets for real-time bidirectional data transfer

## Development

For detailed information on the project structure, making changes, and adding new features, please refer to the [Developer Guide](DEVELOPER_GUIDE.md).

## Planned Features

- IDE integration (possibly Theia IDE)
- Image/video generation page using Veo 2 and Imagen with Segmind API integration
- Video editor
- Drag and drop canvas with multi-agent A2A protocol

## Troubleshooting

If you encounter issues:

1. Check that the backend server is running
2. Verify your API keys are correctly set in `.env`
3. Check browser console for specific error messages
4. Ensure browser permissions for microphone/camera are granted if using those features

## License

This project is proprietary and confidential.

## Acknowledgments

- Google Gemini API for the AI capabilities
- Composio for third-party service integrations

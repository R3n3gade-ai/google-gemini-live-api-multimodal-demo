# Google Gemini Live API Multimodal Demo

This application demonstrates the capabilities of Google's Gemini API with multimodal inputs including text, audio, video, and screen sharing.

## Prerequisites

- Python 3.11 or higher
- Google Gemini API Key

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/R3n3gade-ai/google-gemini-live-api-multimodal-demo.git
   cd google-gemini-live-api-multimodal-demo
   git checkout devin/1746831356-second-brain-setup
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Set up your Gemini API Key:
   ```bash
   export GEMINI_API_KEY=your_api_key
   ```

## Running the Application

Use the provided startup script:

```bash
./start-app.sh
```

Or start the services manually:

1. Start the backend:
   ```bash
   cd backend
   python app.py
   ```

2. In a separate terminal, start the frontend:
   ```bash
   cd frontend
   python -m http.server 5173
   ```

## Accessing the Application

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

## Features

- **Chat Interface**: Interact with Gemini AI through text
- **Multimodal Inputs**: Use audio, video, and screen sharing
- **System Prompt Configuration**: Customize AI behavior
- **App/Web Builder**: Create and manage web applications
- **Brain Setup**: Configure AI brain functionality

## Usage

1. Open http://localhost:5173 in your browser
2. Use the text input to chat with Gemini
3. Click the microphone, camera, or screen buttons to enable multimodal inputs
4. Access additional features through the right sidebar

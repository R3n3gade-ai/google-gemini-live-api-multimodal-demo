#!/bin/bash

# Start the Google Gemini Live API Multimodal Demo
echo "Starting Google Gemini Live API Multimodal Demo..."

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
  echo "Error: GEMINI_API_KEY environment variable is not set."
  echo "Please set it by running: export GEMINI_API_KEY=your_api_key"
  exit 1
fi

# Kill any existing processes
echo "Killing any existing processes..."
pkill -f "python app.py" || true
pkill -f "python -m http.server 5173" || true
sleep 2

# Start the backend service
echo "Starting backend service..."
cd "$SCRIPT_DIR/backend" && python app.py &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start the frontend service
echo "Starting frontend service..."
cd "$SCRIPT_DIR/frontend" && python -m http.server 5173 &
FRONTEND_PID=$!

echo "Google Gemini Live API Multimodal Demo is running!"
echo "Backend URL: http://localhost:8000"
echo "Frontend URL: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the services"

# Wait for user to press Ctrl+C
wait

#!/bin/bash

# Exit on error
set -e

echo -e "\033[1;36mStarting Google Gemini Live API Multimodal Demo\033[0m"
echo -e "\033[1;36m------------------------------------------------\033[0m"

# Check if running in Docker or locally
if [ -f "/.dockerenv" ]; then
  echo -e "\033[1;33mRunning in Docker environment\033[0m"
  
  # Start backend server
  cd /app/backend
  python app.py &
  BACKEND_PID=$!
  
  echo -e "\033[1;32mBackend server started (PID: $BACKEND_PID)\033[0m"
  
  # Keep container running
  echo -e "\033[1;36mApp is running. Press Ctrl+C to stop.\033[0m"
  wait $BACKEND_PID
else
  echo -e "\033[1;33mRunning in local environment\033[0m"
  
  # Kill any existing Python processes related to our app
  echo -e "\033[1;33mStopping any existing Python processes...\033[0m"
  pkill -f "python backend/app.py" 2>/dev/null || true
  
  # Install dependencies
  echo -e "\033[1;32mChecking dependencies...\033[0m"
  cd backend
  pip install -r requirements.txt >/dev/null 2>&1
  
  # Start backend server
  echo -e "\033[1;32mStarting backend server...\033[0m"
  python app.py &
  BACKEND_PID=$!
  
  echo -e "\033[1;32mBackend server started (PID: $BACKEND_PID)\033[0m"
  
  # Wait for server to start
  echo -e "\033[1;33mWaiting for server to initialize...\033[0m"
  sleep 2
  
  # Open browser automatically
  echo -e "\033[1;32mOpening browser...\033[0m"
  
  # Try to open browser in platform-independent way
  case "$(uname -s)" in
    Darwin)  open http://localhost:8000 ;;
    Linux)   xdg-open http://localhost:8000 ;;
    MINGW*)  start http://localhost:8000 ;;
    *)       echo "Please open http://localhost:8000 in your browser" ;;
  esac
  
  # Display usage instructions
  echo -e "\033[1;36m\nApp is running!\033[0m"
  echo ""
  echo -e "\033[1;32mUSAGE INSTRUCTIONS:\033[0m"
  echo -e "1. Close the System Prompt modal if it appears"
  echo -e "2. To access Composio integrations, click on 'Connections' tab in the right panel"
  echo -e "3. Click on any service (Gmail, Google Drive, etc.) to connect via Composio OAuth"
  echo ""
  echo -e "\033[1;33mIMPORTANT:\033[0m"
  echo -e "For real Composio integration, set these environment variables:"
  echo -e "- COMPOSIO_API_KEY: Your Composio API key from composio.dev"
  echo -e "- GEMINI_API_KEY: Your Google Gemini API key"
  echo ""
  echo -e "\033[1;33mTo stop the app, press Ctrl+C\033[0m"
  
  # Keep script running until Ctrl+C
  wait $BACKEND_PID
fi

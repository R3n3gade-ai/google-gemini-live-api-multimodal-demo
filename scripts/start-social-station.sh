


MIXPOST_APP_DIR=~/repos/mixpost-app
MIXPOST_PORT=8080
AI_WORKSTATION_DIR=~/repos/google-gemini-live-api-multimodal-demo

if [ ! -d "$MIXPOST_APP_DIR" ]; then
  echo "Mixpost application not found at $MIXPOST_APP_DIR"
  echo "Please run the setup script first: ./scripts/setup-mixpost.sh"
  exit 1
fi

cd $AI_WORKSTATION_DIR/backend
echo "Starting AI Workstation backend..."
python app.py &
AI_WORKSTATION_PID=$!

echo "AI Workstation backend started with PID: $AI_WORKSTATION_PID"
echo "Access the AI Workstation at: http://localhost:8000"

cd $MIXPOST_APP_DIR
echo "Starting Mixpost on port $MIXPOST_PORT..."
php artisan serve --port=$MIXPOST_PORT &
MIXPOST_PID=$!

echo "Mixpost started with PID: $MIXPOST_PID"
echo "Social Station integration is ready!"
echo "Access Mixpost directly at: http://localhost:$MIXPOST_PORT"

trap cleanup INT TERM
cleanup() {
  echo "Stopping services..."
  
  if [ -n "$MIXPOST_PID" ]; then
    kill $MIXPOST_PID
    echo "Mixpost stopped"
  fi
  
  if [ -n "$AI_WORKSTATION_PID" ]; then
    kill $AI_WORKSTATION_PID
    echo "AI Workstation stopped"
  fi
  
  exit 0
}

echo "Press Ctrl+C to stop all services"

wait $AI_WORKSTATION_PID

cleanup

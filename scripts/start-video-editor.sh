

VIDEO_EDITOR_DIR=~/repos/free-react-video-editor

if [ ! -d "$VIDEO_EDITOR_DIR" ]; then
  echo "Error: Video editor directory not found at $VIDEO_EDITOR_DIR"
  exit 1
fi

cd "$VIDEO_EDITOR_DIR"

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting React Video Editor on port 3000..."
npm run dev -- --port 3000

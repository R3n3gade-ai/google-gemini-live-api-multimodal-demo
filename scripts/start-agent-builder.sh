
echo "Starting Agent Builder container..."

if ! command -v docker-compose &> /dev/null; then
    echo "docker-compose is not installed. Installing docker-compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

if ! docker info &> /dev/null; then
    echo "Docker is not running. Starting Docker..."
    sudo systemctl start docker
fi

cd ~/repos/google-gemini-live-api-multimodal-demo

if [ -f backend/.env ]; then
    export GEMINI_API_KEY=$(grep GEMINI_API_KEY backend/.env | cut -d '=' -f2)
fi

docker-compose up -d agent-builder

echo "Agent Builder container started successfully!"
echo "Access the Agent Builder at: http://localhost:8080"
echo "The Agent Builder is now integrated with the AI Workstation."

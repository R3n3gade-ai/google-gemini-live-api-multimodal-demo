from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try to initialize Composio integration
has_composio = False

# Check if required API keys are present in environment
from dotenv import load_dotenv
import os
load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
composio_api_key = os.getenv("COMPOSIO_API_KEY")

if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY not set. This is required. Please set it in the .env file.")
if not composio_api_key:
    raise ValueError("COMPOSIO_API_KEY not set. This is required. Please set it in the .env file.")

try:
    from composio_gemini import Action, ComposioToolSet, App
    from composio_integration.client import ComposioClient
    
    # Initialize Composio client - this will raise an error if keys are missing
    composio_client = ComposioClient()
    
    # Import Composio routes
    from routes.composio import router as composio_router
    has_composio = True
    print("Composio client and routes loaded successfully")
        
except ImportError as e:
    has_composio = False
    print(f"ERROR: Composio integration not available due to ImportError: {e}")
    print("Please ensure all dependencies are installed: pip install -r requirements.txt")
    raise # Re-raise the exception to prevent the app from starting in a broken state
except Exception as e:
    has_composio = False
    print(f"ERROR: Composio initialization failed: {e}")
    raise # Re-raise the exception

# Import other routes
from routes.websocket import router as websocket_router

# Create FastAPI app
app = FastAPI(title="Gemini Multimodal API")

# Middleware to log all request paths
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Incoming request: {request.method} {request.url.path}")
    response = await call_next(request)
    return response

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(websocket_router)
if has_composio:
    app.include_router(composio_router)
else:
    print("Composio routes not loaded - some features will be disabled")

# Mount frontend static files
app.mount("/static", StaticFiles(directory="../frontend"), name="static")

# Root endpoint - serve the frontend
@app.get("/")
def serve_index():
    return FileResponse("../frontend/index.html")

@app.get("/api/agent-builder-url")
def get_agent_builder_url():
    agent_builder_url = os.getenv("AGENT_BUILDER_URL", "http://localhost:8080")
    return JSONResponse({"url": agent_builder_url})

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

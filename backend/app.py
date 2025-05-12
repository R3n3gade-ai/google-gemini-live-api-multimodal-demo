from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

# Import routes
from routes.websocket import router as websocket_router

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(title="Gemini Multimodal API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(websocket_router)

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

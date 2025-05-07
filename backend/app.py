from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
import os
import httpx
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

@app.get("/social-station/mixpost/{path:path}")
@app.post("/social-station/mixpost/{path:path}")
async def proxy_mixpost(request: Request, path: str):
    # Proxy requests to the Mixpost application
    mixpost_url = f"http://localhost:8080/{path}"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=request.method,
                url=mixpost_url,
                headers=dict(request.headers),
                content=await request.body(),
                follow_redirects=True
            )
            
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers)
            )
        except Exception as e:
            return Response(
                content=f"Error connecting to Mixpost: {str(e)}",
                status_code=500
            )

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

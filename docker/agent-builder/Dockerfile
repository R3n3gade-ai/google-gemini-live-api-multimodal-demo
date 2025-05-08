FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# Clone the google-adk-nocode repository
RUN git clone https://github.com/abhishekkumar35/google-adk-nocode.git .

# Install Python dependencies
RUN pip install --no-cache-dir -e .

# Expose port 8080
EXPOSE 8080

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=8080
ENV CORS_ORIGINS=*

# Create a custom entry point script with CORS enabled
RUN echo '#!/usr/bin/env python\n\
import os\n\
import sys\n\
from pathlib import Path\n\
\n\
# Add the src directory to the Python path\n\
src_dir = Path(__file__).parent / "src"\n\
sys.path.insert(0, str(src_dir))\n\
\n\
from fastapi import FastAPI\n\
from fastapi.middleware.cors import CORSMiddleware\n\
from google.adk.nocode.app import create_app\n\
import uvicorn\n\
\n\
if __name__ == "__main__":\n\
    app = create_app()\n\
    \n\
    # Add CORS middleware\n\
    app.add_middleware(\n\
        CORSMiddleware,\n\
        allow_origins=["*"],\n\
        allow_credentials=True,\n\
        allow_methods=["*"],\n\
        allow_headers=["*"],\n\
    )\n\
    \n\
    uvicorn.run(app, host="0.0.0.0", port=8080)\n\
' > /app/run_app.py

# Make the entry point script executable
RUN chmod +x /app/run_app.py

# Run the application
CMD ["python", "run_app.py"]

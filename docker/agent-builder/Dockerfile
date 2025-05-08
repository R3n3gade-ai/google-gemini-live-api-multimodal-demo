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

# Copy the modified app.js file from the build context
COPY files/app.js /app/src/google/adk/nocode/static/js/app.js

# Expose port 8080
EXPOSE 8080

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=8080

# Create a custom entry point script
RUN echo '#!/usr/bin/env python3\n\
import os\n\
import sys\n\
from pathlib import Path\n\
\n\
# Add the src directory to the Python path\n\
src_dir = Path(__file__).parent / "src"\n\
sys.path.insert(0, str(src_dir))\n\
\n\
from google.adk.nocode.app import create_app\n\
import uvicorn\n\
\n\
if __name__ == "__main__":\n\
    app = create_app()\n\
    uvicorn.run(app, host="0.0.0.0", port=8080)\n\
' > /app/run_app.py

# Make the entry point script executable
RUN chmod +x /app/run_app.py

# Run the application
CMD ["python", "run_app.py"]

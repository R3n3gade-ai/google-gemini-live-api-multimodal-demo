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

# Run the application
CMD ["python", "app.py"]

# Stage 1: Build the frontend
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend

# Copy frontend dependencies
COPY frontend/package*.json ./

# Install dependencies with legacy peer deps flag to handle any shadcn peer dependency issues
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Build the backend with GPU support
FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04

# Set working directory
WORKDIR /app

# Install Python and required system dependencies
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/dist /app/static

# Create directories for mounting data and models
RUN mkdir -p /app/data /app/models

# Set environment variables
ENV NVIDIA_VISIBLE_DEVICES=all
ENV PYTHONPATH=/app
ENV PORT=8000
ENV VITE_PORT=5173

# Expose both frontend and backend ports
EXPOSE 5173 8000

# Volume configuration for data and models
VOLUME ["/app/data", "/app/models"]

# Create a script to run both services
RUN echo '#!/bin/bash\n\
cd /app/frontend && npm run dev & \
cd /app && uvicorn main:app --host 0.0.0.0 --port 8000\n' > /app/start.sh && \
chmod +x /app/start.sh

# Start both services
CMD ["/app/start.sh"]

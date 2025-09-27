#!/bin/bash

echo "🚀 Starting Axiomancer 2.0 - Local Development Environment"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Copy environment files if they don't exist
if [ ! -f "./axiomancer-backend/.env" ]; then
    echo "📄 Creating backend .env file..."
    cp ./axiomancer-backend/.env.example ./axiomancer-backend/.env
fi

if [ ! -f "./axiomancer-frontend/.env" ]; then
    echo "📄 Creating frontend .env file..."
    cp ./axiomancer-frontend/.env.example ./axiomancer-frontend/.env
fi

# Start services
echo "🐳 Starting Docker containers..."
docker compose -f docker-compose.local.yml up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check service status
echo "📊 Service Status:"
docker compose -f docker-compose.local.yml ps

echo ""
echo "✅ Local environment is running!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:3001"
echo "🔍 Health Check: http://localhost:3001/health"
echo ""
echo "To stop the environment, run: ./stop-local.sh"
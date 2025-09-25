#!/bin/bash

echo "🚀 Starting Axiomancer 2.0 - Staging Environment"
echo "============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check for required environment files
if [ ! -f "./axiomancer-backend/.env.staging" ]; then
    echo "⚠️  Creating staging environment file from example..."
    cp ./axiomancer-backend/.env.example ./axiomancer-backend/.env.staging
    echo "📝 Please edit ./axiomancer-backend/.env.staging with staging-specific values"
fi

# Start services
echo "🐳 Starting Docker containers for staging..."
docker-compose -f docker-compose.staging.yml up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "📊 Service Status:"
docker-compose -f docker-compose.staging.yml ps

echo ""
echo "✅ Staging environment is running!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:3001"
echo "🗄️  Database: PostgreSQL on localhost:5432"
echo "🔍 Health Check: http://localhost:3001/health"
echo ""
echo "To stop the environment, run: ./stop-staging.sh"
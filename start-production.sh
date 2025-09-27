#!/bin/bash

echo "🚀 Starting Axiomancer 2.0 - Production Environment"
echo "==============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check for required environment file
if [ ! -f ".env.production" ]; then
    echo "❌ Production environment file not found!"
    echo "📝 Please create .env.production with the following variables:"
    echo "   DB_NAME=axiomancer_prod"
    echo "   DB_USER=axiomancer_user"
    echo "   DB_PASSWORD=your_secure_password"
    echo "   JWT_SECRET=your_super_secure_jwt_secret"
    echo "   JWT_EXPIRES_IN=24h"
    echo "   API_URL=https://your-domain.com/api"
    exit 1
fi

# Load production environment variables
export $(cat .env.production | xargs)

# Validate required environment variables
required_vars=("DB_PASSWORD" "JWT_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set"
        exit 1
    fi
done

echo "🔐 Environment variables loaded"

# Create nginx directory if it doesn't exist
mkdir -p nginx

# Start services
echo "🐳 Starting Docker containers for production..."
docker compose -f docker-compose.production.yml up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check service status
echo "📊 Service Status:"
docker compose -f docker-compose.production.yml ps

echo ""
echo "✅ Production environment is running!"
echo "🌐 Application: http://localhost (via nginx)"
echo "🔗 Direct Backend: Internal network only"
echo "🗄️  Database: Internal network only"
echo ""
echo "⚠️  Remember to:"
echo "   - Configure SSL certificates in nginx/ssl/"
echo "   - Set up proper domain and DNS"
echo "   - Configure firewall rules"
echo "   - Set up monitoring and backups"
echo ""
echo "To stop the environment, run: ./stop-production.sh"
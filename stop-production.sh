#!/bin/bash

echo "🛑 Stopping Axiomancer 2.0 - Production Environment"
echo "==============================================="

docker compose -f docker-compose.production.yml down

echo "✅ Production environment stopped!"
echo "💾 Database data is preserved in Docker volume"
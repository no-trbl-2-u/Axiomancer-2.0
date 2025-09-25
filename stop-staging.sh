#!/bin/bash

echo "🛑 Stopping Axiomancer 2.0 - Staging Environment"
echo "============================================="

docker-compose -f docker-compose.staging.yml down

echo "✅ Staging environment stopped!"
echo "💾 Database data is preserved in Docker volume"
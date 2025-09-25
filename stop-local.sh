#!/bin/bash

echo "🛑 Stopping Axiomancer 2.0 - Local Development Environment"
echo "======================================================="

docker-compose -f docker-compose.local.yml down

echo "✅ Local environment stopped!"
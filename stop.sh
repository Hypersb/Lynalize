#!/bin/bash

# Lynalyze - Stop All Services

echo "🛑 Stopping Lynalyze services..."

# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "✅ Backend stopped"
lsof -ti:5173 | xargs kill -9 2>/dev/null && echo "✅ Frontend stopped"
lsof -ti:5001 | xargs kill -9 2>/dev/null && echo "✅ Microservices stopped"

echo ""
echo "All services stopped."

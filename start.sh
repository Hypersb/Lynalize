#!/bin/bash

# Lynalyze - Start All Services
# This script starts the backend, frontend, and microservices

echo "🚀 Starting Lynalyze Application..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Start Backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd backend && npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo ""

# Wait a moment
sleep 2

# Start Python Microservices
echo -e "${BLUE}Starting Python Microservices...${NC}"
cd ../microservices && ../.venv/bin/python app.py &
PYTHON_PID=$!
echo -e "${GREEN}✅ Microservices started (PID: $PYTHON_PID)${NC}"
echo ""

# Wait a moment
sleep 2

# Start Frontend
echo -e "${BLUE}Starting Frontend...${NC}"
cd ../frontend && npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Lynalyze is now running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Frontend:      http://localhost:5173"
echo "🔧 Backend API:   http://localhost:3000"
echo "🐍 Microservices: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
wait

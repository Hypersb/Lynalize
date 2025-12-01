#!/bin/bash

# Lynalyze Status Check

echo "═══════════════════════════════════════════════════════"
echo "🔍 Lynalyze - Service Status"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check Backend (Port 3000)
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ Backend:    Running on http://localhost:3000"
else
    echo "❌ Backend:    NOT RUNNING (Port 3000)"
fi

# Check Frontend (Port 5173)
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ Frontend:   Running on http://localhost:5173"
else
    echo "❌ Frontend:   NOT RUNNING (Port 5173)"
fi

# Check Python (Port 5001)
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ Python:     Running on http://localhost:5001"
else
    echo "❌ Python:     NOT RUNNING (Port 5001)"
fi

echo ""
echo "═══════════════════════════════════════════════════════"

# Check Gemini API Key
if [ -f "backend/.env" ]; then
    if grep -q "GEMINI_API_KEY=AIza" backend/.env 2>/dev/null; then
        echo "✅ Gemini API: Configured"
    else
        echo "⚠️  Gemini API: NOT CONFIGURED!"
        echo ""
        echo "   📝 Action Required:"
        echo "   1. Visit: https://makersuite.google.com/app/apikey"
        echo "   2. Get your FREE API key"
        echo "   3. Edit: backend/.env"
        echo "   4. Set: GEMINI_API_KEY=your-key-here"
        echo ""
        echo "   See GEMINI_SETUP.md for detailed instructions"
    fi
else
    echo "⚠️  Gemini API: .env file not found"
fi

echo "═══════════════════════════════════════════════════════"
echo ""

# Show what's needed
RUNNING=$(lsof -Pi :3000,5173,5001 -sTCP:LISTEN -t 2>/dev/null | wc -l | tr -d ' ')

if [ "$RUNNING" = "3" ]; then
    echo "🎉 All services running! Open: http://localhost:5173"
else
    echo "🚀 To start all services, run: ./start.sh"
fi

echo ""

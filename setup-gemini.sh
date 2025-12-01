#!/bin/bash

# Gemini API Setup Script
echo "════════════════════════════════════════════════════════"
echo "🔧 Lynalyze - Gemini API Setup"
echo "════════════════════════════════════════════════════════"
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env file not found!"
    echo "   Creating from template..."
    cp backend/.env.example backend/.env
fi

# Check if API key is set
if grep -q "GEMINI_API_KEY=$" backend/.env || grep -q "GEMINI_API_KEY=your-gemini-api-key-here" backend/.env; then
    echo "⚠️  Gemini API Key NOT configured!"
    echo ""
    echo "📝 To enable real-time URL analysis with AI:"
    echo ""
    echo "1️⃣  Get your FREE API key:"
    echo "   👉 Visit: https://makersuite.google.com/app/apikey"
    echo "   👉 Sign in with Google"
    echo "   👉 Click 'Create API Key'"
    echo "   👉 Copy your key (starts with 'AIza...')"
    echo ""
    echo "2️⃣  Add your key to the project:"
    echo "   👉 Open: backend/.env"
    echo "   👉 Set: GEMINI_API_KEY=AIzaSy...your-key-here"
    echo ""
    echo "3️⃣  Restart the backend:"
    echo "   👉 Press Ctrl+C in backend terminal"
    echo "   👉 Run: cd backend && npm run dev"
    echo ""
    echo "════════════════════════════════════════════════════════"
    echo "💡 Without the API key, fallback analysis will be used"
    echo "   (basic word counting instead of AI insights)"
    echo "════════════════════════════════════════════════════════"
else
    echo "✅ Gemini API Key is configured!"
    echo ""
    echo "🎉 Your setup is complete. Real-time AI analysis enabled!"
    echo ""
    echo "Test it now:"
    echo "  1. Open http://localhost:5173"
    echo "  2. Enter any URL (e.g., https://techcrunch.com)"
    echo "  3. Watch AI analyze in real-time!"
fi

echo ""

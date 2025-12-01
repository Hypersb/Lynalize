# 🚀 Lynalyze - Quick Start Guide

## One-Command Startup

```bash
./start.sh
```

This will start all three services:
- ✅ Backend (Node.js/Express) on http://localhost:3000
- ✅ Frontend (React/Vite) on http://localhost:5173
- ✅ Microservices (Python/Flask) on http://localhost:5001

## Stop All Services

```bash
./stop.sh
```

## Manual Startup

If you prefer to start services individually:

### 1. Backend
```bash
cd backend
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm run dev
```

### 3. Python Microservices
```bash
cd microservices
../venv/bin/python app.py
```

## Features

- 🎨 **Modern UI** with dark mode support
- 📊 **URL Analysis** with sentiment analysis and word frequency
- 📈 **Data Visualization** with interactive charts
- 🎵 **Audio Analysis** (disabled - requires librosa)
- 🖼️ **Image Analysis** with dominant color extraction
- 📥 **Export** to PDF and CSV
- 📱 **Responsive** design for all devices

## No Authentication Required

The application has been configured to start directly at the dashboard. No login/signup is required!

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Microservices**: Python, Flask
- **Visualization**: Recharts, Framer Motion

## Development

- Frontend hot-reload enabled
- Backend nodemon auto-restart
- Python Flask debug mode off (production-ready)

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari

Open **http://localhost:5173** to start analyzing URLs! 🎉

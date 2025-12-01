# Lynalyze - Full-Stack URL Analysis Platform

Lynalyze is a powerful web application that analyzes any URL and provides comprehensive insights including metadata extraction, sentiment analysis, media analysis, and trend visualization.

## 🚀 Features

- **URL Analysis**: Input any URL to fetch and analyze website metadata
- **Text Analysis**: Word frequency, sentiment analysis, and content summarization
- **Media Analysis**: Image color extraction, audio features (Spotify integration)
- **Trend Visualization**: Interactive charts (line, bar, pie) with Chart.js/Recharts
- **Data Export**: Export results to PDF/CSV
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Authentication**: JWT-based secure authentication
- **AI Insights**: Optional AI-generated summaries

## 📁 Project Structure

```
Lynalyze/
├── frontend/          # React + TypeScript + TailwindCSS
├── backend/           # Node.js + Express.js API
├── microservices/     # Python analytics services
├── docker-compose.yml # Container orchestration
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- TailwindCSS for styling
- Framer Motion for animations
- Recharts for data visualization
- Axios for API calls
- React Router for navigation

### Backend
- Node.js with Express.js
- TypeScript
- PostgreSQL/MongoDB support
- JWT authentication
- CORS handling
- Rate limiting

### Microservices
- Python 3.11+
- Flask/FastAPI
- NLTK for text analysis
- librosa for audio analysis
- BeautifulSoup for web scraping

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+ or MongoDB 6+
- Docker (optional)

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd Lynalyze
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`

#### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:3000`

#### 4. Python Microservices Setup
```bash
cd microservices
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Microservices run on `http://localhost:5000`

### Using Docker (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down
```

## 📚 API Documentation

### Backend API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

#### Analysis
- `POST /api/analyze/url` - Analyze a URL
- `GET /api/analyze/:id` - Get analysis by ID
- `GET /api/analyze/user/:userId` - Get user's analyses
- `DELETE /api/analyze/:id` - Delete analysis

#### Export
- `GET /api/export/pdf/:id` - Export analysis to PDF
- `GET /api/export/csv/:id` - Export analysis to CSV

### Python Microservices Endpoints

- `POST /analyze/text` - Sentiment analysis and word frequency
- `POST /analyze/audio` - Audio feature extraction
- `POST /analyze/image` - Image color analysis

## 🎨 UI Components

- Dashboard - Main analytics dashboard
- URLInput - URL submission component
- ChartsDisplay - Interactive data visualizations
- DataTable - Sortable and filterable tables
- ExportButton - PDF/CSV export functionality
- ThemeToggle - Dark/light mode switcher

## 🔧 Configuration

### Frontend Environment Variables (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_PYTHON_SERVICE_URL=http://localhost:5000
```

### Backend Environment Variables (.env)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/lynalyze
MONGODB_URI=mongodb://localhost:27017/lynalyze
JWT_SECRET=your-secret-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
YOUTUBE_API_KEY=your-youtube-api-key
GOOGLE_TRENDS_API_KEY=your-google-trends-api-key
```

### Python Microservices Environment Variables (.env)
```env
FLASK_ENV=development
PORT=5000
```

## 📦 Database Setup

### PostgreSQL
```bash
# Create database
createdb lynalyze

# Run migrations (from backend directory)
npm run migrate
```

### MongoDB
```bash
# Start MongoDB
mongod

# Database will be created automatically on first connection
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# Python tests
cd microservices
pytest
```

## 📝 Development Workflow

1. Start the database (PostgreSQL or MongoDB)
2. Run backend: `cd backend && npm run dev`
3. Run Python microservices: `cd microservices && python app.py`
4. Run frontend: `cd frontend && npm run dev`
5. Access the app at `http://localhost:5173`

## 🚢 Deployment

### Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build

# Deploy dist/build folders to your hosting service
```

### Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- TailwindCSS for the amazing CSS framework
- Recharts for beautiful charts
- Express.js community
- React community

## 📧 Support

For support, email business.sbkc@gmail.com or open an issue in the repository.

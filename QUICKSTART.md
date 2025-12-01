# Lynalyze - Quick Start Guide

This guide will help you get Lynalyze up and running quickly.

## 📋 Prerequisites

- **Node.js** 18 or higher
- **Python** 3.11 or higher  
- **PostgreSQL** 14+ or **MongoDB** 6+ (choose one)
- **Docker** (optional, for containerized deployment)

## 🚀 Option 1: Quick Start with Docker (Recommended)

The fastest way to get started:

```bash
# Clone the repository
cd Lynalyze

# Start all services with Docker Compose
docker-compose up --build
```

That's it! The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Python Microservices**: http://localhost:5000
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017

## 🛠️ Option 2: Manual Setup

### Step 1: Database Setup

Choose either PostgreSQL or MongoDB:

#### PostgreSQL (Recommended)

```bash
# Create database
createdb lynalyze

# Or use Docker
docker run -d \
  --name lynalyze-postgres \
  -e POSTGRES_USER=lynalyze \
  -e POSTGRES_PASSWORD=lynalyze_password \
  -e POSTGRES_DB=lynalyze \
  -p 5432:5432 \
  postgres:15-alpine
```

#### MongoDB (Alternative)

```bash
# Start MongoDB
mongod

# Or use Docker
docker run -d \
  --name lynalyze-mongodb \
  -p 27017:27017 \
  mongo:6
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run database migrations (PostgreSQL only)
npx prisma migrate dev

# Start the backend
npm run dev
```

Backend will run on http://localhost:3000

### Step 3: Python Microservices Setup

```bash
cd microservices

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Start the microservice
python app.py
```

Microservices will run on http://localhost:5000

### Step 4: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the development server
npm run dev
```

Frontend will run on http://localhost:5173

## 🔑 Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
PORT=3000
NODE_ENV=development

# Choose your database
DATABASE_URL=postgresql://lynalyze:lynalyze_password@localhost:5432/lynalyze
# OR
MONGODB_URI=mongodb://localhost:27017/lynalyze

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Optional API Keys
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
YOUTUBE_API_KEY=your-youtube-api-key

# Python Microservice
PYTHON_SERVICE_URL=http://localhost:5000

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_PYTHON_SERVICE_URL=http://localhost:5000
```

## 📝 Creating Your First Analysis

1. Open http://localhost:5173
2. Register a new account
3. Login with your credentials
4. Enter a URL in the input box (try: https://example.com)
5. Click "Analyze URL"
6. View the comprehensive analysis with charts and data!

## 🧪 Testing the Application

### Test URLs

Try these URLs to see different features:

- **Standard website**: https://example.com
- **News article**: https://www.bbc.com/news
- **Spotify track**: https://open.spotify.com/track/[track-id]
- **GitHub repo**: https://github.com/microsoft/vscode

### API Testing

Use curl or Postman to test the API:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Analyze URL (use token from login response)
curl -X POST http://localhost:3000/api/analyze/url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"url":"https://example.com"}'
```

## 🐛 Troubleshooting

### Port Already in Use

If ports are already in use, you can change them in the configuration files or stop the conflicting services:

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database Connection Issues

**PostgreSQL:**
```bash
# Check if PostgreSQL is running
pg_isready

# Restart PostgreSQL
brew services restart postgresql  # macOS
sudo systemctl restart postgresql  # Linux
```

**MongoDB:**
```bash
# Check MongoDB status
mongosh

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod  # Linux
```

### Python Dependencies Issues

If you have issues with audio analysis libraries:

```bash
# Install system dependencies (Ubuntu/Debian)
sudo apt-get install libsndfile1 ffmpeg

# macOS
brew install libsndfile ffmpeg

# Reinstall Python packages
pip install --upgrade --force-reinstall -r requirements.txt
```

### Frontend Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📦 Building for Production

### Frontend

```bash
cd frontend
npm run build
# Build files will be in dist/
```

### Backend

```bash
cd backend
npm run build
# Build files will be in dist/
```

### Docker Production

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 🌟 Features to Try

1. **URL Analysis**: Analyze any website for metadata and content
2. **Sentiment Analysis**: See the emotional tone of web content
3. **Word Frequency**: Discover the most common words
4. **Image Detection**: Automatic image extraction and color analysis
5. **Spotify Integration**: Analyze audio features of Spotify tracks
6. **Export Data**: Download analysis as PDF or CSV
7. **History**: View all your past analyses
8. **Dark Mode**: Toggle between light and dark themes

## 🤝 Getting Help

- Check the main README.md for detailed documentation
- Review the DATABASE.md for database setup help
- Open an issue on GitHub if you encounter problems

## 🎉 Next Steps

Now that you have Lynalyze running:

1. Explore the different analysis features
2. Try analyzing various types of URLs
3. Customize the UI in the frontend code
4. Add new analysis features in the backend
5. Extend the Python microservices with more ML features

Happy analyzing! 🚀

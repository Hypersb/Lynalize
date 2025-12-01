# Lynalyze Development Guide

This guide provides detailed information for developers working on Lynalyze.

## 📁 Project Structure

```
Lynalyze/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── Dashboard/  # Dashboard-specific components
│   │   │   └── Layout/     # Layout components
│   │   ├── contexts/       # React Context providers
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API service layer
│   │   ├── lib/            # Utility functions
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   └── package.json
│
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── server.ts       # Server entry point
│   ├── prisma/             # Database schema
│   └── package.json
│
├── microservices/          # Python analytics services
│   ├── app.py             # Flask application
│   ├── text_analyzer.py   # Text analysis module
│   ├── audio_analyzer.py  # Audio analysis module
│   ├── image_analyzer.py  # Image analysis module
│   └── requirements.txt
│
├── docker-compose.yml     # Docker orchestration
└── README.md
```

## 🎨 Frontend Architecture

### Technology Stack

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **TailwindCSS**: Styling
- **Framer Motion**: Animations
- **Recharts**: Data visualization
- **React Router**: Navigation
- **Axios**: HTTP client

### Key Components

#### Layout Components
- `Layout.tsx`: Main app layout
- `Header.tsx`: Navigation header with theme toggle

#### Dashboard Components
- `URLInput.tsx`: URL input form with validation
- `ChartsDisplay.tsx`: Interactive charts (bar, line, pie)
- `DataTable.tsx`: Sortable, filterable data table
- `ExportButton.tsx`: PDF/CSV export functionality

#### Authentication
- `ProtectedRoute.tsx`: Route guard component
- `Login.tsx`: Login page
- `Register.tsx`: Registration page

### State Management

#### Context API
- `ThemeContext`: Dark/light mode management
- `AuthContext`: User authentication state

#### Local State
- Component-level state with React hooks
- Forms use controlled components

### Styling Approach

```typescript
// Utility-first with Tailwind
<div className="card">
  {/* Uses @apply in CSS */}
</div>

// Custom utilities in index.css
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white ...;
}
```

## 🔧 Backend Architecture

### Technology Stack

- **Node.js**: Runtime
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **Prisma/Mongoose**: ORM/ODM
- **JWT**: Authentication
- **Bcrypt**: Password hashing

### API Structure

#### Authentication Flow

```typescript
POST /api/auth/register
→ Validate input
→ Hash password
→ Create user
→ Generate JWT
→ Return user + token

POST /api/auth/login
→ Validate input
→ Find user
→ Compare password
→ Generate JWT
→ Return user + token
```

#### Analysis Flow

```typescript
POST /api/analyze/url
→ Validate URL
→ Scrape metadata (cheerio)
→ Analyze text (Python service)
→ Extract media features
→ Store in database
→ Return analysis
```

### Middleware Stack

```typescript
1. Helmet (Security headers)
2. CORS
3. JSON parser
4. Morgan (Logging)
5. Rate limiter
6. Custom auth middleware
7. Route handlers
8. Error handler
```

### Database Models

#### In-Memory (Development)
Simple Map-based storage for quick prototyping.

#### Prisma (PostgreSQL)
```typescript
// Strongly typed, auto-generated client
const user = await prisma.user.create({
  data: { name, email, password }
})
```

#### Mongoose (MongoDB)
```typescript
// Schema-based, flexible documents
const user = await User.create({
  name, email, password
})
```

## 🐍 Python Microservices

### Technology Stack

- **Flask**: Web framework
- **NLTK**: Natural language processing
- **TextBlob**: Sentiment analysis
- **librosa**: Audio analysis
- **PIL**: Image processing

### Modules

#### Text Analyzer
```python
# Sentiment analysis
analyze_text_sentiment(text) -> dict
# Returns: score, label, positive, negative, neutral

# Word frequency
analyze_word_frequency(text, top_n) -> dict
# Returns: {word: count, ...}
```

#### Audio Analyzer
```python
# Extract audio features
analyze_audio_features(audio_url) -> dict
# Returns: tempo, energy, danceability, valence
```

#### Image Analyzer
```python
# Extract dominant colors
analyze_image_colors(image_url, num_colors) -> list
# Returns: ['#hex1', '#hex2', ...]
```

### API Endpoints

```python
POST /analyze/text
Body: {"text": "..."}
Returns: {wordCount, wordFrequency, sentiment}

POST /analyze/audio
Body: {"audio_url": "..."}
Returns: {tempo, energy, danceability, valence}

POST /analyze/image
Body: {"image_url": "..."}
Returns: {dominantColors: [...]}
```

## 🔐 Security Best Practices

### Authentication
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- Tokens stored in localStorage (consider httpOnly cookies for production)

### API Security
- Helmet.js for security headers
- Rate limiting (100 req/15min)
- CORS configured for specific origin
- Input validation on all endpoints

### Environment Variables
- Never commit `.env` files
- Use `.env.example` as template
- Different configs for dev/prod

## 📊 Data Flow

```
User Input (Frontend)
    ↓
API Request (axios)
    ↓
Express Route
    ↓
Controller
    ↓
Service Layer
    ├→ Scraper Service (cheerio)
    ├→ Text Analysis (Python)
    ├→ Spotify API
    └→ Database
    ↓
Response (JSON)
    ↓
Frontend Update
    ↓
UI Render (React)
```

## 🧪 Testing Strategy

### Frontend Testing
```bash
# Unit tests with Vitest
npm test

# Component testing
# Test user interactions, props, state
```

### Backend Testing
```bash
# API tests with Jest
npm test

# Test controllers, services, models
```

### Integration Testing
```bash
# Test full flow with Docker Compose
docker-compose up
# Run E2E tests
```

## 🚀 Deployment

### Frontend Deployment
```bash
# Build
npm run build

# Deploy to:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
```

### Backend Deployment
```bash
# Build
npm run build

# Deploy to:
- Heroku
- AWS EC2
- DigitalOcean
- Railway
```

### Python Microservices
```bash
# Deploy to:
- Heroku
- AWS Lambda
- Google Cloud Functions
- Docker container
```

### Database
- **PostgreSQL**: AWS RDS, Railway, Supabase
- **MongoDB**: MongoDB Atlas, Railway

## 🎯 Adding New Features

### Adding a New Analysis Type

1. **Backend Service**
```typescript
// backend/src/services/new-analysis.service.ts
export async function analyzeNewFeature(data: string) {
  // Implementation
  return result
}
```

2. **Controller**
```typescript
// backend/src/controllers/analyze.controller.ts
// Add to analyzeUrl function
const newAnalysis = await analyzeNewFeature(data)
```

3. **Frontend Service**
```typescript
// frontend/src/services/analysis.service.ts
export interface AnalysisData {
  // Add new field
  newAnalysis?: NewAnalysisType
}
```

4. **UI Component**
```typescript
// frontend/src/components/Dashboard/NewAnalysisDisplay.tsx
export const NewAnalysisDisplay = ({ data }) => {
  // Render new analysis
}
```

### Adding a New API Endpoint

1. **Route**
```typescript
// backend/src/routes/new.routes.ts
router.post('/endpoint', authenticate, handler)
```

2. **Controller**
```typescript
// backend/src/controllers/new.controller.ts
export const handler = async (req, res) => {
  // Implementation
}
```

3. **Register Route**
```typescript
// backend/src/server.ts
app.use('/api/new', newRoutes)
```

## 🔍 Debugging

### Frontend
```typescript
// React DevTools
// Check component props and state

// Console logging
console.log('State:', state)

// Network tab
// Inspect API calls
```

### Backend
```typescript
// Debug logging
console.log('Request:', req.body)

// VS Code debugger
// Set breakpoints in .ts files

// Morgan logging
// HTTP request logs in terminal
```

### Python
```python
# Print debugging
print(f"Processing: {data}")

# Flask debug mode
app.run(debug=True)
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 📄 Code Style

### TypeScript/JavaScript
- Use ESLint configuration
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required

### Python
- Follow PEP 8
- 4 spaces for indentation
- Type hints where possible
- Docstrings for functions

Happy coding! 🎉

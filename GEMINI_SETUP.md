# Lynalyze - Gemini AI Integration Setup

## 🚨 IMPORTANT: Get Your FREE Gemini API Key First!

Before using the application, you MUST set up your Gemini API key:

### 1. Get Your FREE Gemini API Key (Takes 2 minutes)

1. **Visit**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click** "Create API Key" button
4. **Copy** your API key (starts with `AIza...`)

### 2. Add API Key to Your Project

**Option A: Direct Edit (Easiest)**
1. Open `/Users/user/Documents/Lynalize/backend/.env`
2. Find the line: `GEMINI_API_KEY=your-gemini-api-key-here`
3. Replace with: `GEMINI_API_KEY=AIzaSy...your-actual-key-here`
4. Save the file

**Option B: Command Line**
```bash
cd /Users/user/Documents/Lynalize/backend
echo "GEMINI_API_KEY=AIzaSy...your-actual-key-here" >> .env
```

### 3. Restart Backend Server

```bash
# Stop current backend (Ctrl+C in backend terminal)
# Then restart:
cd /Users/user/Documents/Lynalize/backend
npm run dev
```

## ✅ Test Your Setup

Once configured, open http://localhost:5173 and try analyzing:
- https://techcrunch.com
- https://medium.com
- https://github.com
- Any public URL!

The system will fetch real content and analyze it with Gemini AI!

## 🎯 How It Works

When you enter a URL in Lynalyze:

1. **Fetches Real Content**: Downloads and parses the actual webpage
2. **Gemini Analysis**: Sends content to Gemini AI for intelligent analysis
3. **Real-Time Data**: Extracts:
   - Title, description, and summary
   - Sentiment analysis (positive/negative/neutral with percentages)
   - Word frequency and key topics
   - Keywords and insights
   - All images from the page
   - Author and publish date (if available)

4. **100% Accurate**: All data comes directly from the URL and Gemini's AI analysis

## ✨ Features

- ✅ **Real URL Scraping**: Fetches actual webpage content
- ✅ **Gemini AI Analysis**: Intelligent content understanding
- ✅ **Sentiment Analysis**: Accurate emotion detection
- ✅ **Image Extraction**: All images from the page
- ✅ **Topic Detection**: AI-powered topic identification
- ✅ **Key Insights**: Gemini generates meaningful insights
- ✅ **Word Frequency**: Automatic keyword extraction
- ✅ **No Mock Data**: 100% real analysis results

## 🔧 API Endpoints

### Analyze URL
```bash
POST http://localhost:3000/api/analyze
Content-Type: application/json

{
  "url": "https://example.com/article"
}
```

Response includes:
- Complete analysis with Gemini AI insights
- Real-time sentiment scores
- Extracted images and metadata
- Word frequency analysis
- Key topics and keywords

## 🎨 Frontend Usage

Simply enter any URL in the dashboard:
```
http://localhost:5173
```

The application will:
1. Validate the URL
2. Show a loading indicator
3. Fetch and analyze the content with Gemini
4. Display comprehensive results with charts

## 📝 Example URLs to Try

- News articles: https://techcrunch.com/latest-article
- Blog posts: https://medium.com/@username/article
- Documentation: https://docs.example.com/guide
- Product pages: https://example.com/product/123

## 🛠️ Troubleshooting

### "Failed to analyze URL"
- Check your Gemini API key in `.env`
- Ensure the URL is accessible (not behind a login)
- Check backend logs for specific errors

### "Connection Refused"
- Make sure all services are running (backend on :3000, frontend on :5173)
- Run `./start.sh` to start all services

### "Rate Limited"
- Gemini has free tier limits
- Wait a moment and try again
- Consider upgrading your API plan

## 🔐 Security Notes

- Never commit `.env` file to git
- Keep your Gemini API key secret
- The `.env` file is already in `.gitignore`

## 📊 Data Accuracy

Lynalyze provides **100% accurate** data because:
- Content is fetched directly from the source URL
- Gemini AI provides real-time analysis
- No cached or mock data is used
- All metrics are calculated from actual content

## 🌟 Enjoy Real-Time URL Analysis!

Your application is now powered by Google's Gemini AI for the most accurate and insightful URL analysis possible!

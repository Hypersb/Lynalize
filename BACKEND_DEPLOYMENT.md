# Backend Deployment Guide

Your frontend is deployed on Vercel at: https://lynalizeurl.vercel.app
But the backend is still running locally on `localhost:3000`.

## Quick Fix Options

### Option 1: Deploy Backend to Railway (Recommended - Free Tier)

1. **Create Railway Account**: https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. **Select Repository**: Hypersb/Lynalize
4. **Root Directory**: Set to `backend`
5. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   GEMINI_API_KEY=your-gemini-api-key
   PYTHON_SERVICE_URL=https://your-python-service-url
   CORS_ORIGIN=https://lynalizeurl.vercel.app
   ```
6. **Deploy** - Railway will auto-detect Node.js and run `npm start`
7. **Copy the Railway URL** (e.g., `https://lynalize-backend.railway.app`)

8. **Update Vercel Environment Variables**:
   - Go to https://vercel.com/Hypersb/lynalizeurl/settings/environment-variables
   - Add: `VITE_API_URL` = `https://your-backend.railway.app`
   - Redeploy frontend

### Option 2: Deploy Backend to Render (Free Tier)

1. **Create Render Account**: https://render.com
2. **New Web Service** → Connect GitHub repo
3. **Configure**:
   - Name: `lynalize-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Add Environment Variables** (same as Railway)
5. **Deploy** - Get URL like `https://lynalize-backend.onrender.com`
6. **Update Vercel** with the Render URL

### Option 3: Deploy Backend to Vercel Serverless (Most Integrated)

1. **Create** `backend/vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/server.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/server.ts"
       }
     ]
   }
   ```

2. **Update** `backend/package.json`:
   ```json
   {
     "scripts": {
       "vercel-build": "tsc"
     }
   }
   ```

3. **Deploy**: `cd backend && vercel --prod`
4. **Link to existing project or create new**
5. **Add environment variables** through Vercel dashboard
6. **Update frontend** `VITE_API_URL` to your backend Vercel URL

## What I've Fixed

✅ **CORS Configuration**: Backend now accepts:
   - `http://localhost:5173` (local development)
   - `https://lynalizeurl.vercel.app` (production)
   - Any additional origins in `CORS_ORIGIN` env var

✅ **Frontend API URL**: Now uses `VITE_API_URL` environment variable
   - Development: defaults to `http://localhost:3000`
   - Production: uses value from `.env.production` or Vercel env vars

## Current Status

❌ **Backend**: Still on localhost - needs deployment
❌ **Python Microservice**: Also needs deployment for full functionality
✅ **Frontend**: Deployed on Vercel (but can't reach backend yet)

## Next Steps

1. Choose a backend deployment option (Railway recommended for ease)
2. Deploy backend with environment variables
3. Update Vercel frontend environment variable `VITE_API_URL`
4. Redeploy frontend on Vercel
5. Test full flow: https://lynalizeurl.vercel.app

## Python Microservice Deployment (Optional)

The Python service handles advanced analytics. You can:
- **Deploy to Railway/Render** separately
- **Update** `PYTHON_SERVICE_URL` in backend env vars
- **For now**: The app will work without it (Gemini does most analysis)

## Testing After Deployment

1. Open: https://lynalizeurl.vercel.app
2. Enter URL: `https://techcrunch.com`
3. Check browser console for errors
4. Should see: "Analysis completed successfully!"

Need help with any deployment platform? Let me know!

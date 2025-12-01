# Vercel Deployment Guide for Lynalyze

## ✅ Fixed Issues

The `vite: command not found` error has been resolved by:

1. **Moved build dependencies to `dependencies`**: Vite, TypeScript, Tailwind, and PostCSS are now in the main dependencies
2. **Created `vercel.json`**: Proper configuration for monorepo structure
3. **Specified build commands**: Explicit instructions for Vercel

## 🚀 Deploy to Vercel

### Option 1: One-Click Deploy (Easiest)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Hypersb/Lynalize)

### Option 2: Manual Deploy

1. **Import Your Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import `Hypersb/Lynalize` from GitHub

2. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables** (Optional - for backend integration)
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

4. **Deploy!**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)

## 📝 What Was Fixed

### Before (❌ Broken)
```json
{
  "devDependencies": {
    "vite": "^5.0.8"  // ❌ Not installed in production
  }
}
```

### After (✅ Fixed)
```json
{
  "dependencies": {
    "vite": "^5.0.8",  // ✅ Installed in production
    "typescript": "^5.2.2",
    "tailwindcss": "^3.4.0"
  }
}
```

## 🔧 Vercel Configuration

The `vercel.json` file ensures:
- Correct build directory (frontend/)
- Proper output directory (frontend/dist)
- SPA routing support
- Build command execution

## ⚙️ Manual Configuration (If Needed)

If you prefer to configure in Vercel dashboard instead of `vercel.json`:

**Build & Development Settings:**
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## 🌐 After Deployment

Your app will be live at:
```
https://lynalize.vercel.app
```

Or your custom domain if configured.

## 🐛 Troubleshooting

### Build Still Fails?

1. **Clear Vercel cache**: Deployment Settings → Clear Cache
2. **Check Node version**: Ensure Node.js 18+ in Vercel settings
3. **Verify package.json**: Make sure vite is in dependencies
4. **Check logs**: View detailed build logs in Vercel dashboard

### Frontend vs Full Stack

**Current Setup**: Frontend only (Static site)
- ✅ Fast deployment
- ✅ Free tier friendly
- ⚠️ Backend needs separate deployment

**To Deploy Full Stack**:
- Backend: Deploy to Railway, Render, or Vercel Serverless
- Update `VITE_API_URL` environment variable

## 📚 Additional Resources

- [Vercel Vite Documentation](https://vercel.com/docs/frameworks/vite)
- [Troubleshooting Guide](https://vercel.com/docs/troubleshooting)
- [Environment Variables](https://vercel.com/docs/environment-variables)

## 🎉 Success!

Your Lynalyze frontend is now deployed and accessible worldwide!

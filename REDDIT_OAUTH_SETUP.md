# Reddit OAuth Setup for Real Market Data

## Overview
IdeaVoyage now supports Reddit OAuth authentication to access real market discussion data instead of synthetic demo data.

## 🔑 How to Enable Real Reddit Data

### Step 1: Create Reddit Application
1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Fill in the form:
   - **Name**: IdeaVoyage Market Research
   - **App type**: Web app
   - **Description**: Market research tool for startup validation
   - **About URL**: https://ideavoyage.vercel.app
   - **Redirect URI**: `https://ideavoyage.vercel.app/api/reddit/callback`

### Step 2: Get Credentials
After creating the app, you'll see:
- **Client ID**: The string under your app name
- **Client Secret**: Click "edit" to reveal the secret

### Step 3: Set Environment Variables
Add these to your Vercel project environment variables:

```bash
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here  
REDDIT_REDIRECT_URI=https://ideavoyage.vercel.app/api/reddit/callback
```

### Step 4: Test Authentication
1. Visit: `https://ideavoyage.vercel.app/api/reddit/auth`
2. You'll be redirected to Reddit for authorization
3. After accepting, you'll be redirected back with success message

## 🚀 OAuth Endpoints Available

### `/api/reddit/auth`
- **Method**: GET  
- **Purpose**: Redirects user to Reddit OAuth authorization
- **Response**: 302 redirect to Reddit

### `/api/reddit/callback`
- **Method**: GET
- **Purpose**: Handles OAuth callback from Reddit
- **Parameters**: `code`, `state`, `error`
- **Response**: JSON with success/failure status

## 📊 Benefits of Real Data

With Reddit OAuth enabled:
- ✅ **Real discussions** from active Reddit communities
- ✅ **Higher confidence** analysis scores
- ✅ **Authentic sentiment** from real users
- ✅ **Current market trends** based on recent posts
- ✅ **No rate limiting** issues

## 🔧 Technical Details

### Current Implementation
- Uses Reddit OAuth 2.0 flow
- Requests `read` scope only
- Supports both user authorization and app-only tokens
- Graceful fallback to demo mode if OAuth fails

### Future Enhancements
- Token storage and refresh
- User-specific authentication
- Multiple subreddit analysis
- Historical data trends

## 🆘 Troubleshooting

### Common Issues
1. **Invalid redirect URI**: Ensure redirect URI in Reddit app matches environment variable
2. **Client credentials**: Double-check client ID and secret are correct
3. **Scope permissions**: App only requests 'read' permission

### Demo Mode Fallback
If OAuth fails, the app automatically falls back to synthetic demo data with clear indicators.

## 📞 Support
For help setting up Reddit OAuth, contact support with your Reddit app credentials and deployment URL.
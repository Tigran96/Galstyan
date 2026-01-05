# Backend Setup Guide for AI Chat

This guide explains how to set up the backend for the AI chat feature with ChatGPT/OpenAI.

## 🎯 Quick Start Options

### Option 1: Vercel Serverless Function (Recommended for Production)

**Best for**: Production deployments on Vercel

1. **Get OpenAI API Key**:
   - Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Sign up or log in
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI (if not installed)
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Set Environment Variable**:
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your API key
   - Redeploy

4. **That's it!** The `/api/chat` endpoint will work automatically.

---

### Option 2: Netlify Functions

**Best for**: Production deployments on Netlify

1. **Get OpenAI API Key** (same as Option 1)

2. **Deploy to Netlify**:
   - Connect your GitHub repo to Netlify
   - Or use Netlify CLI: `netlify deploy`

3. **Set Environment Variable**:
   - Netlify Dashboard → Site settings → Environment variables
   - Add `OPENAI_API_KEY` with your API key
   - Redeploy

4. **Update API endpoint** in `.env`:
   ```env
   VITE_CHAT_API_ENDPOINT=/.netlify/functions/chat
   ```

---

### Option 3: Local Express Server (For Development)

**Best for**: Local development and testing

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file** in project root:
   ```env
   OPENAI_API_KEY=sk-your-api-key-here
   PORT=3001
   ```

3. **Start the server**:
   ```bash
   npm run server
   ```

4. **In another terminal, start the frontend**:
   ```bash
   npm run dev
   ```

   Or run both together:
   ```bash
   npm run dev:full
   ```

5. **Test**: The chat will automatically connect to `http://localhost:3001/api/chat`

---

### Option 4: Direct OpenAI API (Frontend Only - Not Recommended)

⚠️ **Warning**: This exposes your API key in the frontend. Only use for development!

1. **Create `.env` file**:
   ```env
   VITE_OPENAI_API_KEY=sk-your-api-key-here
   VITE_CHAT_API_ENDPOINT=https://api.openai.com/v1/chat/completions
   ```

2. **Restart dev server**

---

## 📋 Step-by-Step: Getting OpenAI API Key

1. Visit [https://platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Name it (e.g., "Galstyan Academy Chat")
6. Copy the key immediately (you won't see it again!)
7. Add it to your environment variables

## 💰 Cost Estimation

- **Model**: GPT-3.5-turbo
- **Cost**: ~$0.002 per 1K tokens
- **Average message**: ~500 tokens
- **Cost per message**: ~$0.001

**Example usage**:
- 100 students × 10 questions/day = 1,000 messages/day
- Daily cost: ~$1
- Monthly cost: ~$30

OpenAI gives $5 free credit to start!

## 🔧 Configuration Files

### For Vercel:
- ✅ `api/chat.js` - Already created
- ✅ `vercel.json` - Already created
- ⚙️ Set `OPENAI_API_KEY` in Vercel dashboard

### For Netlify:
- ✅ `netlify/functions/chat.js` - Already created
- ⚙️ Set `OPENAI_API_KEY` in Netlify dashboard
- ⚙️ Update `.env`: `VITE_CHAT_API_ENDPOINT=/.netlify/functions/chat`

### For Local Development:
- ✅ `server.js` - Already created
- ⚙️ Create `.env` with `OPENAI_API_KEY`
- ⚙️ Run `npm run server`

## 🧪 Testing

1. **Test the backend**:
   ```bash
   curl -X POST http://localhost:3001/api/chat \
     -H "Content-Type: application/json" \
     -d '{
       "message": "Hello",
       "conversationHistory": [],
       "lang": "en",
       "systemPrompt": "You are a helpful assistant."
     }'
   ```

2. **Test in browser**:
   - Open the chat
   - Type a message
   - Check browser console for errors

## 🐛 Troubleshooting

### "API error: 401"
- **Problem**: Invalid or missing API key
- **Solution**: Check your `OPENAI_API_KEY` is set correctly

### "Failed to fetch"
- **Problem**: Backend not running or wrong endpoint
- **Solution**: 
  - Check backend is running: `npm run server`
  - Check endpoint in browser Network tab
  - Verify CORS is enabled

### "Rate limit exceeded"
- **Problem**: Too many requests
- **Solution**: Wait a moment or upgrade OpenAI plan

### Chat not responding
- **Check**: Browser console for errors
- **Check**: Backend logs for errors
- **Check**: API key is valid and has credits

## 🚀 Deployment Checklist

- [ ] Get OpenAI API key
- [ ] Choose deployment platform (Vercel/Netlify/Local)
- [ ] Set `OPENAI_API_KEY` environment variable
- [ ] Deploy backend (if using serverless)
- [ ] Test chat functionality
- [ ] Monitor costs in OpenAI dashboard

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Express.js Documentation](https://expressjs.com/)

---

**Need help?** Check the error messages in the browser console and backend logs!


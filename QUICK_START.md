# 🚀 Quick Start Guide - AI Chat with ChatGPT

Get your AI chat up and running in 5 minutes!

## Step 1: Get OpenAI API Key (2 minutes)

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click **"Create new secret key"**
4. Name it (e.g., "Galstyan Academy")
5. **Copy the key** (starts with `sk-`) - you won't see it again!

## Step 2: Set Up Environment (1 minute)

1. Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

2. Edit `.env` and add your API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3001
```

## Step 3: Install Dependencies (if needed)

```bash
npm install
```

## Step 4: Start the Backend (1 minute)

Open a terminal and run:

```bash
npm run server
```

You should see:
```
🚀 Chat API server running on http://localhost:3001
📝 Health check: http://localhost:3001/health
💬 Chat endpoint: http://localhost:3001/api/chat
```

## Step 5: Start the Frontend (1 minute)

Open **another terminal** and run:

```bash
npm run dev
```

Or run both together:

```bash
npm run dev:full
```

## Step 6: Test the Connection (Optional)

Before testing the chat, you can verify the backend is working:

1. Open `test-chat-connection.html` in your browser
2. Click "Run All Tests"
3. Make sure both tests pass (Health Check ✅ and Chat Endpoint ✅)

## Step 7: Test the Chat! 🎉

1. Open your browser to `http://localhost:5173` (or the URL shown)
2. Click the **chat button** in the bottom-right corner
3. Ask a question like:
   - "Tell me about math courses"
   - "What physics lessons do you offer?"
   - "How much do courses cost?"

**Note**: If the backend is not running, the chat will automatically use mock responses (helpful messages) instead of real AI. To get real AI responses, make sure the backend is running!

## ✅ That's It!

Your AI chat is now connected to ChatGPT and ready to help students!

---

## 🚀 Deploy to Production

### Option A: Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variable: `OPENAI_API_KEY`
4. Deploy! The `api/chat.js` function will work automatically

### Option B: Netlify

1. Push your code to GitHub
2. Import project to [Netlify](https://netlify.com)
3. Add environment variable: `OPENAI_API_KEY`
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Deploy!

### Option C: Keep Local Server Running

If you have a server, you can:
1. Deploy `server.js` to your server
2. Set `VITE_CHAT_API_ENDPOINT` in your frontend `.env`:
   ```env
   VITE_CHAT_API_ENDPOINT=https://your-server.com/api/chat
   ```

---

## 💰 Cost Estimate

- **Free tier**: OpenAI gives $5 free credit
- **Per message**: ~$0.001 (very cheap!)
- **100 students, 10 questions/day**: ~$30/month

---

## 🐛 Troubleshooting

### "OPENAI_API_KEY is not set"
- Make sure you created `.env` file
- Check the key is correct (starts with `sk-`)
- Restart the server after changing `.env`

### "Failed to fetch" or "Network error"
- Make sure backend is running: `npm run server`
- Check backend is on port 3001
- Check browser console for errors

### Chat not responding
- Check backend terminal for errors
- Verify API key has credits at [OpenAI Dashboard](https://platform.openai.com/usage)
- Check browser console (F12) for errors

---

## 📚 Need More Help?

- See `BACKEND_SETUP.md` for detailed setup
- See `AI_CHAT_SETUP.md` for advanced configuration
- Check browser console and backend logs for errors

**Happy chatting! 💬**


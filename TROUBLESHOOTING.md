# Chat Connection Troubleshooting Guide

## Quick Diagnosis

### Step 1: Check if Backend is Running

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

**If you see a warning about OPENAI_API_KEY**, you need to set it in `.env` file.

### Step 2: Test Backend Health

Open your browser and go to:
```
http://localhost:3001/health
```

You should see: `{"status":"ok","message":"Chat API is running"}`

### Step 3: Check Browser Console

1. Open your website
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Try sending a message in chat
5. Look for error messages

## Common Issues & Solutions

### Issue 1: "Failed to fetch" or "NetworkError"

**Problem**: Backend server is not running

**Solution**:
1. Open a terminal
2. Run: `npm run server`
3. Make sure you see the "Chat API server running" message
4. Try the chat again

### Issue 2: "OPENAI_API_KEY is not set"

**Problem**: API key is missing in `.env` file

**Solution**:
1. Check if `.env` file exists in project root
2. Open `.env` file
3. Add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your-actual-key-here
   ```
4. Restart the backend server (`Ctrl+C` then `npm run server` again)

### Issue 3: "API error: 401"

**Problem**: Invalid OpenAI API key

**Solution**:
1. Verify your API key at [platform.openai.com](https://platform.openai.com/api-keys)
2. Make sure the key starts with `sk-`
3. Check if you have credits in your OpenAI account
4. Update `.env` with correct key
5. Restart backend server

### Issue 4: Chat shows error message

**Problem**: Backend is not responding correctly

**Solution**:
1. Check backend terminal for error messages
2. Verify `.env` file has `OPENAI_API_KEY`
3. Test backend health: `http://localhost:3001/health`
4. Check browser console (F12) for specific errors

### Issue 5: Chat works but shows mock responses

**Problem**: Backend is not running, so it's using mock responses

**Solution**:
1. Start backend: `npm run server`
2. Make sure backend shows "Chat API server running"
3. Try chat again - it should now use real AI

## Testing the Connection

### Test 1: Backend Health Check
```bash
# In browser or terminal
curl http://localhost:3001/health
```

Should return: `{"status":"ok","message":"Chat API is running"}`

### Test 2: Test Chat Endpoint Directly
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

Should return a JSON response with `{"response": "..."}`

### Test 3: Check Environment Variables

In backend terminal, you should see:
- ✅ `🚀 Chat API server running on http://localhost:3001`
- ❌ `⚠️ WARNING: OPENAI_API_KEY is not set` (if key is missing)

## Step-by-Step Setup Verification

1. **Check `.env` file exists**
   ```bash
   # Windows PowerShell
   Test-Path .env
   
   # Should return: True
   ```

2. **Check `.env` has API key**
   ```bash
   # Windows PowerShell
   Get-Content .env | Select-String "OPENAI_API_KEY"
   
   # Should show: OPENAI_API_KEY=sk-...
   ```

3. **Start backend server**
   ```bash
   npm run server
   ```

4. **Start frontend** (in another terminal)
   ```bash
   npm run dev
   ```

5. **Test in browser**
   - Open `http://localhost:5173`
   - Click chat button
   - Send a message
   - Check browser console (F12) for any errors

## Still Not Working?

### Enable Debug Mode

1. Open browser console (F12)
2. Look for messages starting with:
   - "Attempting to connect to:"
   - "Backend unavailable, using mock responses"
   - "Successfully received response from backend"

### Check These Files

1. **`.env`** - Must have `OPENAI_API_KEY`
2. **`server.js`** - Backend server file
3. **`vite.config.js`** - Should have proxy configuration
4. **`src/services/chatService.js`** - Chat service file

### Get Help

1. Check browser console (F12) for errors
2. Check backend terminal for errors
3. Verify all steps in `QUICK_START.md`
4. Make sure backend is running before testing chat

---

**Remember**: The chat will automatically use mock responses if the backend is not available. This is normal for development, but for real AI responses, you need:
1. Backend server running (`npm run server`)
2. Valid `OPENAI_API_KEY` in `.env` file
3. Backend accessible at `http://localhost:3001`



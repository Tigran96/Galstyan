# Environment Variables Setup Guide

## Quick Setup

1. **Copy the example file:**
   ```bash
   # On Windows (PowerShell)
   Copy-Item .env.example .env
   
   # On Mac/Linux
   cp .env.example .env
   ```

2. **Edit `.env` file** and add your actual values (see below)

3. **Restart your server** after making changes

## Required Variables

### `OPENAI_API_KEY` (Required for AI Chat)
- **What it is**: Your OpenAI API key for ChatGPT integration
- **Where to get it**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Format**: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Example**: `OPENAI_API_KEY=sk-proj-abc123xyz789...`

### `PORT` (Optional - Backend Server)
- **What it is**: Port number for the Express backend server
- **Default**: `3001`
- **When to change**: Only if port 3001 is already in use
- **Example**: `PORT=3001`

## Optional Variables

### `VITE_CHAT_API_ENDPOINT` (Optional)
- **What it is**: Custom API endpoint URL for chat
- **When to use**: 
  - Leave empty for local development (uses proxy)
  - Set for production with custom backend
- **Examples**:
  - Local: `VITE_CHAT_API_ENDPOINT=http://localhost:3001/api/chat`
  - Vercel: `VITE_CHAT_API_ENDPOINT=/api/chat`
  - Netlify: `VITE_CHAT_API_ENDPOINT=/.netlify/functions/chat`
  - Custom: `VITE_CHAT_API_ENDPOINT=https://your-server.com/api/chat`

### `VITE_OPENAI_API_KEY` (Not Recommended)
- **What it is**: Direct OpenAI API key for frontend
- **⚠️ Warning**: Exposes your API key in frontend code!
- **When to use**: Only for development/testing
- **Recommendation**: Leave empty, use backend instead

### `VITE_USE_MOCK_CHAT` (Optional)
- **What it is**: Enable mock responses instead of real AI
- **When to use**: Testing UI without API key
- **Values**: `true` or `false`
- **Default**: `false`

## Example .env File

```env
# Required
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3001

# Optional - Leave empty for local development
VITE_CHAT_API_ENDPOINT=

# Optional - Not recommended for production
VITE_OPENAI_API_KEY=

# Optional - For testing without API
VITE_USE_MOCK_CHAT=false
```

## Important Notes

1. **Never commit `.env` to git** - It's already in `.gitignore`
2. **Use `.env.example`** as a template (safe to commit)
3. **Restart server** after changing `.env` values
4. **Frontend variables** must start with `VITE_` to be accessible
5. **Backend variables** (like `OPENAI_API_KEY`, `PORT`) don't need `VITE_` prefix

## For Production Deployment

### Vercel
- Go to Project Settings → Environment Variables
- Add: `OPENAI_API_KEY` = `sk-your-key-here`

### Netlify
- Go to Site Settings → Environment Variables
- Add: `OPENAI_API_KEY` = `sk-your-key-here`

### Custom Server
- Set environment variables on your server
- Or use a `.env` file (make sure it's secure!)

## Troubleshooting

### "OPENAI_API_KEY is not set"
- Check `.env` file exists in project root
- Verify the key is correct (starts with `sk-`)
- Restart the server after changing `.env`

### "Failed to fetch" in chat
- Check backend is running: `npm run server`
- Verify `VITE_CHAT_API_ENDPOINT` is correct (or leave empty for local)
- Check browser console for errors

### Variables not working
- Frontend variables must start with `VITE_`
- Restart dev server after changing `.env`
- Check for typos in variable names

---

**Need help?** Check `QUICK_START.md` for step-by-step setup!



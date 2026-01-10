# Fixing OpenAI Rate Limit Error (429)

## What is Error 429?

Error 429 means "Rate Limit Exceeded" - you've made too many requests to OpenAI's API too quickly.

## Common Causes

1. **Too many requests too quickly** - You sent multiple messages in a short time
2. **No credits in account** - Your OpenAI account has run out of credits
3. **Free tier limits** - You're on the free tier with strict rate limits
4. **Shared API key** - Multiple people using the same API key

## Quick Fixes

### Solution 1: Wait and Retry (Immediate)

1. **Wait 1-2 minutes** before sending another message
2. The rate limit usually resets after 60 seconds
3. Try sending a message again

### Solution 2: Check Your OpenAI Account

1. Go to [https://platform.openai.com/usage](https://platform.openai.com/usage)
2. Check if you have:
   - ✅ Credits available
   - ✅ API access enabled
   - ✅ Rate limits not exceeded

### Solution 3: Add Credits

1. Go to [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Add payment method
3. Add credits to your account
4. Free tier gets $5 free credit to start!

### Solution 4: Use Mock Responses (Temporary)

If you just want to test the UI without using API:

1. Edit `.env` file:
   ```env
   VITE_USE_MOCK_CHAT=true
   ```

2. Restart your frontend:
   ```bash
   npm run dev
   ```

3. Chat will use mock responses instead of real AI

## Prevention

### For Development:
- Don't spam the chat with rapid messages
- Wait a few seconds between messages
- Use mock responses for UI testing

### For Production:
- Add rate limiting on your backend
- Monitor API usage
- Set up billing alerts in OpenAI dashboard

## Check Your Account Status

1. **Usage Dashboard**: [https://platform.openai.com/usage](https://platform.openai.com/usage)
   - See your API usage
   - Check rate limits
   - View request history

2. **Billing**: [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)
   - Add credits
   - Set up payment method
   - View invoices

3. **API Keys**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Verify your API key is active
   - Create new key if needed

## Rate Limits by Tier

- **Free Tier**: Very limited (usually 3 requests/minute)
- **Pay-as-you-go**: Higher limits based on usage
- **Enterprise**: Custom limits

## Temporary Workaround

While waiting for rate limit to reset:

1. The chat will automatically show a helpful message
2. Wait 1-2 minutes
3. Try again

Or use mock responses for testing:
```env
VITE_USE_MOCK_CHAT=true
```

## Still Having Issues?

1. **Check OpenAI Status**: [https://status.openai.com](https://status.openai.com)
2. **Verify API Key**: Make sure it's valid and active
3. **Check Credits**: Ensure you have credits available
4. **Wait Longer**: Rate limits can take several minutes to reset

---

**Remember**: Rate limits are per API key. If multiple people are using the same key, you'll hit limits faster!



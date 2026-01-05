# AI Chat Setup Guide

This guide explains how to set up the AI chat feature for students.

## Option 1: Backend API Endpoint (Recommended)

### Using Vercel Serverless Functions

1. Create a `api/chat.js` file in your project root:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory, lang, systemPrompt } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.map((msg) => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content,
          })),
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json({ response: data.choices[0]?.message?.content });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Failed to process chat message' });
  }
}
```

2. Set environment variable in Vercel:
   - Go to your Vercel project settings
   - Add `OPENAI_API_KEY` with your OpenAI API key

3. Deploy to Vercel - the function will be available at `/api/chat`

### Using Netlify Functions

1. Create a `netlify/functions/chat.js` file:

```javascript
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const { message, conversationHistory, lang, systemPrompt } = JSON.parse(event.body);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.map((msg) => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content,
          })),
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ response: data.choices[0]?.message?.content }),
    };
  } catch (error) {
    console.error('Chat API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process chat message' }),
    };
  }
};
```

2. Set environment variable in Netlify:
   - Go to Site settings → Environment variables
   - Add `OPENAI_API_KEY` with your OpenAI API key

## Option 2: Direct Frontend API (Not Recommended for Production)

⚠️ **Warning**: This exposes your API key in the frontend. Only use for development.

1. Create a `.env` file in your project root:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_CHAT_API_ENDPOINT=https://api.openai.com/v1/chat/completions
```

2. The chat service will automatically use direct OpenAI API calls if `VITE_OPENAI_API_KEY` is set.

## Option 3: Alternative AI Services

You can modify `src/services/chatService.js` to use other AI services:

- **Anthropic Claude**: Replace OpenAI API calls with Claude API
- **Google Gemini**: Use Google's Gemini API
- **Hugging Face**: Use Hugging Face Inference API
- **Custom Backend**: Point to your own backend service

## Getting an OpenAI API Key

1. Go to [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (you won't be able to see it again!)

## Cost Considerations

- OpenAI GPT-3.5-turbo: ~$0.002 per 1K tokens
- Average conversation: ~500 tokens per message
- Estimated cost: ~$0.001 per message

For a school with 100 students asking 10 questions/day:
- Daily: ~$1
- Monthly: ~$30

## Testing

1. Start your development server: `npm run dev`
2. Click the chat button in the bottom right
3. Type a question and send
4. Check the browser console for any errors

## Troubleshooting

### Chat not responding
- Check browser console for errors
- Verify API endpoint is correct
- Check API key is set correctly
- Ensure CORS is configured if using external API

### API errors
- Verify your OpenAI API key is valid
- Check you have credits in your OpenAI account
- Review rate limits on your OpenAI plan

## Security Notes

- **Never commit API keys to git**
- Use environment variables for all secrets
- Consider rate limiting for production
- Monitor API usage to prevent abuse
- Use serverless functions to keep API keys secure


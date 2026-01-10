// Simple Express backend server for AI Chat
// Run with: node server.js
// Make sure to set OPENAI_API_KEY in .env file

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chat API is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory, lang, systemPrompt } = req.body;

    // Validate input
    if (!message || !systemPrompt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []).map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', response.status, errorData);
      
      // Handle specific error codes with user-friendly messages
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after') || '60';
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: `Too many requests. Please wait ${retryAfter} seconds before trying again.`,
          details: errorData.error?.message || 'You have exceeded your OpenAI API rate limit. This could be due to: 1) Too many requests too quickly, 2) No credits in your account, or 3) Free tier limits. Please check your OpenAI account at https://platform.openai.com/usage',
          retryAfter: parseInt(retryAfter),
          code: 'RATE_LIMIT_EXCEEDED'
        });
      }
      
      if (response.status === 401) {
        return res.status(401).json({
          error: 'Invalid API key',
          message: 'Your OpenAI API key is invalid or expired. Please check your .env file.',
          code: 'INVALID_API_KEY'
        });
      }
      
      if (response.status === 402) {
        return res.status(402).json({
          error: 'Insufficient credits',
          message: 'Your OpenAI account has no credits. Please add credits at https://platform.openai.com/account/billing',
          code: 'INSUFFICIENT_CREDITS'
        });
      }
      
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    return res.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Failed to process chat message',
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Chat API server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY is not set in .env file');
  }
});


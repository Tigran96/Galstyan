// Netlify Serverless Function for AI Chat
// Deploy this to Netlify and it will be available at /.netlify/functions/chat
// Make sure to set OPENAI_API_KEY in Netlify environment variables

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { message, conversationHistory, lang, systemPrompt } = JSON.parse(event.body);

    // Validate input
    if (!message || !systemPrompt) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
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
        return {
          statusCode: 429,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: 'Rate limit exceeded',
            message: `Too many requests. Please wait ${retryAfter} seconds before trying again.`,
            details: errorData.error?.message || 'You have exceeded your OpenAI API rate limit.',
            retryAfter: parseInt(retryAfter),
            code: 'RATE_LIMIT_EXCEEDED'
          }),
        };
      }
      
      if (response.status === 401) {
        return {
          statusCode: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: 'Invalid API key',
            message: 'Your OpenAI API key is invalid or expired.',
            code: 'INVALID_API_KEY'
          }),
        };
      }
      
      if (response.status === 402) {
        return {
          statusCode: 402,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: 'Insufficient credits',
            message: 'Your OpenAI account has no credits. Please add credits.',
            code: 'INSUFFICIENT_CREDITS'
          }),
        };
      }
      
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ response: aiResponse }),
    };
  } catch (error) {
    console.error('Chat API error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to process chat message',
        message: error.message,
      }),
    };
  }
};


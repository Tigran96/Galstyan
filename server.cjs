// CommonJS entrypoint for cPanel/CloudLinux Passenger (which uses require()).
// Use this as the Startup file in cPanel: server.cjs
//
// Note: This file assumes Node 18+ (built-in fetch). Your cPanel config shows Node 19.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function getTopicPolicyPrompt(lang = 'en') {
  const prompts = {
    hy: [
      'Դուք Նյուտոնն եք՝ Գալստյան Ակադեմիայի AI օգնականը։',
      'ՊԱՐՏԱԴԻՐ ՍԱՀՄԱՆԱՓԱԿՈՒՄ: Պատասխանեք ՄԻԱՅՆ մաթեմատիկայի, ֆիզիկայի և ընդհանուր գիտության (օր․ քիմիա, կենսաբանություն, աստղագիտություն) հարցերին։',
      'Եթե հարցը դուրս է այս թեմաներից (օր․ քաղաքականություն, իրավաբանություն, բժշկություն, անձնական խորհուրդներ, ծրագրավորում, բիզնես, կրիպտո, և այլն), քաղաքավարի հրաժարվեք և առաջարկեք տալ գիտությանը/մաթեմատիկային/ֆիզիկային վերաբերող հարց, կամ կապ հաստատել ակադեմիայի հետ։',
      'Պատասխանեք հստակ, քայլ առ քայլ, ուսուցողական ոճով։',
    ].join('\n'),
    ru: [
      'Вы — Ньютон, AI‑ассистент Академии Галстяна.',
      'ОБЯЗАТЕЛЬНОЕ ОГРАНИЧЕНИЕ: отвечайте ТОЛЬКО на вопросы по математике, физике и общей науке (например, химия, биология, астрономия).',
      'Если вопрос вне этих тем (например, политика, право, медицина, личные советы, программирование, бизнес, крипто и т.д.), вежливо откажите и предложите задать вопрос по науке/математике/физике или связаться с академией.',
      'Отвечайте дружелюбно, ясно и пошагово в образовательном стиле.',
    ].join('\n'),
    en: [
      "You are Newton — the AI assistant for Galstyan Academy.",
      'HARD TOPIC LIMIT: Answer ONLY questions about Mathematics, Physics, and general Science (e.g., Chemistry, Biology, Astronomy).',
      'If the question is outside these topics (e.g., politics, law, medicine, personal advice, programming, business, crypto, etc.), politely refuse and suggest asking a math/physics/science question or contacting the academy.',
      'Respond in a friendly, clear, step-by-step educational manner.',
    ].join('\n'),
  };

  return prompts[lang] || prompts.en;
}

// Middleware
// Allow requests from your public site to your API subdomain (CORS).
const allowedOrigins = [
  'https://www.galstyanacademy.com',
  'https://galstyanacademy.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin(origin, cb) {
      // Allow same-origin / server-to-server / tools without Origin header
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chat API is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory, systemPrompt, lang } = req.body;
    const resolvedLang = typeof lang === 'string' ? lang : 'en';

    // Validate input
    if (!message || !systemPrompt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (typeof fetch !== 'function') {
      return res.status(500).json({
        error: 'Server runtime error',
        message: 'Global fetch() is not available. Please use Node 18+ on cPanel.',
      });
    }

    // Prepare messages for OpenAI
    // Enforce a server-side topic policy (cannot be overridden by client input).
    const policyPrompt = getTopicPolicyPrompt(resolvedLang);
    const mergedSystemPrompt = `${policyPrompt}\n\n${systemPrompt}`;

    const messages = [
      { role: 'system', content: mergedSystemPrompt },
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
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
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
          details:
            errorData.error?.message ||
            'You have exceeded your OpenAI API rate limit. Please check your OpenAI account.',
          retryAfter: parseInt(retryAfter, 10),
          code: 'RATE_LIMIT_EXCEEDED',
        });
      }

      if (response.status === 401) {
        return res.status(401).json({
          error: 'Invalid API key',
          message: 'Your OpenAI API key is invalid or expired.',
          code: 'INVALID_API_KEY',
        });
      }

      if (response.status === 402) {
        return res.status(402).json({
          error: 'Insufficient credits',
          message: 'Your OpenAI account has no credits.',
          code: 'INSUFFICIENT_CREDITS',
        });
      }

      throw new Error(
        `OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
      );
    }

    const data = await response.json();
    const aiResponse =
      data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';

    return res.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Failed to process chat message',
      message: error.message,
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Chat API server running on port ${PORT}`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY is not set');
  }
});



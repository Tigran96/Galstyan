// Chat service to handle AI API calls
// This service can be configured to use different AI providers

// Try different API endpoints based on deployment
const getApiEndpoint = () => {
  // Custom endpoint from env
  if (import.meta.env.VITE_CHAT_API_ENDPOINT) {
    return import.meta.env.VITE_CHAT_API_ENDPOINT;
  }
  
  // For local development with Express server
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api/chat';
  }
  
  // For production (Vercel/Netlify)
  return '/api/chat';
};

const API_ENDPOINT = getApiEndpoint();
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const USE_MOCK = import.meta.env.VITE_USE_MOCK_CHAT === 'true';

// System prompt for educational context
const getSystemPrompt = (lang) => {
  const prompts = {
    hy: `Դուք Գալստյան Ակադեմիայի օգնական AI-ն եք: Ձեր նպատակն է օգնել ուսանողներին մաթեմատիկայի, ֆիզիկայի և այլ առարկաների հարցերում: Պատասխանեք բարեկամաբար, հստակ և կրթական ոճով: Եթե հարցը վերաբերում է դասընթացներին կամ գրանցմանը, խորհուրդ տվեք կապ հաստատել ակադեմիայի հետ:`,
    en: `You are an AI assistant for Galstyan Academy. Your goal is to help students with questions about mathematics, physics, and other subjects. Respond in a friendly, clear, and educational manner. If the question is about courses or enrollment, suggest contacting the academy directly.`,
    ru: `Вы - AI-ассистент Академии Галстяна. Ваша цель - помочь студентам с вопросами по математике, физике и другим предметам. Отвечайте дружелюбно, четко и в образовательном стиле. Если вопрос касается курсов или записи, предложите связаться с академией напрямую.`,
  };
  return prompts[lang] || prompts.en;
};

// Mock responses for development/testing
const getMockResponse = (message, lang) => {
  const lowerMessage = message.toLowerCase();
  
  const responses = {
    hy: {
      default: "Շնորհակալություն ձեր հարցի համար: Այս պահին AI-ն կարգավորվում է: Խնդրում ենք կապ հաստատել մեզ հետ ուղղակիորեն՝ +374 (94) 766-409 հեռախոսահամարով կամ maratgalstyan1967@gmail.com էլ.փոստով:",
      math: "Մաթեմատիկայի հարցերի համար մենք առաջարկում ենք խմբակային կամ անհատական դասեր: Մեր ուսուցիչները կարող են օգնել հանրահաշիվ, երկրաչափություն, եռանկյունաչափություն և այլ թեմաներում:",
      physics: "Ֆիզիկայի հարցերի համար մենք առաջարկում ենք մասնագիտացված դասեր: Կապ հաստատեք մեզ հետ ավելի մանրամասն տեղեկությունների համար:",
      course: "Մենք առաջարկում ենք խմբակային (մինչև 5 ուսանող) և անհատական դասեր: Գնացուցակը տեսնելու համար այցելեք գնացուցակի բաժինը:",
    },
    en: {
      default: "Thank you for your question! The AI is currently being set up. Please contact us directly at +374 (94) 766-409 or email maratgalstyan1967@gmail.com for immediate assistance.",
      math: "For mathematics questions, we offer both group and private lessons. Our teachers can help with algebra, geometry, trigonometry, and more.",
      physics: "For physics questions, we offer specialized lessons. Please contact us for more details.",
      course: "We offer group (up to 5 students) and private lessons. Visit the pricing section to see our plans.",
    },
    ru: {
      default: "Спасибо за ваш вопрос! В настоящее время AI настраивается. Пожалуйста, свяжитесь с нами напрямую по телефону +374 (94) 766-409 или по email maratgalstyan1967@gmail.com для немедленной помощи.",
      math: "По вопросам математики мы предлагаем групповые и индивидуальные занятия. Наши преподаватели могут помочь с алгеброй, геометрией, тригонометрией и другими темами.",
      physics: "По вопросам физики мы предлагаем специализированные занятия. Пожалуйста, свяжитесь с нами для получения дополнительной информации.",
      course: "Мы предлагаем групповые (до 5 студентов) и индивидуальные занятия. Посетите раздел с ценами, чтобы увидеть наши планы.",
    },
  };

  const langResponses = responses[lang] || responses.en;
  
  if (lowerMessage.includes('math') || lowerMessage.includes('մաթեմ') || lowerMessage.includes('матем')) {
    return langResponses.math;
  }
  if (lowerMessage.includes('physics') || lowerMessage.includes('ֆիզիկ') || lowerMessage.includes('физик')) {
    return langResponses.physics;
  }
  if (lowerMessage.includes('course') || lowerMessage.includes('դաս') || lowerMessage.includes('курс') || lowerMessage.includes('price') || lowerMessage.includes('գին') || lowerMessage.includes('цена')) {
    return langResponses.course;
  }
  
  return langResponses.default;
};

export const sendMessage = async (message, conversationHistory, lang = 'en') => {
  try {
    // Use mock responses in development if no API is configured
    if (USE_MOCK && !API_KEY && !import.meta.env.VITE_CHAT_API_ENDPOINT) {
      console.log('Using mock chat responses (development mode)');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getMockResponse(message, lang);
    }

    // If using OpenAI directly from frontend (not recommended for production)
    if (API_KEY && (API_ENDPOINT.includes('openai') || !API_ENDPOINT.includes('/api/'))) {
      return await callOpenAI(message, conversationHistory, lang);
    }

    // Otherwise, use backend API endpoint
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory,
        lang,
        systemPrompt: getSystemPrompt(lang),
      }),
    });

    if (!response.ok) {
      // If API endpoint doesn't exist, fall back to mock in development
      if (response.status === 404 && USE_MOCK) {
        console.log('API endpoint not found, using mock responses');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getMockResponse(message, lang);
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || data.message || 'Sorry, I could not process your request.';
  } catch (error) {
    console.error('Chat service error:', error);
    
    // In development, provide helpful mock response instead of error
    if (USE_MOCK && (error.message.includes('Failed to fetch') || error.message.includes('404'))) {
      console.log('Network error, using mock response');
      await new Promise(resolve => setTimeout(resolve, 500));
      return getMockResponse(message, lang);
    }
    
    throw error;
  }
};

// Direct OpenAI API call (for development/testing)
const callOpenAI = async (message, conversationHistory, lang) => {
  const messages = [
    { role: 'system', content: getSystemPrompt(lang) },
    ...conversationHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    })),
    { role: 'user', content: message },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'Sorry, I could not process your request.';
};


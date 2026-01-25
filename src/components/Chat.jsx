import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/chatService';
import newtonChatLogo from '../assets/newton-chat-logo.svg';

export const Chat = ({ lang, t, CONFIG, isOpen, onClose }) => {
  const detectMessageLang = (text) => {
    // Armenian range: \u0530-\u058F
    if (/[\u0530-\u058F]/.test(text)) return 'hy';
    // Cyrillic range: \u0400-\u04FF (covers Russian)
    if (/[\u0400-\u04FF]/.test(text)) return 'ru';
    // Default to English/Latin
    return 'en';
  };

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: t('chat.welcomeMessage'),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Ensure chat opens expanded (not minimized) and resets when closed
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
      setIsMaximized(false);
    } else {
      setIsMinimized(false);
      setIsMaximized(false);
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const messageLang = detectMessageLang(userMessage);
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Answer in the same language as the student's message (not the UI language)
      const response = await sendMessage(userMessage, messages, messageLang);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ]);
    } catch (error) {
      console.error('Chat error:', error);

      const status = error?.status;
      const code = error?.code;
      const msg = String(error?.message || '');

      const isRateLimit =
        status === 429 ||
        code === 'RATE_LIMIT_EXCEEDED' ||
        /rate limit/i.test(msg) ||
        /too many requests/i.test(msg);

      const isNetworkError =
        status == null &&
        (msg.includes('Failed to fetch') ||
          msg.includes('NetworkError') ||
          msg.includes('ERR_CONNECTION') ||
          msg.includes('ERR_NETWORK') ||
          msg.includes('Load failed'));

      // Handle rate limit errors with specific message
      if (isRateLimit) {
        const rateLimitMessages = {
          hy: 'Ներեցեք, դուք գերազանցել եք հարցումների սահմանը: Խնդրում ենք սպասել մի քանի րոպե և փորձել կրկին:',
          en: 'Sorry, you\'ve exceeded the rate limit. Please wait a few minutes and try again. Check your OpenAI account if this continues.',
          ru: 'Извините, вы превысили лимит запросов. Пожалуйста, подождите несколько минут и попробуйте снова.'
        };
        
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: rateLimitMessages[messageLang] || rateLimitMessages.en,
          },
        ]);
        return;
      }

      if (isNetworkError) {
        const connectionMessages = {
          hy: 'Չեմ կարող կապ հաստատել սերվերի հետ։ Խնդրում եմ փորձեք մի քիչ հետո կամ ստուգեք, որ chat backend-ը աշխատում է։',
          en: 'I can’t connect to the server right now. Please try again in a minute or make sure the chat backend is running.',
          ru: 'Не могу подключиться к серверу. Попробуйте чуть позже или проверьте, что backend чата работает.',
        };

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: connectionMessages[messageLang] || connectionMessages.en,
          },
        ]);
        return;
      }

      // Generic error (backend responded with an error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: t('chat.errorMessage'),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: t('chat.welcomeMessage'),
      },
    ]);
  };

  if (!isOpen) return null;

  const shellWrapperClass = isMaximized
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'
    : 'fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)]';

  const shellPanelClass = isMaximized
    ? `relative w-full max-w-2xl flex flex-col bg-sky-950 rounded-2xl shadow-2xl border border-sky-800/50 overflow-hidden ${isMinimized ? 'h-auto' : 'h-[80vh] max-h-[700px]'}`
    : `relative flex flex-col bg-sky-950 rounded-2xl shadow-2xl border border-sky-800/50 overflow-hidden ${isMinimized ? 'h-auto' : 'h-[70vh] max-h-[700px]'}`;

  const handleMinimize = () => {
    // If minimizing while maximized, behave exactly like normal minimized state:
    // collapse to the bottom-right minimized bar (no centered modal).
    if (isMaximized) setIsMaximized(false);
    setIsMinimized(true);
  };

  const handleHeaderToggle = () => {
    if (isMinimized) {
      setIsMinimized(false);
      return;
    }
    handleMinimize();
  };

  const handleToggleMaximize = () => {
    // Maximizing should always expand the full chat UI.
    if (!isMaximized) setIsMinimized(false);
    setIsMaximized((v) => !v);
  };

  return (
    <div className={shellWrapperClass}>
      <div className={shellPanelClass}>
        {/* Header (click to toggle minimize) */}
        <button
          type="button"
          onClick={handleHeaderToggle}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-sky-900 to-indigo-900 border-b border-sky-800/50 text-left"
          aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center">
              <img
                src={newtonChatLogo}
                alt=""
                className="w-8 h-8 select-none"
                draggable="false"
              />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                {t('chat.title')}
              </h3>
              {!!t('chat.subtitle') && (
                <p className="text-sky-300 text-xs">
                  {t('chat.subtitle')}
                </p>
              )}
            </div>
          </div>
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Maximize / Restore */}
            <button
              type="button"
              onClick={handleToggleMaximize}
              className={`text-sky-300 hover:text-white hover:bg-sky-800/50 rounded-lg transition-colors ${isMinimized ? 'p-1.5' : 'p-2'}`}
              title={isMaximized ? (t('chat.restore') || 'Restore') : (t('chat.maximize') || 'Maximize')}
              aria-label={isMaximized ? (t('chat.restore') || 'Restore') : (t('chat.maximize') || 'Maximize')}
            >
              {isMaximized ? (
                <svg className={`${isMinimized ? 'w-4.5 h-4.5' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8h10v10H8z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 16H5a1 1 0 01-1-1V5a1 1 0 011-1h10a1 1 0 011 1v1" />
                </svg>
              ) : (
                <svg className={`${isMinimized ? 'w-4.5 h-4.5' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="1.5" strokeWidth={2} />
                </svg>
              )}
            </button>

            {/* Minimize (hide when already minimized) */}
            {!isMinimized && (
              <button
                type="button"
                onClick={handleMinimize}
                className="p-2 text-sky-300 hover:text-white hover:bg-sky-800/50 rounded-lg transition-colors"
                title={t('chat.minimize') || 'Minimize'}
                aria-label={t('chat.minimize') || 'Minimize'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 19h12" />
                </svg>
              </button>
            )}

            {/* Clear */}
            <button
              type="button"
              onClick={handleClear}
              className={`text-sky-300 hover:text-white hover:bg-sky-800/50 rounded-lg transition-colors ${isMinimized ? 'p-1.5' : 'p-2'}`}
              title={t('chat.clear')}
              aria-label={t('chat.clear')}
            >
              <svg className={`${isMinimized ? 'w-4.5 h-4.5' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className={`text-sky-300 hover:text-white hover:bg-sky-800/50 rounded-lg transition-colors ${isMinimized ? 'p-1.5' : 'p-2'}`}
              title={t('chat.close')}
              aria-label={t('chat.close')}
            >
              <svg className={`${isMinimized ? 'w-4.5 h-4.5' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </button>

        {/* Minimized quick input (small write + send) */}
        {isMinimized && (
          <form
            onSubmit={handleSend}
            className="p-3 bg-sky-950 border-t border-sky-800/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4 11.5-11.5z" />
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chat.placeholder')}
                  className="w-full pl-9 pr-3 py-2 bg-sky-900/70 border border-sky-800/50 rounded-xl text-white placeholder-sky-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-9 w-9 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white flex items-center justify-center hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label={t('chat.send')}
                title={t('chat.send')}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        )}

        {!isMinimized && (
        <>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-sky-950/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white'
                    : 'bg-sky-900/80 text-sky-100 border border-sky-800/50'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-sky-900/80 text-sky-100 border border-sky-800/50 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-4 bg-sky-900/50 border-t border-sky-800/50"
        >
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="flex-1 px-4 py-3 bg-sky-900/80 border border-sky-800/50 rounded-xl text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-12 w-12 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center"
              aria-label={t('chat.send')}
              title={t('chat.send')}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>
        </>
        )}
      </div>
    </div>
  );
};


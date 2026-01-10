import newtonChatLogo from '../assets/newton-chat-logo.svg';

export const ChatButton = ({ onClick, unreadCount = 0, t }) => {
  const tooltipTitle = t ? t('chat.tooltipTitle') : "Hello, I'm Newton";
  const tooltipBody =
    t ? t('chat.tooltipBody') : "I can help with math and physics. Let's start!";
  const tooltipCta = t ? t('chat.tooltipCta') : 'Start';

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      {/* Hover card */}
      <div
        role="tooltip"
        className="absolute bottom-[78px] right-0 w-72 origin-bottom-right rounded-2xl border border-white/10 bg-sky-950/95 backdrop-blur shadow-2xl p-4 opacity-0 translate-y-2 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto"
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center">
            <img
              src={newtonChatLogo}
              alt=""
              className="w-8 h-8 select-none"
              draggable="false"
            />
          </div>
          <div className="min-w-0">
            <div className="text-white font-semibold leading-tight">
              {tooltipTitle}
            </div>
            <div className="mt-1 text-sm text-sky-200 leading-snug">
              {tooltipBody}
            </div>
            <button
              type="button"
              onClick={onClick}
              className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold text-sm hover:from-sky-500 hover:to-indigo-500 transition-colors"
            >
              {tooltipCta}
            </button>
          </div>
        </div>

        {/* little caret */}
        <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 bg-sky-950/95 border-b border-r border-white/10" />
      </div>

      {/* Main floating button */}
      <button
        type="button"
        onClick={onClick}
        className="relative w-16 h-16 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label={tooltipTitle}
      >
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        <img
          src={newtonChatLogo}
          alt=""
          className="w-9 h-9 transition-transform select-none"
          draggable="false"
        />
      </button>
    </div>
  );
};


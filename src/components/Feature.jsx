import { Card } from './Card';

export const Feature = ({ icon, title, desc, CONFIG, disabled = false, comingSoonText = "Coming Soon", notifyMeText = "Notify me when ready" }) => {
  const content = (
    <div className="flex items-start gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${disabled ? 'bg-white/5' : 'bg-gradient-to-br from-white/10 to-white/0'}`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex-1">
        <h3 className={`text-lg font-semibold ${disabled ? 'text-sky-300' : 'text-white'}`}>
          {title}
          {disabled && <span className="ml-2 text-xs text-sky-400">({comingSoonText})</span>}
        </h3>
        <p className={`mt-2 text-sm ${disabled ? 'text-sky-300' : 'text-sky-200'}`}>{desc}</p>
        {disabled && (
          <a
            href="#contact"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-200 transition-colors"
            onClick={e => e.stopPropagation()}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifyMeText}
          </a>
        )}
      </div>
    </div>
  );

  if (disabled) {
    return (
      <Card CONFIG={CONFIG} className="opacity-60 hover:opacity-80 transition-opacity">
        {content}
      </Card>
    );
  }

  return (
    <a href="#pricing" className="block">
      <Card CONFIG={CONFIG} className="hover:bg-white/10 transition-colors cursor-pointer">
        {content}
      </Card>
    </a>
  );
};

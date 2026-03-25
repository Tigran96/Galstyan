import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sticky_trial_bar_dismissed';

export const StickyTrialBar = ({ lang, phone }) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 400) setVisible(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  if (dismissed || !visible) return null;

  const label =
    lang === 'hy' ? 'Գրանցվե՛ք անվճար փորձնական դասի' :
    lang === 'ru' ? 'Запишитесь на бесплатный пробный урок' :
    'Book your free trial lesson';

  const cta =
    lang === 'hy' ? 'Զանգահարել' :
    lang === 'ru' ? 'Позвонить' :
    'Call now';

  const sub =
    lang === 'hy' ? 'Առաջին դասն անվճար է' :
    lang === 'ru' ? 'Первый урок бесплатно' :
    'First lesson is free';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-600 shadow-2xl shadow-sky-900/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          {/* Left: text */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="hidden sm:block text-2xl">🎓</span>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm sm:text-base leading-tight truncate">{label}</p>
              <p className="text-sky-200 text-xs">{sub}</p>
            </div>
          </div>

          {/* Right: CTA + dismiss */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white text-sky-700 font-bold text-sm px-4 py-2 hover:bg-sky-50 transition-colors shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
              </svg>
              {cta}
            </a>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss"
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

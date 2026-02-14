export function PrivacyPolicyPage({ t, lang, onBack }) {
  const sections = t("privacy.sections") || [];
  const title = t("privacy.title") || (lang === 'hy' ? 'Գաղտնիություն' : 'Privacy Policy');
  const subtitle = t("privacy.subtitle") || '';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col pt-28 pb-32 overflow-y-auto">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Simple navigation */}
        <div className="mb-12">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sky-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t('auth.back') || 'Back'}</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-16 border-l-4 border-sky-500 pl-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
          {subtitle && <p className="text-xl text-sky-200/60">{subtitle}</p>}
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-sky-300">{section.title}</h2>
              <p className="text-lg text-white/80 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Simple footer/CTA */}
        <div className="mt-20 py-12 border-t border-white/10 text-center">
           <h3 className="text-2xl font-bold mb-6">
             {lang === 'hy' ? 'Հարցեր ունե՞ք:' : lang === 'ru' ? 'Есть вопросы?' : 'Have questions?'}
           </h3>
           <button 
              onClick={() => { onBack(); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="px-8 py-4 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 transition-colors"
            >
              {lang === 'hy' ? 'Կապնվել հիմա' : lang === 'ru' ? 'Связаться сейчас' : 'Contact Us'}
            </button>
        </div>
      </div>
    </div>
  );
}


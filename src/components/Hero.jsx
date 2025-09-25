import { Badge } from './Badge';

export const Hero = ({ t, CONFIG, lang }) => (
  <section id="home" className="relative overflow-hidden min-h-screen flex items-center">
    {/* Multi-layer animated background */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgba(56,189,248,.25),transparent)]" />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_20rem_at_80%_20%,rgba(99,102,241,.15),transparent)]" />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(30rem_15rem_at_20%_80%,rgba(168,85,247,.1),transparent)]" />
    
    {/* Animated floating shapes */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-sky-400/20 to-indigo-400/20 rounded-full animate-float blur-sm"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-float-delayed blur-sm"></div>
      <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full animate-float-slow blur-sm"></div>
      <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full animate-float blur-sm"></div>
      <div className="absolute bottom-20 right-10 w-14 h-14 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full animate-float-delayed blur-sm"></div>
    </div>
    
    <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 relative z-10">
      <div className="max-w-3xl">
        {t("hero.badge") && <Badge>{t("hero.badge")}</Badge>}
        <h1 className="mt-6 text-4xl md:text-6xl font-heading font-bold tracking-tight leading-normal">
          <div className="bg-gradient-to-r from-white via-sky-100 to-sky-200 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%] py-2">
            {CONFIG.businessName[lang]}
          </div>
          <div className="text-2xl md:text-4xl text-sky-200 mt-4 font-medium tracking-wide">
            {t("hero.tagline")}
          </div>
        </h1>
        <p className="mt-6 text-lg text-sky-200 font-sans leading-relaxed">{t("hero.subtitle")}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a
            href="#pricing"
            className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-400 px-8 py-4 text-sm font-heading font-semibold text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("hero.primary")}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
          <a
            href="#courses"
            className="group relative inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-4 text-sm font-heading font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 hover:ring-white/25 hover:scale-105 transition-all duration-300 backdrop-blur-sm overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("hero.secondary")}
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
          <a
            href="#founder"
            className="group relative inline-flex items-center justify-center rounded-xl bg-white/5 px-6 py-4 text-sm font-heading font-semibold text-white ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-sm overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("hero.founder")}
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-sky-200">
          {t("hero.smalls").map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

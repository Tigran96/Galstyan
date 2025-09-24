import { Badge } from './Badge';

export const Hero = ({ t, CONFIG, lang }) => (
  <section id="home" className="relative overflow-hidden min-h-screen flex items-center">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgba(56,189,248,.25),transparent)]" />
    
    <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 relative z-10">
      <div className="max-w-3xl">
        {t("hero.badge") && <Badge>{t("hero.badge")}</Badge>}
        <h1 className="mt-6 text-4xl md:text-6xl font-heading font-bold tracking-tight leading-tight">
          <div className="text-white">
            {CONFIG.businessName[lang]}
          </div>
          <div className="text-2xl md:text-4xl text-sky-200 mt-4 font-medium tracking-wide">
            {t("hero.tagline")}
          </div>
        </h1>
        <p className="mt-6 text-lg text-sky-200 font-sans leading-relaxed">{t("hero.subtitle")}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-400 px-6 py-3 text-sm font-heading font-semibold text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:scale-105 transition-all duration-300"
          >
            {t("hero.primary")}
          </a>
          <a
            href="#courses"
            className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-sm font-heading font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 hover:ring-white/25 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
          >
            {t("hero.secondary")}
          </a>
          <a
            href="#founder"
            className="inline-flex items-center justify-center rounded-xl bg-white/5 px-6 py-3 text-sm font-heading font-semibold text-white ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
          >
            {t("hero.founder")}
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

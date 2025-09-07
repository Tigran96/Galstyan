import { Badge } from './Badge';

export const Hero = ({ t, CONFIG, lang }) => (
  <section id="home" className="relative overflow-hidden">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgba(56,189,248,.25),transparent)]" />
    <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="max-w-3xl">
        <Badge>{t("hero.badge")}</Badge>
        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-white">
          {CONFIG.businessName[lang]}: {t("hero.tagline")}
        </h1>
        <p className="mt-5 text-lg text-sky-200">{t("hero.subtitle")}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:opacity-95 transition-opacity"
          >
            {t("hero.primary")}
          </a>
          <a
            href="#courses"
            className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 transition-all"
          >
            {t("hero.secondary")}
          </a>
          <a
            href="#founder"
            className="inline-flex items-center justify-center rounded-xl bg-white/5 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10 transition-all"
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

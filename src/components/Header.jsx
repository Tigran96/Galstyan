import { LangButton } from './LangButton';
import { NavLink } from './NavLink';

export const Header = ({ lang, setLang, t, CONFIG }) => (
  <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-sky-950/60 border-b border-white/10">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
      <a href="#home" className="flex items-center gap-2">
        <img
          src={CONFIG.logo}
          alt={CONFIG.businessName[lang] + " logo"}
          className="h-12 w-auto md:h-16"
        />
        <span className="text-white font-semibold text-height-fixed">{CONFIG.businessName[lang]}</span>
      </a>
      <nav className="hidden md:flex items-center gap-1">
        <NavLink href="#courses">{t("nav.courses")}</NavLink>
        <NavLink href="#teachers">{t("nav.teachers")}</NavLink>
        <NavLink href="#pricing">{t("nav.pricing")}</NavLink>
        <NavLink href="#faq">{t("nav.faq")}</NavLink>
        <NavLink href="#contact">{t("nav.contact")}</NavLink>
      </nav>
      <div className="flex items-center gap-2">
        <LangButton code="hy" label="🇦🇲 Հայ" active={lang === "hy"} onClick={() => setLang("hy")} />
        <LangButton code="en" label="🇬🇧 EN" active={lang === "en"} onClick={() => setLang("en")} />
        <LangButton code="ru" label="🇷🇺 РУ" active={lang === "ru"} onClick={() => setLang("ru")} />
      </div>
    </div>
  </header>
);

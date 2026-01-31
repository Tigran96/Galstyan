import { LangButton } from './LangButton';
import { NavLink } from './NavLink';

export const Header = ({
  lang,
  setLang,
  t,
  CONFIG,
  isAuthed,
  user,
  onLoginClick,
  onSignUpClick,
  onDashboardClick,
  onLogout,
}) => (
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
        <div className="flex items-center gap-2 mr-2">
          {isAuthed ? (
            <>
              <button
                type="button"
                onClick={onDashboardClick}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-sky-100 hover:bg-white/10 transition-colors"
                title={user?.username || ''}
              >
                {t('private.dashboardNav')}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-lg bg-red-500/20 border border-red-500/30 px-3 py-2 text-sm text-red-100 hover:bg-red-500/25 transition-colors"
              >
                {t('private.logoutNav')}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onLoginClick}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-sky-100 hover:bg-white/10 transition-colors"
              >
                {t('auth.loginNav')}
              </button>
              <button
                type="button"
                onClick={onSignUpClick}
                className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 font-semibold px-3 py-2 text-sm hover:opacity-95 transition-opacity"
              >
                {t('auth.signupNav')}
              </button>
            </>
          )}
        </div>
        <LangButton code="hy" label="🇦🇲 Հայ" active={lang === "hy"} onClick={() => setLang("hy")} />
        <LangButton code="en" label="🇬🇧 EN" active={lang === "en"} onClick={() => setLang("en")} />
        <LangButton code="ru" label="🇷🇺 РУ" active={lang === "ru"} onClick={() => setLang("ru")} />
      </div>
    </div>
  </header>
);

import { LangButton } from './LangButton';
import { NavLink } from './NavLink';

export const Header = ({
  lang,
  setLang,
  t,
  CONFIG,
  isAuthed,
  user,
  unreadNotificationsCount,
  onForumClick,
  onNavigateAnchor,
  onLogoClick,
  onLoginClick,
  onSignUpClick,
  onDashboardClick,
  onLogout,
}) => (
  <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-sky-950/60 border-b border-white/10">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
      <a
        href="#home"
        className="flex items-center gap-2"
        onClick={(e) => {
          e.preventDefault();
          onLogoClick?.();
        }}
      >
        <img
          src={CONFIG.logo}
          alt={CONFIG.businessName[lang] + " logo"}
          className="h-12 w-auto md:h-16"
        />
        <span className="text-white font-semibold text-height-fixed">{CONFIG.businessName[lang]}</span>
      </a>
      <nav className="hidden md:flex items-center gap-1">
        <NavLink
          href="#courses"
          onClick={(e) => {
            e.preventDefault();
            onNavigateAnchor?.('courses');
          }}
        >
          {t("nav.courses")}
        </NavLink>
        <NavLink
          href="#teachers"
          onClick={(e) => {
            e.preventDefault();
            onNavigateAnchor?.('teachers');
          }}
        >
          {t("nav.teachers")}
        </NavLink>
        <NavLink
          href="#pricing"
          onClick={(e) => {
            e.preventDefault();
            onNavigateAnchor?.('pricing');
          }}
        >
          {t("nav.pricing")}
        </NavLink>
        <NavLink
          href="#faq"
          onClick={(e) => {
            e.preventDefault();
            onNavigateAnchor?.('faq');
          }}
        >
          {t("nav.faq")}
        </NavLink>
        <NavLink
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            onNavigateAnchor?.('contact');
          }}
        >
          {t("nav.contact")}
        </NavLink>
        <button
          type="button"
          onClick={onForumClick}
          className="px-3 py-2 text-sm text-sky-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors whitespace-nowrap"
        >
          {t("nav.forum")}
        </button>
      </nav>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-2">
          {isAuthed ? (
            <>
              <button
                type="button"
                onClick={onDashboardClick}
                className="relative rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-sky-100 hover:bg-white/10 transition-colors whitespace-nowrap"
                title={user?.username || ''}
              >
                {t('private.dashboardNav')}
                {unreadNotificationsCount > 0 ? (
                  <span
                    className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-sky-950"
                    aria-label="Unread notifications"
                    title="Unread notifications"
                  />
                ) : null}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-lg bg-red-500/20 border border-red-500/30 px-3 py-2 text-sm text-red-100 hover:bg-red-500/25 transition-colors whitespace-nowrap"
              >
                {t('private.logoutNav')}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onLoginClick}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-sky-100 hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                {t('auth.loginNav')}
              </button>
              <button
                type="button"
                onClick={onSignUpClick}
                className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 font-semibold px-3 py-2 text-sm hover:opacity-95 transition-opacity whitespace-nowrap"
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

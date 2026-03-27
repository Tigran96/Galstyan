import { LangButton } from "./LangButton";
import { LangDropdown } from "./LangDropdown";
import { NavLink } from "./NavLink";

export const Header = ({
  lang,
  setLang,
  t,
  CONFIG,
  isAuthed,
  user,
  unreadNotificationsCount,
  unreadSupportCount,
  currentPage,
  activeAnchor,
  onForumClick,
  onTeachersClick,
  onNavigateAnchor,
  onLogoClick,
  onLoginClick,
  onSignUpClick,
  onMessagesClick,
  onNotificationsClick,
  onProfileClick,
  onMembersClick,
  onLogout,
}) => (
  /**
   *
   * Header component with enhanced features:
   * - Responsive design with mobile-friendly navigation
   * - Dynamic rendering based on authentication state
   * - Accessibility improvements (aria-labels, keyboard navigation)
   * - SEO considerations (semantic HTML, alt text for images)
   * - Future-proofing with clear separation of concerns and extensible structure
   *
   */

  <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[#07091a]/70 border-b border-white/10">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-3 sm:px-6 py-2 sm:py-3">
      <a
        href="#home"
        className="flex items-center gap-2 min-w-0"
        onClick={(e) => {
          e.preventDefault();
          onLogoClick?.();
        }}
      >
        <img
          src={CONFIG.logo}
          alt={CONFIG.businessName[lang] + " logo"}
          className="h-10 w-auto sm:h-12 md:h-16"
        />
        {/* Always keep brand name for accessibility */}
        <span className="sr-only">{CONFIG.businessName[lang]}</span>
        {/* Intentionally no visible brand text (icons need space). */}
      </a>
      <nav className="hidden md:flex items-center gap-1">
        <NavLink
          href="#courses"
          active={currentPage === 'home' && activeAnchor === 'courses'}
          onClick={(e) => {
            e.preventDefault();
            onNavigateAnchor?.("courses");
          }}
        >
          {t("nav.courses")}
        </NavLink>
        <NavLink
          href="#teachers"
          active={currentPage === 'teachers'}
          onClick={(e) => {
            e.preventDefault();
            onTeachersClick?.();
          }}
        >
          {t("nav.teachers")}
        </NavLink>
        <NavLink
          href="#pricing"
          active={currentPage === 'home' && activeAnchor === 'pricing'}
          onClick={(e) => {
            e.preventDefault();
            onNavigateAnchor?.("pricing");
          }}
        >
          {t("nav.pricing")}
        </NavLink>
        <NavLink
          href="#faq"
          active={currentPage === 'home' && activeAnchor === 'faq'}
          onClick={(e) => {
            e.preventDefault();
            onNavigateAnchor?.("faq");
          }}
        >
          {t("nav.faq")}
        </NavLink>
        <NavLink
          href="#contact"
          active={currentPage === 'home' && activeAnchor === 'contact'}
          onClick={(e) => {
            e.preventDefault();
            onNavigateAnchor?.("contact");
          }}
        >
          {t("nav.contact")}
        </NavLink>
        <button
          type="button"
          onClick={onForumClick}
          className={`px-3 py-2 text-sm transition-colors rounded-lg whitespace-nowrap ${
            currentPage === 'forum' 
              ? 'bg-sky-500/20 text-sky-400 font-semibold' 
              : 'text-sky-200 hover:text-white hover:bg-white/5'
          }`}
        >
          {t("nav.forum")}
        </button>
      </nav>
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end shrink-0">
        <div className="flex items-center gap-1 sm:gap-2 mr-0 sm:mr-2">
          {isAuthed ? (
            <>
              <button
                type="button"
                onClick={onMessagesClick}
                className="group relative inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 h-9 w-9 sm:h-10 sm:w-10 hover:bg-white/10 transition-colors"
                aria-label={t?.("private.supportTab") || "Messages"}
                title={t?.("private.supportTab") || "Messages"}
              >
                {/* Chat bubble icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-sky-100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12c0 4.418-4.03 8-9 8a11 11 0 0 1-3.7-.64L3 20l1.7-4.08A7.6 7.6 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
                  <path d="M8 12h.01M12 12h.01M16 12h.01" />
                </svg>
                {unreadSupportCount > 0 ? (
                  <span
                    className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#07091a]"
                    aria-label="Unread messages"
                    title="Unread messages"
                  />
                ) : null}
                <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#07091a]/95 px-2 py-1 text-xs text-sky-100 opacity-0 shadow border border-white/10 group-hover:opacity-100 transition-opacity">
                  {t?.("private.supportTab") || "Messages"}
                </span>
              </button>
              <button
                type="button"
                onClick={onNotificationsClick}
                className="group relative inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 h-9 w-9 sm:h-10 sm:w-10 hover:bg-white/10 transition-colors"
                aria-label={t?.("private.notificationsTab") || "Notifications"}
                title={t?.("private.notificationsTab") || "Notifications"}
              >
                {/* Bell icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-sky-100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 17H9" />
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" />
                  <path d="M10 21a2 2 0 0 0 4 0" />
                </svg>
                {unreadNotificationsCount > 0 ? (
                  <span
                    className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#07091a]"
                    aria-label="Unread notifications"
                    title="Unread notifications"
                  />
                ) : null}
                <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#07091a]/95 px-2 py-1 text-xs text-sky-100 opacity-0 shadow border border-white/10 group-hover:opacity-100 transition-opacity">
                  {t?.("private.notificationsTab") || "Notifications"}
                </span>
              </button>
              <button
                type="button"
                onClick={onProfileClick}
                className="group relative inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 h-9 w-9 sm:h-10 sm:w-10 hover:bg-white/10 transition-colors"
                aria-label={t?.("private.profileNav") || "Profile"}
                title={t?.("private.profileNav") || "Profile"}
              >
                {/* User icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-sky-100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21a8 8 0 1 0-16 0" />
                  <path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
                </svg>
                <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#07091a]/95 px-2 py-1 text-xs text-sky-100 opacity-0 shadow border border-white/10 group-hover:opacity-100 transition-opacity">
                  {t?.("private.profileNav") || "Profile"}
                </span>
              </button>
              {["admin", "moderator"].includes(user?.role) ? (
                <button
                  type="button"
                  onClick={onMembersClick}
                  className="group relative inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 h-9 w-9 sm:h-10 sm:w-10 hover:bg-white/10 transition-colors"
                  aria-label={t?.("admin.members.title") || "Members"}
                  title={t?.("admin.members.title") || "Members"}
                >
                  {/* Users icon */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-sky-100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21a7 7 0 0 0-14 0" />
                    <path d="M10 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
                    <path d="M22 21a6 6 0 0 0-7-5.6" />
                    <path d="M17 11a3.5 3.5 0 1 0-2.3-6.1" />
                  </svg>
                  <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#07091a]/95 px-2 py-1 text-xs text-sky-100 opacity-0 shadow border border-white/10 group-hover:opacity-100 transition-opacity">
                    {t?.("admin.members.title") || "Members"}
                  </span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={onLogout}
                className="group relative inline-flex items-center justify-center rounded-lg bg-red-500/20 border border-red-500/30 h-9 w-9 sm:h-10 sm:w-10 text-red-100 hover:bg-red-500/25 transition-colors"
                aria-label={t?.("private.logoutNav") || "Logout"}
                title={t?.("private.logoutNav") || "Logout"}
              >
                {/* Arrow-only logout icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h12" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
                <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#07091a]/95 px-2 py-1 text-xs text-sky-100 opacity-0 shadow border border-white/10 group-hover:opacity-100 transition-opacity">
                  {t?.("private.logoutNav") || "Logout"}
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onLoginClick}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-sky-100 hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                {t("auth.loginNav")}
              </button>
              <button
                type="button"
                onClick={onSignUpClick}
                className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-white font-semibold px-3 py-2 text-sm hover:opacity-95 transition-opacity whitespace-nowrap"
              >
                {t("auth.signupNav")}
              </button>
            </>
          )}
        </div>

        <LangDropdown currentLang={lang} setLang={setLang} />
      </div>
    </div>
  </header>
);

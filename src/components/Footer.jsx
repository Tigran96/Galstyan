export const Footer = ({ t, CONFIG, lang, onPrivacyClick }) => {
  const nav = [
    { label: t("nav.courses"),  href: "#courses"  },
    { label: t("nav.teachers"), href: "#teachers" },
    { label: t("nav.pricing"),  href: "#pricing"  },
    { label: t("nav.faq"),      href: "#faq"      },
    { label: t("nav.contact"),  href: "#contact"  },
  ];

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand column */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={CONFIG.logo}
                alt={CONFIG.businessName[lang] + " logo"}
                className="h-10 w-auto opacity-90"
              />
              <span className="text-white font-heading font-bold text-lg">
                {CONFIG.businessName[lang]}
              </span>
            </div>
            <p className="text-sm text-sky-300/70 leading-relaxed max-w-xs">
              {lang === "hy"
                ? "Բարձրորակ կրթություն մաթեմատիկայի, ֆիզիկայի և SAT/GRE/GMAT-ի բոլոր մակարդակների համար։"
                : lang === "ru"
                ? "Качественное образование по математике, физике и подготовке к SAT/GRE/GMAT для всех уровней."
                : "Quality education in Mathematics, Physics, and SAT/GRE/GMAT prep for all levels."}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4 pt-1">
              <a
                href={CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-sky-400/70 hover:text-white transition-colors"
              >
                <i className="fa-brands fa-facebook text-xl" />
              </a>
              <a
                href={CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-sky-400/70 hover:text-white transition-colors"
              >
                <i className="fa-brands fa-instagram text-xl" />
              </a>
              <a
                href={`https://t.me/${CONFIG.telegramPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="text-sky-400/70 hover:text-white transition-colors"
              >
                <i className="fa-brands fa-telegram text-xl" />
              </a>
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-sky-400/70 mb-5">
              {lang === "hy" ? "Նավիգացիա" : lang === "ru" ? "Навигация" : "Navigate"}
            </h3>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-sky-200/70 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onPrivacyClick?.()}
                  className="text-sm text-sky-200/70 hover:text-white transition-colors text-left"
                >
                  {t("footer.links.privacy")}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-sky-400/70 mb-5">
              {lang === "hy" ? "Կապ" : lang === "ru" ? "Контакты" : "Contact"}
            </h3>
            <ul className="space-y-3 text-sm text-sky-200/70">
              <li>
                <a
                  href={`mailto:${CONFIG.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-envelope w-4 text-center" />
                  {CONFIG.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONFIG.phone}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-phone w-4 text-center" />
                  {CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-location-dot w-4 text-center" />
                {CONFIG.address[lang]}
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sky-300/40">
          <span>© {new Date().getFullYear()} {CONFIG.businessName[lang]}. {t("footer.rights")}.</span>
          <span>
            {lang === "hy" ? "Պատրաստված է ❤️-ով" : lang === "ru" ? "Сделано с ❤️" : "Made with ❤️"}
          </span>
        </div>
      </div>
    </footer>
  );
};

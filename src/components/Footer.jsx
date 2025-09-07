export const Footer = ({ t, CONFIG, lang }) => (
  <footer className="border-t border-white/10">
    <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-sky-200">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} {CONFIG.businessName[lang]}. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <a href="#enroll" className="underline decoration-white/20 hover:decoration-white/40 transition-colors">
            {t("footer.links.enroll")}
          </a>
          <a href="#faq" className="underline decoration-white/20 hover:decoration-white/40 transition-colors">
            {t("footer.links.faq")}
          </a>
          <a href="#pricing" className="underline decoration-white/20 hover:decoration-white/40 transition-colors">
            {t("footer.links.pricing")}
          </a>
        </div>
      </div>
    </div>
  </footer>
);

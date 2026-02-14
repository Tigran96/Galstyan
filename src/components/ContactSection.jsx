import React from 'react';
import { Section } from './Section';
import { Card } from './Card';
import { trackContactClick } from '../utils/analytics';

export const ContactSection = ({ lang, t, CONFIG }) => {

    /**
     * 
     * Contact Section component features:
     *  
     */


  const socialTitle = {
    hy: "Մեր սոցիալական ցանցերը",
    en: "Follow us",
    ru: "Мы в соцсетях"
  };

  return (
    <Section id="contact" title={t("contact.title")} subtitle={t("contact.subtitle")} variant="subtle">
      <div className="max-w-4xl mx-auto">
        <Card CONFIG={CONFIG}>
          <div className="text-center">
            <p className="text-lg text-sky-200 mb-6">
              {t("contact.lead")}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Contact Information */}
              <div className="space-y-6 text-left md:pl-8">
                <ContactLink 
                  href={`mailto:${CONFIG.email}`}
                  icon="fa-envelope"
                  label={CONFIG.email}
                  onClick={() => trackContactClick('email')}
                />
                <ContactLink 
                  href={`tel:${CONFIG.phone}`}
                  icon="fa-phone"
                  label={CONFIG.phone}
                  onClick={() => trackContactClick('phone')}
                />
                <div className="flex items-center gap-4 group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-sky-400">
                    <i className="fa-solid fa-location-dot text-xl"></i>
                  </div>
                  <span className="text-sky-200 text-lg leading-snug">
                    {CONFIG.address[lang]}
                  </span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex flex-col justify-center items-center space-y-4 border-t border-white/5 pt-6 md:border-t-0 md:pt-0 md:border-l">
                <h4 className="text-white font-semibold text-lg">
                  {socialTitle[lang] || socialTitle.en}
                </h4>
                <div className="flex justify-center gap-6">
                  <SocialIcon 
                    href={CONFIG.social.facebook}
                    icon="fa-facebook"
                    title="Facebook"
                    onClick={() => trackContactClick('facebook')}
                  />
                  <SocialIcon 
                    href={CONFIG.social.instagram}
                    icon="fa-instagram"
                    title="Instagram"
                    onClick={() => trackContactClick('instagram')}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-sky-200/80">
            {t("contact.cta")}{' '}
            <a href="#pricing" className="text-sky-300 hover:text-white underline decoration-sky-300/30 hover:decoration-white transition-all">
              {t("contact.ctaLink1")}
            </a>{' '}
            {t("hero.or")}{' '}
            <a href="#faq" className="text-sky-300 hover:text-white underline decoration-sky-300/30 hover:decoration-white transition-all">
              {t("contact.ctaLink2")}
            </a>.
          </p>
        </div>
      </div>
    </Section>
  );
};

// Helper Components for cleaner code
const ContactLink = ({ href, icon, label, onClick }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="flex items-center gap-4 group transition-all"
  >
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-sky-400 group-hover:bg-sky-400 group-hover:text-sky-950 transition-all">
      <i className={`fa-solid ${icon} text-xl`}></i>
    </div>
    <span className="text-sky-200 group-hover:text-white text-lg transition-colors">
      {label}
    </span>
  </a>
);

const SocialIcon = ({ href, icon, title, onClick }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={onClick}
    title={title}
    className="text-sky-400 hover:text-white hover:scale-110 transition-all duration-200"
  >
    <i className={`fa-brands ${icon} text-4xl`}></i>
  </a>
);
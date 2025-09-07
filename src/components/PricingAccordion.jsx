import { useState } from 'react';
import { PricingCard } from './PricingCard';
import { Card } from './Card';
import { trackEvent } from '../utils/analytics';

export const PricingAccordion = ({ t, CONFIG, lang, formatPrice, onPlanSelect }) => {
  const [activeTab, setActiveTab] = useState('group');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    trackEvent('pricing_tab_change', { tab: tabId });
  };

  const tabs = [
    {
      id: 'group',
      name: lang === "hy" ? "Խմբակային դասեր" : lang === "en" ? "Group Lessons" : "Групповые занятия",
      description: lang === "hy" ? "Փոքր խմբեր մինչև 8 ուսանող" : 
                  lang === "en" ? "Small groups up to 8 students" : 
                  "Малые группы до 8 учеников",
      icon: "👥",
      tiers: t("pricing.groupTiers")
    },
    {
      id: 'private',
      name: lang === "hy" ? "Անհատական դասեր" : lang === "en" ? "Private Lessons" : "Индивидуальные занятия",
      description: lang === "hy" ? "Անհատական պլան և ճկուն գրաֆիկ" : 
                  lang === "en" ? "Personal plan and flexible schedule" : 
                  "Личный план и гибкий график",
      icon: "👤",
      tiers: t("pricing.privateTiers")
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-sky-500 to-indigo-400 text-white shadow-lg'
                : 'bg-white/10 text-sky-200 hover:bg-white/15'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <div className="text-left">
              <div className="font-semibold">{tab.name}</div>
              <div className="text-sm opacity-90">{tab.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tabs.find(tab => tab.id === activeTab)?.tiers.map((tier, i) => (
          <PricingCard
            key={i}
            name={tier.name}
            price={tier.price}
            period={tier.period}
            features={tier.features}
            cta={tier.cta}
            lang={lang}
            CONFIG={CONFIG}
            formatPrice={formatPrice}
            onSelect={() => onPlanSelect(tier.price)}
          />
        ))}
      </div>

      {/* Additional Info */}
      <Card CONFIG={CONFIG} className="text-center">
        <p className="text-sm text-sky-200">
          {t("pricing.note")}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-sky-300">
          <span>• {lang === "hy" ? "60 րոպեանոց դասեր" : lang === "en" ? "60-minute lessons" : "60-минутные уроки"}</span>
          <span>• {lang === "hy" ? "Անվճար փորձնական դաս" : lang === "en" ? "Free trial lesson" : "Бесплатный пробный урок"}</span>
          <span>• {lang === "hy" ? "Ճկուն վճարում" : lang === "en" ? "Flexible payment" : "Гибкая оплата"}</span>
        </div>
      </Card>
    </div>
  );
};

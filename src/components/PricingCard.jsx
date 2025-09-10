import { Card } from './Card';

export const PricingCard = ({ name, price, period, features, cta, ctaHref = "#enroll", lang, CONFIG, formatPrice, onSelect }) => (

  /**
   * 
   * 
   */


  <Card CONFIG={CONFIG}>
    <div className="flex flex-col h-full">
      <div>
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <div className="mt-4 flex items-end gap-1">
          <div className="text-4xl font-bold text-white">{formatPrice(price, lang)}</div>
          <div className="text-sm text-sky-200">/{period}</div>
        </div>
        <ul className="mt-6 space-y-2 text-sm text-sky-200">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5">✅</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onSelect}
        className="mt-8 w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:opacity-95 transition-opacity"
      >
        {cta}
      </button>
    </div>
  </Card>
);

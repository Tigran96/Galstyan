import { Card } from './Card';

export const PricingCard = ({ name, price, period, features, cta, ctaHref = "#enroll", lang, CONFIG, formatPrice, onSelect, popular = false }) => (
  <Card 
    CONFIG={CONFIG} 
    variant={popular ? "premium" : "glass"}
    className={`group relative ${popular ? "ring-2 ring-yellow-400/50 shadow-yellow-400/20" : ""}`}
  >
    <div className="flex flex-col h-full">
      <div>
        <h3 className="text-xl font-heading font-semibold text-white group-hover:text-sky-100 transition-colors duration-300 tracking-wide">{name}</h3>
        <div className="mt-4 flex items-end gap-1">
          <div className="text-4xl font-heading font-bold text-white group-hover:text-sky-50 transition-colors duration-300 tracking-tight">{formatPrice(price, lang)}</div>
          <div className="text-sm font-sans text-sky-200 group-hover:text-sky-100 transition-colors duration-300 font-medium">/{period}</div>
        </div>
        <ul className="mt-6 space-y-3 text-sm text-sky-200 font-sans">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-300" style={{transitionDelay: `${i * 50}ms`}}>
              <span className="mt-0.5 text-green-400 group-hover:text-green-300 transition-colors duration-300">✅</span>
              <span className="group-hover:text-sky-100 transition-colors duration-300 leading-relaxed">{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onSelect}
        className={`mt-8 w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-heading font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl tracking-wide relative overflow-hidden ${
          popular 
            ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:from-yellow-300 hover:to-orange-300 shadow-yellow-400/20 hover:shadow-yellow-400/40" 
            : "bg-gradient-to-r from-sky-500 to-indigo-400 hover:from-sky-400 hover:to-indigo-300 shadow-sky-500/20 hover:shadow-sky-500/40"
        }`}
      >
        <span className="relative z-10">{cta}</span>
        <div className={`absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 ${
          popular 
            ? "bg-gradient-to-r from-yellow-300 to-orange-300" 
            : "bg-gradient-to-r from-sky-400 to-indigo-300"
        }`}></div>
      </button>
    </div>
  </Card>
);

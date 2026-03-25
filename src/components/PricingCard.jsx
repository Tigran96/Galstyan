import { Card } from './Card';

export const PricingCard = ({ name, price, period, features, cta, lang, CONFIG, formatPrice, onSelect, popular = false, spotsLeft }) => (
  <Card
    CONFIG={CONFIG}
    variant={popular ? "premium" : "glass"}
    className={`group relative ${popular ? "ring-2 ring-yellow-400/50 shadow-yellow-400/20" : ""}`}
  >
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {popular && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/15 border border-yellow-400/30 px-3 py-1 text-xs font-semibold text-yellow-300 tracking-wide">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {lang === "hy" ? "Ամենատարածված" : lang === "ru" ? "Популярный" : "Most Popular"}
          </div>
        )}
        {spotsLeft != null && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-400/30 px-3 py-1 text-xs font-semibold text-red-300 tracking-wide animate-pulse">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            {lang === "hy" ? `${spotsLeft} տեղ մնաց` : lang === "ru" ? `Осталось ${spotsLeft} мест` : `${spotsLeft} spots left`}
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-heading font-semibold text-white group-hover:text-sky-100 transition-colors duration-300 tracking-wide">
          {name}
        </h3>
        <div className="mt-4 flex items-end gap-1">
          <div className="text-4xl font-heading font-bold text-white tracking-tight">
            {formatPrice(price, lang)}
          </div>
          <div className="text-sm text-sky-200 font-medium pb-1">/{period}</div>
        </div>

        <ul className="mt-6 space-y-3">
          {features.map((f, i) => (
            <li
              key={i}
              className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-300 text-sm text-sky-200"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <svg
                className="mt-0.5 w-4 h-4 shrink-0 text-green-400 group-hover:text-green-300 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="group-hover:text-sky-100 transition-colors duration-300 leading-relaxed">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onSelect}
        className={`mt-8 w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-heading font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl tracking-wide ${
          popular
            ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-950 hover:from-yellow-300 hover:to-orange-300 shadow-yellow-400/20 hover:shadow-yellow-400/40"
            : "bg-gradient-to-r from-sky-500 to-indigo-400 text-white hover:from-sky-400 hover:to-indigo-300 shadow-sky-500/20 hover:shadow-sky-500/40"
        }`}
      >
        {cta}
      </button>
    </div>
  </Card>
);

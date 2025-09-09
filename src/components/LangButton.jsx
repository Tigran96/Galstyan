import { trackLanguageChange } from '../utils/analytics';

export const LangButton = ({ code, label, active, onClick }) => {
  const handleClick = () => {
    if (!active) {
      trackLanguageChange(code);
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Change language to ${label}`}
      className={`inline-flex items-center justify-center rounded-xl p-1.5 ring-1 transition ${
        active
          ? "bg-white/15 ring-white/30"
          : "bg-white/5 ring-white/10 hover:bg-white/10"
      }`}
    >
      <img 
        src={`${import.meta.env.BASE_URL}flags/${code === "hy" ? "am" : code === "en" ? "gb" : "ru"}.svg`}
        alt={`${label} flag`}
        className="w-6 h-4 object-cover rounded-sm"
      />
    </button>
  );
};

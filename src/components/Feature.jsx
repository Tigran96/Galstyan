import { Card } from './Card';

export const Feature = ({ icon, title, desc, CONFIG, disabled = false, comingSoonText = "Coming Soon" }) => {
  const content = (
    <div className="flex items-start gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${disabled ? 'bg-white/5' : 'bg-gradient-to-br from-white/10 to-white/0'}`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h3 className={`text-lg font-semibold ${disabled ? 'text-sky-300' : 'text-white'}`}>
          {title}
          {disabled && <span className="ml-2 text-xs text-sky-400">({comingSoonText})</span>}
        </h3>
        <p className={`mt-2 text-sm ${disabled ? 'text-sky-300' : 'text-sky-200'}`}>{desc}</p>
      </div>
    </div>
  );

  if (disabled) {
    return (
      <Card CONFIG={CONFIG} className="opacity-50 cursor-not-allowed">
        {content}
      </Card>
    );
  }

  return (
    <a href="#pricing" className="block">
      <Card CONFIG={CONFIG} className="hover:bg-white/10 transition-colors cursor-pointer">
        {content}
      </Card>
    </a>
  );
};

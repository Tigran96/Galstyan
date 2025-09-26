export const Card = ({ children, className = "", CONFIG, variant = "default" }) => {
  const variants = {
    default: "bg-white/5 backdrop-blur-md border border-white/10 shadow-xl shadow-sky-900/20",
    glass: "bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl shadow-sky-900/30",
    premium: "bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/30 shadow-2xl shadow-sky-900/40",
    dark: "bg-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-slate-900/50"
  };

  return (
    <div className={`${variants[variant]} rounded-2xl p-6 transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] group ${className}`}>
      {children}
    </div>
  );
};

export const Card = ({ children, className = "", CONFIG }) => (
  <div className={`${CONFIG.color.card} rounded-2xl p-6 ring-1 ring-white/10 shadow-xl ${className}`}>
    {children}
  </div>
);

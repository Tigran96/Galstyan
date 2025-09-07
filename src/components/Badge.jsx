export const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-sky-200 ${className}`}>
    {children}
  </span>
);

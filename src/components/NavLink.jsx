export const NavLink = ({ href, children, onClick, active = false }) => (
  <a
    href={href}
    onClick={onClick}
    className={`px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg text-center ${
      active 
        ? 'bg-sky-500/20 text-sky-400 font-semibold' 
        : 'text-sky-200 hover:text-white hover:bg-white/5'
    }`}
  >
    {children}
  </a>
);

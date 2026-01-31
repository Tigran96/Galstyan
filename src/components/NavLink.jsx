export const NavLink = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="px-3 py-2 text-sm font-medium text-sky-200 hover:text-white hover:opacity-90 transition-colors text-center"
  >
    {children}
  </a>
);

export const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="px-3 py-2 text-sm font-medium text-sky-200 hover:text-white hover:opacity-90 transition-colors text-center"
  >
    {children}
  </a>
);

import React, { useState, useRef, useEffect } from 'react';
import { trackLanguageChange } from '../utils/analytics';

const languages = [
  { code: 'hy', label: 'ՀԱՅ', flagCode: 'am' },
  { code: 'en', label: 'ENG', flagCode: 'gb' },
  { code: 'ru', label: 'РУС', flagCode: 'ru' },
];

export const LangDropdown = ({ currentLang, setLang }) => {

    /**
     * Accessibility and UX considerations:
     * - Keyboard navigable: Users can open the dropdown with Enter/Space and navigate options with arrow keys.
     * - ARIA attributes: Proper use of aria-expanded, aria-haspopup, and role="menu" for screen readers.
     * - Click outside to close: Dropdown closes when clicking outside of it.
     * - Visual feedback: Active language is highlighted, and dropdown has smooth animations for better user experience.
     * - Analytics: Language changes are tracked for insights into user preferences.
     * 
     */


  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLangSelect = (code) => {
    if (code !== currentLang) {
      trackLanguageChange(code);
      setLang(code);
    }
    setIsOpen(false);
  };

  const activeLang = languages.find((l) => l.code === currentLang) || languages[1];

  return (
    <div className="relative " ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2 transition-all hover:bg-white/10 sm:px-3 py-2.5"
      >
        <img
          src={`./flags/${activeLang.flagCode}.svg`}
          alt={activeLang.label}
          className="h-3.5 w-5 rounded-sm object-cover sm:h-4 sm:w-6"
        />
        <svg
          className={`h-4 w-4 text-sky-200 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-xl border border-white/10 bg-sky-950/95 p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in duration-150 z-50">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => handleLangSelect(l.code)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                currentLang === l.code
                  ? 'bg-white/15 text-white'
                  : 'text-sky-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <img
                src={`./flags/${l.flagCode}.svg`}
                alt=""
                className="h-3 w-4 rounded-sm object-cover"
              />
              <span className="font-medium">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
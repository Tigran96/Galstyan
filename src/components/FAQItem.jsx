import { useState } from 'react';

export const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div 
      className={`group rounded-[2rem] border transition-all duration-500 overflow-hidden ${
        open 
          ? 'bg-white/10 border-white/20 shadow-2xl scale-[1.02]' 
          : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/10'
      }`}
    >
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center justify-between p-7 text-left outline-none"
        aria-expanded={open}
      >
        <span className={`text-lg md:text-xl font-heading font-bold transition-colors duration-300 ${
          open ? 'text-sky-300' : 'text-white'
        }`}>
          {q}
        </span>
        <div className={`shrink-0 ml-4 flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/5 transition-all duration-500 ${
          open ? 'rotate-180 bg-sky-500/20 border-sky-500/30' : ''
        }`}>
          <svg 
            className={`w-4 h-4 transition-transform duration-500 ${open ? 'text-sky-400' : 'text-sky-300'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d={open ? "M18 12H6" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} 
            />
          </svg>
        </div>
      </button>

      <div 
        className={`transition-all duration-500 ease-in-out px-7 ${
          open ? 'max-h-96 pb-8 opacity-100 translate-y-0' : 'max-h-0 pb-0 opacity-0 -translate-y-4'
        }`}
      >
        <div className="pt-2 border-t border-white/5">
          <p className="text-sky-100/70 text-base md:text-lg leading-relaxed font-sans mt-4">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
};

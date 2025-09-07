import { useState } from 'react';

export const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
        aria-controls={`faq-answer-${q.slice(0, 10)}`}
      >
        <span className="text-base font-medium text-white">{q}</span>
        <span className="text-sky-200 transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          +
        </span>
      </button>
      {open && (
        <div id={`faq-answer-${q.slice(0, 10)}`} className="mt-3 text-sm text-sky-200">
          {a}
        </div>
      )}
    </div>
  );
};

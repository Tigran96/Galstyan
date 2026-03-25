export const Testimonials = ({ t }) => {
  const items = t("testimonials.items");

  return (
    <section id="testimonials" className="py-24 relative bg-slate-950">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-6 bg-gradient-to-r from-transparent via-sky-500 to-sky-500 rounded-full" />
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <div className="h-px w-6 bg-gradient-to-l from-transparent via-sky-500 to-sky-500 rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-white leading-tight">
            {t("testimonials.title")}
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative flex flex-col bg-white/[0.04] border border-white/10 rounded-2xl p-7 backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300"
            >
              {/* Decorative quote mark */}
              <svg
                className="absolute top-5 right-6 w-8 h-8 text-sky-500/20"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M10 8C6.686 8 4 10.686 4 14v10h10V14H7.5C7.5 11.515 9.015 10 11.5 10L10 8zm14 0c-3.314 0-6 2.686-6 6v10h10V14h-6.5c0-2.485 1.515-4 4-4L24 8z" />
              </svg>

              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {[...Array(item.rating)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sky-100/80 leading-relaxed flex-1 mb-6 text-sm md:text-base">
                "{item.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{item.name}</div>
                  <div className="text-sky-400/70 text-xs mt-0.5">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

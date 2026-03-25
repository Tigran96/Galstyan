import { AnimatedBackground } from "./AnimatedBackground";

export const Section = ({
  id,
  title,
  subtitle,
  children,
  className = "",
  animated = true,
  variant = "subtle",
  align = "center",
}) => {
  const variants = {
    subtle:   "bg-slate-950",
    gradient: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
    glass:    "bg-white/5 backdrop-blur-xl border-y border-white/10",
    dark:     "bg-black",
    minimal:  "bg-sky-950",
  };

  const isCenter = align === "center";

  return (
    <section
      id={id}
      className={`relative py-20 md:py-32 overflow-hidden ${
        variants[variant] ?? variants.subtle
      } ${className}`}
    >
      {animated && <AnimatedBackground variant={variant} />}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {(title || subtitle) && (
          <div className={`mb-14 max-w-3xl ${isCenter ? "mx-auto text-center" : "text-left"}`}>
            {/* Accent line */}
            {title && (
              <div className={`flex items-center gap-3 mb-5 ${isCenter ? "justify-center" : ""}`}>
                <div className="h-px w-6 bg-gradient-to-r from-transparent via-sky-500 to-sky-500 rounded-full" />
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <div className="h-px w-6 bg-gradient-to-l from-transparent via-sky-500 to-sky-500 rounded-full" />
              </div>
            )}

            {title && (
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-white leading-tight ${isCenter ? "text-center" : "text-left"}`}>
                {title}
              </h2>
            )}

            {subtitle && (
              <p className={`mt-4 text-base md:text-lg text-slate-300 leading-relaxed ${isCenter ? "text-center" : "text-left"}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  );
};

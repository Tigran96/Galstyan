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
    subtle: "bg-slate-950",
    gradient:
      "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
    glass:
      "bg-white/5 backdrop-blur-xl border-y border-white/10",
    dark: "bg-black",
  };

  const alignmentClass = align === "center" ? "text-center" : "text-left";
  const containerAlign = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <section
      id={id}
      className={`relative py-20 md:py-32 overflow-hidden ${
        variants[variant] || variants.subtle
      } ${className}`}
    >
      {animated && <AnimatedBackground variant={variant} />}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {(title || subtitle) && (
          <div className={`mb-14 max-w-3xl ${containerAlign}`}>
            {title && (
              <h2
                className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight ${alignmentClass}`}
              >
                {title}
              </h2>
            )}

            {subtitle && (
              <p
                className={`mt-4 text-base md:text-lg text-slate-300 leading-relaxed ${alignmentClass}`}
              >
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

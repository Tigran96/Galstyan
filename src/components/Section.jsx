import { AnimatedBackground } from './AnimatedBackground';

export const Section = ({ id, title, subtitle, children, className = "", animated = true, variant = "subtle" }) => (
  <section id={id} className={`py-20 md:py-28 relative ${className}`}>
    <div className="mx-auto max-w-6xl px-6 relative z-10">
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white text-height-xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base md:text-lg text-sky-200 mx-auto text-height-fixed">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  </section>
);

export const Section = ({ id, title, subtitle, children, className = "" }) => (
  <section id={id} className={`py-20 md:py-28 ${className}`}>
    <div className="mx-auto max-w-6xl px-6">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base md:text-lg text-sky-200">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  </section>
);

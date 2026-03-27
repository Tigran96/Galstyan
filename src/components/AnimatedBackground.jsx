export const AnimatedBackground = ({ variant = "default" }) => {
  const variants = {
    default: {
      gradients: [
        "bg-[radial-gradient(70rem_35rem_at_50%_-10%,rgba(99,102,241,.22),transparent)]",
        "bg-[radial-gradient(45rem_25rem_at_85%_15%,rgba(139,92,246,.14),transparent)]",
        "bg-[radial-gradient(35rem_18rem_at_15%_75%,rgba(56,189,248,.10),transparent)]",
        "bg-[radial-gradient(25rem_12rem_at_60%_90%,rgba(168,85,247,.08),transparent)]"
      ],
      shapes: [
        { position: "top-20 left-10",    size: "w-20 h-20", color: "from-indigo-400/20 to-violet-400/20",  animation: "animate-float" },
        { position: "top-40 right-20",   size: "w-16 h-16", color: "from-violet-400/20 to-purple-400/20", animation: "animate-float-delayed" },
        { position: "bottom-40 left-1/4",size: "w-12 h-12", color: "from-sky-400/15 to-indigo-400/15",    animation: "animate-float-slow" },
        { position: "top-1/3 right-1/3", size: "w-8 h-8",   color: "from-purple-400/15 to-pink-400/15",   animation: "animate-float" },
        { position: "bottom-20 right-10",size: "w-14 h-14", color: "from-indigo-400/15 to-sky-400/15",    animation: "animate-float-delayed" }
      ]
    },
    subtle: {
      gradients: [
        "bg-[radial-gradient(40rem_20rem_at_30%_20%,rgba(99,102,241,.12),transparent)]",
        "bg-[radial-gradient(30rem_15rem_at_70%_80%,rgba(139,92,246,.08),transparent)]"
      ],
      shapes: [
        { position: "top-10 right-1/4",  size: "w-12 h-12", color: "from-indigo-400/15 to-violet-400/15", animation: "animate-float-slow" },
        { position: "bottom-20 left-1/3",size: "w-8 h-8",   color: "from-violet-400/15 to-purple-400/15", animation: "animate-float-delayed" },
        { position: "top-1/2 right-10",  size: "w-6 h-6",   color: "from-sky-400/10 to-indigo-400/10",    animation: "animate-float" }
      ]
    },
    minimal: {
      gradients: [
        "bg-[radial-gradient(20rem_10rem_at_50%_50%,rgba(99,102,241,.08),transparent)]"
      ],
      shapes: [
        { position: "top-1/4 left-1/4",   size: "w-6 h-6", color: "from-indigo-400/10 to-violet-400/10", animation: "animate-float-slow" },
        { position: "bottom-1/4 right-1/4",size: "w-4 h-4", color: "from-violet-400/10 to-purple-400/10", animation: "animate-float-delayed" }
      ]
    }
  };

  const config = variants[variant] || variants.default;

  return (
    <>
      {/* Base background — deep midnight */}
      <div className="pointer-events-none absolute inset-0 bg-[#07091a]" />

      {/* Subtle noise texture overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }}
      />

      {/* Animated gradients */}
      {config.gradients.map((gradient, index) => (
        <div key={index} className={`pointer-events-none absolute inset-0 ${gradient}`} />
      ))}

      {/* Floating shapes */}
      <div className="pointer-events-none absolute inset-0">
        {config.shapes.map((shape, index) => (
          <div
            key={index}
            className={`absolute ${shape.position} ${shape.size} bg-gradient-to-br ${shape.color} rounded-full ${shape.animation} blur-sm`}
          />
        ))}
      </div>
    </>
  );
};

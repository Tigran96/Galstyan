export const AnimatedBackground = ({ variant = "default" }) => {
  const variants = {
    default: {
      gradients: [
        "bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgba(56,189,248,.25),transparent)]",
        "bg-[radial-gradient(40rem_20rem_at_80%_20%,rgba(99,102,241,.15),transparent)]",
        "bg-[radial-gradient(30rem_15rem_at_20%_80%,rgba(168,85,247,.1),transparent)]"
      ],
      shapes: [
        { position: "top-20 left-10", size: "w-20 h-20", color: "from-sky-400/20 to-indigo-400/20", animation: "animate-float" },
        { position: "top-40 right-20", size: "w-16 h-16", color: "from-purple-400/20 to-pink-400/20", animation: "animate-float-delayed" },
        { position: "bottom-40 left-1/4", size: "w-12 h-12", color: "from-cyan-400/20 to-blue-400/20", animation: "animate-float-slow" },
        { position: "top-1/3 right-1/3", size: "w-8 h-8", color: "from-emerald-400/20 to-teal-400/20", animation: "animate-float" },
        { position: "bottom-20 right-10", size: "w-14 h-14", color: "from-orange-400/20 to-red-400/20", animation: "animate-float-delayed" }
      ]
    },
    subtle: {
      gradients: [
        "bg-[radial-gradient(40rem_20rem_at_30%_20%,rgba(56,189,248,.15),transparent)]",
        "bg-[radial-gradient(30rem_15rem_at_70%_80%,rgba(99,102,241,.1),transparent)]"
      ],
      shapes: [
        { position: "top-10 right-1/4", size: "w-12 h-12", color: "from-sky-400/15 to-indigo-400/15", animation: "animate-float-slow" },
        { position: "bottom-20 left-1/3", size: "w-8 h-8", color: "from-purple-400/15 to-pink-400/15", animation: "animate-float-delayed" },
        { position: "top-1/2 right-10", size: "w-6 h-6", color: "from-cyan-400/15 to-blue-400/15", animation: "animate-float" }
      ]
    },
    minimal: {
      gradients: [
        "bg-[radial-gradient(20rem_10rem_at_50%_50%,rgba(56,189,248,.1),transparent)]"
      ],
      shapes: [
        { position: "top-1/4 left-1/4", size: "w-6 h-6", color: "from-sky-400/10 to-indigo-400/10", animation: "animate-float-slow" },
        { position: "bottom-1/4 right-1/4", size: "w-4 h-4", color: "from-purple-400/10 to-pink-400/10", animation: "animate-float-delayed" }
      ]
    }
  };

  const config = variants[variant] || variants.default;

  return (
    <>
      {/* Base background */}
      <div className="pointer-events-none absolute inset-0 bg-sky-950" />
      
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

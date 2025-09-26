export const LoadingSpinner = ({ CONFIG, lang }) => (
  <div className="min-h-screen bg-sky-950 flex items-center justify-center">
    <div className="text-center">
      <img
        src={CONFIG.logo}
        alt={CONFIG.businessName[lang] + " logo"}
        className="h-16 w-auto mx-auto mb-6 drop-shadow-2xl"
      />
      <div className="spinner mx-auto mb-4"></div>
      <div className="text-white text-xl">Loading...</div>
    </div>
  </div>
);

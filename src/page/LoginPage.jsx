import { useState } from 'react';
import { login as loginApi } from '../services/authService';

export function LoginPage({ t, onBack, onLoginSuccess, onSignUpClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = await loginApi(username, password);
      onLoginSuccess?.(data);
    } catch (err) {
      setError(err.message || t('auth.loginError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-20 overflow-y-auto">
      <div className="w-full max-w-lg relative z-10">
        {/* Navigation Header */}
        <div className="mb-8 px-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="group flex items-center gap-2 text-sky-300/70 hover:text-white transition-all duration-300 text-sm font-medium"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-sky-500/20 group-hover:border-sky-500/30 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
            {t('auth.back')}
          </button>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          {/* Subtle card glow */}
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-700" />
          
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
              {t('auth.loginTitle')}
            </h1>
            <p className="mt-2 text-sky-200/60 font-medium">{t('auth.loginSubtitle')}</p>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-200 flex items-center gap-3 animate-wiggle">
                <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Username Input */}
              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                <label className="block text-xs font-bold uppercase tracking-widest text-sky-400/70 ml-1">{t('auth.username')}</label>
                <div className="relative">
                  <input
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all placeholder:text-white/20"
                    placeholder="jon.doe@example.com"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-sky-400/70">{t('auth.password')}</label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent('nav:forgot'));
                    }}
                    className="text-xs font-medium text-sky-400/50 hover:text-sky-300 transition-colors"
                  >
                    {t('auth.forgot')}
                  </a>
                </div>
                <div className="relative">
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all placeholder:text-white/20"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden rounded-2xl bg-sky-500 py-4 font-heading font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 mt-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-500 transition-transform duration-500 group-hover:scale-110" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('auth.loggingIn')}
                    </>
                  ) : (
                    <>
                      {t('auth.login')}
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onSignUpClick}
                  className="text-sky-300/70 hover:text-white transition-colors text-sm font-medium border-b border-sky-500/10 hover:border-sky-500/100 pb-0.5"
                >
                  {t('auth.noAccount')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}




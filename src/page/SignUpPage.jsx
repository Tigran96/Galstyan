import { useState } from 'react';
import { signup as signupApi } from '../services/authService';

export function SignUpPage({ t, onBack, onSignInClick, onSignupSuccess }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== password2) {
      setError(t('auth.passwordsNoMatch'));
      return;
    }
    setIsSubmitting(true);
    try {
      const data = await signupApi({
        firstName,
        lastName,
        email,
        age: age === '' ? null : Number(age),
        password,
        passwordConfirm: password2,
      });
      onSignupSuccess?.(data);
    } catch (err) {
      setError(err.message || t('auth.signupError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-20 overflow-y-auto">
      <div className="w-full max-w-xl relative z-10">
        {/* Navigation Header */}
        <div className="mb-8 flex items-center justify-between px-2">
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
          
          <button
            type="button"
            onClick={onSignInClick}
            className="text-sky-300/70 hover:text-white transition-colors text-sm font-medium border-b border-sky-500/20 hover:border-sky-500/100 pb-0.5"
          >
            {t('auth.haveAccount')}
          </button>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          {/* Subtle card glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/20 transition-colors duration-700" />
          
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
              {t('auth.signupTitle')}
            </h1>
            <p className="mt-2 text-sky-200/60 font-medium">{t('auth.signupSubtitle')}</p>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-200 flex items-center gap-3 animate-wiggle">
                <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="block text-xs font-bold uppercase tracking-widest text-sky-400/70 ml-1">{t('auth.firstName')}</label>
                  <div className="relative">
                    <input
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all placeholder:text-white/20"
                      placeholder="John"
                      autoComplete="given-name"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="block text-xs font-bold uppercase tracking-widest text-sky-400/70 ml-1">{t('auth.lastName')}</label>
                  <div className="relative">
                    <input
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all placeholder:text-white/20"
                      placeholder="Doe"
                      autoComplete="family-name"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Email - Span 2 */}
                <div className="md:col-span-2 space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="block text-xs font-bold uppercase tracking-widest text-sky-400/70 ml-1">{t('auth.email')}</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all placeholder:text-white/20"
                    placeholder="email@example.com"
                    autoComplete="email"
                  />
                </div>

                {/* Age */}
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="block text-xs font-bold uppercase tracking-widest text-sky-400/70 ml-1">{t('auth.age')}</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all placeholder:text-white/20"
                    placeholder="18"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="block text-xs font-bold uppercase tracking-widest text-sky-400/70 ml-1">{t('auth.password')}</label>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all placeholder:text-white/20"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="block text-xs font-bold uppercase tracking-widest text-sky-400/70 ml-1">{t('auth.repeatPassword')}</label>
                  <input
                    required
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all placeholder:text-white/20"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <p className="text-xs text-sky-300/40 px-1 italic">
                {t('auth.passwordHint')}
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden rounded-2xl bg-sky-500 py-4 font-heading font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-500 transition-transform duration-500 group-hover:scale-110" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('auth.signingUp')}
                    </>
                  ) : (
                    <>
                      {t('auth.signup')}
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


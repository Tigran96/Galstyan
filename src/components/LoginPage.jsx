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
    <div className="min-h-screen bg-sky-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <button
            type="button"
            onClick={onBack}
            className="text-sky-200 hover:text-white transition-colors text-sm"
          >
            ← {t('auth.back')}
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-sky-900/40 backdrop-blur p-6 shadow-xl">
          <h1 className="text-2xl font-semibold">{t('auth.loginTitle')}</h1>
          <p className="mt-1 text-sky-200 text-sm">{t('auth.loginSubtitle')}</p>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-sky-200 mb-1">{t('auth.username')}</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                placeholder="username or email"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm text-sky-200 mb-1">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 font-semibold py-2 hover:opacity-95 disabled:opacity-60"
            >
              {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onSignUpClick}
                className="text-sky-200 hover:text-white transition-colors text-sm"
              >
                {t('auth.noAccount')}
              </button>
            </div>

            <div className="text-center">
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('nav:forgot'));
                }}
                className="text-sky-300/90 hover:text-white transition-colors text-sm underline decoration-sky-300/40 hover:decoration-white"
              >
                {t('auth.forgot')}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}



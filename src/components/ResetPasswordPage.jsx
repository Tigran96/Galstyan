import { useState } from 'react';
import { resetPassword } from '../services/authService';

export function ResetPasswordPage({ t, token, onBackToSignIn }) {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ error: '', ok: false });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ error: '', ok: false });
    if (!token) {
      setStatus({ error: t('auth.resetMissingToken'), ok: false });
      return;
    }
    if (password !== password2) {
      setStatus({ error: t('auth.passwordsNoMatch'), ok: false });
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword({ token, password, passwordConfirm: password2 });
      setStatus({ error: '', ok: true });
    } catch (err) {
      setStatus({ error: err.message || t('auth.resetError'), ok: false });
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
            onClick={onBackToSignIn}
            className="text-sky-200 hover:text-white transition-colors text-sm"
          >
            ← {t('auth.signIn')}
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-sky-900/40 backdrop-blur p-6 shadow-xl">
          <h1 className="text-2xl font-semibold">{t('auth.resetTitle')}</h1>
          <p className="mt-1 text-sky-200 text-sm">{t('auth.resetSubtitle')}</p>

          {status.ok ? (
            <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-100">
              {t('auth.resetOk')}
            </div>
          ) : null}

          {status.error ? (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {status.error}
            </div>
          ) : null}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-sky-200 mb-1">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm text-sky-200 mb-1">{t('auth.repeatPassword')}</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 font-semibold py-2 hover:opacity-95 disabled:opacity-60"
            >
              {isSubmitting ? t('auth.saving') : t('auth.resetBtn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



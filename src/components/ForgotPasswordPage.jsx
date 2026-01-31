import { useState } from 'react';
import { forgotPassword } from '../services/authService';

export function ForgotPasswordPage({ t, onBack, onSignInClick }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ error: '', sent: false, hint: '', sentTo: '' });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ error: '', sent: false, hint: '', sentTo: '' });
    setIsSubmitting(true);
    try {
      const res = await forgotPassword(email);
      // If backend allows enumeration, it may return exists=false
      if (res && res.exists === false) {
        setStatus({ error: t('auth.emailNotFound'), sent: false, hint: '', sentTo: '' });
      } else {
        setStatus({
          error: '',
          sent: true,
          hint: '',
          sentTo: res && res.exists === true ? String(email).trim() : '',
        });
      }
    } catch (err) {
      setStatus({
        error: err.message || t('auth.forgotError'),
        sent: false,
        hint: err.hint || '',
        sentTo: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-84px)] bg-sky-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-sky-200 hover:text-white transition-colors text-sm"
          >
            ← {t('auth.back')}
          </button>
          <button
            type="button"
            onClick={onSignInClick}
            className="text-sky-200 hover:text-white transition-colors text-sm"
          >
            {t('auth.signIn')}
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-sky-900/40 backdrop-blur p-6 shadow-xl">
          <h1 className="text-2xl font-semibold">{t('auth.forgotTitle')}</h1>
          <p className="mt-1 text-sky-200 text-sm">{t('auth.forgotSubtitle')}</p>

          {status.sent ? (
            <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-100">
              {status.sentTo ? (
                <>
                  {t('auth.forgotSentTo')} <span className="font-semibold">{status.sentTo}</span>
                </>
              ) : (
                t('auth.forgotSent')
              )}
            </div>
          ) : null}

          {status.error ? (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {status.error}
              {status.hint ? <div className="mt-2 text-xs text-red-100/90">{status.hint}</div> : null}
            </div>
          ) : null}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-sky-200 mb-1">{t('auth.email')}</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                placeholder="email@example.com"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 font-semibold py-2 hover:opacity-95 disabled:opacity-60"
            >
              {isSubmitting ? t('auth.sending') : t('auth.sendReset')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



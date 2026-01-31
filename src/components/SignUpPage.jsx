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
            {t('auth.haveAccount')}
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-sky-900/40 backdrop-blur p-6 shadow-xl">
          <h1 className="text-2xl font-semibold">{t('auth.signupTitle')}</h1>
          <p className="mt-1 text-sky-200 text-sm">{t('auth.signupSubtitle')}</p>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-sky-200 mb-1">{t('auth.firstName')}</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                  placeholder="Name"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block text-sm text-sky-200 mb-1">{t('auth.lastName')}</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                  placeholder="Surname"
                  autoComplete="family-name"
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm text-sky-200 mb-1">{t('auth.age')}</label>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                placeholder="16"
                inputMode="numeric"
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
                autoComplete="new-password"
              />
              <p className="mt-1 text-xs text-sky-300/80">{t('auth.passwordHint')}</p>
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
              {isSubmitting ? t('auth.signingUp') : t('auth.signup')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



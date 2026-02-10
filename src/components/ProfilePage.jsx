import { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile } from '../services/profileService';
// Profile page is only for editing user details.

export function ProfilePage({ t, user, token, onLogout, onBackHome, onMembers }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', grade: '' });
  const [status, setStatus] = useState({ loading: true, saving: false, error: '', saved: false });

  // Support chat moved to Dashboard left panel.

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setStatus((s) => ({ ...s, loading: true, error: '', saved: false }));
        const p = await getMyProfile(token);
        if (!mounted) return;
        setProfile(p);
        setForm({
          fullName: p?.fullName || '',
          email: p?.email || '',
          phone: p?.phone || '',
          grade: p?.grade || '',
        });
        setStatus((s) => ({ ...s, loading: false }));
      } catch (e) {
        if (!mounted) return;
        setStatus((s) => ({ ...s, loading: false, error: e.message || 'Failed to load profile' }));
      }
    };
    if (token) run();
    return () => {
      mounted = false;
    };
  }, [token]);

  const save = async () => {
    setStatus((s) => ({ ...s, saving: true, error: '', saved: false }));
    try {
      const updated = await updateMyProfile(token, form);
      setProfile(updated);
      setStatus((s) => ({ ...s, saving: false, saved: true }));
      setTimeout(() => setStatus((s) => ({ ...s, saved: false })), 1500);
    } catch (e) {
      setStatus((s) => ({ ...s, saving: false, error: e.message || 'Failed to save' }));
    }
  };


  return (
    <div className="min-h-screen bg-sky-950 text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">{t?.('private.profileTitle') || 'Profile'}</h1>
            <p className="mt-1 text-sky-200 text-sm">
              {t?.('private.welcome') || 'Welcome'}{' '}
              <span className="text-white font-medium">{user?.username || '—'}</span>
            </p>
            <div className="mt-2 text-xs text-sky-200">
              {t?.('private.role') || 'Role'}:{' '}
              <span className="inline-flex items-center px-2 py-1 rounded bg-white/10 text-white">
                {user?.role || 'user'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {['admin', 'moderator'].includes(user?.role) ? (
              <button
                type="button"
                onClick={onMembers}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition-colors"
              >
                {t?.('admin.members.title') || 'Members'}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onBackHome}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition-colors"
            >
              {t?.('private.home') || 'Home'}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg bg-red-500/20 border border-red-500/30 px-3 py-2 text-sm text-red-100 hover:bg-red-500/25 transition-colors"
            >
              {t?.('private.logout') || 'Logout'}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="rounded-2xl border border-white/10 bg-sky-900/40 p-6">
            <div className="text-white font-semibold">{t?.('private.profileEditTitle') || 'Edit profile'}</div>

            {status.loading ? (
              <p className="mt-3 text-sky-200 text-sm">{t?.('private.loading') || 'Loading…'}</p>
            ) : status.error ? (
              <p className="mt-3 text-red-200 text-sm">{status.error}</p>
            ) : (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs text-sky-200 mb-1">{t?.('private.fullName') || 'Full name'}</label>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs text-sky-200 mb-1">{t?.('private.email') || 'Email'}</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs text-sky-200 mb-1">{t?.('private.phone') || 'Phone'}</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs text-sky-200 mb-1">{t?.('private.grade') || 'Grade'}</label>
                  <input
                    value={form.grade}
                    onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
                    className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={save}
                    disabled={status.saving}
                    className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-400 text-sky-950 font-semibold px-4 py-2 text-sm hover:opacity-95 disabled:opacity-60"
                  >
                    {status.saving ? t?.('private.saving') || 'Saving…' : t?.('private.save') || 'Save'}
                  </button>
                  {status.saved ? <span className="text-sky-200 text-sm">{t?.('private.saved') || 'Saved'}</span> : null}
                </div>

                {profile?.updatedAt ? (
                  <p className="mt-3 text-sky-300/80 text-xs">
                    {t?.('private.lastUpdated') || 'Last updated:'} {String(profile.updatedAt)}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



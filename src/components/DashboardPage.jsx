import { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile } from '../services/profileService';
import { getMyNotifications, getSentNotifications, markNotificationRead } from '../services/notificationService';

export function DashboardPage({ t, user, token, onLogout, onBackHome, onAdminMembers }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', grade: '' });
  const [status, setStatus] = useState({ loading: true, saving: false, error: '', saved: false });

  const [notifs, setNotifs] = useState([]);
  const [notifStatus, setNotifStatus] = useState({ loading: false, error: '' });
  const [notifFilter, setNotifFilter] = useState('all'); // 'unread' | 'all'
  const [markingId, setMarkingId] = useState(null);

  const canSendNotifs = ['admin', 'moderator'].includes(user?.role);
  const [sent, setSent] = useState([]);
  const [sentStatus, setSentStatus] = useState({ loading: false, error: '' });

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

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setNotifStatus({ loading: true, error: '' });
        const rows = await getMyNotifications(token);
        if (!mounted) return;
        setNotifs(rows);
        setNotifStatus({ loading: false, error: '' });
      } catch (e) {
        if (!mounted) return;
        setNotifStatus({ loading: false, error: e.message || 'Failed to load notifications' });
      }
    };
    if (token) run();
    return () => {
      mounted = false;
    };
  }, [token]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setSentStatus({ loading: true, error: '' });
        const rows = await getSentNotifications(token);
        if (!mounted) return;
        setSent(rows);
        setSentStatus({ loading: false, error: '' });
      } catch (e) {
        if (!mounted) return;
        setSentStatus({ loading: false, error: e.message || 'Failed to load sent history' });
      }
    };
    if (token && canSendNotifs) run();
    return () => {
      mounted = false;
    };
  }, [token, canSendNotifs]);

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
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{t('private.title')}</h1>
            <p className="mt-1 text-sky-200 text-sm">
              {t('private.welcome')}{' '}
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
                onClick={onAdminMembers}
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
              {t('private.home')}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg bg-red-500/20 border border-red-500/30 px-3 py-2 text-sm text-red-100 hover:bg-red-500/25 transition-colors"
            >
              {t('private.logout')}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-sky-900/40 p-6">
            <div className="text-white font-semibold">{t('private.profileTitle')}</div>

            {status.loading ? (
              <p className="mt-3 text-sky-200 text-sm">{t('private.loading')}</p>
            ) : status.error ? (
              <p className="mt-3 text-red-200 text-sm">{status.error}</p>
            ) : (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs text-sky-200 mb-1">{t('private.fullName')}</label>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs text-sky-200 mb-1">{t('private.email')}</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs text-sky-200 mb-1">{t('private.phone')}</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded-lg bg-sky-950/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs text-sky-200 mb-1">{t('private.grade')}</label>
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
                    {status.saving ? t('private.saving') : t('private.save')}
                  </button>
                  {status.saved ? <span className="text-sky-200 text-sm">{t('private.saved')}</span> : null}
                </div>

                {profile?.updatedAt ? (
                  <p className="mt-3 text-sky-300/80 text-xs">
                    {t('private.lastUpdated')} {String(profile.updatedAt)}
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-sky-900/40 p-6">
            <div className="text-white font-semibold">{t?.('private.notificationsTitle') || 'Notifications'}</div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                className={`px-3 py-1 rounded-lg text-sm border ${
                  notifFilter === 'unread' ? 'bg-white/15 border-white/20' : 'bg-white/5 border-white/10'
                }`}
                onClick={() => setNotifFilter('unread')}
              >
                {t?.('private.notificationsUnread') || 'Unread'}
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded-lg text-sm border ${
                  notifFilter === 'all' ? 'bg-white/15 border-white/20' : 'bg-white/5 border-white/10'
                }`}
                onClick={() => setNotifFilter('all')}
              >
                {t?.('private.notificationsAll') || 'All'}
              </button>
              <div className="ml-auto text-xs text-sky-200">
                {(notifs || []).filter((n) => !n.isRead).length} {t?.('private.unreadCount') || 'unread'}
              </div>
            </div>

            {notifStatus.loading ? (
              <p className="mt-3 text-sky-200 text-sm">{t?.('private.loading') || 'Loading…'}</p>
            ) : notifStatus.error ? (
              <p className="mt-3 text-red-200 text-sm">{notifStatus.error}</p>
            ) : (notifs || []).filter((n) => (notifFilter === 'unread' ? !n.isRead : true)).length === 0 ? (
              <p className="mt-3 text-sky-200 text-sm">{t?.('private.notificationsEmpty') || 'No notifications yet.'}</p>
            ) : (
              <div className="mt-3 space-y-3 max-h-72 overflow-auto pr-2">
                {(notifs || [])
                  .filter((n) => (notifFilter === 'unread' ? !n.isRead : true))
                  .map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-xl border border-white/10 bg-sky-950/30 p-3 ${n.isRead ? 'opacity-80' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-semibold text-white flex items-center gap-2">
                          {n.title}
                          {!n.isRead ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-100">
                              {t?.('private.unread') || 'UNREAD'}
                            </span>
                          ) : null}
                        </div>
                        <div className="text-[11px] text-sky-300 whitespace-nowrap">
                          {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-sky-200 whitespace-pre-wrap">{n.message}</div>
                      {n.senderUsername ? (
                        <div className="mt-2 text-xs text-sky-300">
                          {t?.('private.from') || 'From'}: {n.senderUsername} ({n.senderRole || 'user'})
                        </div>
                      ) : null}

                      {!n.isRead ? (
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            className="px-3 py-1 rounded-lg text-xs border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-60"
                            disabled={markingId === n.id}
                            onClick={async () => {
                              setMarkingId(n.id);
                              try {
                                await markNotificationRead(token, n.id);
                                setNotifs((prev) =>
                                  (prev || []).map((x) =>
                                    x.id === n.id ? { ...x, isRead: true, readAt: new Date().toISOString() } : x
                                  )
                                );
                              // Keep message visible after marking as read.
                              setNotifFilter('all');
                                if (typeof window !== 'undefined') {
                                  window.dispatchEvent(new Event('notifications:changed'));
                                }
                              } catch (e) {
                                setNotifStatus((s) => ({ ...s, error: e.message || 'Failed to mark read' }));
                              } finally {
                                setMarkingId(null);
                              }
                            }}
                          >
                            {markingId === n.id ? t?.('private.marking') || 'Marking…' : t?.('private.markRead') || 'Mark as read'}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
              </div>
            )}

            {canSendNotifs ? (
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-white font-semibold">{t?.('private.sentTitle') || 'Sent notifications'}</div>
                {sentStatus.loading ? (
                  <p className="mt-2 text-sky-200 text-sm">{t?.('private.loading') || 'Loading…'}</p>
                ) : sentStatus.error ? (
                  <p className="mt-2 text-red-200 text-sm">{sentStatus.error}</p>
                ) : sent.length === 0 ? (
                  <p className="mt-2 text-sky-200 text-sm">{t?.('private.sentEmpty') || 'No sent notifications yet.'}</p>
                ) : (
                  <div className="mt-3 space-y-3 max-h-56 overflow-auto pr-2">
                    {sent.map((s) => (
                      <div key={s.id} className="rounded-xl border border-white/10 bg-sky-950/30 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-semibold text-white">{s.title}</div>
                          <div className="text-[11px] text-sky-300 whitespace-nowrap">
                            {s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-sky-200 whitespace-pre-wrap">{s.message}</div>
                        <div className="mt-2 text-xs text-sky-300">
                          {s.targetUserId
                            ? `${t?.('private.to') || 'To'}: ${s.targetUsername || ''} ${
                                s.targetEmail ? `(${s.targetEmail})` : ''
                              }`.trim()
                            : `${t?.('private.to') || 'To'}: ${s.targetRoles || '-'}`}
                        </div>
                        <div className="mt-1 text-xs text-sky-300">
                          {t?.('private.recipients') || 'Recipients'}: {s.recipientsCount ?? '-'} •{' '}
                          {t?.('private.read') || 'Read'}: {s.readCount ?? 0}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}



import { useEffect, useMemo, useState } from 'react';
import { listUsers, updateUserRole } from '../services/adminService';
import { sendNotificationToUser } from '../services/notificationService';

export default function AdminMembersPage({ t, authToken, authUser, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [msgUser, setMsgUser] = useState(null);
  const [msgForm, setMsgForm] = useState({ title: '', message: '' });
  const [msgStatus, setMsgStatus] = useState({ sending: false, error: '', sent: false });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const rows = await listUsers(authToken);
        if (!mounted) return;
        setUsers(rows);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'Failed to load users');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [authToken]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) => {
      const hay = [
        u.username,
        u.email,
        u.role,
        u.firstName,
        u.lastName,
        u.fullName,
        u.profileEmail,
        u.phone,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(s);
    });
  }, [q, users]);

  const setUserRoleLocal = (id, role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  const saveRole = async (id) => {
    const u = users.find((x) => x.id === id);
    if (!u) return;
    setSavingId(id);
    setSaveError('');
    try {
      const updated = await updateUserRole(authToken, id, u.role);
      setUserRoleLocal(id, updated.role);
    } catch (e) {
      setSaveError(e.message || 'Failed to update role');
    } finally {
      setSavingId(null);
    }
  };

  const canEditRoles = authUser?.role === 'admin';

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-2xl font-bold">{t?.('admin.members.title') || 'Members'}</h2>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            onClick={onBack}
            type="button"
          >
            {t?.('common.back') || 'Back'}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          className="w-full md:w-96 px-3 py-2 border rounded-lg"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t?.('admin.members.search') || 'Search…'}
        />
        <div className="text-sm text-gray-600 whitespace-nowrap">
          {t?.('admin.members.count') || 'Count'}: <b>{filtered.length}</b>
        </div>
      </div>

      {loading ? (
        <div className="mt-4 text-gray-600">{t?.('common.loading') || 'Loading…'}</div>
      ) : error ? (
        <div className="mt-4 text-red-600">{error}</div>
      ) : (
        <div className="mt-4">
          {saveError ? <div className="mb-3 text-red-600">{saveError}</div> : null}
          <div className="overflow-auto border rounded-xl">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3">{t?.('admin.members.username') || 'Username'}</th>
                <th className="p-3">{t?.('admin.members.email') || 'Email'}</th>
                <th className="p-3">{t?.('admin.members.role') || 'Role'}</th>
                <th className="p-3">{t?.('admin.members.actions') || 'Actions'}</th>
                <th className="p-3">{t?.('admin.members.name') || 'Name'}</th>
                <th className="p-3">{t?.('admin.members.age') || 'Age'}</th>
                <th className="p-3">{t?.('admin.members.phone') || 'Phone'}</th>
                <th className="p-3">{t?.('admin.members.grade') || 'Grade'}</th>
                <th className="p-3">{t?.('admin.members.created') || 'Created'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.username || '-'}</td>
                  <td className="p-3">{u.email || u.profileEmail || '-'}</td>
                  <td className="p-3">
                    {/* Role editor is admin-only; moderators can still view list + message. */}
                    {canEditRoles ? (
                      <select
                        className="px-2 py-1 rounded border bg-white"
                        value={u.role || 'user'}
                        onChange={(e) => setUserRoleLocal(u.id, e.target.value)}
                        disabled={savingId === u.id}
                      >
                        <option value="user">{t?.('admin.roles.user') || 'user'}</option>
                        <option value="pro">{t?.('admin.roles.pro') || 'pro'}</option>
                        <option value="moderator">{t?.('admin.roles.moderator') || 'moderator'}</option>
                        <option value="admin">{t?.('admin.roles.admin') || 'admin'}</option>
                      </select>
                    ) : (
                      <span className="px-2 py-1 rounded bg-gray-100">{u.role || 'user'}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {canEditRoles ? (
                        <button
                          type="button"
                          className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-black disabled:opacity-60"
                          onClick={() => saveRole(u.id)}
                          disabled={savingId === u.id}
                        >
                          {savingId === u.id
                            ? t?.('admin.members.saving') || 'Saving…'
                            : t?.('admin.members.save') || 'Save'}
                        </button>
                      ) : null}

                      {u.id !== authUser?.id ? (
                        <button
                          type="button"
                          className="px-3 py-1 rounded bg-sky-600 text-white hover:bg-sky-700"
                          onClick={() => {
                            setMsgUser(u);
                            setMsgForm({ title: '', message: '' });
                            setMsgStatus({ sending: false, error: '', sent: false });
                          }}
                        >
                          {t?.('admin.members.message') || 'Message'}
                        </button>
                      ) : null}
                    </div>
                  </td>
                  <td className="p-3">
                    {u.firstName || u.lastName
                      ? `${u.firstName || ''} ${u.lastName || ''}`.trim()
                      : u.fullName || '-'}
                  </td>
                  <td className="p-3">{u.age ?? '-'}</td>
                  <td className="p-3">{u.phone || '-'}</td>
                  <td className="p-3">{u.grade || '-'}</td>
                  <td className="p-3">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr className="border-t">
                  <td className="p-3 text-gray-600" colSpan={9}>
                    {t?.('admin.members.empty') || 'No users found.'}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {msgUser ? (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {t?.('admin.members.sendTo') || 'Send to'}: {msgUser.username}
                </div>
                <div className="text-sm text-gray-600">
                  {msgUser.email || msgUser.profileEmail || '-'} • {msgUser.role}
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => setMsgUser(null)}
              >
                {t?.('common.close') || 'Close'}
              </button>
            </div>

            {msgStatus.error ? <div className="mt-3 text-red-600">{msgStatus.error}</div> : null}
            {msgStatus.sent ? <div className="mt-3 text-green-700">{t?.('private.sent') || 'Sent'}</div> : null}

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  {t?.('private.titleLabel') || 'Title'}
                </label>
                <input
                  className="w-full px-3 py-2 border rounded-lg"
                  value={msgForm.title}
                  onChange={(e) => setMsgForm((f) => ({ ...f, title: e.target.value }))}
                  disabled={msgStatus.sending}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  {t?.('private.messageLabel') || 'Message'}
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg min-h-[110px]"
                  value={msgForm.message}
                  onChange={(e) => setMsgForm((f) => ({ ...f, message: e.target.value }))}
                  disabled={msgStatus.sending}
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  onClick={() => setMsgUser(null)}
                  disabled={msgStatus.sending}
                >
                  {t?.('admin.members.cancel') || 'Cancel'}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-60"
                  disabled={msgStatus.sending}
                  onClick={async () => {
                    const title = String(msgForm.title || '').trim();
                    const message = String(msgForm.message || '').trim();
                    if (title.length < 2) {
                      return setMsgStatus({ sending: false, error: 'Title must be at least 2 characters', sent: false });
                    }
                    if (message.length < 2) {
                      return setMsgStatus({ sending: false, error: 'Message must be at least 2 characters', sent: false });
                    }

                    setMsgStatus({ sending: true, error: '', sent: false });
                    try {
                      await sendNotificationToUser(authToken, {
                        userId: msgUser.id,
                        title,
                        message,
                      });
                      setMsgStatus({ sending: false, error: '', sent: true });
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new Event('notifications:changed'));
                      }
                      setTimeout(() => {
                        setMsgUser(null);
                      }, 700);
                    } catch (e) {
                      setMsgStatus({ sending: false, error: e.message || 'Failed to send', sent: false });
                    }
                  }}
                >
                  {msgStatus.sending ? t?.('private.sending') || 'Sending…' : t?.('private.send') || 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}



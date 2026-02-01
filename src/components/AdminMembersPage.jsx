import { useEffect, useMemo, useState } from 'react';
import { listUsers, updateUserRole } from '../services/adminService';

export default function AdminMembersPage({ t, authToken, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [saveError, setSaveError] = useState('');

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
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-black disabled:opacity-60"
                      onClick={() => saveRole(u.id)}
                      disabled={savingId === u.id}
                    >
                      {savingId === u.id ? t?.('admin.members.saving') || 'Saving…' : t?.('admin.members.save') || 'Save'}
                    </button>
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
    </div>
  );
}



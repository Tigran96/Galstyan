const getApiBase = () => {
  const endpoint =
    import.meta.env.VITE_CHAT_API_ENDPOINT ||
    (import.meta.env.DEV ? '/api/chat' : '/api/chat');

  if (endpoint.includes('://')) {
    return endpoint.replace(/\/api\/chat\/?$/, '');
  }
  return endpoint.replace(/\/api\/chat\/?$/, '');
};

const API_BASE = getApiBase();

export async function listUsers(token) {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load users');
  return data.users || [];
}

export async function updateUserRole(token, userId, role) {
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update role');
  return data.user;
}



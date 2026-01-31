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

export async function getMyProfile(token) {
  const res = await fetch(`${API_BASE}/api/profile/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || 'Failed to load profile');
    err.status = res.status;
    throw err;
  }
  return data.profile;
}

export async function updateMyProfile(token, patch) {
  const res = await fetch(`${API_BASE}/api/profile/me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(patch || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || 'Failed to update profile');
    err.status = res.status;
    throw err;
  }
  return data.profile;
}



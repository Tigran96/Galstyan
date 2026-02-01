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

export async function getMyNotifications(token) {
  const res = await fetch(`${API_BASE}/api/notifications/my`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load notifications');
  return data.notifications || [];
}

export async function markNotificationRead(token, notificationId) {
  const res = await fetch(`${API_BASE}/api/notifications/${notificationId}/read`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to mark read');
  return data;
}

export async function getSentNotifications(token) {
  const res = await fetch(`${API_BASE}/api/notifications/sent`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load sent history');
  return data.sent || [];
}

export async function sendNotification(token, { audience, title, message }) {
  const res = await fetch(`${API_BASE}/api/notifications/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ audience, title, message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to send notification');
  return data;
}

export async function sendNotificationToUser(token, { userId, title, message }) {
  const res = await fetch(`${API_BASE}/api/notifications/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, title, message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to send notification');
  return data;
}



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

export async function listSupportConversations(token) {
  const res = await fetch(`${API_BASE}/api/support/conversations`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load conversations');
  return data.conversations || [];
}

export async function createSupportConversation(token, message) {
  const res = await fetch(`${API_BASE}/api/support/conversations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to start conversation');
  return data;
}

export async function getSupportConversation(token, id) {
  const res = await fetch(`${API_BASE}/api/support/conversations/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load conversation');
  return data;
}

export async function sendSupportMessage(token, id, message) {
  const res = await fetch(`${API_BASE}/api/support/conversations/${id}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to send message');
  return data;
}

export async function setSupportTyping(token, id, typing) {
  const res = await fetch(`${API_BASE}/api/support/conversations/${id}/typing`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ typing: Boolean(typing) }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to set typing');
  return data;
}

export async function markSupportSeen(token, id) {
  const res = await fetch(`${API_BASE}/api/support/conversations/${id}/seen`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to mark seen');
  return data;
}

export async function getSupportUnreadCount(token) {
  const res = await fetch(`${API_BASE}/api/support/unread-count`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load unread count');
  return Number(data.unread || 0);
}



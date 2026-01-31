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

export async function listThreads() {
  const res = await fetch(`${API_BASE}/api/forum/threads`, { method: 'GET' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load threads');
  return data.threads || [];
}

export async function getThread(threadId) {
  const res = await fetch(`${API_BASE}/api/forum/threads/${threadId}`, { method: 'GET' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load thread');
  return { thread: data.thread, posts: data.posts || [] };
}

export async function createThread(token, { title, body }) {
  const res = await fetch(`${API_BASE}/api/forum/threads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, body }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to create thread');
  return data; // { ok, threadId }
}

export async function addReply(token, threadId, body) {
  const res = await fetch(`${API_BASE}/api/forum/threads/${threadId}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ body }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to add reply');
  return data;
}

export async function deleteThread(token, threadId) {
  const res = await fetch(`${API_BASE}/api/forum/threads/${threadId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to delete thread');
  return data;
}



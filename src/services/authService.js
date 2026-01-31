const getApiBase = () => {
  const endpoint =
    import.meta.env.VITE_CHAT_API_ENDPOINT ||
    (import.meta.env.DEV ? '/api/chat' : '/api/chat');

  // If endpoint is absolute like https://api.example.com/api/chat, strip /api/chat
  if (endpoint.includes('://')) {
    return endpoint.replace(/\/api\/chat\/?$/, '');
  }

  // If endpoint is relative like /api/chat, base is same-origin
  return endpoint.replace(/\/api\/chat\/?$/, '');
};

const API_BASE = getApiBase();

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || data.message || 'Login failed';
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data; // { token, user }
}

export async function signup({ firstName, lastName, email, age, password, passwordConfirm }) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, age, password, passwordConfirm }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || data.message || 'Sign up failed';
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data; // { token, user }
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_BASE}/api/auth/forgot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || data.message || 'Failed to send reset email';
    const err = new Error(msg);
    err.status = res.status;
    err.hint = data.hint;
    throw err;
  }
  return data; // { ok: true, exists?: boolean }
}

export async function resetPassword({ token, password, passwordConfirm }) {
  const res = await fetch(`${API_BASE}/api/auth/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password, passwordConfirm }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || data.message || 'Failed to reset password';
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data; // { ok: true }
}

export async function getMe(token) {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || data.message || 'Unauthorized';
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data; // { user }
}



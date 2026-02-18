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

async function fileToDataUrl(file) {
  if (!file) return null;
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(String(reader.result || ''));
    reader.readAsDataURL(file);
  });
}

async function imageToJpegDataUrl(file, { maxWidth = 1280, maxHeight = 1280, quality = 0.82 } = {}) {
  if (!file) return null;
  const type = String(file.type || '').toLowerCase();
  if (!type.startsWith('image/')) {
    throw new Error('Only images are allowed');
  }

  // Prefer ImageBitmap (fast), fallback to Image element.
  const url = URL.createObjectURL(file);
  try {
    let bitmap = null;
    if (typeof createImageBitmap === 'function') {
      bitmap = await createImageBitmap(file);
    } else {
      bitmap = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
      });
    }

    const w = bitmap.width;
    const h = bitmap.height;
    if (!w || !h) throw new Error('Invalid image');

    const scale = Math.min(1, maxWidth / w, maxHeight / h);
    const outW = Math.max(1, Math.round(w * scale));
    const outH = Math.max(1, Math.round(h * scale));

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not supported');
    ctx.drawImage(bitmap, 0, 0, outW, outH);

    // JPEG is usually much smaller than PNG (good for cPanel request limits).
    return canvas.toDataURL('image/jpeg', quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function approxBytesFromDataUrl(dataUrl) {
  const s = String(dataUrl || '');
  const idx = s.indexOf('base64,');
  if (idx < 0) return 0;
  const b64 = s.slice(idx + 7);
  // base64 size -> bytes approx
  return Math.floor((b64.length * 3) / 4);
}

function normalizeMessagePayload(input) {
  if (typeof input === 'string') return { message: input };
  if (!input || typeof input !== 'object') return {};
  return input;
}

export async function listSupportConversations(token) {
  const res = await fetch(`${API_BASE}/api/support/conversations`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load conversations');
  return data.conversations || [];
}

export async function createSupportConversation(token, message, file) {
  const base = normalizeMessagePayload(message);
  const imageDataUrl = file ? await imageToJpegDataUrl(file) : null;
  if (imageDataUrl) {
    const approx = approxBytesFromDataUrl(imageDataUrl);
    // Keep payload small to avoid proxy/apache limits. (Server default accepts 2MB)
    if (approx > 1_800_000) {
      throw new Error('Image is too large. Please choose a smaller image.');
    }
  }
  const payload = imageDataUrl
    ? { ...base, imageDataUrl, imageName: file?.name || null }
    : base;
  // Optional: include imageDataUrl + imageName for attachment
  const res = await fetch(`${API_BASE}/api/support/conversations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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

export async function sendSupportMessage(token, id, message, file) {
  const base = normalizeMessagePayload(message);
  const imageDataUrl = file ? await imageToJpegDataUrl(file) : null;
  if (imageDataUrl) {
    const approx = approxBytesFromDataUrl(imageDataUrl);
    if (approx > 1_800_000) {
      throw new Error('Image is too large. Please choose a smaller image.');
    }
  }
  const payload = imageDataUrl
    ? { ...base, imageDataUrl, imageName: file?.name || null }
    : base;
  const res = await fetch(`${API_BASE}/api/support/conversations/${id}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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

export async function deleteSupportConversation(token, id) {
  const res = await fetch(`${API_BASE}/api/support/conversations/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to delete conversation');
  return data;
}



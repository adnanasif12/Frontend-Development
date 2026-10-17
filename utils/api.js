import { getToken } from './auth';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
export const API_ORIGIN = API_URL.replace(/\/api$/, '');

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const FALLBACKS = {
  400: 'The request was not valid. Please check your input.',
  401: 'Your session has expired. Please log in again.',
  403: 'You are not authorized to perform this action.',
  404: 'We could not find what you were looking for.',
  409: 'This record already exists.',
  500: 'Something went wrong on the server. Please try again.',
};

function extractMessage(data, status) {
  if (data && typeof data === 'object') {
    if (Array.isArray(data.errors) && data.errors.length) {
      const msg = data.errors.map((e) => (typeof e === 'string' ? e : e?.message || e?.msg)).filter(Boolean).join(' ');
      if (msg) return msg;
    }
    if (typeof data.message === 'string' && data.message) return data.message;
    if (typeof data.error === 'string' && data.error) return data.error;
    if (data.error?.message) return data.error.message;
  }
  if (typeof data === 'string' && data.length < 200 && !data.trim().startsWith('<')) return data;
  return FALLBACKS[status] || 'Something went wrong. Please try again.';
}

function buildQuery(query) {
  const params = new URLSearchParams();
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== '') params.set(k, String(v).trim());
  });
  const s = params.toString();
  return s ? `?${s}` : '';
}

/**
 * Single entry point for every API call.
 * - Adds `Authorization: Bearer <token>` when a token exists (auth !== false)
 * - Throws ApiError with a user-friendly message
 * - Fires `auth:unauthorized` on 401 so the app can clear the session
 */
export async function request(path, { method = 'GET', body, formData, auth = true, query } = {}) {
  const headers = { Accept: 'application/json' };
  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (formData) payload = formData; // browser sets multipart boundary
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}${buildQuery(query)}`, { method, headers, body: payload, cache: 'no-store' });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and make sure the API is running.', 0);
  }

  let data = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    if (res.status === 401 && token && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    throw new ApiError(extractMessage(data, res.status), res.status, data);
  }
  return data;
}

/* ---------- response-shape helpers (backends wrap data differently) ---------- */
const LIST_KEYS = ['blogs', 'users', 'results', 'items', 'docs', 'data'];

export function pickList(d) {
  if (Array.isArray(d)) return d;
  if (!d || typeof d !== 'object') return [];
  for (const k of LIST_KEYS) {
    if (Array.isArray(d[k])) return d[k];
  }
  if (d.data && typeof d.data === 'object') return pickList(d.data);
  return [];
}

export function pickObject(d, keys = []) {
  if (!d || typeof d !== 'object' || Array.isArray(d)) return null;
  for (const k of keys) {
    if (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k])) return d[k];
  }
  if (d.data && typeof d.data === 'object' && !Array.isArray(d.data)) return pickObject(d.data, keys);
  return d;
}

export function imageUrl(path, version) {
  if (!path || typeof path !== 'string') return '';
  let url = /^(https?:|data:|blob:)/.test(path) ? path : `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
  if (version) url += `${url.includes('?') ? '&' : '?'}v=${version}`;
  return url;
}

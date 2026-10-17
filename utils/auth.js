const TOKEN_KEY = 'blogspace_token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(token) {
  try { window.localStorage.setItem(TOKEN_KEY, token); } catch {}
}
export function clearToken() {
  try { window.localStorage.removeItem(TOKEN_KEY); } catch {}
}
/** Only allow in-app redirects such as /dashboard (blocks //evil.com). */
export function safeNext(value) {
  if (value && value.startsWith('/') && !value.startsWith('//')) return value;
  return '/dashboard';
}

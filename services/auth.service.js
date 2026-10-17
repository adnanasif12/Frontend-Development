import { request } from '@/utils/api';

export const authService = {
  register: ({ firstName, lastName, email, password }) =>
    request('/auth/register', { method: 'POST', auth: false, body: { firstname: firstName, lastname: lastName, email, password } }),
  login: ({ email, password }) => request('/auth/login', { method: 'POST', auth: false, body: { email, password } }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', auth: false, body: { email } }),
  resetPassword: (token, password) =>
    request(`/auth/reset-password/${encodeURIComponent(token)}`, { method: 'PATCH', auth: false, body: { password } }),
};

export function extractToken(d) {
  return d?.token || d?.accessToken || d?.data?.token || d?.data?.accessToken || null;
}

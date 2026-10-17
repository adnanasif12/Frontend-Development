export const MIN_PASSWORD = 8;
export const MAX_PASSWORD = 64;
export const MAX_IMAGE_MB = 2;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const required = (v, label) => (String(v ?? '').trim() ? '' : `${label} is required.`);

export function validateEmail(v) {
  if (!String(v || '').trim()) return 'Email is required.';
  return EMAIL_RE.test(v.trim()) ? '' : 'Enter a valid email address.';
}
export const PASSWORD_RULES = [
  { id: 'len', short: `${MIN_PASSWORD}+ characters`, label: `At least ${MIN_PASSWORD} characters`, test: (v) => v.length >= MIN_PASSWORD },
  { id: 'lower', short: 'a lowercase letter', label: 'A lowercase letter (a-z)', test: (v) => /[a-z]/.test(v) },
  { id: 'upper', short: 'an uppercase letter', label: 'An uppercase letter (A-Z)', test: (v) => /[A-Z]/.test(v) },
  { id: 'num', short: 'a number', label: 'A number (0-9)', test: (v) => /\d/.test(v) },
  { id: 'special', short: 'a special character', label: 'A special character (@ ! # $ %)', test: (v) => /[^A-Za-z0-9\s]/.test(v) },
];

/** 0 (too weak) .. 4 (strong), based on how many rules are met and the length. */
export function passwordScore(v) {
  if (!v) return 0;
  const met = PASSWORD_RULES.filter((r) => r.test(v)).length;
  if (met <= 1) return 0;
  if (met <= 3) return 1;
  if (met === 4) return 2;
  return v.length >= 12 ? 4 : 3;
}

export function validatePassword(v) {
  if (!v) return 'Password is required.';
  if (/\s/.test(v)) return 'Password must not contain spaces.';
  if (v.length > MAX_PASSWORD) return `Password must be at most ${MAX_PASSWORD} characters.`;
  const missing = PASSWORD_RULES.filter((r) => !r.test(v)).map((r) => r.short);
  return missing.length ? `Password needs: ${missing.join(', ')}.` : '';
}
export function validateConfirm(password, confirm) {
  if (!confirm) return 'Please confirm your password.';
  return password === confirm ? '' : 'Passwords do not match.';
}
export function validateImage(file) {
  if (!file) return 'Choose an image first.';
  if (!IMAGE_TYPES.includes(file.type)) return 'Image must be a JPG, PNG or WebP file.';
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `Image must be smaller than ${MAX_IMAGE_MB} MB.`;
  return '';
}
export const compact = (errors) => Object.fromEntries(Object.entries(errors).filter(([, v]) => v));

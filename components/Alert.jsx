const STYLES = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-brand/30 bg-brand-light text-brand-dark',
  info: 'border-ink/15 bg-white text-ink',
};
export default function Alert({ type = 'error', children, className = '' }) {
  if (!children) return null;
  return <div role={type === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-4 py-3 text-sm ${STYLES[type]} ${className}`}>{children}</div>;
}

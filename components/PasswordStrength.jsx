import { PASSWORD_RULES, passwordScore } from '@/utils/validators';

const LEVELS = [
  { label: 'Too weak', bar: 'bg-red-500', text: 'text-red-600' },
  { label: 'Weak', bar: 'bg-red-500', text: 'text-red-600' },
  { label: 'Fair', bar: 'bg-amber-signal', text: 'text-amber-700' },
  { label: 'Good', bar: 'bg-brand', text: 'text-brand' },
  { label: 'Strong', bar: 'bg-brand', text: 'text-brand' },
];

/** Live checklist + strength bar shown under a "new password" field. */
export default function PasswordStrength({ password }) {
  if (!password) {
    return <p className="mt-1 text-xs text-ink/55">Use 8+ characters with upper &amp; lower case, a number and a special character.</p>;
  }
  const score = passwordScore(password); // 0..4
  const level = LEVELS[score];
  return (
    <div className="mt-2 space-y-2" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="flex h-1.5 flex-1 gap-1" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className={`h-full flex-1 rounded-full ${i <= score ? level.bar : 'bg-ink/10'}`} />
          ))}
        </div>
        <span className={`text-xs font-medium ${level.text}`}>{level.label}</span>
      </div>
      <ul className="grid gap-x-4 gap-y-1 text-xs sm:grid-cols-2">
        {PASSWORD_RULES.map((r) => {
          const ok = r.test(password);
          return (
            <li key={r.id} className={ok ? 'text-brand' : 'text-ink/55'}>
              <span aria-hidden="true">{ok ? '✓' : '○'}</span> {r.label}
              <span className="sr-only">{ok ? ' (met)' : ' (not met)'}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Spinner({ className = 'h-5 w-5' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Loader({ label = 'Loading...', className = '' }) {
  return (
    <div role="status" className={`flex items-center justify-center gap-3 py-16 text-ink/70 ${className}`}>
      <Spinner className="h-6 w-6 text-brand" />
      <span>{label}</span>
    </div>
  );
}

export function PageLoader({ label = 'Loading...' }) {
  return <div className="flex min-h-screen items-center justify-center bg-paper"><Loader label={label} /></div>;
}

export function BlogCardSkeleton() {
  return (
    <div className="card animate-pulse space-y-4 p-5" aria-hidden="true">
      <div className="h-5 w-20 rounded-full bg-ink/10" />
      <div className="h-6 w-4/5 rounded bg-ink/10" />
      <div className="space-y-2"><div className="h-3 rounded bg-ink/10" /><div className="h-3 w-5/6 rounded bg-ink/10" /><div className="h-3 w-2/3 rounded bg-ink/10" /></div>
      <div className="flex items-center gap-3 pt-2"><div className="h-9 w-9 rounded-full bg-ink/10" /><div className="h-3 w-28 rounded bg-ink/10" /></div>
    </div>
  );
}

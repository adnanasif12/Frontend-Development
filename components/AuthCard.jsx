export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-md items-center px-4 py-10">
      <div className="card w-full p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink/65">{subtitle}</p>}
        <div className="mt-6">{children}</div>
        {footer && <div className="mt-6 border-t border-ink/10 pt-4 text-center text-sm text-ink/70">{footer}</div>}
      </div>
    </div>
  );
}

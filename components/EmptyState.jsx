export default function EmptyState({ title, message, action }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      {message && <p className="mt-1 max-w-md text-sm text-ink/65">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

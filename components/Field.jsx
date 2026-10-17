/** Labelled form control. Use `as="textarea"` / `as="select"` for other controls. */
export default function Field({ label, error, hint, as: Tag = 'input', children, id, ...props }) {
  const fid = id || props.name;
  return (
    <div>
      <label htmlFor={fid} className="label">{label}</label>
      <Tag id={fid} className={`input ${error ? 'input-error' : ''}`} aria-invalid={!!error} aria-describedby={error ? `${fid}-error` : undefined} {...props}>
        {children}
      </Tag>
      {hint && !error && <p className="mt-1 text-xs text-ink/55">{hint}</p>}
      {error && <p id={`${fid}-error`} className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

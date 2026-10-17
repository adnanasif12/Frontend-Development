'use client';
import { useEffect } from 'react';
import { Spinner } from './Loader';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', pendingLabel = 'Working...', danger = false, pending = false, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape' && !pending) onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, pending, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={() => !pending && onCancel()} />
      <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="card relative w-full max-w-md p-6 shadow-xl">
        <h2 id="confirm-title" className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-ink/70">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel} disabled={pending}>Cancel</button>
          <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm} disabled={pending}>
            {pending && <Spinner className="h-4 w-4" />}
            {pending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

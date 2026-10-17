'use client';
import { useEffect, useState } from 'react';
import Avatar from './Avatar';
import Alert from './Alert';
import Loader from './Loader';
import { userService } from '@/services/user.service';
import { createdOf, capitalize, formatDate, fullName, profileImageOf } from '@/utils/format';

export default function UserDetailsDialog({ id, onClose }) {
  const [state, setState] = useState({ loading: true, error: '', user: null });

  useEffect(() => {
    let ignore = false;
    setState({ loading: true, error: '', user: null });
    userService.getUser(id)
      .then((user) => !ignore && setState({ loading: false, error: '', user }))
      .catch((e) => !ignore && setState({ loading: false, error: e.message, user: null }));
    return () => { ignore = true; };
  }, [id]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const u = state.user;
  const rows = u ? [
    ['Name', fullName(u)], ['Email', u.email], ['Role', capitalize(u.role)],
    ['Status', u.isActive === false ? 'Inactive' : 'Active'], ['Created', formatDate(createdOf(u), true)],
  ] : [];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="User details" className="card relative w-full max-w-md p-6 shadow-xl">
        <h2 className="text-lg font-semibold">User details</h2>
        {state.loading && <Loader label="Loading user..." className="!py-10" />}
        {state.error && <Alert className="mt-4">{state.error}</Alert>}
        {u && (
          <div className="mt-4">
            <div className="mb-4 flex justify-center"><Avatar src={profileImageOf(u)} size={88} alt={fullName(u)} /></div>
            <dl className="divide-y divide-ink/10 text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2"><dt className="text-ink/60">{k}</dt><dd className="break-all text-right font-medium">{v || '—'}</dd></div>
              ))}
            </dl>
          </div>
        )}
        <div className="mt-6 flex justify-end"><button className="btn-secondary" onClick={onClose}>Close</button></div>
      </div>
    </div>
  );
}

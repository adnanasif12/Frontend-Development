'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Avatar from '@/components/Avatar';
import Alert from '@/components/Alert';
import Loader from '@/components/Loader';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import UserDetailsDialog from '@/components/UserDetailsDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { userService } from '@/services/user.service';
import { capitalize, fullName, profileImageOf, userId } from '@/utils/format';

const isActive = (u) => u.isActive !== false;

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const toast = useToast();
  const [state, setState] = useState({ loading: true, error: '', forbidden: false, users: [] });
  const [viewId, setViewId] = useState(null);
  const [target, setTarget] = useState(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let ignore = false;
    userService.getUsers()
      .then((users) => !ignore && setState({ loading: false, error: '', forbidden: false, users }))
      .catch((e) => !ignore && setState({ loading: false, error: e.message, forbidden: e.status === 403, users: [] }));
    return () => { ignore = true; };
  }, []);

  async function confirmToggle() {
    const next = !isActive(target);
    setPending(true);
    try {
      await userService.setStatus(userId(target), next);
      setState((s) => ({ ...s, users: s.users.map((u) => (userId(u) === userId(target) ? { ...u, isActive: next } : u)) }));
      toast.success(`User ${next ? 'activated' : 'deactivated'}.`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setPending(false);
      setTarget(null);
    }
  }

  const { loading, error, forbidden, users } = state;

  if (forbidden) {
    return (
      <div className="card mx-auto max-w-lg px-6 py-14 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-sm text-ink/65">{error}</p>
        <Link href="/dashboard" className="btn-primary mt-6">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Users</h1>
      {loading && <Loader label="Loading users..." />}
      {error && <Alert>{error}</Alert>}
      {!loading && !error && users.length === 0 && <EmptyState title="No users found." />}

      {users.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-ink/10 bg-ink/[0.03] text-ink/65">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {users.map((u) => {
                const active = isActive(u);
                const self = userId(u) === userId(me);
                return (
                  <tr key={userId(u)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3"><Avatar src={profileImageOf(u)} size={32} alt={fullName(u)} /><span className="font-medium">{fullName(u)}</span></div>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{u.email}</td>
                    <td className="px-4 py-3">{capitalize(u.role)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${active ? 'bg-brand-light text-brand-dark' : 'bg-red-50 text-red-700'}`}>{active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button className="btn-ghost !px-3 !py-1.5" onClick={() => setViewId(userId(u))}>View</button>
                      <button className={`btn-ghost !px-3 !py-1.5 ${active ? '!text-red-600 hover:!bg-red-50' : '!text-brand'}`}
                        disabled={self} title={self ? 'You cannot change your own status' : undefined} onClick={() => setTarget(u)}>
                        {active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {viewId && <UserDetailsDialog id={viewId} onClose={() => setViewId(null)} />}
      <ConfirmDialog open={!!target} danger={target ? isActive(target) : false} pending={pending}
        title={target && isActive(target) ? 'Deactivate user' : 'Activate user'}
        confirmLabel={target && isActive(target) ? 'Deactivate' : 'Activate'} pendingLabel="Updating..."
        message={target ? `${isActive(target) ? 'Deactivate' : 'Activate'} ${fullName(target)}? ${isActive(target) ? 'They will no longer be able to log in.' : 'They will be able to log in again.'}` : ''}
        onConfirm={confirmToggle} onCancel={() => setTarget(null)} />
    </div>
  );
}

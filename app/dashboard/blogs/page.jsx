'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Alert from '@/components/Alert';
import Loader from '@/components/Loader';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { blogService } from '@/services/blog.service';
import { createdOf, blogAuthor, blogId, blogTitle, formatDate, isOwner } from '@/utils/format';

export default function ManageBlogsPage() {
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const [state, setState] = useState({ loading: true, error: '', blogs: [] });
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const all = await blogService.getBlogs();
      const list = isAdmin ? all : all.filter((b) => isOwner(b, user));
      list.sort((a, b) => new Date(createdOf(b)) - new Date(createdOf(a)));
      setState({ loading: false, error: '', blogs: list });
    } catch (e) {
      setState({ loading: false, error: e.message, blogs: [] });
    }
  }, [isAdmin, user]);

  useEffect(() => { load(); }, [load]);

  async function confirmDelete() {
    setDeleting(true);
    try {
      await blogService.remove(blogId(target));
      toast.success('Blog deleted successfully.');
      setTarget(null);
      await load();
    } catch (e) {
      toast.error(e.message);
      setTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  const { loading, error, blogs } = state;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">{isAdmin ? 'All Blogs' : 'My Blogs'}</h1>
        <Link href="/dashboard/blogs/create" className="btn-primary">Create Blog</Link>
      </div>

      {loading && <Loader label="Loading blogs..." />}
      {error && <Alert>{error}</Alert>}
      {!loading && !error && blogs.length === 0 && (
        <EmptyState title={isAdmin ? 'No blogs found.' : "You haven't created any blogs yet."} message="Published blogs will show up here."
          action={<Link href="/dashboard/blogs/create" className="btn-primary">Create Blog</Link>} />
      )}

      {blogs.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-ink/10 bg-ink/[0.03] text-ink/65">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {blogs.map((b) => (
                <tr key={blogId(b)}>
                  <td className="max-w-xs px-4 py-3"><Link href={`/blogs/${blogId(b)}`} className="line-clamp-2 font-medium hover:text-brand">{blogTitle(b)}</Link></td>
                  <td className="px-4 py-3"><span className="badge bg-brand-light text-brand-dark">{b.category || '—'}</span></td>
                  <td className="px-4 py-3">{blogAuthor(b).name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink/65">{formatDate(createdOf(b))}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link href={`/dashboard/blogs/${blogId(b)}/edit`} className="btn-ghost !px-3 !py-1.5">Edit</Link>
                    <button className="btn-ghost !px-3 !py-1.5 !text-red-600 hover:!bg-red-50" onClick={() => setTarget(b)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={!!target} danger title="Delete blog" pending={deleting} confirmLabel="Delete" pendingLabel="Deleting..."
        message={`Are you sure you want to delete this blog? “${target ? blogTitle(target) : ''}” will be removed permanently.`}
        onConfirm={confirmDelete} onCancel={() => setTarget(null)} />
    </div>
  );
}

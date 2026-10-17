'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Avatar from '@/components/Avatar';
import Alert from '@/components/Alert';
import Loader from '@/components/Loader';
import EmptyState from '@/components/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { blogService } from '@/services/blog.service';
import { createdOf, firstNameOf, blogId, blogTitle, capitalize, formatDate, fullName, isOwner, profileImageOf } from '@/utils/format';

export default function DashboardPage() {
  const { user, isAdmin, avatarVersion } = useAuth();
  const [state, setState] = useState({ loading: true, error: '', blogs: [] });

  useEffect(() => {
    let ignore = false;
    blogService.getBlogs()
      .then((all) => {
        if (ignore) return;
        const mine = isAdmin ? all : all.filter((b) => isOwner(b, user));
        const sorted = [...mine].sort((a, b) => new Date(createdOf(b)) - new Date(createdOf(a)));
        setState({ loading: false, error: '', blogs: sorted });
      })
      .catch((e) => !ignore && setState({ loading: false, error: e.message, blogs: [] }));
    return () => { ignore = true; };
  }, [isAdmin, user]);

  const { loading, error, blogs } = state;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome, {firstNameOf(user) || 'there'}</h1>
        <Link href="/dashboard/blogs/create" className="btn-primary">Create Blog</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-ink/60">{isAdmin ? 'Total Blogs (all users)' : 'Total Blogs'}</p>
          <p className="mt-1 font-display text-4xl font-extrabold text-brand">{loading ? '–' : blogs.length}</p>
        </div>
        <div className="card flex items-center gap-4 p-5 md:col-span-2">
          <Avatar src={profileImageOf(user)} version={avatarVersion} size={64} alt={fullName(user)} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold">{fullName(user)}</p>
            <p className="truncate text-sm text-ink/65">{user?.email}</p>
            <span className="badge mt-2 bg-brand-light text-brand-dark">{capitalize(user?.role)}</span>
          </div>
          <Link href="/dashboard/profile" className="btn-secondary">Edit profile</Link>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent blogs</h2>
          <Link href="/dashboard/blogs" className="text-sm font-medium text-brand hover:underline">View all</Link>
        </div>
        {loading && <Loader label="Loading blogs..." />}
        {error && <Alert>{error}</Alert>}
        {!loading && !error && blogs.length === 0 && (
          <EmptyState title="You haven't created any blogs yet." message="Your first post is a few minutes away."
            action={<Link href="/dashboard/blogs/create" className="btn-primary">Write your first blog</Link>} />
        )}
        {blogs.length > 0 && (
          <ul className="card divide-y divide-ink/10">
            {blogs.slice(0, 5).map((b) => (
              <li key={blogId(b)} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <Link href={`/blogs/${blogId(b)}`} className="block truncate font-medium hover:text-brand">{blogTitle(b)}</Link>
                  <p className="text-xs text-ink/55">{b.category} · {formatDate(createdOf(b))}</p>
                </div>
                <Link href={`/dashboard/blogs/${blogId(b)}/edit`} className="btn-ghost !px-3 !py-1.5">Edit</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PublicLayout from '@/components/PublicLayout';
import Avatar from '@/components/Avatar';
import Alert from '@/components/Alert';
import Loader from '@/components/Loader';
import { useAuth } from '@/contexts/AuthContext';
import { blogService } from '@/services/blog.service';
import { createdOf, blogAuthor, blogBody, blogId, blogTitle, formatDate, isOwner } from '@/utils/format';

export default function BlogDetailsPage() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const [state, setState] = useState({ loading: true, error: '', notFound: false, blog: null });

  const load = useCallback(() => {
    setState({ loading: true, error: '', notFound: false, blog: null });
    blogService.getBlog(id)
      .then((blog) => setState({ loading: false, error: '', notFound: !blog, blog }))
      .catch((e) => {
        const missing = [400, 404].includes(e.status);
        setState({ loading: false, error: missing ? '' : e.message, notFound: missing, blog: null });
      });
  }, [id]);

  useEffect(load, [load]);

  const { loading, error, notFound, blog } = state;
  const author = blog ? blogAuthor(blog) : null;
  const canEdit = blog && user && (isAdmin || isOwner(blog, user));

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        {loading && <Loader label="Loading blog..." />}

        {notFound && (
          <div className="card px-6 py-14 text-center">
            <h1 className="text-2xl font-bold">Blog Not Found</h1>
            <p className="mt-2 text-sm text-ink/65">This blog does not exist or may have been deleted.</p>
            <Link href="/" className="btn-primary mt-6">Browse blogs</Link>
          </div>
        )}

        {error && (
          <div className="space-y-4"><Alert>{error}</Alert><button className="btn-secondary" onClick={load}>Try again</button></div>
        )}

        {blog && (
          <article>
            <Link href="/" className="text-sm text-brand hover:underline">← All blogs</Link>
            {blog.category && <span className="badge mt-5 bg-brand-light text-brand-dark">{blog.category}</span>}
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{blogTitle(blog)}</h1>
            <div className="mt-5 flex items-center gap-3 border-y border-ink/10 py-4">
              <Avatar src={author.image} size={44} alt={author.name} />
              <div className="flex-1">
                <p className="font-medium">{author.name}</p>
                <p className="text-sm text-ink/55">{formatDate(createdOf(blog), true)}</p>
              </div>
              {canEdit && <Link href={`/dashboard/blogs/${blogId(blog)}/edit`} className="btn-secondary">Edit</Link>}
            </div>
            <div className="mt-8 max-w-prose whitespace-pre-wrap text-lg leading-8 text-ink/90">{blogBody(blog)}</div>
          </article>
        )}
      </div>
    </PublicLayout>
  );
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import BlogForm from '@/components/BlogForm';
import Alert from '@/components/Alert';
import Loader from '@/components/Loader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { blogService } from '@/services/blog.service';
import { blogBody, blogTitle, isOwner } from '@/utils/format';

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();
  const { user, isAdmin } = useAuth();
  const [state, setState] = useState({ loading: true, error: '', notFound: false, blog: null });

  useEffect(() => {
    let ignore = false;
    blogService.getBlog(id)
      .then((blog) => !ignore && setState({ loading: false, error: '', notFound: !blog, blog }))
      .catch((e) => {
        if (ignore) return;
        const missing = [400, 404].includes(e.status);
        setState({ loading: false, error: missing ? '' : e.message, notFound: missing, blog: null });
      });
    return () => { ignore = true; };
  }, [id]);

  async function handleUpdate(values) {
    await blogService.update(id, values); // backend enforces ownership (403 is shown in the form)
    toast.success('Blog updated successfully.');
    router.push('/dashboard/blogs');
  }

  const { loading, error, notFound, blog } = state;
  const allowed = blog && (isAdmin || isOwner(blog, user));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Edit Blog</h1>
      {loading && <Loader label="Loading blog..." />}
      {error && <Alert>{error}</Alert>}
      {notFound && (
        <div className="card px-6 py-12 text-center">
          <h2 className="text-xl font-semibold">Blog Not Found</h2>
          <Link href="/dashboard/blogs" className="btn-primary mt-5">Back to blogs</Link>
        </div>
      )}
      {blog && !allowed && (
        <div className="card px-6 py-12 text-center">
          <h2 className="text-xl font-semibold">You are not authorized to update this blog.</h2>
          <Link href="/dashboard/blogs" className="btn-primary mt-5">Back to blogs</Link>
        </div>
      )}
      {blog && allowed && (
        <BlogForm initial={{ blogTitle: blogTitle(blog), blog: blogBody(blog), category: blog.category }}
          onSubmit={handleUpdate} submitLabel="Update Blog" pendingLabel="Saving..." />
      )}
    </div>
  );
}

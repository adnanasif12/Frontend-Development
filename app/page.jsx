'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PublicLayout from '@/components/PublicLayout';
import BlogCard from '@/components/BlogCard';
import CategoryFilter from '@/components/CategoryFilter';
import EmptyState from '@/components/EmptyState';
import Alert from '@/components/Alert';
import { BlogCardSkeleton } from '@/components/Loader';
import { blogService } from '@/services/blog.service';
import { blogId } from '@/utils/format';

const PAGE_SIZE = 9;

function BlogList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get('title') || '';
  const category = searchParams.get('category') || '';
  const [state, setState] = useState({ loading: true, error: '', blogs: [], loaded: false });
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    let ignore = false;
    setState((s) => ({ ...s, loading: true })); // keep the previous results on screen while loading
    setVisible(PAGE_SIZE);
    blogService.getBlogs({ title, category })
      .then((blogs) => !ignore && setState({ loading: false, error: '', blogs, loaded: true }))
      .catch((e) => !ignore && setState({ loading: false, error: e.message, blogs: [], loaded: true }));
    return () => { ignore = true; };
  }, [title, category]);

  function setCategory(c) {
    const p = new URLSearchParams(searchParams.toString());
    if (c) p.set('category', c); else p.delete('category');
    const qs = p.toString();
    router.replace(qs ? `/?${qs}` : '/', { scroll: false });
  }

  const { loading, error, blogs, loaded } = state;
  const firstLoad = loading && !loaded;
  return (
    <>
      <div className="mb-6"><CategoryFilter value={category} onChange={setCategory} /></div>
      {error && <Alert className="mb-6">{error}</Alert>}
      <div className="min-h-[60vh]" aria-busy={loading}>
      {firstLoad ? (
        <div role="status" aria-label="Loading blogs">
          <p className="sr-only">Loading blogs...</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}</div>
        </div>
      ) : !error && blogs.length === 0 ? (
        <EmptyState title="No blogs found."
          message={title || category ? 'Try a different search term or category.' : 'Nobody has published a blog yet.'}
          action={(title || category) && <button className="btn-secondary" onClick={() => router.replace('/')}>Clear filters</button>} />
      ) : (
        <div className={`transition-opacity duration-150 ${loading ? 'pointer-events-none opacity-50' : ''}`}>
          <p className="mb-4 text-sm text-ink/60">{blogs.length} {blogs.length === 1 ? 'blog' : 'blogs'}{title && <> matching “{title}”</>}{category && <> in {category}</>}</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, visible).map((b) => <BlogCard key={blogId(b)} blog={b} />)}
          </div>
          {visible < blogs.length && (
            <div className="mt-8 text-center"><button className="btn-secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>Load more</button></div>
          )}
        </div>
      )}
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">Write it down. Ship it better.</h1>
          <p className="mt-3 max-w-xl text-ink/65">Practical posts on testing, automation, programming, DevOps and AI — written by the people doing the work.</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Suspense fallback={null}><BlogList /></Suspense>
      </div>
    </PublicLayout>
  );
}

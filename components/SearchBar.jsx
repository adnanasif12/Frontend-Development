'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Icon from './Icon';

/** Debounced search that drives GET /api/blogs?title=... via the homepage URL. */
export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const param = searchParams.get('title') || '';
  const [value, setValue] = useState(param);
  const lastPushed = useRef(param);

  // keep in sync when the URL changes from elsewhere (e.g. clearing filters)
  useEffect(() => {
    if (param !== lastPushed.current) {
      lastPushed.current = param;
      setValue(param);
    }
  }, [param]);

  function push(next) {
    const trimmed = next.trim();
    if (trimmed === lastPushed.current) return;
    lastPushed.current = trimmed;
    const p = new URLSearchParams(pathname === '/' ? searchParams.toString() : '');
    if (trimmed) p.set('title', trimmed); else p.delete('title');
    const qs = p.toString();
    const url = qs ? `/?${qs}` : '/';
    pathname === '/' ? router.replace(url, { scroll: false }) : router.push(url);
  }

  useEffect(() => {
    if (value.trim() === lastPushed.current) return;
    const t = setTimeout(() => push(value), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <form role="search" onSubmit={(e) => { e.preventDefault(); push(value); }} className="relative w-full">
      <label htmlFor="blog-search" className="sr-only">Search blogs</label>
      <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
      <input id="blog-search" type="search" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search blogs..." className="input rounded-full bg-paper pl-9" />
    </form>
  );
}

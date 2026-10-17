'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from './SearchBar';
import ProfileMenu from './ProfileMenu';
import Icon from './Icon';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { isAuthenticated, initializing } = useAuth();
  const pathname = usePathname() || '/';
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="btn-ghost !p-2 lg:hidden" aria-label="Open menu"><Icon name="menu" /></button>
        )}
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-brand">BlogSpace</Link>
        <div className="mx-auto hidden w-full max-w-md flex-1 md:block">
          <Suspense fallback={null}><SearchBar /></Suspense>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {initializing ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-ink/10" />
          ) : isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <>
              {[['/', 'Home'], ['/login', 'Login'], ['/register', 'Register']].map(([href, label]) => {
                const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
                return (
                  <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={active ? 'btn-primary' : 'btn-ghost'}>
                    {label}
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>
      <div className="px-4 pb-3 md:hidden">
        <Suspense fallback={null}><SearchBar /></Suspense>
      </div>
    </header>
  );
}

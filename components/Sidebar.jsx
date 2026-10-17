'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';
import { useAuth } from '@/contexts/AuthContext';

function isActive(pathname, href) {
  if (href === '/dashboard') return pathname === href;
  if (href === '/dashboard/blogs') return pathname === href || /^\/dashboard\/blogs\/[^/]+\/edit$/.test(pathname);
  return pathname.startsWith(href);
}

export default function Sidebar({ open, onClose }) {
  const { isAdmin, logout } = useAuth();
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: 'grid' },
    { href: '/dashboard/blogs', label: isAdmin ? 'All Blogs' : 'My Blogs', icon: 'doc' },
    { href: '/dashboard/blogs/create', label: 'Create Blog', icon: 'plus' },
    ...(isAdmin ? [{ href: '/admin/users', label: 'Users', icon: 'users' }] : []),
    { href: '/dashboard/profile', label: 'Profile', icon: 'user' },
    { href: '/dashboard/change-password', label: 'Change Password', icon: 'lock' },
  ];

  const nav = (
    <nav aria-label="Dashboard" className="flex h-full flex-col gap-1 p-4">
      {links.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <Link key={l.href} href={l.href} aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? 'bg-brand text-white' : 'text-ink/75 hover:bg-ink/5'}`}>
            <Icon name={l.icon} className="h-5 w-5" />{l.label}
          </Link>
        );
      })}
      <button onClick={logout} className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
        <Icon name="logout" className="h-5 w-5" />Logout
      </button>
    </nav>
  );

  return (
    <>
      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-64 border-r border-ink/10 bg-white lg:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-ink/10 px-4">
              <span className="font-display text-xl font-extrabold text-brand">BlogSpace</span>
              <button onClick={onClose} className="btn-ghost !p-2" aria-label="Close menu"><Icon name="x" /></button>
            </div>
            <div className="h-[calc(100%-4rem)]">{nav}</div>
          </aside>
        </div>
      )}
    </>
  );
}

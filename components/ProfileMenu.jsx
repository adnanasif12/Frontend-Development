'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Avatar from './Avatar';
import Icon from './Icon';
import { useAuth } from '@/contexts/AuthContext';
import { fullName, profileImageOf } from '@/utils/format';

export default function ProfileMenu() {
  const { user, logout, avatarVersion } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, []);

  const name = fullName(user);
  const item = 'flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-ink/5';
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-ink/5">
        <Avatar src={profileImageOf(user)} version={avatarVersion} size={36} alt={name} />
        <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:block">{name}</span>
        <Icon name="chevron" className="h-4 w-4 text-ink/50" />
      </button>
      {open && (
        <div role="menu" className="card absolute right-0 mt-2 w-56 overflow-hidden py-1 shadow-lg">
          <div className="border-b border-ink/10 px-4 py-2">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-ink/55">{user?.email}</p>
          </div>
          <Link role="menuitem" href="/dashboard/profile" className={item} onClick={() => setOpen(false)}><Icon name="user" className="h-4 w-4" />Profile</Link>
          <Link role="menuitem" href="/dashboard/change-password" className={item} onClick={() => setOpen(false)}><Icon name="lock" className="h-4 w-4" />Change Password</Link>
          <button role="menuitem" className={`${item} text-red-600`} onClick={() => { setOpen(false); logout(); }}><Icon name="logout" className="h-4 w-4" />Logout</button>
        </div>
      )}
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { PageLoader } from './Loader';
import { useAuth } from '@/contexts/AuthContext';

function AccessDenied() {
  return (
    <div className="card mx-auto max-w-lg px-6 py-14 text-center">
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="mt-2 text-sm text-ink/65">You need administrator permissions to view this page.</p>
      <Link href="/dashboard" className="btn-primary mt-6">Back to dashboard</Link>
    </div>
  );
}

/** Dashboard layout + route guard. adminOnly pages show Access Denied for normal users. */
export default function DashboardShell({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, initializing } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    if (!initializing && !isAuthenticated) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [initializing, isAuthenticated, pathname, router]);

  useEffect(() => setDrawer(false), [pathname]);

  if (initializing || !isAuthenticated) return <PageLoader label="Checking your session..." />;

  return (
    <div className="min-h-screen">
      <Navbar onMenuClick={() => setDrawer(true)} />
      <Sidebar open={drawer} onClose={() => setDrawer(false)} />
      <main className="pt-28 md:pt-16 lg:pl-64">
        <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
          {adminOnly && !isAdmin ? <AccessDenied /> : children}
        </div>
      </main>
    </div>
  );
}

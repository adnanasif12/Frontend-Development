import DashboardShell from '@/components/DashboardShell';

export default function AdminLayout({ children }) {
  return <DashboardShell adminOnly>{children}</DashboardShell>;
}

import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-ink/65">The page you are looking for does not exist.</p>
        <Link href="/" className="btn-primary mt-6">Go home</Link>
      </div>
    </PublicLayout>
  );
}

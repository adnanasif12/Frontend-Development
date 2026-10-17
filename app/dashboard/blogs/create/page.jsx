'use client';
import { useRouter } from 'next/navigation';
import BlogForm from '@/components/BlogForm';
import { useToast } from '@/contexts/ToastContext';
import { blogService } from '@/services/blog.service';

export default function CreateBlogPage() {
  const router = useRouter();
  const toast = useToast();

  async function handleCreate(values) {
    await blogService.create(values);
    toast.success('Blog published successfully.');
    router.push('/dashboard/blogs');
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Create Blog</h1>
      <BlogForm onSubmit={handleCreate} submitLabel="Publish Blog" pendingLabel="Publishing..." />
    </div>
  );
}

import Link from 'next/link';
import Avatar from './Avatar';
import { createdOf, blogAuthor, blogBody, blogId, blogTitle, excerpt, formatDate } from '@/utils/format';

export default function BlogCard({ blog }) {
  const author = blogAuthor(blog);
  const id = blogId(blog);
  return (
    <article className="card flex flex-col p-5 transition-shadow hover:shadow-md">
      {blog.category && <span className="badge mb-3 w-fit bg-brand-light text-brand-dark">{blog.category}</span>}
      <h3 className="text-xl font-bold leading-snug">
        <Link href={`/blogs/${id}`} className="hover:text-brand">{blogTitle(blog)}</Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{excerpt(blogBody(blog))}</p>
      <div className="mt-5 flex items-center gap-3">
        <Avatar src={author.image} size={36} alt={author.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{author.name}</p>
          <p className="text-xs text-ink/55">{formatDate(createdOf(blog))}</p>
        </div>
        <Link href={`/blogs/${id}`} className="btn-secondary shrink-0 !px-3 !py-1.5">Read more</Link>
      </div>
    </article>
  );
}

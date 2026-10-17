'use client';
import { useState } from 'react';
import Link from 'next/link';
import Field from './Field';
import Alert from './Alert';
import { Spinner } from './Loader';
import { useForm } from '@/utils/useForm';
import { compact, required } from '@/utils/validators';
import { CATEGORIES } from '@/utils/format';

/** Shared by Create and Edit. `onSubmit(values)` must return a promise. */
export default function BlogForm({ initial, onSubmit, submitLabel, pendingLabel }) {
  const { values, errors, setErrors, onChange } = useForm({
    blogTitle: initial?.blogTitle || '',
    category: initial?.category || '',
    blog: initial?.blog || '',
  });
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = compact({
      blogTitle: required(values.blogTitle, 'Blog title') || (values.blogTitle.trim().length < 3 ? 'Title must be at least 3 characters.' : ''),
      category: required(values.category, 'Category'),
      blog: required(values.blog, 'Blog content') || (values.blog.trim().length < 20 ? 'Content must be at least 20 characters.' : ''),
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setPending(true);
    setServerError('');
    try {
      await onSubmit({ blogTitle: values.blogTitle.trim(), category: values.category, blog: values.blog.trim() });
    } catch (err) {
      setServerError(err.message);
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-5 sm:p-6">
      <Alert>{serverError}</Alert>
      <Field label="Blog title" name="blogTitle" value={values.blogTitle} onChange={onChange} error={errors.blogTitle} placeholder="Introduction to Playwright" maxLength={150} />
      <Field as="select" label="Category" name="category" value={values.category} onChange={onChange} error={errors.category}>
        <option value="">Select a category</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </Field>
      <Field as="textarea" rows={12} label="Blog content" name="blog" value={values.blog} onChange={onChange} error={errors.blog} placeholder="Write your blog here..." />
      <div className="flex flex-wrap justify-end gap-3">
        <Link href="/dashboard/blogs" className="btn-secondary">Cancel</Link>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending && <Spinner className="h-4 w-4" />}
          {pending ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}

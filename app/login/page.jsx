'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import PublicLayout from '@/components/PublicLayout';
import AuthCard from '@/components/AuthCard';
import Field from '@/components/Field';
import Alert from '@/components/Alert';
import { Spinner } from '@/components/Loader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useForm } from '@/utils/useForm';
import { compact, validateEmail } from '@/utils/validators';
import { safeNext } from '@/utils/auth';

function LoginForm() {
  const { login, isAuthenticated, initializing } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const sp = useSearchParams();
  const next = safeNext(sp.get('next'));
  const { values, errors, setErrors, onChange } = useForm({ email: '', password: '' });
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!initializing && isAuthenticated) router.replace(next);
  }, [initializing, isAuthenticated, next, router]);

  async function submit(e) {
    e.preventDefault();
    const errs = compact({ email: validateEmail(values.email), password: values.password ? '' : 'Password is required.' });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setPending(true);
    setServerError('');
    try {
      await login(values.email.trim(), values.password);
      toast.success('Logged in successfully.');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard title="Welcome back" subtitle="Log in to manage your blogs."
      footer={<>New to BlogSpace? <Link href="/register" className="font-semibold text-brand hover:underline">Create an account</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        {sp.get('registered') && <Alert type="success">Account created. Please log in.</Alert>}
        {sp.get('reset') && <Alert type="success">Password successfully changed. Log in with your new password.</Alert>}
        <Alert>{serverError}</Alert>
        <Field label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={onChange} error={errors.email} placeholder="you@example.com" />
        <Field label="Password" name="password" type="password" autoComplete="current-password" value={values.password} onChange={onChange} error={errors.password} />
        <div className="text-right"><Link href="/forgot-password" className="text-sm text-brand hover:underline">Forgot Password?</Link></div>
        <button type="submit" className="btn-primary w-full" disabled={pending}>
          {pending && <Spinner className="h-4 w-4" />}{pending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return <PublicLayout><Suspense fallback={null}><LoginForm /></Suspense></PublicLayout>;
}

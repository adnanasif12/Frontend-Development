'use client';
import { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import AuthCard from '@/components/AuthCard';
import Field from '@/components/Field';
import Alert from '@/components/Alert';
import { Spinner } from '@/components/Loader';
import { authService } from '@/services/auth.service';
import { validateEmail } from '@/utils/validators';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    if (err) return;
    setPending(true);
    setServerError('');
    try {
      await authService.forgotPassword(email.trim());
      setSent(true);
    } catch (ex) {
      setServerError(ex.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <PublicLayout>
      <AuthCard title="Forgot your password?" subtitle="Enter your email and we will send you a reset link."
        footer={<Link href="/login" className="font-semibold text-brand hover:underline">Back to login</Link>}>
        {sent ? (
          <Alert type="success">If an account exists for {email.trim()}, a password reset link has been sent. Check your inbox.</Alert>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <Alert>{serverError}</Alert>
            <Field label="Email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} error={error} placeholder="you@example.com" />
            <button type="submit" className="btn-primary w-full" disabled={pending}>
              {pending && <Spinner className="h-4 w-4" />}{pending ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </AuthCard>
    </PublicLayout>
  );
}

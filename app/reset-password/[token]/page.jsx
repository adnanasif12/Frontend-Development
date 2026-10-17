'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import PublicLayout from '@/components/PublicLayout';
import AuthCard from '@/components/AuthCard';
import Field from '@/components/Field';
import PasswordStrength from '@/components/PasswordStrength';
import Alert from '@/components/Alert';
import { Spinner } from '@/components/Loader';
import { authService } from '@/services/auth.service';
import { useForm } from '@/utils/useForm';
import { compact, validateConfirm, validatePassword } from '@/utils/validators';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const { values, errors, setErrors, onChange } = useForm({ password: '', confirmPassword: '' });
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState('');

  async function submit(e) {
    e.preventDefault();
    const errs = compact({ password: validatePassword(values.password), confirmPassword: validateConfirm(values.password, values.confirmPassword) });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setPending(true);
    setServerError('');
    try {
      await authService.resetPassword(token, values.password);
      router.push('/login?reset=1');
    } catch (err) {
      setServerError(err.message);
      setPending(false);
    }
  }

  return (
    <PublicLayout>
      <AuthCard title="Reset your password" subtitle="Choose a new password for your account."
        footer={<Link href="/login" className="font-semibold text-brand hover:underline">Back to login</Link>}>
        <form onSubmit={submit} noValidate className="space-y-4">
          <Alert>{serverError}</Alert>
          <div>  <Field label="New Password" name="password" type="password" autoComplete="new-password" value={values.password} onChange={onChange} error={errors.password} />  <PasswordStrength password={values.password} /></div>
          <Field label="Confirm Password" name="confirmPassword" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={onChange} error={errors.confirmPassword} />
          <button type="submit" className="btn-primary w-full" disabled={pending}>
            {pending && <Spinner className="h-4 w-4" />}{pending ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </AuthCard>
    </PublicLayout>
  );
}

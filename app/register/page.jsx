'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PublicLayout from '@/components/PublicLayout';
import AuthCard from '@/components/AuthCard';
import Field from '@/components/Field';
import PasswordStrength from '@/components/PasswordStrength';
import Alert from '@/components/Alert';
import { Spinner } from '@/components/Loader';
import { authService } from '@/services/auth.service';
import { useForm } from '@/utils/useForm';
import { compact, required, validateConfirm, validateEmail, validatePassword } from '@/utils/validators';

export default function RegisterPage() {
  const router = useRouter();
  const { values, errors, setErrors, onChange } = useForm({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState('');

  async function submit(e) {
    e.preventDefault();
    const errs = compact({
      firstName: required(values.firstName, 'First name'),
      lastName: required(values.lastName, 'Last name'),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirmPassword: validateConfirm(values.password, values.confirmPassword),
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setPending(true);
    setServerError('');
    try {
      await authService.register({ firstName: values.firstName.trim(), lastName: values.lastName.trim(), email: values.email.trim(), password: values.password });
      router.push('/login?registered=1');
    } catch (err) {
      setServerError(err.message);
      setPending(false);
    }
  }

  return (
    <PublicLayout>
      <AuthCard title="Create your account" subtitle="Start writing and sharing blogs."
        footer={<>Already have an account? <Link href="/login" className="font-semibold text-brand hover:underline">Login</Link></>}>
        <form onSubmit={submit} noValidate className="space-y-4">
          <Alert>{serverError}</Alert>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First Name" name="firstName" autoComplete="given-name" value={values.firstName} onChange={onChange} error={errors.firstName} />
            <Field label="Last Name" name="lastName" autoComplete="family-name" value={values.lastName} onChange={onChange} error={errors.lastName} />
          </div>
          <Field label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={onChange} error={errors.email} />
          <div>  <Field label="Password" name="password" type="password" autoComplete="new-password" value={values.password} onChange={onChange} error={errors.password} />  <PasswordStrength password={values.password} /></div>
          <Field label="Confirm Password" name="confirmPassword" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={onChange} error={errors.confirmPassword} />
          <button type="submit" className="btn-primary w-full" disabled={pending}>
            {pending && <Spinner className="h-4 w-4" />}{pending ? 'Registering...' : 'Register'}
          </button>
        </form>
      </AuthCard>
    </PublicLayout>
  );
}

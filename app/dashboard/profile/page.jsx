'use client';
import { useEffect, useRef, useState } from 'react';
import Avatar from '@/components/Avatar';
import Alert from '@/components/Alert';
import Field from '@/components/Field';
import { Spinner } from '@/components/Loader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { userService } from '@/services/user.service';
import { useForm } from '@/utils/useForm';
import { firstNameOf, lastNameOf, capitalize, fullName, profileImageOf } from '@/utils/format';
import { compact, required, validateImage, MAX_IMAGE_MB } from '@/utils/validators';

export default function ProfilePage() {
  const { user, refreshProfile, bumpAvatar, avatarVersion } = useAuth();
  const toast = useToast();
  const fileRef = useRef(null);

  const { values, setValues, errors, setErrors, onChange } = useForm({ firstName: '', lastName: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [imageError, setImageError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => { refreshProfile().catch(() => {}); }, [refreshProfile]);
  useEffect(() => {
    if (user) setValues({ firstName: firstNameOf(user), lastName: lastNameOf(user) });
  }, [user?.firstname, user?.lastname, user?.firstName, user?.lastName]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateImage(f);
    setImageError(err);
    if (err) { setFile(null); setPreview(''); e.target.value = ''; return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function upload() {
    const err = validateImage(file);
    setImageError(err);
    if (err) return;
    setUploading(true);
    try {
      await userService.uploadImage(file);
      await refreshProfile(); // updates the fixed Navbar avatar immediately
      bumpAvatar();           // cache-busts the image URL
      toast.success('Profile image updated.');
      setFile(null);
      setPreview('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      setImageError(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    const errs = compact({ firstName: required(values.firstName, 'First name'), lastName: required(values.lastName, 'Last name') });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    setSaveError('');
    try {
      await userService.updateProfile({ firstName: values.firstName.trim(), lastName: values.lastName.trim() });
      await refreshProfile();
      toast.success('Profile updated.');
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>

      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Profile image</h2>
        <div className="mt-4 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {preview
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={preview} alt="Selected preview" className="h-24 w-24 rounded-full object-cover" />
            : <Avatar src={profileImageOf(user)} version={avatarVersion} size={96} alt={fullName(user)} />}
          <div className="w-full flex-1 space-y-3">
            <div>
              <label htmlFor="image" className="label">Choose Image</label>
              <input ref={fileRef} id="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange}
                className="block w-full text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-dark hover:file:bg-brand/20" />
              <p className="mt-1 text-xs text-ink/55">JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB.</p>
            </div>
            <Alert>{imageError}</Alert>
            <button className="btn-primary" onClick={upload} disabled={!file || uploading}>
              {uploading && <Spinner className="h-4 w-4" />}{uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Personal information</h2>
        <form onSubmit={saveProfile} noValidate className="mt-4 space-y-4">
          <Alert>{saveError}</Alert>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First Name" name="firstName" value={values.firstName} onChange={onChange} error={errors.firstName} />
            <Field label="Last Name" name="lastName" value={values.lastName} onChange={onChange} error={errors.lastName} />
            <Field label="Email" name="email" value={user?.email || ''} readOnly disabled hint="Email cannot be changed." />
            <Field label="Role" name="role" value={capitalize(user?.role)} readOnly disabled />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving && <Spinner className="h-4 w-4" />}{saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

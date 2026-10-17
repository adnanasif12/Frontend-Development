'use client';
import { useEffect, useState } from 'react';
import { imageUrl } from '@/utils/api';

/** Shows the uploaded image, or a default silhouette when missing/broken. */
export default function Avatar({ src, version, size = 36, alt = '' }) {
  const url = imageUrl(src, version);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);

  const style = { width: size, height: size };
  if (!url || failed) {
    return (
      <span style={style} className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-light text-brand" role="img" aria-label={alt || 'Default avatar'}>
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size * 0.7, height: size * 0.7 }} aria-hidden="true">
          <circle cx="12" cy="8.5" r="4" />
          <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7z" />
        </svg>
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} style={style} className="shrink-0 rounded-full object-cover" onError={() => setFailed(true)} />;
}

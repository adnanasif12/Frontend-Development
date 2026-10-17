export const CATEGORIES = ['Testing', 'Automation', 'Programming', 'DevOps', 'AI'];

export const blogId = (b) => b?._id || b?.id;
export const blogTitle = (b) => b?.blogTitle || b?.title || 'Untitled';
export const blogBody = (b) => b?.blog || b?.content || b?.body || '';
export const userId = (u) => u?._id || u?.id;

export const firstNameOf = (u) => u?.firstname ?? u?.firstName ?? '';
export const lastNameOf = (u) => u?.lastname ?? u?.lastName ?? '';
export const createdOf = (x) => x?.createAt || x?.createdAt;

export function fullName(u) {
  if (!u) return '';
  const n = [firstNameOf(u), lastNameOf(u)].filter(Boolean).join(' ').trim();
  return n || u.name || u.email || '';
}

/** Author may be populated as user/author/createdBy/userId (object) or just an id string. */
export function blogAuthor(b) {
  const a = b?.user || b?.author || b?.createdBy || b?.userId;
  if (a && typeof a === 'object') {
    return { id: userId(a), name: fullName(a) || 'Unknown author', image: a.profileImage || a.image || a.avatar || '' };
  }
  return { id: typeof a === 'string' ? a : undefined, name: 'Unknown author', image: '' };
}

export const profileImageOf = (u) => u?.profileImage || u?.image || u?.avatar || '';

export function isOwner(blog, user) {
  const owner = blogAuthor(blog).id;
  return !!owner && !!user && owner === userId(user);
}

export function formatDate(value, long = false) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', long ? { year: 'numeric', month: 'long', day: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' });
}

export function excerpt(text, max = 150) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

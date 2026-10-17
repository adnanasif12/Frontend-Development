import { CATEGORIES } from '@/utils/format';

export default function CategoryFilter({ value, onChange }) {
  const items = ['All', ...CATEGORIES];
  const current = value || 'All';
  return (
    <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
      {items.map((c) => (
        <button key={c} type="button" onClick={() => onChange(c === 'All' ? '' : c)} aria-pressed={current === c}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${current === c ? 'border-brand bg-brand text-white' : 'border-ink/15 bg-white text-ink/75 hover:border-brand/50'}`}>
          {c}
        </button>
      ))}
    </div>
  );
}

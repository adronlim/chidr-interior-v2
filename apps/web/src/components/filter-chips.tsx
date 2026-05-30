import type { CategorySlug, ProjectCategory } from '@/lib/types';

interface Props {
  categories: ProjectCategory[];
  active: CategorySlug | null;
  onChange: (next: CategorySlug | null) => void;
}

export default function FilterChips({ categories, active, onChange }: Props) {
  // Guard: defend against undefined / non-array categories. The "All" chip
  // is always shown, even if the categories list is empty or still loading.
  const safeCategories = Array.isArray(categories) ? categories : [];
  const items: { slug: CategorySlug | null; label: string }[] = [
    { slug: null, label: 'All' },
    ...safeCategories.map((c) => ({ slug: c.slug, label: c.title })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0 pb-2">
      {items.map((item) => {
        const isActive = item.slug === active;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onChange(item.slug)}
            className={`whitespace-nowrap px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
              isActive
                ? 'bg-ink text-bone border-ink'
                : 'border-line hover:border-ink'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

interface Item {
  label: string;
  value: string;
}

export default function MetaList({ items }: { items: Item[] }) {
  // Guard: no list when items are missing or empty.
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <dl className="divide-y divide-line border-t border-b border-line">
      {items.map((item) => (
        <div key={item.label} className="flex justify-between py-3 text-sm">
          <dt className="eyebrow">{item.label}</dt>
          <dd className="text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

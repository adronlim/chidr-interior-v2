interface Item {
  label: string;
  value: string;
}

export default function MetaList({ items }: { items: Item[] }) {
  // Degrade gracefully: tolerate a missing / non-array prop and skip rows with
  // no value, rendering whatever valid rows exist instead of hiding the list.
  const rows = (Array.isArray(items) ? items : []).filter((row) => row?.value);

  return (
    <dl className="divide-y divide-line border-t border-b border-line">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between py-3 text-sm">
          <dt className="eyebrow">{row.label}</dt>
          <dd className="text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  children: ReactNode;
  align?: 'left' | 'center';
}

export default function SectionTitle({ eyebrow, children, align = 'left' }: Props) {
  // Degrade gracefully: render whichever parts are provided (eyebrow and/or
  // heading) instead of hiding the whole block when one is missing.
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
      {children && (
        <h2 className="font-display text-4xl lg:text-5xl tracking-tighter leading-[1.05]">
          {children}
        </h2>
      )}
    </div>
  );
}

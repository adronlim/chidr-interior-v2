import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Testimonial } from '@/lib/types';

interface Props {
  items: Testimonial[];
}

/** Auto-advancing quote carousel with manual controls and dots. Each slide
 *  change crossfades via a keyed animation; pauses nothing on hover by design
 *  (quotes are short) but stops auto-play once the user takes control. */
export default function TestimonialCarousel({ items }: Props) {
  const safe = Array.isArray(items) ? items.filter((item) => item?.quote) : [];
  const count = safe.length;
  const [index, setIndex] = useState(0);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (manual || count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 7000);
    return () => clearInterval(id);
  }, [manual, count]);

  if (count === 0) return null;

  const active = safe[index];
  const go = (dir: number) => {
    setManual(true);
    setIndex((i) => (i + dir + count) % count);
  };

  return (
    <div className="mx-auto max-w-3xl text-center">
      <blockquote key={index} className="fade-key">
        <p className="font-display text-3xl leading-snug tracking-tighter lg:text-4xl">
          &ldquo;{active?.quote}&rdquo;
        </p>
        <footer className="eyebrow mt-8">
          — {active?.author}
          {active?.role ? `, ${active.role}` : ''}
        </footer>
      </blockquote>

      {count > 1 && (
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => go(-1)}
            className="p-2 text-ash transition-colors hover:text-ink"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            {safe.map((item, i) => (
              <button
                key={item?._id ?? i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => {
                  setManual(true);
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-brass' : 'w-1.5 bg-line'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => go(1)}
            className="p-2 text-ash transition-colors hover:text-ink"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProjectImage } from '@/lib/types';

interface Props {
  images: ProjectImage[];
}

export default function Gallery({ images }: Props) {
  // Degrade gracefully: tolerate a missing / non-array images prop. An empty
  // list simply renders no thumbnails instead of hiding the section. Derived
  // before the hooks so the callbacks below depend on a stable array length.
  const safeImages = Array.isArray(images) ? images : [];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((index) => (index === null ? null : (index + 1) % safeImages.length)),
    [safeImages.length],
  );
  const prev = useCallback(
    () =>
      setOpenIndex((index) =>
        index === null ? null : (index - 1 + safeImages.length) % safeImages.length,
      ),
    [safeImages.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [openIndex, close, next, prev]);

  // The image currently open in the lightbox, or null when nothing is open or
  // the index falls outside the (possibly empty) list.
  const activeImage = openIndex === null ? null : safeImages[openIndex];

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {safeImages.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group block aspect-[4/3] overflow-hidden bg-line"
          >
            <img
              src={img?.url}
              alt={img?.alt ?? `Image ${i + 1}`}
              loading="lazy"
              className="image-hover h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-6"
          onClick={close}
        >
          <button
            type="button"
            className="absolute right-6 top-6 p-2 text-bone"
            aria-label="Close"
            onClick={close}
          >
            <X size={24} />
          </button>
          <button
            type="button"
            className="absolute left-6 p-2 text-bone"
            aria-label="Previous"
            onClick={(event) => {
              event.stopPropagation();
              prev();
            }}
          >
            <ChevronLeft size={28} />
          </button>
          <img
            src={activeImage?.url}
            alt={activeImage?.alt ?? ''}
            className="max-h-full max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-6 p-2 text-bone"
            aria-label="Next"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </>
  );
}

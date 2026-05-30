import { useEffect, useRef, useState } from 'react';

interface Options {
  /** Fraction of the element visible before it counts as in view. */
  threshold?: number;
  /** Margin around the root; the negative bottom delays reveal until scrolled up a bit. */
  rootMargin?: string;
  /** Reveal once and stop observing (default), or toggle as it enters/leaves. */
  once?: boolean;
}

/**
 * Scroll-reveal primitive. Returns a ref to attach and a boolean that flips
 * true when the element scrolls into view. Honours prefers-reduced-motion by
 * reporting visible immediately so content never stays hidden.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}

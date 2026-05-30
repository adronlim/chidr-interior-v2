import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/use-in-view';

interface Props {
  value: number;
  suffix?: string;
  label: string;
  durationMs?: number;
}

/** A large display number that counts up from zero the first time it scrolls
 *  into view. Falls back to the final value when motion is reduced. */
export default function StatCounter({ value, suffix = '', label, durationMs = 1600 }: Props) {
  const { ref, inView } = useInView({ once: true });
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, durationMs]);

  return (
    <div ref={ref}>
      <div className="font-display text-6xl lg:text-7xl tracking-tighter leading-none">
        {display}
        {suffix && <span className="text-brass">{suffix}</span>}
      </div>
      <div className="eyebrow mt-3">{label}</div>
    </div>
  );
}

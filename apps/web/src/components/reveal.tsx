import type { CSSProperties, ReactNode } from 'react';
import { useInView } from '@/hooks/use-in-view';

interface Props {
  children: ReactNode;
  className?: string;
  /** Motion style: slide up, slide in from left, fade only, or image clip-reveal. */
  variant?: 'up' | 'right' | 'fade' | 'clip';
  /** Stagger delay in ms — set per index when revealing a list. */
  delay?: number;
  once?: boolean;
  style?: CSSProperties;
}

/**
 * Wraps content in a scroll-reveal. Starts hidden/offset and animates into
 * place when it enters the viewport. Pair `delay` with a list index to stagger.
 */
export default function Reveal({
  children,
  className = '',
  variant = 'up',
  delay = 0,
  once = true,
  style,
}: Props) {
  const { ref, inView } = useInView({ once });

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${inView ? 'is-visible' : ''} ${className}`.trim()}
      style={{ ...(delay ? { transitionDelay: `${delay}ms` } : null), ...style }}
    >
      {children}
    </div>
  );
}

"use client";

import React from "react";

type CounterProps = {
  target: number;
  durationMs?: number; // default 1200ms
  className?: string;
};

export function Counter({ target, durationMs = 1200, className }: CounterProps) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = React.useState(0);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    if (reduceMotion) {
      setValue(target);
      return () => {};
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, reduceMotion]);

  return (
    <span ref={ref} className={className} aria-live="polite">
      {value.toLocaleString()}
    </span>
  );
}



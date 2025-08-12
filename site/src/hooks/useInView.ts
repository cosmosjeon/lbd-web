"use client";

import { useEffect, useRef, useState } from "react";

export type InViewOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
};

export function useInView<T extends HTMLElement = HTMLElement>(
  { root = null, rootMargin = "0px 0px -10% 0px", threshold = 0.2, once = true }: InViewOptions = {}
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setInView(false);
        }
      },
      { root, rootMargin, threshold }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold, once]);

  return { ref, inView } as const;
}



"use client";

import React from "react";
import { cn } from "@/lib/cn";

type AutoSliderProps = {
  children: React.ReactNode;
  intervalMs?: number; // default 6000
  ariaLabel?: string;
  className?: string;
};

export function AutoSlider({ children, intervalMs = 6000, ariaLabel = "슬라이더", className }: AutoSliderProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = React.useState(0);
  const count = React.Children.count(children);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // auto advance
  React.useEffect(() => {
    if (!containerRef.current) return;
    if (reduceMotion || count <= 1) return;
    let paused = false;
    const node = containerRef.current;

    const onMouseEnter = () => { paused = true; };
    const onMouseLeave = () => { paused = false; };
    const onFocusIn = () => { paused = true; };
    const onFocusOut = () => { paused = false; };
    node.addEventListener("mouseenter", onMouseEnter);
    node.addEventListener("mouseleave", onMouseLeave);
    node.addEventListener("focusin", onFocusIn);
    node.addEventListener("focusout", onFocusOut);

    const id = window.setInterval(() => {
      if (paused) return;
      const next = (index + 1) % count;
      const slide = node.children.item(next) as HTMLElement | null;
      slide?.scrollIntoView({ behavior: "smooth", inline: "start" });
      setIndex(next);
    }, intervalMs);

    return () => {
      window.clearInterval(id);
      node.removeEventListener("mouseenter", onMouseEnter);
      node.removeEventListener("mouseleave", onMouseLeave);
      node.removeEventListener("focusin", onFocusIn);
      node.removeEventListener("focusout", onFocusOut);
    };
  }, [index, count, intervalMs, reduceMotion]);

  // sync index on manual scroll
  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const handler = () => {
      const childrenArray = Array.from(node.children) as HTMLElement[];
      let nearest = 0;
      let min = Number.POSITIVE_INFINITY;
      for (let i = 0; i < childrenArray.length; i += 1) {
        const rect = childrenArray[i].getBoundingClientRect();
        const diff = Math.abs(rect.left - node.getBoundingClientRect().left);
        if (diff < min) {
          min = diff;
          nearest = i;
        }
      }
      setIndex(nearest);
    };
    node.addEventListener("scroll", handler, { passive: true });
    return () => node.removeEventListener("scroll", handler);
  }, []);

  return (
    <section aria-label={ariaLabel} className={className}>
      <div
        ref={containerRef}
        className={cn(
          "flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-p-4", // layout
          "px-4",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {React.Children.map(children, (child, i) => (
          <div
            key={i}
            className={cn(
              "snap-start shrink-0 w-[85%] sm:w-[48%] lg:w-[31%]",
              "scroll-mx-4"
            )}
          >
            {child}
          </div>
        ))}
      </div>
      {count > 1 && (
        <div className="hidden sm:flex justify-center gap-2 mt-4" aria-hidden>
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 w-2 rounded-full",
                i === index ? "bg-[color:var(--color-lbd-navy)]" : "bg-[color:var(--color-gray-300)]"
              )}
            />)
          )}
        </div>
      )}
    </section>
  );
}



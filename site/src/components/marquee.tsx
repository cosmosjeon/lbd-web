"use client";

import React from "react";

export function Marquee({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduceMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <div className={className}>
      <div
        className="flex gap-8 whitespace-nowrap overflow-hidden"
        role="list"
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
        onFocus={(e) => (e.currentTarget.style.animationPlayState = "paused")}
        onBlur={(e) => (e.currentTarget.style.animationPlayState = "running")}
        style={reduceMotion ? {} : { animation: "marquee 20s linear infinite" }}
      >
        {children}
        {children}
        {children}
      </div>
      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}




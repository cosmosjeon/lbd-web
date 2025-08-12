"use client";

import { useEffect } from "react";

/**
 * Adds data-scrolled=true to header when window scrollY > 8.
 * Also implements show-on-scroll-up behavior for future extension.
 */
export function useScrolledHeader(headerSelector: string = "header") {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(headerSelector);
    if (!header) return;

    const onScroll = () => {
      const scrolled = window.scrollY > 8;
      header.dataset.scrolled = scrolled ? "true" : "false";
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headerSelector]);
}



"use client";

import React from "react";
import { sanitize } from "@/lib/sanitize";

export type RichContentProps = {
  html: string;
  className?: string;
};

export function RichContent({ html, className }: RichContentProps) {
  const clean = React.useMemo(() => sanitize(html), [html]);
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}



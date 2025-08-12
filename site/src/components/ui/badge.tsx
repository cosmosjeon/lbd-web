import React from "react";
import { cn } from "@/lib/cn";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "cohort" | "default";
};

export function Badge({ className, tone = "cohort", ...props }: BadgeProps) {
  const toneClass =
    tone === "cohort"
      ? "bg-[color:var(--color-lbd-navy)] text-white"
      : "bg-[color:var(--color-gray-100)] text-[color:var(--color-gray-800)]";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[6px] px-2 py-0.5 text-xs font-medium",
        toneClass,
        className
      )}
      {...props}
    />
  );
}



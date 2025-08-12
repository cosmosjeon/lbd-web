import React from "react";
import { cn } from "@/lib/cn";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] bg-white shadow-md p-4 transition will-change-transform duration-[var(--duration-fast)] hover:shadow-lg hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}



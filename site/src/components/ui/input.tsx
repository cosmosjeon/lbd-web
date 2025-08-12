import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-[10px] border border-[color:var(--color-gray-300)] bg-white px-3 text-[color:var(--color-lbd-navy)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-lbd-orange)] focus-visible:ring-offset-2",
        "placeholder:text-[color:var(--color-gray-400)]",
        className
      )}
      {...props}
    />
  );
});



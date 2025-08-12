import React from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "destructive";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--color-lbd-orange)] text-white hover:translate-y-[-1px] active:translate-y-0 transition-transform duration-[var(--duration-ultra-fast)] hover:[--tw-bg-opacity:1] disabled:opacity-60 disabled:cursor-not-allowed",
  secondary:
    "border border-[color:var(--color-gray-300)] text-[color:var(--color-lbd-navy)] bg-transparent hover:bg-[color:var(--color-gray-50)]",
  destructive: "bg-[color:var(--color-danger)] text-white hover:bg-[#b91c1c]",
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center h-10 px-5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variantClasses[variant],
        className
      )}
    />
  );
}



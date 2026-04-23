import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-accent-500 text-surface-950 hover:bg-accent-400 focus-visible:outline-accent-400",
  secondary:
    "bg-surface-700 text-surface-300 hover:bg-surface-600 focus-visible:outline-surface-500",
  ghost:
    "bg-transparent text-surface-400 hover:bg-surface-800 hover:text-surface-300 focus-visible:outline-surface-500",
  danger:
    "bg-red-500/15 text-red-200 hover:bg-red-500/25 focus-visible:outline-red-400",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
});

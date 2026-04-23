import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/6 bg-surface-900/80 shadow-soft backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

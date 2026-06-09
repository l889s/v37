import { cn } from "@/lib/utils";
import type { Accent } from "@/lib/types";

type Variant = Accent | "neutral";

const styles: Record<Variant, string> = {
  coral:   "bg-coral-soft text-coral",
  violet:  "bg-violet-soft text-violet",
  mint:    "bg-mint-soft text-mint",
  neutral: "bg-[#F7F7F7] text-[#666]",
};

export function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2.5 py-1 text-[11px] font-bold whitespace-nowrap",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

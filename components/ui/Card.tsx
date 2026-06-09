import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-line p-5 sm:p-6 shadow-cardSoft transition-all duration-200 hover:shadow-cardSoftHover hover:-translate-y-0.5",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

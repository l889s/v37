"use client";

import { cn } from "@/lib/utils";

/**
 * مكوّن skeleton أساسي — صندوق رمادي فاتح مع animate-pulse
 * يُستخدم كـbuilding block لبناء skeletons أكثر تعقيداً
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-[#F0F0F0]", className)}
      {...props}
    />
  );
}

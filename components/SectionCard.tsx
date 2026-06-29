"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { Section, Accent } from "@/lib/types";

const accentSolid: Record<Accent, string> = {
  coral: "bg-coral", violet: "bg-violet", mint: "bg-mint", sky: "bg-sky", amber: "bg-amber",
};
const accentGlow: Record<Accent, string> = {
  coral: "shadow-[0_4px_12px_rgba(255,77,79,0.30)]",
  violet: "shadow-[0_4px_12px_rgba(124,92,252,0.30)]",
  mint: "shadow-[0_4px_12px_rgba(17,168,142,0.30)]",
  sky: "shadow-[0_4px_12px_rgba(47,143,224,0.30)]",
  amber: "shadow-[0_4px_12px_rgba(224,138,30,0.30)]",
};
const accentSoft: Record<Accent, string> = {
  coral: "bg-coral/10 text-coral",
  violet: "bg-violet/10 text-violet",
  mint: "bg-mint/10 text-mint",
  sky: "bg-sky/10 text-sky",
  amber: "bg-amber/10 text-amber",
};
function isCnChar(s: string): boolean {
  return /[\u4e00-\u9fff]/.test(s);
}

export function SectionCard({ section }: { section: Section }) {
  const router = useRouter();
  const { href, emoji, accent, title, sub, count, unit } = section;
  const cn_char = isCnChar(emoji);
  const hasCount = Boolean(count && unit);

  return (
    <Card
      onClick={() => router.push(href)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push(href); }
      }}
      aria-label={title}
    >
      {/* RICH: أيقونة 52px + badge كمية صغير */}
      <div className="flex min-h-[64px] items-center gap-3.5 px-1 py-1">
        <div
          className={cn(
            "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl text-white",
            accentSolid[accent], accentGlow[accent],
            cn_char ? "font-cn text-[28px] font-black" : "text-[28px]"
          )}
        >
          <span>{emoji}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold leading-tight text-ink">{title}</h3>
            {hasCount && (
              <span className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold",
                accentSoft[accent]
              )}>
                {count} {unit}
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-1 text-[13px] leading-relaxed text-muted">{sub}</p>
        </div>
        <ChevronLeft className="h-5 w-5 shrink-0 text-[#CBCBCB]" />
      </div>
    </Card>
  );
}

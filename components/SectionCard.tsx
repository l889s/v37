"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { Section, Accent } from "@/lib/types";

// لون الأيقونة الممتلئ + توهّج الظل لكل accent
const accentSolid: Record<Accent, string> = {
  coral: "bg-coral",
  violet: "bg-violet",
  mint: "bg-mint",
};

const accentGlow: Record<Accent, string> = {
  coral: "shadow-[0_6px_16px_rgba(255,77,79,0.32)]",
  violet: "shadow-[0_6px_16px_rgba(124,92,252,0.32)]",
  mint: "shadow-[0_6px_16px_rgba(17,168,142,0.32)]",
};

// هل الإيموجي حرف صيني (يحتاج خط Noto SC)؟
function isCnChar(s: string): boolean {
  return /[\u4e00-\u9fff]/.test(s);
}

export function SectionCard({ section }: { section: Section }) {
  const router = useRouter();
  const { href, emoji, accent, title, sub } = section;
  const cn_char = isCnChar(emoji);

  return (
    <Card
      onClick={() => router.push(href)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(href);
        }
      }}
      aria-label={title}
    >
      <div className="flex items-center gap-4">
        {/* الأيقونة الملوّنة الممتلئة */}
        <div
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white",
            accentSolid[accent],
            accentGlow[accent],
            cn_char ? "font-cn text-3xl font-black" : "text-[32px]"
          )}
        >
          <span>{emoji}</span>
        </div>

        {/* النص */}
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-extrabold leading-tight text-ink">{title}</h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{sub}</p>
        </div>

        {/* السهم */}
        <ChevronLeft className="h-6 w-6 shrink-0 text-[#CBCBCB]" />
      </div>
    </Card>
  );
}

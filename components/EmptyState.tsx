"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "neutral";

const TONE_STYLES: Record<Tone, { iconBg: string; iconText: string }> = {
  info:    { iconBg: "bg-violet-soft", iconText: "text-violet" },
  success: { iconBg: "bg-mint-soft",   iconText: "text-mint-deep" },
  warning: { iconBg: "bg-amber-50",    iconText: "text-amber-700" },
  neutral: { iconBg: "bg-[#F7F7F7]",   iconText: "text-muted" },
};

export type EmptyStateAction = {
  label: string;
  href?: string;          // لو رابط (Link)
  onClick?: () => void;   // لو زر
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  tone = "neutral",
  size = "md",
}: {
  /** ايموجي أو رمز قصير (سيظهر بحجم 32px) */
  icon: string;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  tone?: Tone;
  /** sm للأماكن الضيقة (داخل tabs/cards)، md للشاشات الكاملة */
  size?: "sm" | "md";
}) {
  const t = TONE_STYLES[tone];
  const isCompact = size === "sm";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        isCompact ? "py-6 px-4" : "py-10 px-6"
      )}
    >
      {/* أيقونة في صندوق ملوّن خفيف */}
      <div
        className={cn(
          "mb-3 flex items-center justify-center rounded-lg",
          isCompact ? "h-12 w-12" : "h-14 w-14",
          t.iconBg
        )}
      >
        <span
          className={cn(
            "leading-none",
            isCompact ? "text-2xl" : "text-3xl"
          )}
        >
          {icon}
        </span>
      </div>

      {/* العنوان */}
      <h3
        className={cn(
          "font-extrabold text-ink",
          isCompact ? "text-[14px]" : "text-[15px]"
        )}
      >
        {title}
      </h3>

      {/* الوصف */}
      {description && (
        <p
          className={cn(
            "mt-1.5 max-w-xs text-muted leading-relaxed",
            isCompact ? "text-[11.5px]" : "text-[12.5px]"
          )}
        >
          {description}
        </p>
      )}

      {/* الزر الاختياري */}
      {action && (
        <div className="mt-4">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-[12px] font-bold text-white hover:bg-black"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-[12px] font-bold text-white hover:bg-black"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

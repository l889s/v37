"use client";

import { X, BookOpen, Headphones, Keyboard, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type PracticeMode = "normal" | "listening" | "typing";

const MODES: {
  key: PracticeMode;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accentBg: string;
  accentText: string;
}[] = [
  {
    key: "normal",
    icon: BookOpen,
    title: "عادي",
    description: "اقلب البطاقات وراجع — الوضع الكلاسيكي",
    accentBg: "bg-coral-soft",
    accentText: "text-coral",
  },
  {
    key: "listening",
    icon: Headphones,
    title: "استماع",
    description: "استمع للنطق واختر المعنى الصحيح من 4 خيارات",
    accentBg: "bg-mint-soft",
    accentText: "text-mint-deep",
  },
  {
    key: "typing",
    icon: Keyboard,
    title: "كتابة",
    description: "اكتب الحرف الصيني — يقبل الـpinyin أيضاً",
    accentBg: "bg-violet-soft",
    accentText: "text-violet",
  },
];

export function PracticeModeChooser({
  dueCount,
  onSelect,
  onClose,
}: {
  dueCount: number;
  onSelect: (mode: PracticeMode) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
    >
      {/* الرأس */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-muted hover:bg-[#F7F7F7]"
          aria-label="إغلاق"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-[13px] font-bold text-ink">اختيار الوضع</div>
        <div className="w-9" />
      </div>

      {/* المحتوى */}
      <div className="flex flex-1 flex-col justify-center px-5 py-8">
        <div className="mx-auto w-full max-w-md">
          <h2 className="mb-2 text-2xl font-extrabold text-ink">كيف تريد المراجعة؟</h2>
          <p className="mb-6 text-[13px] leading-relaxed text-muted">
            {dueCount} {dueCount === 1 ? "كلمة" : "كلمات"} جاهزة — اختر الأسلوب الذي يناسبك
          </p>

          <div className="space-y-3">
            {MODES.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.key}
                  onClick={() => onSelect(m.key)}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-lg border border-line bg-white p-4 text-right transition-all hover:border-[#D0D0D0] hover:shadow-card"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
                      m.accentBg
                    )}
                  >
                    <Icon className={cn("h-6 w-6", m.accentText)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-extrabold text-ink">{m.title}</div>
                    <div className="mt-0.5 text-[12px] leading-relaxed text-muted">
                      {m.description}
                    </div>
                  </div>
                  <ChevronLeft className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:-translate-x-0.5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

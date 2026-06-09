"use client";

import { Calendar, Sparkles } from "lucide-react";
import { daysBetween, type SrsCard } from "@/lib/spacedRepetition";

function dayPhrase(days: number): string {
  if (days <= 0) return "اليوم";
  if (days === 1) return "غداً";
  if (days === 2) return "بعد يومين";
  return `بعد ${days} يوم`;
}

function lastReviewPhrase(days: number): string {
  if (days === 0) return "اليوم";
  if (days === 1) return "أمس";
  if (days === 2) return "قبل يومين";
  return `قبل ${days} يوم`;
}

/**
 * شريط معلومات يظهر فوق البطاقة في وضع SRS فقط.
 * يعرض:
 *  - متى آخر مراجعة (أو "كلمة جديدة" لو ما تراجعت)
 *  - متى المراجعة القادمة المتوقعة لو ضغط "جيدة"
 */
export function ReviewContext({
  card,
  goodInterval,
}: {
  card: SrsCard;
  /** الـinterval لو ضغط "جيدة" — نحسبه في المكوّن الأب */
  goodInterval: number;
}) {
  const isNew = card.lastReviewed === null;

  if (isNew) {
    return (
      <div className="mx-auto mb-3 w-full max-w-md rounded-lg border border-mint/20 bg-mint-soft/50 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-mint">
          <Sparkles className="h-4 w-4" />
          كلمة جديدة — لم تراجعها من قبل
        </div>
      </div>
    );
  }

  const sinceLast = daysBetween(card.lastReviewed!);
  return (
    <div className="mx-auto mb-3 w-full max-w-md rounded-lg border border-[#E8E8E8] bg-[#FAFAFA] px-4 py-2.5">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7280]">
        <Calendar className="h-4 w-4 shrink-0" />
        <span>آخر مراجعة: {lastReviewPhrase(sinceLast)}</span>
      </div>
      <div className="mt-1 text-[11px] leading-relaxed text-muted">
        لو ضغطت <span className="font-bold text-mint">جيدة</span> الآن، ستعود{" "}
        <span className="font-bold text-ink">{dayPhrase(goodInterval)}</span>
      </div>
    </div>
  );
}

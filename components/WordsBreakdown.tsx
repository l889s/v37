"use client";

import { useState } from "react";
import { BookOpen, Award, AlertTriangle, PieChart, BarChart3 } from "lucide-react";
import { categorize, type SrsCard, type Rating } from "@/lib/spacedRepetition";
import type { Classifier } from "@/lib/types";
import { EmptyState } from "@/components/EmptyState";
import { RatingsDonut } from "@/components/RatingsDonut";
import { cn } from "@/lib/utils";

type Tab = "distribution" | "mastered" | "forgotten" | "performance";

function findClassifier(id: string, all: Classifier[]): Classifier | undefined {
  return all.find((c) => c.id === id);
}

/* ============ صف كلمة ============ */
function WordRow({
  rank,
  cls,
  rightLabel,
  accent,
}: {
  rank: number;
  cls: Classifier;
  rightLabel: string;
  accent: "violet" | "coral";
}) {
  const colors = {
    violet: { text: "text-violet", bg: "bg-violet-soft" },
    coral: { text: "text-coral", bg: "bg-coral-soft" },
  }[accent];

  return (
    // ← bg-white بدل #FAFAFA (يطفو على الخلفية البيضاء بالـborder الناعم)
    <li className="flex items-center gap-3 rounded-lg border border-line bg-white p-3 transition-colors hover:border-line/60">
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-extrabold tabular-nums",
          colors.bg,
          colors.text
        )}
      >
        {rank}
      </div>
      <div className="font-cn text-2xl font-bold text-ink shrink-0" dir="ltr">
        {cls.char}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] italic text-muted" dir="ltr">
            {cls.pinyin}
          </span>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[9px] font-bold",
              colors.bg,
              colors.text
            )}
          >
            HSK {cls.hsk}
          </span>
        </div>
        <div className="truncate text-[13px] font-bold text-ink leading-snug">{cls.ar}</div>
      </div>
      <div
        className={cn(
          "shrink-0 text-left text-[11px] font-extrabold tabular-nums",
          colors.text
        )}
      >
        {rightLabel}
      </div>
    </li>
  );
}

/* ============ Tab "التوزيع" ============ */
function DistributionContent({
  cards,
  classifierIdsByHsk,
}: {
  cards: Record<string, SrsCard>;
  classifierIdsByHsk: Record<number, string[]>;
}) {
  let n = 0, l = 0, r = 0;
  for (const c of Object.values(cards)) {
    const cat = categorize(c);
    if (cat === "new") n++;
    else if (cat === "learning") l++;
    else r++;
  }
  const total = n + l + r;
  const pct = (x: number) => (total > 0 ? (x / total) * 100 : 0);

  return (
    <div>
      {/* الشريط المكدّس */}
      <div className="mb-3.5 flex h-3 overflow-hidden rounded-full bg-[#F0F0F0]">
        {n > 0 && <div className="h-full bg-mint transition-all" style={{ width: `${pct(n)}%` }} />}
        {l > 0 && <div className="h-full bg-amber-500 transition-all" style={{ width: `${pct(l)}%` }} />}
        {r > 0 && <div className="h-full bg-violet transition-all" style={{ width: `${pct(r)}%` }} />}
      </div>

      {/* المفتاح — ألوان رفعت تباينها */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
        {[
          { k: "new",      label: "جديدة",  value: n, color: "text-mint-deep", dot: "bg-mint" },
          { k: "learning", label: "تعلّم",  value: l, color: "text-amber-700", dot: "bg-amber-500" },
          { k: "review",   label: "مراجعة", value: r, color: "text-violet",    dot: "bg-violet" },
        ].map((it) => (
          <div key={it.k} className="flex items-center gap-1.5">
            <span className={cn("h-2.5 w-2.5 rounded-full", it.dot)} />
            <span className="font-semibold text-muted">{it.label}</span>
            <span className={cn("font-extrabold", it.color)}>{it.value}</span>
          </div>
        ))}
      </div>

      {/* حسب HSK */}
      <div className="mt-6 space-y-3 border-t border-line pt-5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted">حسب مستوى HSK</div>
        {Object.entries(classifierIdsByHsk)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([hsk, ids]) => {
            const reviewed = ids.filter((id) => cards[id]?.lastReviewed !== null).length;
            const totalLv = ids.length;
            const pctLv = totalLv > 0 ? Math.round((reviewed / totalLv) * 100) : 0;
            return (
              <div key={hsk}>
                <div className="mb-1.5 flex items-center justify-between text-[13px]">
                  <span className="font-bold text-ink">HSK {hsk}</span>
                  <span className="font-semibold text-muted tabular-nums" dir="ltr">
                    {reviewed} / {totalLv}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#F0F0F0]">
                  <div
                    className="h-full bg-violet transition-all duration-500"
                    style={{ width: `${pctLv}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

/* ============ المكوّن الرئيسي ============ */
export function WordsBreakdown({
  cards,
  topMastered,
  topForgotten,
  classifiers,
  classifierIdsByHsk,
  ratingTotals,
}: {
  cards: Record<string, SrsCard>;
  topMastered: SrsCard[];
  topForgotten: SrsCard[];
  classifiers: Classifier[];
  classifierIdsByHsk: Record<number, string[]>;
  ratingTotals: Record<Rating, number>;
}) {
  const [tab, setTab] = useState<Tab>("distribution");

  const totalRatings =
    (ratingTotals.again ?? 0) +
    (ratingTotals.hard ?? 0) +
    (ratingTotals.good ?? 0) +
    (ratingTotals.easy ?? 0);

  const tabs: {
    key: Tab;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    count: number;
    activeColor: string;
    activeBg: string;
  }[] = [
    {
      key: "distribution",
      icon: PieChart,
      label: "التوزيع",
      count: Object.keys(cards).length,
      activeColor: "text-ink",
      activeBg: "bg-white",
    },
    {
      key: "performance",
      icon: BarChart3,
      label: "أداؤك",
      count: totalRatings,
      activeColor: "text-mint-deep",
      activeBg: "bg-white",
    },
    {
      key: "mastered",
      icon: Award,
      label: "الأقوى",
      count: topMastered.length,
      activeColor: "text-violet",
      activeBg: "bg-white",
    },
    {
      key: "forgotten",
      icon: AlertTriangle,
      label: "تحتاج",
      count: topForgotten.length,
      activeColor: "text-coral",
      activeBg: "bg-white",
    },
  ];

  return (
    <section className="mb-8">
      {/* العنوان: مسافة mb-4 ثابتة */}
      <h2 className="mb-4 flex items-center gap-2 px-1 text-[15px] font-extrabold text-ink">
        <BookOpen className="h-5 w-5 text-ink" />
        كلماتك
      </h2>

      {/* الكرت — 8px radius + border ناعم بدل ظل */}
      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-card">
        {/* Tabs — padding أكبر + ring بدل ظل */}
        <div className="grid grid-cols-4 gap-1 bg-[#F7F7F7] p-1.5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 rounded py-2.5 px-1 text-[11.5px] font-bold transition-all",
                  isActive
                    ? cn(t.activeBg, t.activeColor, "ring-1 ring-black/5 shadow-sm")
                    : "text-muted hover:bg-white/60"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap leading-tight">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* المحتوى — padding p-5 = 20px موحّد */}
        <div className="p-5">
          {tab === "distribution" && (
            <DistributionContent cards={cards} classifierIdsByHsk={classifierIdsByHsk} />
          )}

          {tab === "performance" && (
            <RatingsDonut ratingTotals={ratingTotals} />
          )}

          {tab === "mastered" &&
            (topMastered.length === 0 ? (
              <EmptyState
                icon="🌱"
                title="كلماتك القوية ستظهر هنا"
                description="استمر في مراجعة 3+ بطاقات لتبدأ كلماتك بالظهور في هذه القائمة"
                action={{ label: "ابدأ التمرين", href: "/classifiers" }}
                tone="success"
                size="sm"
              />
            ) : (
              <ul className="space-y-2.5">
                {topMastered.map((card, i) => {
                  const cls = findClassifier(card.id, classifiers);
                  if (!cls) return null;
                  return (
                    <WordRow
                      key={card.id}
                      rank={i + 1}
                      cls={cls}
                      accent="violet"
                      rightLabel={
                        card.interval >= 30
                          ? `${Math.round(card.interval / 30)} شهر`
                          : `${card.interval} يوم`
                      }
                    />
                  );
                })}
              </ul>
            ))}

          {tab === "forgotten" &&
            (topForgotten.length === 0 ? (
              <EmptyState
                icon="✨"
                title="ذاكرتك ممتازة!"
                description="لم تنسَ أي كلمة بعد. استمر بالمراجعة المنتظمة للحفاظ على هذا المستوى."
                tone="success"
                size="sm"
              />
            ) : (
              <ul className="space-y-2.5">
                {topForgotten.map((card, i) => {
                  const cls = findClassifier(card.id, classifiers);
                  if (!cls) return null;
                  return (
                    <WordRow
                      key={card.id}
                      rank={i + 1}
                      cls={cls}
                      accent="coral"
                      rightLabel={`نسيت ${card.lapses}×`}
                    />
                  );
                })}
              </ul>
            ))}
        </div>
      </div>
    </section>
  );
}

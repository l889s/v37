"use client";

import { Activity } from "lucide-react";
import { todayISO, addDaysISO } from "@/lib/spacedRepetition";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";

const AR_DAYS = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

export function WeeklyActivity({
  history,
}: {
  history: Record<string, number>;
}) {
  const today = todayISO();
  const days: { date: string; label: string; count: number; isToday: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = addDaysISO(today, -i);
    const dayOfWeek = new Date(date + "T00:00:00Z").getUTCDay();
    days.push({
      date,
      label: AR_DAYS[dayOfWeek],
      count: history[date] ?? 0,
      isToday: i === 0,
    });
  }

  const max = Math.max(...days.map((d) => d.count), 1);
  const total = days.reduce((s, d) => s + d.count, 0);

  return (
    <section className="mb-8">
      <h2 className="mb-4 flex items-center gap-2 px-1 text-[15px] font-extrabold text-ink">
        <Activity className="h-5 w-5 text-amber-600" />
        نشاط الأسبوع
      </h2>

      {/* border + shadow-card = lift أنعم على الأبيض */}
      <div className="rounded-lg border border-line bg-white p-5 shadow-card">
        {/* لو لا يوجد نشاط على الإطلاق هذا الأسبوع → Empty State */}
        {total === 0 ? (
          <EmptyState
            icon="📊"
            title="إحصاءاتك ستظهر هنا"
            description="ابدأ جلسة مراجعة لتبدأ بتتبّع نشاطك اليومي خلال الأسبوع"
            action={{ label: "ابدأ جلسة", href: "/classifiers" }}
            tone="warning"
            size="sm"
          />
        ) : (
          <>
            {/* المجموع */}
            <div className="mb-5 flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-black text-ink tabular-nums leading-none">{total}</div>
                <div className="mt-1.5 text-[11px] font-semibold text-muted">مراجعة هذا الأسبوع</div>
              </div>
              <div className="text-[11px] font-semibold text-muted">
                متوسط: <span className="font-extrabold text-ink">{Math.round(total / 7)}</span>/يوم
              </div>
            </div>

            {/* الأعمدة */}
            <div className="flex items-end justify-between gap-2" style={{ height: 110 }}>
              {days.map((d) => {
                const heightPct = d.count > 0 ? Math.max(8, (d.count / max) * 100) : 4;
                return (
                  <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className={cn(
                        "text-[10px] font-extrabold tabular-nums",
                        d.count === 0 ? "text-[#D0D0D0]" : d.isToday ? "text-coral" : "text-ink"
                      )}
                    >
                      {d.count > 0 ? d.count : "·"}
                    </div>
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className={cn(
                          "w-full rounded-lg transition-all duration-500",
                          d.count === 0
                            ? "bg-[#F0F0F0]"
                            : d.isToday
                            ? "bg-gradient-to-t from-coral to-amber-400 shadow-coral/40"
                            : "bg-amber-300"
                        )}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <div
                      className={cn(
                        "text-[10px] font-extrabold",
                        d.isToday ? "text-coral" : "text-muted"
                      )}
                    >
                      {d.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

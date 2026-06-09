"use client";

import { TrendingUp } from "lucide-react";
import { useFavorites, useProgress } from "@/lib/storage";
import { cn } from "@/lib/utils";

const TOTAL_CLASSIFIERS = 33;

export function ProgressWidget() {
  const { count: favCount, ready: favReady } = useFavorites();
  const { progress, ready } = useProgress();

  if (!ready || !favReady) {
    return <div className="h-[88px]" aria-hidden />;
  }

  const practiced = progress.hsk["classifiers_practiced"] ?? 0;
  const favPct = Math.round((favCount / TOTAL_CLASSIFIERS) * 100);

  const items = [
    {
      label: "مصنِّفات محفوظة",
      value: `${favCount} / ${TOTAL_CLASSIFIERS}`,
      pct: favPct,
      color: "bg-coral",
      soft: "bg-coral-soft",
      text: "text-coral",
    },
    {
      label: "بطاقات راجعتها",
      value: practiced.toLocaleString("en-US"),
      pct: Math.min(100, Math.round((practiced / 50) * 100)),
      color: "bg-mint",
      soft: "bg-mint-soft",
      text: "text-mint",
    },
  ];

  return (
    <div className="mx-auto mb-4 grid max-w-2xl grid-cols-2 gap-3 px-4 sm:px-5">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-lg border border-[#F0F0F0] bg-white p-3.5 shadow-card"
        >
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <TrendingUp className={cn("h-3 w-3", it.text)} />
            {it.label}
          </div>
          <div className={cn("mb-1.5 text-lg font-extrabold", it.text)}>
            {it.value}
          </div>
          <div className={cn("h-1.5 overflow-hidden rounded-full", it.soft)}>
            <div
              className={cn("h-full transition-all duration-500", it.color)}
              style={{ width: `${it.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

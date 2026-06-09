"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getHskSystems, getAllWordIds } from "@/lib/data";
import { useSrs } from "@/lib/spacedRepetition";
import { LevelCard } from "@/components/LevelCard";
import { HskLevelsSkeleton } from "@/components/HskLevelsSkeleton";
import { cn } from "@/lib/utils";

type SystemKey = "2" | "3";

export function HskLevelsClient() {
  const systems = getHskSystems();
  const searchParams = useSearchParams();
  const router = useRouter();

  // النظام النشط من URL (افتراضي: 2)
  const urlSystem = searchParams.get("system");
  const initialSystem: SystemKey = urlSystem === "3" ? "3" : "2";
  const [activeSystem, setActiveSystem] = useState<SystemKey>(initialSystem);

  // sync URL لو تغيّر التبويب
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeSystem === "2") {
      params.delete("system");
    } else {
      params.set("system", activeSystem);
    }
    const qs = params.toString();
    const url = qs ? `/hsk-levels?${qs}` : "/hsk-levels";
    router.replace(url, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSystem]);

  // كل ids الكلمات لـSRS
  const allIds = useMemo(() => getAllWordIds(), []);
  const { ready, state: srsState } = useSrs(allIds);

  if (!ready) {
    return <HskLevelsSkeleton />;
  }

  const sys2 = systems["2"];
  const sys3 = systems["3"];
  const activeLevels = systems[activeSystem].levels;

  // المجاميع لكل نظام
  const total2 = sys2.levels.reduce((s, l) => s + l.count, 0);
  const total3 = sys3.levels.reduce((s, l) => s + l.count, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-5">
      {/* Tabs */}
      <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-lg border border-line bg-[#F7F7F7] p-1.5">
        <TabButton
          active={activeSystem === "2"}
          onClick={() => setActiveSystem("2")}
          title="HSK 2.0"
          subtitle={`${total2.toLocaleString("en-US")} كلمة`}
          accentColor="#FF4D4F"
          accentBg="bg-coral-soft"
        />
        <TabButton
          active={activeSystem === "3"}
          onClick={() => setActiveSystem("3")}
          title="HSK 3.0"
          subtitle={`${total3.toLocaleString("en-US")} كلمة`}
          accentColor="#11A88E"
          accentBg="bg-mint-soft"
        />
      </div>

      {/* وصف النظام */}
      <div className="mb-6 text-[12px] leading-relaxed text-muted">
        <span className="font-bold text-ink">{systems[activeSystem].name}</span>
        {" — "}
        <span>{systems[activeSystem].subtitle}</span>
        {" · "}
        <span>{activeLevels.length} مستويات</span>
      </div>

      {/* قائمة المستويات */}
      <div className="mb-8 space-y-3">
        {activeLevels.map((level) => (
          <LevelCard key={level.id} level={level} cards={srsState.cards} />
        ))}
      </div>

      {/* ملاحظة التغطية */}
      <div className="mb-8 rounded-lg border border-line bg-[#FAFAFA] p-3">
        <p className="text-[11px] leading-relaxed text-muted">
          التطبيق يغطي حالياً جزءاً من كلمات منهج HSK وسيتم تحديثه تدريجياً.
          يمكنك البدء بالكلمات المتاحة الآن.
        </p>
      </div>
    </div>
  );
}

/* ============ زر التبويب ============ */
function TabButton({
  active,
  onClick,
  title,
  subtitle,
  accentColor,
  accentBg,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  accentColor: string;
  accentBg: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-3 transition-all",
        active
          ? cn(accentBg, "ring-1 ring-black/5 shadow-sm")
          : "text-muted hover:bg-white/60"
      )}
      style={active ? { color: accentColor } : undefined}
    >
      <span className="text-[15px] font-extrabold">{title}</span>
      <span
        className={cn(
          "text-[10px] font-bold tabular-nums",
          active ? "" : "text-muted"
        )}
      >
        {subtitle}
      </span>
    </button>
  );
}

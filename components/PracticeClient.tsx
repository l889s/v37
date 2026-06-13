"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ClassifierFlashcards } from "@/components/ClassifierFlashcards";
import type { Classifier, Word } from "@/lib/types";

/** تحويل Word → Classifier عشان يشتغل مع ClassifierFlashcards */
function wordToClassifier(w: Word, levelId: string, idx: number): Classifier {
  // استخرج رقم HSK من levelId
  const hskNum = levelId.startsWith("n") ? 7 :
    levelId === "hsk1-2" ? 1 :
    levelId === "hsk3" ? 3 :
    levelId === "hsk4" ? 4 :
    levelId === "hsk5" ? 5 : 6;

  return {
    id: `${levelId}_${idx}_${w.w}`,
    char: w.w,
    pinyin: w.p,
    ar: w.m,
    hsk: hskNum,
    usage: w.s || "",   // الجملة الصينية كـ usage
    examples: w.s ? [
      {
        zh: w.s,
        ar: w.sa || "",
      }
    ] : [],
  };
}

type PracticeLevel = {
  id: string;
  label: string;
  badge: string;
  emoji: string;
  count: number;
};

export function PracticeClient({
  levels,
  wordsByLevel,
}: {
  levels: PracticeLevel[];
  wordsByLevel: Record<string, Word[]>;
}) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showFlashcards, setShowFlashcards] = useState(false);

  // الكلمات المحوّلة للمستوى المختار
  const flashcardItems: Classifier[] = selectedLevel
    ? (wordsByLevel[selectedLevel] ?? []).map((w, i) =>
        wordToClassifier(w, selectedLevel, i)
      )
    : [];

  // فتح الـ Flashcards
  function startPractice(levelId: string) {
    setSelectedLevel(levelId);
    setShowFlashcards(true);
  }

  // تقسيم المستويات لمجموعتين
  const hsk2Levels = levels.filter((l) => l.badge === "HSK 2.0");
  const hsk3Levels = levels.filter((l) => l.badge === "HSK 3.0");

  return (
    <>
      {/* ===== اختيار المستوى ===== */}
      <div className="mx-auto max-w-2xl px-4 sm:px-5">

        {/* HSK 2.0 */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-lg bg-coral-soft px-2.5 py-1 text-[11px] font-extrabold text-coral">
              HSK 2.0
            </span>
            <span className="text-[11px] text-muted">النظام القديم · HSK 1-6</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {hsk2Levels.map((lv) => (
              <LevelCard
                key={lv.id}
                level={lv}
                isSelected={selectedLevel === lv.id}
                onSelect={() => startPractice(lv.id)}
              />
            ))}
          </div>
        </div>

        {/* HSK 3.0 */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-lg bg-mint-soft px-2.5 py-1 text-[11px] font-extrabold text-mint-deep">
              HSK 3.0
            </span>
            <span className="text-[11px] text-muted">النظام الجديد · N1-N9</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {hsk3Levels.map((lv) => (
              <LevelCard
                key={lv.id}
                level={lv}
                isSelected={selectedLevel === lv.id}
                onSelect={() => startPractice(lv.id)}
              />
            ))}
          </div>
        </div>

        {/* تلميح */}
        <div className="rounded-lg border border-line bg-[#FAFAFA] px-4 py-3 text-center text-[12px] text-muted">
          💡 اختر مستوى لتبدأ مراجعة الكلمات بطريقة Flashcards
        </div>
      </div>

      {/* ===== Flashcards (تفتح فوق الشاشة) ===== */}
      {showFlashcards && flashcardItems.length > 0 && (
        <ClassifierFlashcards
          items={flashcardItems}
          onClose={() => setShowFlashcards(false)}
          mode="srs"
        />
      )}
    </>
  );
}

/* ============ بطاقة المستوى ============ */
function LevelCard({
  level,
  isSelected,
  onSelect,
}: {
  level: PracticeLevel;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isHsk2 = level.badge === "HSK 2.0";
  const accentColor = isHsk2 ? "text-coral" : "text-mint-deep";
  const accentBg   = isHsk2 ? "bg-coral-soft" : "bg-mint-soft";
  const borderColor = isHsk2 ? "border-coral/30" : "border-mint/30";

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex flex-col items-start gap-2 rounded-xl border bg-white p-4 text-right transition-all",
        "hover:shadow-sm active:scale-[0.98]",
        isSelected ? borderColor + " shadow-sm ring-2" : "border-line"
      )}
      style={isSelected ? {
        ringColor: isHsk2 ? "#FF4D4F33" : "#11A88E33"
      } : {}}
    >
      <div className="text-2xl">{level.emoji}</div>
      <div>
        <div className="text-[15px] font-extrabold text-ink">{level.label}</div>
        <div className={cn("mt-0.5 text-[11px] font-bold tabular-nums", accentColor)}>
          {level.count.toLocaleString()} كلمة
        </div>
      </div>
      <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-extrabold", accentBg, accentColor)}>
        {level.badge}
      </span>
    </button>
  );
}

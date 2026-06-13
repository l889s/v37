"use client";

import { useMemo, useState } from "react";
import { Search, X as XIcon, ChevronDown, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import { useSpeech } from "@/lib/useSpeech";
import { EmptyState } from "@/components/EmptyState";
import { getHskColor, getHskTextColor, getHskHeaderColor } from "@/lib/hskColors";
import type { GrammarRule, GrammarLevel } from "@/lib/types";

function hskLabel(level: number): string {
  return level === 789 ? "HSK 7-9" : `HSK ${level}`;
}

export function GrammarClient({ levels }: { levels: GrammarLevel[] }) {
  const [query, setQuery] = useState("");
  const [hskFilter, setHskFilter] = useState<number | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const { speak } = useSpeech();
  const { toast } = useToast();

  // المستويات بعد الفلترة
  const filteredLevels = useMemo(() => {
    const q = query.trim().toLowerCase();
    return levels
      .filter((lvl) => hskFilter === null || lvl.level === hskFilter)
      .map((lvl) => ({
        ...lvl,
        rules: lvl.rules.filter((r) => {
          if (!q) return true;
          return (
            r.pattern.includes(q) ||
            r.pinyin.toLowerCase().includes(q) ||
            r.ar.includes(q) ||
            r.usage.includes(q) ||
            (r.nickname?.includes(q) ?? false) ||
            (r.meaning?.includes(q) ?? false)
          );
        }),
      }));
  }, [levels, query, hskFilter]);

  const visibleCount = useMemo(
    () => filteredLevels.reduce((sum, l) => sum + l.rules.length, 0),
    [filteredLevels]
  );

  function speakSafe(text: string) {
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      toast("النطق غير مدعوم على هذا الجهاز", "info");
      return;
    }
    speak(text);
  }

  const filterLevels = [1, 2, 3, 4, 5, 6, 789];

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-5">
      {/* ===== شريط البحث + الفلتر ===== */}
      <div className="mb-6">
        {/* البحث */}
        <div className="relative mb-3">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالتركيب أو الـpinyin أو المعنى..."
            className="w-full rounded-lg border border-line bg-white py-3 pr-10 pl-3 text-[13px] outline-none transition-colors focus:border-coral"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:bg-[#F0F0F0]"
              aria-label="مسح البحث"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* فلتر HSK */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="me-1 text-[11px] font-bold text-muted">HSK:</span>
          <FilterChip active={hskFilter === null} onClick={() => setHskFilter(null)}>
            الكل
          </FilterChip>
          {filterLevels.map((n) => (
            <FilterChip
              key={n}
              active={hskFilter === n}
              onClick={() => setHskFilter(hskFilter === n ? null : n)}
              hskColor={n}
            >
              {n === 789 ? "HSK7-9" : `HSK${n}`}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* ===== المحتوى ===== */}
      {visibleCount === 0 && query ? (
        <EmptyState
          icon="🔍"
          title="لا توجد نتائج"
          description="جرّب تعديل البحث أو إزالة فلتر HSK"
          tone="info"
        />
      ) : (
        <div className="space-y-10">
          {filteredLevels.map((lvl) => {
            if (query && lvl.rules.length === 0) return null;
            return (
              <HskSection
                key={lvl.level}
                level={lvl}
                openId={openId}
                onToggle={(id) => setOpenId(openId === id ? null : id)}
                onSpeak={speakSafe}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============ HSK Section ============ */
function HskSection({
  level,
  openId,
  onToggle,
  onSpeak,
}: {
  level: GrammarLevel;
  openId: string | null;
  onToggle: (id: string) => void;
  onSpeak: (text: string) => void;
}) {
  const color = getHskColor(level.level);
  const textColor = getHskTextColor(level.level);
  const headerColor = getHskHeaderColor(level.level);
  const isEmpty = level.rules.length === 0;

  return (
    <section>
      {/* رأس القسم */}
      <header className="mb-4 px-1">
        <div className="flex items-baseline gap-2.5">
          <span
            className="rounded-lg px-3 py-1 text-[12px] font-extrabold ring-1"
            style={{
              background: color.soft,
              color: textColor,
              boxShadow: `inset 0 0 0 1px ${color.hex}33`,
            }}
          >
            {hskLabel(level.level)}
          </span>
          <span className="font-cn text-[11px] font-bold text-muted" dir="ltr">
            {level.cn}
          </span>
          <span className="ms-auto text-[11px] font-bold text-muted tabular-nums">
            {isEmpty ? `${level.count} قريباً` : `${level.rules.length} قاعدة`}
          </span>
        </div>
        <h2 className="mt-2 text-[15px] font-extrabold text-ink">{level.label}</h2>
        <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{level.desc}</p>
      </header>

      {/* المحتوى */}
      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-line bg-[#FAFAFA] px-4 py-8 text-center">
          <div className="mb-1.5 text-2xl">🌱</div>
          <div className="text-[13px] font-bold text-ink">قيد الإعداد</div>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
            نضيف قواعد هذا المستوى تدريجياً بنفس الجودة الاحترافية
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          {level.rules.map((r, i) => (
            <GrammarRow
              key={r.id}
              rule={r}
              charColor={textColor}
              accentSoft={color.soft}
              accentHex={color.hex}
              headerColor={headerColor}
              isLast={i === level.rules.length - 1}
              isOpen={openId === r.id}
              onToggle={() => onToggle(r.id)}
              onSpeak={onSpeak}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ============ Grammar Row (الصف الغني) ============ */
function GrammarRow({
  rule,
  charColor,
  accentSoft,
  accentHex,
  headerColor,
  isLast,
  isOpen,
  onToggle,
  onSpeak,
}: {
  rule: GrammarRule;
  charColor: string;
  accentSoft: string;
  accentHex: string;
  headerColor: string;
  isLast: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onSpeak: (text: string) => void;
}) {
  const r = rule;

  return (
    <div className={cn(!isLast && "border-b border-line")}>
      {/* الـsummary */}
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-right transition-colors"
        style={{
          background: isOpen ? headerColor : "transparent",
        }}
        aria-expanded={isOpen}
      >
        <div
          className="flex shrink-0 items-center justify-center rounded-lg font-cn font-bold text-[15px]"
          style={{
            minWidth: 52,
            paddingInline: 8,
            height: 52,
            color: charColor,
            background: isOpen ? "#FFFFFF" : accentSoft,
            boxShadow: isOpen
              ? `inset 0 0 0 1.5px ${accentHex}40, 0 2px 6px rgba(16,24,40,0.10)`
              : `inset 0 0 0 1px ${accentHex}22`,
          }}
          dir="ltr"
        >
          {r.pattern}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-extrabold text-ink">{r.ar}</span>
            <span className="text-[11.5px] italic text-muted" dir="ltr">
              {r.pinyin}
            </span>
          </div>
          {r.nickname ? (
            <span className="mt-1 inline-block rounded bg-violet-soft px-2 py-0.5 text-[10.5px] font-bold text-violet">
              {r.nickname}
            </span>
          ) : (
            <p className="mt-0.5 truncate text-[11.5px] text-muted">{r.usage}</p>
          )}
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* التفاصيل */}
      {isOpen && (
        <div
          className="px-4 py-5"
          style={{
            background: "#ECEEF1",
            borderTop: `4px solid ${accentHex}`,
            boxShadow: "inset 0 6px 10px -8px rgba(16,24,40,0.25)",
          }}
        >
          {/* المعنى */}
          {r.meaning && (
            <Section icon="📌" title="المعنى الأساسي">
              <p className="text-[12.5px] leading-relaxed text-ink">{r.meaning}</p>
            </Section>
          )}

          {/* الاستخدام */}
          <Section icon="🎯" title="الاستخدام">
            <p className="text-[12.5px] leading-loose text-ink">{r.usage}</p>
          </Section>

          {/* التركيب */}
          {r.structure && (
            <Section icon="📋" title="التركيب">
              <div
                className="rounded-lg border border-dashed border-violet/40 bg-white px-3 py-2.5"
                style={{
                  boxShadow:
                    "0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.06)",
                }}
              >
                <div
                  className="mb-1.5 text-center font-cn text-[15px] font-bold text-violet"
                  dir="ltr"
                >
                  {r.structure}
                </div>
                {r.structureExample && (
                  <div
                    className="text-center font-cn text-[13px] text-ink"
                    dir="ltr"
                  >
                    {r.structureExample}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* استماع للتركيب */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSpeak(r.pattern);
            }}
            className="mb-4 inline-flex items-center gap-1.5 rounded-lg bg-coral-soft px-3 py-1.5 text-[11.5px] font-bold text-coral hover:bg-coral hover:text-white"
          >
            <Volume2 className="h-3.5 w-3.5" />
            استمع لنطق التركيب
          </button>

          {/* أمثلة */}
          {r.examples.length > 0 && (
            <Section icon="✅" title={`أمثلة (${r.examples.length})`}>
              <ul className="space-y-2">
                {r.examples.map((ex, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg border border-line bg-white px-3 py-2.5"
                    style={{
                      boxShadow:
                        "0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.06)",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSpeak(ex.zh);
                      }}
                      className="mt-0.5 shrink-0 rounded p-1 text-coral hover:bg-coral-soft"
                      aria-label="استمع"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="font-cn text-[15px] font-bold text-ink" dir="ltr">
                        {ex.zh}
                      </div>
                      {ex.pinyin && (
                        <div className="mt-0.5 text-[11px] italic text-muted" dir="ltr">
                          {ex.pinyin}
                        </div>
                      )}
                      <div className="mt-0.5 text-[12px] font-semibold text-ink">
                        {ex.ar}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* ملاحظات مهمة */}
          {r.notes && r.notes.length > 0 && (
            <Section icon="💡" title="ملاحظات مهمة">
              <ul className="space-y-1.5">
                {r.notes.map((n, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2"
                  >
                    <span className="mt-0.5 shrink-0 text-[11px] text-amber-700">•</span>
                    <span className="text-[12px] leading-relaxed text-amber-700">{n}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* خطأ شائع */}
          {r.commonMistake && (
            <Section icon="⚠️" title="خطأ شائع للعرب">
              <div className="rounded-lg border border-coral/30 bg-coral-soft p-3">
                <div className="mb-2">
                  <span
                    className="font-cn text-[17px] font-bold text-coral line-through"
                    dir="ltr"
                  >
                    ❌ {r.commonMistake.wrong}
                  </span>
                </div>
                <div className="mb-2.5">
                  <span className="font-cn text-[17px] font-bold text-mint-deep" dir="ltr">
                    ✓ {r.commonMistake.right}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed text-ink">
                  {r.commonMistake.explanation}
                </p>
              </div>
            </Section>
          )}

          {/* المقارنة */}
          {r.comparison && r.comparison.length > 0 && (
            <Section icon="🔄" title="المقارنة مع تراكيب مشابهة">
              <ul className="space-y-1.5">
                {r.comparison.map((cmp, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg bg-violet-soft px-3 py-2.5"
                  >
                    <span
                      className="shrink-0 font-cn text-[14px] font-extrabold text-violet"
                      style={{ minWidth: 96 }}
                      dir="ltr"
                    >
                      {cmp.with}
                    </span>
                    <span className="text-[12px] leading-relaxed text-ink">{cmp.note}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

/* ============ Section helper ============ */
function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="text-[14px]">{icon}</span>
        <span className="text-[11px] font-extrabold uppercase tracking-wide text-ink">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ============ Filter Chip ============ */
function FilterChip({
  active,
  onClick,
  hskColor,
  children,
}: {
  active: boolean;
  onClick: () => void;
  hskColor?: number;
  children: React.ReactNode;
}) {
  const color = hskColor !== undefined ? getHskColor(hskColor) : null;
  const textColor = hskColor !== undefined ? getHskTextColor(hskColor) : null;

  if (active && color && textColor) {
    return (
      <button
        onClick={onClick}
        className="rounded-lg px-2.5 py-1.5 text-[10.5px] font-extrabold tabular-nums shadow-sm transition-all"
        style={{
          background: color.soft,
          color: textColor,
          boxShadow: `inset 0 0 0 1px ${color.hex}33`,
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg px-2.5 py-1.5 text-[10.5px] font-extrabold tabular-nums transition-all",
        active
          ? "bg-ink text-white shadow-sm"
          : "bg-[#F7F7F7] text-muted hover:bg-[#EEEEEE]"
      )}
    >
      {children}
    </button>
  );
}

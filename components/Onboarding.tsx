"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type SlideProps = {
  index: number;
  total: number;
};

/* ============ الشريحة 1: الترحيب ============ */
function WelcomeSlide({ index, total }: SlideProps) {
  return (
    <SlideShell
      emoji="👋"
      iconBg="bg-coral-soft"
      title="أهلاً بك في HSK!"
      description="تعلَّم آلاف كلمات HSK بأسلوب يناسب يومك المزدحم"
      index={index}
      total={total}
    >
      <FeatureList
        items={[
          { icon: "✓", text: "6,760 كلمة HSK 2.0" },
          { icon: "✓", text: "12,036 كلمة HSK 3.0" },
          { icon: "✓", text: "مراجعة ذكية + إنجازات" },
        ]}
        accentColor="text-coral"
        bg="bg-coral-soft"
      />
    </SlideShell>
  );
}

/* ============ الشريحة 2: SRS ============ */
function SrsSlide({ index, total }: SlideProps) {
  return (
    <SlideShell
      emoji="🧠"
      iconBg="bg-violet-soft"
      title="تعلَّم بذكاء، لا بجهد"
      description="راجع كل كلمة في الوقت المناسب — قبل أن تنساها بثوانٍ"
      index={index}
      total={total}
    >
      <div className="rounded-lg bg-violet-soft p-4">
        <ul className="space-y-2.5 text-[13px]">
          <RatingRow icon="✕" label="نسيتها" hint="اليوم" color="text-coral" />
          <RatingRow icon="⚠" label="صعبة" hint="قريباً" color="text-amber-700" />
          <RatingRow icon="✓" label="جيدة" hint="عادي" color="text-mint-deep" />
          <RatingRow icon="⭐" label="سهلة" hint="بعد أيام" color="text-violet" />
        </ul>
      </div>
      <p className="mt-4 flex items-center justify-center gap-3 text-[12px] font-semibold text-muted">
        <span className="flex items-center gap-1">
          <span>⏱</span> أقل وقت
        </span>
        <span className="text-line">•</span>
        <span className="flex items-center gap-1">
          <span>📈</span> ثبات أكبر
        </span>
      </p>
    </SlideShell>
  );
}

/* ============ الشريحة 3: Streak ============ */
function StreakSlide({ index, total }: SlideProps) {
  return (
    <SlideShell
      emoji="🔥"
      iconBg="bg-amber-50"
      title="حافظ على سلسلتك"
      description="10 كلمات في 5 دقائق يومياً تكفي للإتقان"
      index={index}
      total={total}
    >
      {/* مثال على الهدف اليومي */}
      <div className="rounded-lg bg-[#FAFAFA] border border-line p-4 space-y-3">
        <div>
          <div className="mb-2 flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1.5 font-bold text-ink">
              <span>🎯</span> الهدف اليومي
            </span>
            <span className="font-extrabold tabular-nums text-mint-deep" dir="ltr">
              8 / 10
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#F0F0F0]">
            <div className="h-full bg-mint" style={{ width: "80%" }} />
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-line pt-3">
          <span className="text-[15px]">🔥</span>
          <span className="text-[12px] font-bold text-ink">
            سلسلة 5 أيام متتالية
          </span>
        </div>
      </div>
      <p className="mt-4 text-center text-[11.5px] leading-relaxed text-muted">
        جلسة قصيرة كل يوم{" "}
        <span className="inline-block px-1 font-bold text-ink">&gt;</span>{" "}
        جلسة طويلة أسبوعية
      </p>
    </SlideShell>
  );
}

/* ============ الشريحة 4: ابدأ! ============ */
/* ============ الشريحة 4: ابدأ! (محسّنة) ============ */
function StartSlide({
  index,
  total,
  onDismiss,
}: SlideProps & { onDismiss: () => void }) {
  return (
    <SlideShell
      emoji="🚀"
      iconBg="bg-mint-soft"
      title="ابدأ رحلتك الآن"
      description="كل يوم تتعلم فيه = خطوة نحو إتقان الصينية 🎯"
      index={index}
      total={total}
    >
      {/* ===== صندوق الهدف الأسبوعي (التحفيز) ===== */}
      <div className="mb-5 rounded-lg bg-mint-soft p-4">
        <div className="mb-2.5 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-mint-deep" />
          <span className="text-[13px] font-extrabold text-mint-deep">
            هدفك للأسبوع الأول
          </span>
        </div>
        <ul className="space-y-1.5 text-[12.5px] text-ink">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
            <span>
              <span className="font-extrabold tabular-nums">10</span> كلمات يومياً
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
            <span>
              سلسلة <span className="font-extrabold tabular-nums">7</span> أيام
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
            <span>بداية إتقانك للأساسيات</span>
          </li>
        </ul>
      </div>

      {/* ===== اختيارات سريعة ===== */}
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
        ابدأ من:
      </div>
      <div className="space-y-2.5">
        <Link
          href="/hsk-levels"
          onClick={onDismiss}
          className="group flex items-center gap-3 rounded-lg border border-line bg-white p-3.5 transition-all hover:border-coral hover:shadow-card"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-coral-soft text-lg">
            📚
          </div>
          <div className="min-w-0 flex-1 text-right">
            <div className="text-[13px] font-extrabold text-ink">
              مستويات HSK
            </div>
            <p className="text-[11px] text-muted">
              مسار منظّم خطوة بخطوة
            </p>
          </div>
          <ChevronLeft className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:-translate-x-0.5" />
        </Link>

        <Link
          href="/classifiers"
          onClick={onDismiss}
          className="group flex items-center gap-3 rounded-lg border border-line bg-white p-3.5 transition-all hover:border-mint hover:shadow-card"
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mint-soft font-cn text-lg font-bold text-mint-deep"
            dir="ltr"
          >
            量
          </div>
          <div className="min-w-0 flex-1 text-right">
            <div className="text-[13px] font-extrabold text-ink">
              كلمات الكمية
            </div>
            <p className="text-[11px] text-muted">نقطة بداية سريعة</p>
          </div>
          <ChevronLeft className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:-translate-x-0.5" />
        </Link>
      </div>
    </SlideShell>
  );
}

/* ============ Helpers ============ */

function FeatureList({
  items,
  accentColor,
  bg,
}: {
  items: { icon: string; text: string }[];
  accentColor: string;
  bg: string;
}) {
  return (
    <div className={cn("rounded-lg p-4", bg)}>
      <ul className="space-y-2 text-[13px]">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2.5">
            <span className={cn("text-[15px] font-extrabold", accentColor)}>
              {it.icon}
            </span>
            <span className="font-semibold text-ink">{it.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RatingRow({
  icon,
  label,
  hint,
  color,
}: {
  icon: string;
  label: string;
  hint: string;
  color: string;
}) {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className={cn("text-[15px] font-extrabold", color)}>{icon}</span>
        <span className="font-bold text-ink">{label}</span>
      </div>
      <div className="flex items-center gap-1.5 text-muted">
        <span className="text-[10px]">←</span>
        <span className="text-[11.5px] font-semibold">{hint}</span>
      </div>
    </li>
  );
}

/* ============ غلاف الشريحة الموحّد ============ */
function SlideShell({
  emoji,
  iconBg,
  title,
  description,
  children,
  index,
  total,
}: {
  emoji: string;
  iconBg: string;
  title: string;
  description: string;
  children: React.ReactNode;
  index: number;
  total: number;
}) {
  return (
    <div className="flex flex-1 flex-col px-6 pt-2 pb-6">
      {/* الأيقونة */}
      <div className="mb-5 flex justify-center">
        <div
          className={cn(
            "flex h-[88px] w-[88px] items-center justify-center rounded-lg text-[44px] leading-none",
            iconBg
          )}
        >
          {emoji}
        </div>
      </div>

      {/* العنوان والوصف */}
      <h2 className="mb-2 text-center text-[20px] font-extrabold text-ink">
        {title}
      </h2>
      <p className="mb-6 text-center text-[13px] leading-relaxed text-muted">
        {description}
      </p>

      {/* المحتوى المخصّص */}
      <div className="flex-1">{children}</div>

      {/* مؤشر التقدم */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "w-8 bg-ink" : "w-1.5 bg-[#E0E0E0]"
            )}
          />
        ))}
      </div>
    </div>
  );
}

/* ============ المكوّن الرئيسي ============ */
export function Onboarding({ onDismiss }: { onDismiss: () => void }) {
  const [step, setStep] = useState(0);
  const TOTAL = 4;
  const isLast = step === TOTAL - 1;
  const isFirst = step === 0;

  function next() {
    if (isLast) {
      onDismiss();
    } else {
      setStep((s) => s + 1);
    }
  }

  function back() {
    if (!isFirst) setStep((s) => s - 1);
  }

  return (
    <div
      className="fixed inset-0 z-[95] flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="مرحباً بك في التطبيق"
    >
      {/* رأس بسيط — زر تخطي يميناً */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onDismiss}
          className="rounded-lg px-3 py-1.5 text-[12px] font-bold text-muted hover:bg-[#F7F7F7]"
        >
          تخطي
        </button>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted tabular-nums">
          <span>{step + 1}</span>
          <span className="text-line">/</span>
          <span>{TOTAL}</span>
        </div>
        {!isFirst ? (
          <button
            onClick={back}
            className="rounded-lg p-2 text-muted hover:bg-[#F7F7F7]"
            aria-label="السابق"
          >
            <ChevronLeft className="h-5 w-5 rotate-180" />
          </button>
        ) : (
          <div className="w-9" />
        )}
      </div>

      {/* الشرائح — slide transition عبر key */}
      <div className="mx-auto flex w-full max-w-md flex-1 animate-[onboardFade_280ms_ease-out] flex-col" key={step}>
        {step === 0 && <WelcomeSlide index={0} total={TOTAL} />}
        {step === 1 && <SrsSlide index={1} total={TOTAL} />}
        {step === 2 && <StreakSlide index={2} total={TOTAL} />}
        {step === 3 && (
          <StartSlide index={3} total={TOTAL} onDismiss={onDismiss} />
        )}
      </div>

      {/* الأزرار السفلية */}
      <div className="mx-auto w-full max-w-md px-6 pb-6 pt-2">
        {!isLast ? (
          <button
            onClick={next}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-3.5 text-[13px] font-bold text-white shadow-card hover:bg-black"
          >
            التالي
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : (
          <Link
            href="/hsk-levels"
            onClick={onDismiss}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-coral py-4 text-[14px] font-extrabold text-white shadow-coral hover:bg-coral/90"
          >
            ابدأ رحلتي
            <Sparkles className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

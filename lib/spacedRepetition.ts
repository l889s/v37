"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "hsk_srs_v1";

/* ============ الثوابت ============ */
export const EASE_DEFAULT = 2.5;
export const EASE_MIN = 1.3;
export const EASE_MAX = 3.0;
export const INTERVAL_MAX = 365;
/** مضاعِف الـEasy على الـinterval — كلمة سهلة تصل لأقصى interval أسرع بكثير */
export const EASY_BONUS = 1.3;

/* ============ الأنواع ============ */
/**
 * تقييم البطاقة (4 مستويات):
 * - again: نسيتها — يعود للبداية
 * - hard:  صعبة — يزيد ببطء
 * - good:  جيدة — يزيد طبيعياً
 * - easy:  سهلة — يزيد بسرعة (×EASY_BONUS + يكبر ease)
 */
export type Rating = "again" | "hard" | "good" | "easy";

export type SrsCard = {
  id: string;
  lastReviewed: string | null; // ISO date "YYYY-MM-DD"
  interval: number;            // days
  ease: number;                // 1.3 .. 3.0
  nextReview: string;          // ISO date
  reps: number;                // successful reviews in a row
  lapses: number;
};

export type SrsStats = {
  totalReviews: number;
  todayReviews: number;
  todayDate: string;
  lastReviewedAt: string | null;
  /** عدد المراجعات لكل يوم (آخر 30 يوم فقط) — { "2026-06-08": 12 } */
  history: Record<string, number>;
  /** مجموع كل تقييم تاريخياً (لرسم Donut chart) */
  ratingTotals: Record<Rating, number>;
};

export type SrsState = {
  cards: Record<string, SrsCard>;
  stats: SrsStats;
};

/* ============ مساعدات التاريخ ============ */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(baseISO: string, days: number): string {
  const d = new Date(baseISO + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** فرق الأيام بين تاريخين بصيغة ISO (مفيد لحساب "قبل كم يوم") */
export function daysBetween(fromISO: string, toISO: string = todayISO()): number {
  const a = new Date(fromISO + "T00:00:00Z").getTime();
  const b = new Date(toISO + "T00:00:00Z").getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function isDue(card: SrsCard, today = todayISO()): boolean {
  return card.nextReview <= today;
}

/* ============ الحالة الافتراضية ============ */
function defaultStats(): SrsStats {
  return {
    totalReviews: 0,
    todayReviews: 0,
    todayDate: todayISO(),
    lastReviewedAt: null,
    history: {},
    ratingTotals: { again: 0, hard: 0, good: 0, easy: 0 },
  };
}

function defaultState(): SrsState {
  return { cards: {}, stats: defaultStats() };
}

/** أنشئ بطاقة جديدة "مستحقة فوراً" */
export function newCard(id: string): SrsCard {
  return {
    id,
    lastReviewed: null,
    interval: 0,
    ease: EASE_DEFAULT,
    nextReview: todayISO(),
    reps: 0,
    lapses: 0,
  };
}

/* ============ الخوارزمية ============ */
/**
 * طبّق التقييم وأعِد البطاقة المحدّثة.
 *
 * خوارزمية SM-2 المبسّطة بأربع مستويات:
 *
 *  ┌──────────┬────────────────────────────┬──────────┬──────────────┐
 *  │ التقييم   │ تأثير الـinterval          │ الـease   │ الـreps      │
 *  ├──────────┼────────────────────────────┼──────────┼──────────────┤
 *  │ again    │ = 0 (ترجع اليوم نفسه)      │ -= 0.20  │ = 0 (إعادة)  │
 *  │ hard     │ × 1.2                      │ -= 0.15  │ ++           │
 *  │ good     │ حسب reps: 1→3→7→×ease      │ ثابت     │ ++           │
 *  │ easy     │ نفس good ثم × EASY_BONUS   │ += 0.15  │ ++           │
 *  └──────────┴────────────────────────────┴──────────┴──────────────┘
 *
 * الفلسفة:
 *  - again/hard = عقوبة (تقلّل الـease فيصعب على الكلمة الوصول لـintervals طويلة)
 *  - good       = محايد (الـease ما يتغيّر)
 *  - easy       = مكافأة (الـease يكبر + bonus فوري على الـinterval)
 *
 * مثال على 4 مراجعات متتالية لنفس الكلمة:
 *  - كله "good":  1 → 3 → 7 → 17 → 42 يوم
 *  - كله "easy":  1 → 4 → 12 → 41 → 152 يوم (يصل للأقصى أسرع بكثير)
 */
export function applyRating(card: SrsCard, rating: Rating): SrsCard {
  const today = todayISO();
  let { interval, ease, reps, lapses } = card;

  if (rating === "again") {
    // نسيتها: تعود للبداية كأنها جديدة
    interval = 0;
    reps = 0;
    lapses += 1;
    ease = Math.max(EASE_MIN, ease - 0.20);
  } else if (rating === "hard") {
    // صعبة: زيادة بطيئة + عقوبة على الـease
    interval = Math.max(1, Math.round(interval * 1.2));
    reps += 1;
    ease = Math.max(EASE_MIN, ease - 0.15);
  } else if (rating === "good") {
    // جيدة: السلم المعتاد للـintervals، الـease ثابت
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 3;
    else if (reps === 2) interval = 7;
    else interval = Math.round(interval * ease);
    reps += 1;
  } else {
    // easy: نفس قاعدة good ثم نضرب بـEASY_BONUS، ونزيد الـease كمكافأة
    let base: number;
    if (reps === 0) base = 1;
    else if (reps === 1) base = 3;
    else if (reps === 2) base = 7;
    else base = Math.round(interval * ease);
    interval = Math.max(1, Math.round(base * EASY_BONUS));
    reps += 1;
    ease = Math.min(EASE_MAX, ease + 0.15);
  }

  // حدود الأمان
  interval = Math.min(INTERVAL_MAX, Math.max(0, interval));
  ease = Math.min(EASE_MAX, Math.max(EASE_MIN, ease));

  return {
    ...card,
    lastReviewed: today,
    interval,
    ease,
    nextReview: addDaysISO(today, interval),
    reps,
    lapses,
  };
}

/* ============ تصنيف البطاقات ============ */
export function categorize(card: SrsCard): "new" | "learning" | "review" {
  if (card.lastReviewed === null) return "new";
  if (card.reps < 3 || card.interval < 7) return "learning";
  return "review";
}

/* ============ دوال إحصاءات للواجهة ============ */

/** عدد المراجعات في آخر N يوم (شاملة اليوم) */
export function getReviewsInDays(
  history: Record<string, number>,
  days: number
): number {
  const today = todayISO();
  const start = addDaysISO(today, -(days - 1));
  let sum = 0;
  for (const [date, count] of Object.entries(history)) {
    if (date >= start && date <= today) sum += count;
  }
  return sum;
}

/** توزيع البطاقات على المراحل الثلاث */
export function getDistribution(
  cards: Record<string, SrsCard>
): { new: number; learning: number; review: number; total: number } {
  let n = 0, l = 0, r = 0;
  for (const c of Object.values(cards)) {
    const cat = categorize(c);
    if (cat === "new") n++;
    else if (cat === "learning") l++;
    else r++;
  }
  return { new: n, learning: l, review: r, total: n + l + r };
}

/** أعلى N كلمة من ناحية الإتقان (reps - lapses) */
export function getTopMastered(
  cards: Record<string, SrsCard>,
  limit = 5
): SrsCard[] {
  return Object.values(cards)
    .filter((c) => c.lastReviewed !== null) // استبعد الجديدة
    .sort((a, b) => {
      const scoreA = a.reps - a.lapses * 2;
      const scoreB = b.reps - b.lapses * 2;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return b.interval - a.interval; // tiebreaker: interval أطول = أرسخ
    })
    .slice(0, limit);
}

/** الكلمات الأكثر نسياناً (lapses الأعلى) */
export function getTopForgotten(
  cards: Record<string, SrsCard>,
  limit = 5
): SrsCard[] {
  return Object.values(cards)
    .filter((c) => c.lapses > 0)
    .sort((a, b) => {
      if (b.lapses !== a.lapses) return b.lapses - a.lapses;
      return a.interval - b.interval; // الأقصر interval أصعب
    })
    .slice(0, limit);
}

/** نسبة الإتقان العامة: متوسط reps/(reps+lapses) للكلمات المُراجَعة */
export function getOverallMastery(cards: Record<string, SrsCard>): number {
  const reviewed = Object.values(cards).filter((c) => c.lastReviewed !== null);
  if (reviewed.length === 0) return 0;
  let totalScore = 0;
  for (const c of reviewed) {
    const denom = c.reps + c.lapses;
    if (denom === 0) continue;
    totalScore += c.reps / denom;
  }
  return Math.round((totalScore / reviewed.length) * 100);
}

/* ============ I/O ============ */
function read(): SrsState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as SrsState;
    return {
      cards: parsed.cards ?? {},
      stats: { ...defaultStats(), ...(parsed.stats ?? {}) },
    };
  } catch {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* تجاهل */
    }
    return defaultState();
  }
}

function write(s: SrsState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* quota */
  }
}

/** إعادة تعيين عداد اليوم لو تغيّر التاريخ */
function rolloverStats(s: SrsStats): SrsStats {
  const today = todayISO();
  if (s.todayDate === today) return s;
  return { ...s, todayDate: today, todayReviews: 0 };
}

/* ============ Hook ============ */
export function useSrs(allIds: string[]) {
  const [state, setState] = useState<SrsState>(defaultState());
  const [ready, setReady] = useState(false);

  // تحميل + تطبيق rollover + ضمان وجود كل البطاقات
  useEffect(() => {
    const loaded = read();
    const stats = rolloverStats(loaded.stats);
    // أضف البطاقات اللي ما زالت غير موجودة (مستحقة فوراً كـ"new")
    const cards = { ...loaded.cards };
    let added = false;
    for (const id of allIds) {
      if (!cards[id]) {
        cards[id] = newCard(id);
        added = true;
      }
    }
    const next: SrsState = { cards, stats };
    if (added || stats !== loaded.stats) write(next);
    setState(next);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allIds.join(",")]);

  /** سجّل تقييم لبطاقة */
  const rate = useCallback((id: string, rating: Rating) => {
    setState((prev) => {
      const cur = prev.cards[id] ?? newCard(id);
      const updated = applyRating(cur, rating);
      const stats = rolloverStats(prev.stats);
      const today = todayISO();

      // حدّث history وأبقِ آخر 30 يوم فقط
      const cutoff = addDaysISO(today, -30);
      const history: Record<string, number> = {};
      for (const [date, count] of Object.entries(stats.history ?? {})) {
        if (date >= cutoff) history[date] = count;
      }
      history[today] = (history[today] ?? 0) + 1;

      // حدّث ratingTotals (backward compat لو ما موجود)
      const prevRatings = stats.ratingTotals ?? { again: 0, hard: 0, good: 0, easy: 0 };
      const ratingTotals: Record<Rating, number> = {
        ...prevRatings,
        [rating]: (prevRatings[rating] ?? 0) + 1,
      };

      const next: SrsState = {
        cards: { ...prev.cards, [id]: updated },
        stats: {
          ...stats,
          totalReviews: stats.totalReviews + 1,
          todayReviews: stats.todayReviews + 1,
          lastReviewedAt: new Date().toISOString(),
          history,
          ratingTotals,
        },
      };
      write(next);
      return next;
    });
  }, []);

  /** أعد قائمة الـids المستحقة للمراجعة */
  const getDueIds = useCallback((): string[] => {
    const today = todayISO();
    return allIds.filter((id) => {
      const c = state.cards[id];
      if (!c) return true; // جديدة → مستحقة
      return isDue(c, today);
    });
  }, [state.cards, allIds]);

  /** عداد المستحقات */
  const dueCount = (() => {
    const today = todayISO();
    let n = 0;
    for (const id of allIds) {
      const c = state.cards[id];
      if (!c || isDue(c, today)) n++;
    }
    return n;
  })();

  /** عدد البطاقات الجديدة */
  const newCount = allIds.filter((id) => {
    const c = state.cards[id];
    return !c || c.lastReviewed === null;
  }).length;

  /** إجمالي الكلمات في النظام */
  const totalCount = allIds.length;

  const resetAll = useCallback(() => {
    write(defaultState());
    setState(defaultState());
  }, []);

  return {
    ready,
    state,
    rate,
    getDueIds,
    dueCount,
    newCount,
    totalCount,
    resetAll,
  };
}

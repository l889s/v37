"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "hsk_daily_v1";
export const DAILY_GOAL = 10; // الهدف اليومي الثابت

/* ============ الأنواع ============ */
export type DailyState = {
  goal: number;
  today: {
    date: string;       // "2026-06-08"
    count: number;      // عدد الكلمات الممارسة اليوم
    goalMet: boolean;   // هل تحقق الهدف اليوم؟
  };
  streak: {
    current: number;
    longest: number;
    lastGoalMetDate: string | null;
  };
  totalDaysActive: number;
  goalsCompletedAllTime: number;
};

const DEFAULT_STATE: DailyState = {
  goal: DAILY_GOAL,
  today: { date: todayISO(), count: 0, goalMet: false },
  streak: { current: 0, longest: 0, lastGoalMetDate: null },
  totalDaysActive: 0,
  goalsCompletedAllTime: 0,
};

/* ============ مساعدات التاريخ ============ */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

/* ============ I/O ============ */
function read(): DailyState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as DailyState;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* تجاهل */
    }
    return DEFAULT_STATE;
  }
}

function write(s: DailyState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* quota */
  }
}

/* ============ التحقق من بداية يوم جديد ============ */
/**
 * إذا كان آخر يوم محفوظ ليس اليوم، نُهيّئ يوماً جديداً.
 * نتحقق أيضاً من الـstreak: لو آخر هدف تحقق ليس أمس → ينقطع.
 */
function rolloverIfNeeded(s: DailyState): DailyState {
  const today = todayISO();
  if (s.today.date === today) return s;

  // يوم جديد
  let nextStreak = s.streak;
  if (s.streak.current > 0 && s.streak.lastGoalMetDate) {
    const diff = daysBetween(s.streak.lastGoalMetDate, today);
    if (diff > 1) {
      // انقطع — لم يحقق الهدف أمس
      nextStreak = { ...s.streak, current: 0 };
    }
  }

  return {
    ...s,
    today: { date: today, count: 0, goalMet: false },
    streak: nextStreak,
  };
}

/* ============ منطق تسجيل كلمة جديدة ============ */
function recordWord(s: DailyState): {
  next: DailyState;
  goalJustMet: boolean;
} {
  const rolled = rolloverIfNeeded(s);
  const isFirstTodayCount = rolled.today.count === 0;

  const newCount = rolled.today.count + 1;
  const reachedGoal = newCount >= rolled.goal;
  const goalJustMet = reachedGoal && !rolled.today.goalMet;

  let nextStreak = rolled.streak;
  let goalsCompletedAllTime = rolled.goalsCompletedAllTime;

  if (goalJustMet) {
    const today = todayISO();
    let current = 1;
    if (rolled.streak.lastGoalMetDate) {
      const diff = daysBetween(rolled.streak.lastGoalMetDate, today);
      if (diff === 0) current = rolled.streak.current; // نظرياً ما يحصل (goalMet=false في نفس اليوم لو حققناه)
      else if (diff === 1) current = rolled.streak.current + 1;
      else current = 1;
    }
    nextStreak = {
      current,
      longest: Math.max(current, rolled.streak.longest),
      lastGoalMetDate: today,
    };
    goalsCompletedAllTime = rolled.goalsCompletedAllTime + 1;
  }

  return {
    next: {
      ...rolled,
      today: {
        date: rolled.today.date,
        count: newCount,
        goalMet: reachedGoal,
      },
      streak: nextStreak,
      totalDaysActive: rolled.totalDaysActive + (isFirstTodayCount ? 1 : 0),
      goalsCompletedAllTime,
    },
    goalJustMet,
  };
}

/* ============ Hook ============ */
export function useDaily() {
  const [state, setState] = useState<DailyState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  // تحميل من localStorage + تطبيق rollover
  useEffect(() => {
    const loaded = rolloverIfNeeded(read());
    write(loaded);
    setState(loaded);
    setReady(true);
  }, []);

  // مراقبة منتصف الليل — تحديث الحالة عند تغيّر اليوم بدون refresh
  useEffect(() => {
    const interval = window.setInterval(() => {
      setState((prev) => {
        if (prev.today.date === todayISO()) return prev;
        const rolled = rolloverIfNeeded(prev);
        write(rolled);
        return rolled;
      });
    }, 60_000); // كل دقيقة
    return () => window.clearInterval(interval);
  }, []);

  /** سجّل ممارسة كلمة واحدة. يعيد goalJustMet لاستخدامه في Toast/أنيميشن */
  const tickPractice = useCallback((): { goalJustMet: boolean } => {
    let result = { goalJustMet: false };
    setState((prev) => {
      const { next, goalJustMet } = recordWord(prev);
      result = { goalJustMet };
      write(next);
      return next;
    });
    return result;
  }, []);

  const resetAll = useCallback(() => {
    const fresh: DailyState = {
      ...DEFAULT_STATE,
      today: { date: todayISO(), count: 0, goalMet: false },
    };
    write(fresh);
    setState(fresh);
  }, []);

  return { ready, state, tickPractice, resetAll };
}

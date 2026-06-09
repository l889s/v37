"use client";

import { useCallback, useEffect, useState } from "react";

const STATS_KEY  = "hsk_achievements_stats";
const LEVELS_KEY = "hsk_achievements_levels";
const RECENT_KEY = "hsk_achievements_recent";
const RECENT_LIMIT = 20;

/* ============ الأنواع ============ */
export type Stats = {
  totalPracticed: number;
  streak: { current: number; longest: number; lastDate: string | null };
  lastActivity: string | null;
};

export type LevelProgress = {
  practiced: number;
  masteryAvg: number; // 0..100
};

export type LevelsMap = Record<string, LevelProgress>;

export type RecentItem = {
  levelId: string;
  w: string;
  p: string;
  m: string;
  at: string; // ISO
};

const DEFAULT_STATS: Stats = {
  totalPracticed: 0,
  streak: { current: 0, longest: 0, lastDate: null },
  lastActivity: null,
};

/* ============ I/O ============ */
function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    // البيانات فاسدة — احذفها حتى لا تفشل في كل قراءة
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* تجاهل لو حتى الحذف فشل */
    }
    return fallback;
  }
}

function writeJSON<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* quota */
  }
}

/* ============ منطق الـstreak ============ */
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

function updateStreak(prev: Stats["streak"]): Stats["streak"] {
  const today = todayISO();
  if (!prev.lastDate) {
    return { current: 1, longest: Math.max(1, prev.longest), lastDate: today };
  }
  const diff = daysBetween(prev.lastDate, today);
  if (diff === 0) return prev; // نفس اليوم
  if (diff === 1) {
    const current = prev.current + 1;
    return { current, longest: Math.max(current, prev.longest), lastDate: today };
  }
  // انقطع
  return { current: 1, longest: Math.max(1, prev.longest), lastDate: today };
}

/* ============ Hook ============ */
export function useAchievements() {
  const [stats, setStats]   = useState<Stats>(DEFAULT_STATS);
  const [levels, setLevels] = useState<LevelsMap>({});
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [ready, setReady]   = useState(false);

  useEffect(() => {
    setStats(readJSON<Stats>(STATS_KEY, DEFAULT_STATS));
    setLevels(readJSON<LevelsMap>(LEVELS_KEY, {}));
    setRecent(readJSON<RecentItem[]>(RECENT_KEY, []));
    setReady(true);
  }, []);

  /** سجّل ممارسة كلمة واحدة */
  const recordPractice = useCallback(
    (item: Omit<RecentItem, "at">, mastery = 50) => {
      const now = new Date().toISOString();
      const at  = now;

      // stats
      setStats((prev) => {
        const next: Stats = {
          totalPracticed: prev.totalPracticed + 1,
          streak: updateStreak(prev.streak),
          lastActivity: now,
        };
        writeJSON(STATS_KEY, next);
        return next;
      });

      // levels
      setLevels((prev) => {
        const cur = prev[item.levelId] ?? { practiced: 0, masteryAvg: 0 };
        const newPracticed = cur.practiced + 1;
        // متوسط متجدد بسيط
        const newAvg = Math.round(
          (cur.masteryAvg * cur.practiced + mastery) / newPracticed
        );
        const next: LevelsMap = {
          ...prev,
          [item.levelId]: { practiced: newPracticed, masteryAvg: newAvg },
        };
        writeJSON(LEVELS_KEY, next);
        return next;
      });

      // recent
      setRecent((prev) => {
        const next = [{ ...item, at }, ...prev].slice(0, RECENT_LIMIT);
        writeJSON(RECENT_KEY, next);
        return next;
      });
    },
    []
  );

  const resetAll = useCallback(() => {
    writeJSON(STATS_KEY, DEFAULT_STATS);
    writeJSON(LEVELS_KEY, {});
    writeJSON(RECENT_KEY, []);
    setStats(DEFAULT_STATS);
    setLevels({});
    setRecent([]);
  }, []);

  /** نسبة الإتقان العامة = متوسط masteryAvg لكل المستويات النشطة */
  const overallMastery = (() => {
    const active = Object.values(levels).filter((l) => l.practiced > 0);
    if (active.length === 0) return 0;
    const sum = active.reduce((s, l) => s + l.masteryAvg, 0);
    return Math.round(sum / active.length);
  })();

  return {
    ready,
    stats,
    levels,
    recent,
    overallMastery,
    recordPractice,
    resetAll,
  };
}

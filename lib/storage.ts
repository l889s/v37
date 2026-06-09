"use client";

import { useCallback, useEffect, useState } from "react";

const FAV_KEY = "hsk_fav_classifiers_v1";
const PROG_KEY = "hsk_progress_v1";

export type Progress = {
  // كم كلمة "تمت رؤيتها" أو "تم حفظها" لكل مستوى HSK
  hsk: Record<string, number>; // مثال: { "hsk3": 12, "n5": 40 }
};

const DEFAULT_PROGRESS: Progress = { hsk: {} };

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* تجاهل */
    }
    return fallback;
  }
}

function writeJSON<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignore quota */
  }
}

/* ============ المفضلات ============ */
export function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavs(readJSON<string[]>(FAV_KEY, []));
    setReady(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setFavs((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      writeJSON(FAV_KEY, next);
      return next;
    });
  }, []);

  const has = useCallback((id: string) => favs.includes(id), [favs]);

  return { favs, toggle, has, ready, count: favs.length };
}

/* ============ التقدم ============ */
export function useProgress() {
  const [prog, setProg] = useState<Progress>(DEFAULT_PROGRESS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProg(readJSON<Progress>(PROG_KEY, DEFAULT_PROGRESS));
    setReady(true);
  }, []);

  const bumpLevel = useCallback((levelId: string, delta = 1) => {
    setProg((prev) => {
      const next: Progress = {
        ...prev,
        hsk: { ...prev.hsk, [levelId]: (prev.hsk[levelId] ?? 0) + delta },
      };
      writeJSON(PROG_KEY, next);
      return next;
    });
  }, []);

  const setLevel = useCallback((levelId: string, value: number) => {
    setProg((prev) => {
      const next: Progress = {
        ...prev,
        hsk: { ...prev.hsk, [levelId]: Math.max(0, value) },
      };
      writeJSON(PROG_KEY, next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    writeJSON(PROG_KEY, DEFAULT_PROGRESS);
    setProg(DEFAULT_PROGRESS);
  }, []);

  return { progress: prog, bumpLevel, setLevel, reset, ready };
}

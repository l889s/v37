"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "hsk_read_words_v1";

// البنية: { "hsk1-2": ["hsk1-2:爱", "hsk1-2:爸爸", ...], "n1": [...] }
type ReadData = Record<string, string[]>;

function load(): ReadData {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ReadData) : {};
  } catch {
    return {};
  }
}

function persist(data: ReadData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
}

/**
 * useReadWords — يتتبع الكلمات المقروءة لمستوى واحد
 *
 * @param levelId   مثل "hsk1-2" أو "n1"
 * @param totalWords  عدد الكلمات الكلي في المستوى
 */
export function useReadWords(levelId: string, totalWords: number) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  // تحميل من localStorage
  useEffect(() => {
    const data = load();
    setReadIds(new Set(data[levelId] ?? []));
    setReady(true);
  }, [levelId]);

  /**
   * markRead — يضيف wordId للمقروءين (مرة واحدة فقط)
   * wordId يكون: `${levelId}:${word.w}`  ← نفس wordIdFor في lib/data.ts
   */
  const markRead = useCallback(
    (wordId: string) => {
      setReadIds((prev) => {
        if (prev.has(wordId)) return prev; // مقروءة قبل كذا — لا تغيير
        const next = new Set(prev);
        next.add(wordId);
        // حفظ فوري
        const data = load();
        data[levelId] = [...next];
        persist(data);
        return next;
      });
    },
    [levelId]
  );

  const readCount = readIds.size;
  const progressPct =
    totalWords > 0 ? Math.round((readCount / totalWords) * 100) : 0;

  return { readCount, readIds, progressPct, markRead, ready };
}

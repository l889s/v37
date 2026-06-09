"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "hsk_onboarding_v1";

/**
 * Hook لإدارة حالة الـonboarding.
 * - يظهر للمستخدم الجديد فقط (مرّة واحدة)
 * - يُحفظ في localStorage تحت hsk_onboarding_v1
 */
export function useOnboarding() {
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);

  // فحص بعد mount لتجنّب hydration mismatch
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const done = window.localStorage.getItem(KEY) === "done";
      setShow(!done);
    } catch {
      // لو localStorage معطّل، لا تظهر الـonboarding (نتفادى الإزعاج)
      setShow(false);
    }
    setReady(true);
  }, []);

  const dismiss = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(KEY, "done");
      } catch {
        /* تجاهل */
      }
    }
    setShow(false);
  }, []);

  // للتطوير/الاختبار: إعادة عرض الـonboarding
  const reset = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(KEY);
      } catch {
        /* تجاهل */
      }
    }
    setShow(true);
  }, []);

  return { ready, show, dismiss, reset };
}

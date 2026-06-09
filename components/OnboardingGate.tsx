"use client";

import { Onboarding } from "@/components/Onboarding";
import { useOnboarding } from "@/lib/onboarding";

/**
 * Wrapper بسيط — يعرض الـonboarding تلقائياً للمستخدم الجديد
 * نضعه في layout.tsx أو الصفحة الرئيسية فقط
 */
export function OnboardingGate() {
  const { ready, show, dismiss } = useOnboarding();

  // تجنّب الـflash لما يكون localStorage يقول "done"
  if (!ready || !show) return null;

  return <Onboarding onDismiss={dismiss} />;
}

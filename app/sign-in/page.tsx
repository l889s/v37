"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from '../../hooks/useAuth';

/**
 * النموذج الفعلي — منفصل لأن useSearchParams يتطلّب Suspense في Next.js 15.
 */
function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);

    // تحقّق بسيط من جهة العميل قبل إرسال الطلب
    if (!email.trim() || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setLoading(true);
    const { error: authError } = await signIn(email, password);
    setLoading(false);

    if (authError) {
      setError(authError);
      return;
    }

    // وجهة ما بعد الدخول: redirect من الـ middleware أو /dashboard
    const redirect = searchParams.get("redirect") || "/dashboard";
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      {/* الشعار */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-coral font-cn text-2xl font-black text-white shadow-[0_8px_20px_rgba(255,77,79,0.32)]">
          中
        </div>
        <h1 className="text-2xl font-extrabold text-ink">أهلاً بعودتك</h1>
        <p className="mt-1.5 text-sm text-muted">سجّل دخولك لمتابعة رحلتك</p>
      </div>

      {/* البطاقة */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{
          border: "1px solid #EAEAEA",
          boxShadow:
            "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px rgba(17,24,39,0.06)",
        }}
      >
        {/* رسالة الخطأ */}
        {error && (
          <div
            className="mb-4 flex items-start gap-2 rounded-lg px-3.5 py-3 text-[13px] font-semibold"
            style={{ background: "#FFF1F0", color: "#C2410C" }}
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>

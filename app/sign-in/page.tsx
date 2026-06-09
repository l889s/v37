"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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
  // نعرض رسالة الخطأ القادمة من معالج التأكيد (?error=) إن وُجدت
  const [error, setError] = useState<string | null>(
    searchParams.get("error")
  );

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
    router.refresh(); // لتحديث حالة الخادم (الجلسة الجديدة)
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
        )}

        {/* البريد الإلكتروني */}
        <label className="mb-4 block">
          <span className="mb-1.5 block text-[13px] font-bold text-ink">
            البريد الإلكتروني
          </span>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="email"
              inputMode="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-lg border border-line bg-white py-3 pr-10 pl-3 text-[14px] text-ink outline-none transition-colors focus:border-coral"
              disabled={loading}
            />
          </div>
        </label>

        {/* كلمة المرور */}
        <label className="mb-2 block">
          <span className="mb-1.5 block text-[13px] font-bold text-ink">
            كلمة المرور
          </span>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-lg border border-line bg-white py-3 pr-10 pl-10 text-[14px] text-ink outline-none transition-colors focus:border-coral"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        {/* نسيت كلمة المرور */}
        <div className="mb-5 text-left">
          <Link
            href="/forgot-password"
            className="text-[12.5px] font-bold text-coral hover:underline"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        {/* زر الدخول */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-coral py-3.5 text-[15px] font-extrabold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جارٍ الدخول…
            </>
          ) : (
            "تسجيل الدخول"
          )}
        </button>
      </div>

      {/* رابط التسجيل */}
      <p className="mt-6 text-center text-[13.5px] text-muted">
        ليس لديك حساب؟{" "}
        <Link href="/sign-up" className="font-extrabold text-coral hover:underline">
          سجّل الآن
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-5 py-10"
      style={{ background: "#FAFAF8" }}
    >
      <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-coral" />}>
        <SignInForm />
      </Suspense>
    </main>
  );
}

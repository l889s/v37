"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [xLoading, setXLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error")
  );

  async function handleSubmit() {
    setError(null);
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
    const redirect = searchParams.get("redirect") || "/dashboard";
    router.push(redirect);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) {
      setError("حدث خطأ أثناء تسجيل الدخول بـ Google. حاول مجدداً.");
      setGoogleLoading(false);
    }
  }

  async function handleXSignIn() {
    setError(null);
    setXLoading(true);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "x",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) {
      setError("حدث خطأ أثناء تسجيل الدخول بـ X. حاول مجدداً.");
      setXLoading(false);
    }
  }

  async function handleAppleSignIn() {
    setError(null);
    setAppleLoading(true);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) {
      setError("حدث خطأ أثناء تسجيل الدخول بـ Apple. حاول مجدداً.");
      setAppleLoading(false);
    }
  }

  const anyLoading = loading || googleLoading || xLoading || appleLoading;

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

        {/* زر Google */}
        <button
          onClick={handleGoogleSignIn}
          disabled={anyLoading}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-white py-3 text-[14px] font-bold text-ink transition hover:bg-gray-50 disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          تسجيل الدخول بـ Google
        </button>

        {/* زر X */}
        <button
          onClick={handleXSignIn}
          disabled={anyLoading}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-black py-3 text-[14px] font-bold text-white transition hover:bg-gray-900 disabled:opacity-60"
        >
          {xLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          )}
          تسجيل الدخول بـ X
        </button>

        {/* زر Apple */}
        <button
          onClick={handleAppleSignIn}
          disabled={anyLoading}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 text-[14px] font-bold text-white transition hover:bg-gray-900 disabled:opacity-60"
          style={{ border: "1px solid #000" }}
        >
          {appleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          )}
          تسجيل الدخول بـ Apple
        </button>

        {/* فاصل */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-[12px] text-muted">أو</span>
          <div className="h-px flex-1 bg-line" />
        </div>

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
              disabled={anyLoading}
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
              disabled={anyLoading}
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
          disabled={anyLoading}
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

"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    setError(null);

    if (!email.trim()) {
      setError("الرجاء إدخال البريد الإلكتروني.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/reset-password` }
    );
    setLoading(false);

    if (resetError) {
      setError("حدث خطأ. تأكّد من البريد وحاول مرة أخرى.");
      return;
    }

    setSent(true);
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-5 py-10"
      style={{ background: "#FAFAF8" }}
    >
      <div className="w-full max-w-sm">
        {/* الشعار */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-coral font-cn text-2xl font-black text-white shadow-[0_8px_20px_rgba(255,77,79,0.32)]">
            中
          </div>
          <h1 className="text-2xl font-extrabold text-ink">نسيت كلمة المرور؟</h1>
          <p className="mt-1.5 text-sm text-muted">
            أدخل بريدك وسنرسل لك رابط إعادة التعيين
          </p>
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
          {sent ? (
            /* رسالة النجاح */
            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "#ECFDF5" }}
              >
                <CheckCircle2 className="h-6 w-6" style={{ color: "#059669" }} />
              </div>
              <p className="text-[14px] font-bold text-ink">تم إرسال الرابط!</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                راجع بريدك الإلكتروني{" "}
                <span dir="ltr" className="font-semibold">
                  {email}
                </span>{" "}
                واضغط على الرابط لإعادة تعيين كلمة المرور. تحقّق من مجلد الرسائل
                غير المرغوب فيها إن لم تجده.
              </p>
            </div>
          ) : (
            <>
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
              <label className="mb-5 block">
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

              {/* زر الإرسال */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-coral py-3.5 text-[15px] font-extrabold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جارٍ الإرسال…
                  </>
                ) : (
                  "إرسال رابط إعادة التعيين"
                )}
              </button>
            </>
          )}
        </div>

        {/* رابط الرجوع */}
        <p className="mt-6 text-center text-[13.5px] text-muted">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1 font-extrabold text-coral hover:underline"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            العودة لتسجيل الدخول
          </Link>
        </p>
      </div>
    </main>
  );
}

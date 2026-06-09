"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  // نتحقّق أن المستخدم وصل عبر رابط صالح (جلسة استرجاع)
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    // عند فتح الرابط، Supabase ينشئ جلسة مؤقتة تلقائياً.
    // نتأكّد من وجودها قبل السماح بتغيير كلمة المرور.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setReady(true);
      } else {
        // ننتظر حدث الاسترجاع (قد يصل بعد لحظة من قراءة الرابط)
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "PASSWORD_RECOVERY" || session) {
            setReady(true);
            setLinkError(false);
          }
        });
        // مهلة قصيرة: إن لم تصل جلسة، فالرابط منتهٍ أو غير صالح
        setTimeout(() => {
          setReady((r) => {
            if (!r) setLinkError(true);
            return r;
          });
        }, 2500);
        return () => subscription.unsubscribe();
      }
    });
  }, []);

  async function handleSubmit() {
    setError(null);

    if (!password || password.length < 6) {
      setError("كلمة المرور قصيرة جداً (٦ أحرف على الأقل).");
      return;
    }
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("تعذّر تحديث كلمة المرور. قد يكون الرابط منتهياً، اطلب رابطاً جديداً.");
      return;
    }

    setDone(true);
    // بعد ثانيتين نوجّهه لتسجيل الدخول
    setTimeout(() => {
      router.push("/sign-in");
      router.refresh();
    }, 2000);
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
          <h1 className="text-2xl font-extrabold text-ink">كلمة مرور جديدة</h1>
          <p className="mt-1.5 text-sm text-muted">اختر كلمة مرور قوية لحسابك</p>
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
          {done ? (
            /* نجاح */
            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "#ECFDF5" }}
              >
                <CheckCircle2 className="h-6 w-6" style={{ color: "#059669" }} />
              </div>
              <p className="text-[14px] font-bold text-ink">تم تحديث كلمة المرور!</p>
              <p className="mt-2 text-[13px] text-muted">
                جارٍ تحويلك لتسجيل الدخول…
              </p>
            </div>
          ) : linkError ? (
            /* رابط غير صالح */
            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "#FFF1F0" }}
              >
                <AlertCircle className="h-6 w-6" style={{ color: "#C2410C" }} />
              </div>
              <p className="text-[14px] font-bold text-ink">الرابط غير صالح</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                انتهت صلاحية الرابط أو سبق استخدامه. اطلب رابطاً جديداً.
              </p>
              <Link
                href="/forgot-password"
                className="mt-4 inline-block rounded-lg bg-coral px-4 py-2.5 text-[13.5px] font-extrabold text-white hover:opacity-90"
              >
                طلب رابط جديد
              </Link>
            </div>
          ) : !ready ? (
            /* جارٍ التحقق من الرابط */
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-coral" />
            </div>
          ) : (
            <>
              {/* خطأ */}
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

              {/* كلمة المرور الجديدة */}
              <label className="mb-4 block">
                <span className="mb-1.5 block text-[13px] font-bold text-ink">
                  كلمة المرور الجديدة
                </span>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-line bg-white py-3 pr-10 pl-10 text-[14px] text-ink outline-none transition-colors focus:border-coral"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                    aria-label={showPassword ? "إخفاء" : "إظهار"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {/* تأكيد كلمة المرور */}
              <label className="mb-5 block">
                <span className="mb-1.5 block text-[13px] font-bold text-ink">
                  تأكيد كلمة المرور
                </span>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    dir="ltr"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-line bg-white py-3 pr-10 pl-3 text-[14px] text-ink outline-none transition-colors focus:border-coral"
                    disabled={loading}
                  />
                </div>
              </label>

              {/* زر التحديث */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-coral py-3.5 text-[15px] font-extrabold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جارٍ التحديث…
                  </>
                ) : (
                  "تحديث كلمة المرور"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

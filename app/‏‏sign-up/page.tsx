"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setError(null);

    if (!fullName.trim()) {
      setError("الرجاء إدخال الاسم الكامل.");
      return;
    }
    if (!email || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }
    if (password.length < 6) {
      setError("كلمة المرور قصيرة جداً (٦ أحرف على الأقل).");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setLoading(true);

    const { error: authError } = await signUp(email, password, fullName);

    setLoading(false);

    if (authError) {
      setError(authError);
      return;
    }

    setSuccess(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-5 py-10">
      <div className="w-full max-w-sm">
        {/* الشعار والعنوان */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF4D4F] font-cn text-2xl font-black text-white shadow-[0_8px_20px_rgba(255,77,79,0.32)]">
            中
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A1A1A]">أنشئ حسابك</h1>
          <p className="mt-1.5 text-sm text-[#6B7280]">ابدأ رحلتك في تعلّم الصينية</p>
        </div>

        {/* البطاقة */}
        <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #EAEAEA", boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px rgba(17,24,39,0.06)" }}>
          
          {/* رسالة النجاح */}
          {success ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F7F3] text-3xl">✅</div>
              <h2 className="text-xl font-extrabold text-[#1A1A1A]">تحقّق من بريدك!</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                أرسلنا رابط تأكيد إلى <span className="font-bold text-[#1A1A1A]">{email}</span>.<br />
                افتح الرابط لتفعيل حسابك.
              </p>
              <Link 
                href="/sign-in" 
                className="mt-6 block rounded-lg bg-[#FF4D4F] py-3.5 text-center text-[15px] font-extrabold text-white"
              >
                الذهاب لتسجيل الدخول
              </Link>
            </div>
          ) : (
            <>
              {/* رسالة الخطأ */}
              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-lg bg-[#FFF1F0] px-3.5 py-3 text-[13px] font-semibold text-[#C2410C]">
                  ⚠️ <span>{error}</span>
                </div>
              )}

              {/* الاسم الكامل */}
              <label className="mb-4 block">
                <span className="mb-1.5 block text-[13px] font-bold text-[#1A1A1A]">الاسم الكامل</span>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">👤</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="عبدالرحمن سليمان"
                    className="w-full rounded-lg border border-[#EAEAEA] bg-white py-3 pr-10 pl-3 text-[14px] outline-none focus:border-[#FF4D4F]"
                  />
                </div>
              </label>

              {/* البريد الإلكتروني */}
              <label className="mb-4 block">
                <span className="mb-1.5 block text-[13px] font-bold text-[#1A1A1A]">البريد الإلكتروني</span>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">✉️</span>
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-[#EAEAEA] bg-white py-3 pr-10 pl-3 text-[14px] outline-none focus:border-[#FF4D4F]"
                  />
                </div>
              </label>

              {/* كلمة المرور */}
              <label className="mb-4 block">
                <span className="mb-1.5 block text-[13px] font-bold text-[#1A1A1A]">كلمة المرور</span>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-[#EAEAEA] bg-white py-3 pr-10 pl-10 text-[14px] outline-none focus:border-[#FF4D4F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-lg"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </label>

              {/* تأكيد كلمة المرور */}
              <label className="mb-5 block">
                <span className="mb-1.5 block text-[13px] font-bold text-[#1A1A1A]">تأكيد كلمة المرور</span>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    dir="ltr"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-[#EAEAEA] bg-white py-3 pr-10 pl-3 text-[14px] outline-none focus:border-[#FF4D4F]"
                  />
                </div>
              </label>

              {/* زر إنشاء الحساب */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-lg bg-[#FF4D4F] py-3.5 text-[15px] font-extrabold text-white transition-opacity disabled:opacity-70"
              >
                {loading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}
              </button>
            </>
          )}
        </div>

        {/* رابط تسجيل الدخول */}
        {!success && (
          <p className="mt-6 text-center text-[13.5px] text-[#6B7280]">
            لديك حساب بالفعل؟{" "}
            <Link href="/sign-in" className="font-extrabold text-[#FF4D4F] hover:underline">
              سجّل الدخول
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
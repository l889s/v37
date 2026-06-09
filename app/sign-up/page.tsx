"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setError(null);
    if (!fullName.trim()) { setError("الرجاء إدخال الاسم الكامل."); return; }
    if (!email.trim() || !password) { setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور."); return; }
    if (password.length < 6) { setError("كلمة المرور قصيرة جداً (٦ أحرف على الأقل)."); return; }
    if (password !== confirm) { setError("كلمتا المرور غير متطابقتين."); return; }
    setLoading(true);
    const { error: authError } = await signUp(email, password, fullName);
    setLoading(false);
    if (authError) { setError(authError); return; }
    setSuccess(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-coral font-cn text-2xl font-black text-white shadow-[0_8px_20px_rgba(255,77,79,0.32)]">中</div>
          <h1 className="text-2xl font-extrabold text-ink">أنشئ حسابك</h1>
          <p className="mt-1.5 text-sm text-muted">ابدأ رحلتك في تعلّم الصينية</p>
        </div>
        {success ? (
          <div className="rounded-2xl bg-white p-6 text-center" style={{ border: "1px solid #EAEAEA", boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px rgba(17,24,39,0.06)" }}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "#E6F7F3" }}>
              <CheckCircle2 className="h-7 w-7" style={{ color: "#0F8B73" }} />
            </div>
            <h2 className="text-lg font-extrabold text-ink">تحقّق من بريدك!</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">أرسلنا رابط تأكيد إلى <span className="font-bold text-ink" dir="ltr">{email}</span>. افتح الرابط لتفعيل حسابك ثم سجّل الدخول.</p>
            <Link href="/sign-in" className="mt-5 inline-block w-full rounded-lg bg-coral py-3.5 text-[15px] font-extrabold text-white transition-opacity hover:opacity-90">الذهاب لتسجيل الدخول</Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #EAEAEA", boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px rgba(17,24,39,0.06)" }}>
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-lg px-3.5 py-3 text-[13px] font-semibold" style={{ background: "#FFF1F0", color: "#C2410C" }} role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span>
              </div>
            )}
            <label className="mb-4 block">
              <span className="mb-1.5 block text-[13px] font-bold text-ink">الاسم الكامل</span>
              <div className="relative">
                <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} placeholder="عبدالرحمن سليمان" autoComplete="name" className="w-full rounded-lg border border-line bg-white py-3 pr-10 pl-3 text-[14px] text-ink outline-none transition-colors focus:border-coral" disabled={loading} />
              </div>
            </label>
            <label className="mb-4 block">
              <span className="mb-1.5 block text-[13px] font-bold text-ink">البريد الإلكتروني</span>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input type="email" inputMode="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} placeholder="you@example.com" autoComplete="email" className="w-full rounded-lg border border-line bg-white py-3 pr-10 pl-3 text-[14px] text-ink outline-none transition-colors focus:border-coral" disabled={loading} />
              </div>
            </label>
            <label className="mb-4 block">
              <span className="mb-1.5 block text-[13px] font-bold text-ink">كلمة المرور</span>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input type={showPassword ? "text" : "password"} dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} placeholder="••••••••" autoComplete="new-password" className="w-full rounded-lg border border-line bg-white py-3 pr-10 pl-10 text-[14px] text-ink outline-none transition-colors focus:border-coral" disabled={loading} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink" aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} tabIndex={-1}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            <label className="mb-5 block">
              <span className="mb-1.5 block text-[13px] font-bold text-ink">تأكيد كلمة المرور</span>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input type={showPassword ? "text" : "password"} dir="ltr" value={confirm} onChange={(e) => setConfirm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} placeholder="••••••••" autoComplete="new-password" className="w-full rounded-lg border border-line bg-white py-3 pr-10 pl-3 text-[14px] text-ink outline-none transition-colors focus:border-coral" disabled={loading} />
              </div>
            </label>
            <button onClick={handleSubmit} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-coral py-3.5 text-[15px] font-extrabold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
              {loading ? (<><Loader2 className="h-4 w-4 animate-spin" />جارٍ إنشاء الحساب…</>) : ("إنشاء حساب")}
            </button>
          </div>
        )}
        {!success && (
          <p className="mt-6 text-center text-[13.5px] text-muted">لديك حساب بالفعل؟ <Link href="/sign-in" className="font-extrabold text-coral hover:underline">سجّل الدخول</Link></p>
        )}
      </div>
    </main>
  );
}

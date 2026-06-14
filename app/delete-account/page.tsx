"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteAccountPage() {
  const [step, setStep] = useState<"info" | "confirm" | "done">("info");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    if (!password) {
      setError("أدخل كلمة المرور للمتابعة.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // 1. Re-authenticate to verify password
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        setError("لم يتم التعرف على حسابك. سجّل دخولك مجدداً.");
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password,
      });

      if (signInError) {
        setError("كلمة المرور غلط. حاول مرة ثانية.");
        setLoading(false);
        return;
      }

      // 2. Delete user data from public tables
      await supabase.from("user_progress").delete().eq("user_id", user.id);
      await supabase.from("user_achievements").delete().eq("user_id", user.id);
      await supabase.from("profiles").delete().eq("id", user.id);

      // 3. Delete auth user via Edge Function (requires admin key on server)
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) {
        throw new Error("فشل حذف الحساب من الخادم.");
      }

      await supabase.auth.signOut();
      setStep("done");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ. تواصل مع الدعم."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
      className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-start px-4 py-16"
    >
      {/* Header */}
      <div className="w-full max-w-lg mb-10 text-center">
        <a href="/" className="inline-block mb-6">
          <span className="text-2xl font-bold text-[#FF4D4F]">HSK</span>
          <span className="text-2xl font-bold text-[#1A1A1A]"> بالعربي</span>
        </a>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">
          حذف الحساب
        </h1>
        <p className="text-[#666] text-base">
          نأخذ خصوصيتك بجدية — لك الحق الكامل في حذف حسابك في أي وقت.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-[#EBEBEB] overflow-hidden">

        {step === "info" && (
          <>
            {/* Warning Banner */}
            <div className="bg-[#FFF2F2] border-b border-[#FFCDD2] px-6 py-4 flex gap-3 items-start">
              <span className="text-[#FF4D4F] text-xl mt-0.5">⚠️</span>
              <p className="text-[#CC0000] text-sm font-medium leading-relaxed">
                هذا الإجراء نهائي ولا يمكن التراجع عنه.
              </p>
            </div>

            {/* What gets deleted */}
            <div className="px-6 py-6">
              <h2 className="text-base font-bold text-[#1A1A1A] mb-4">
                ماذا سيُحذف؟
              </h2>
              <ul className="space-y-3">
                {[
                  "بيانات حسابك الشخصية (الاسم، الإيميل، كلمة المرور)",
                  "كل تقدّمك في مستويات HSK 1–6",
                  "الإنجازات والشارات المكتسبة",
                  "إحصائياتك وسجل التعلّم",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#444]">
                    <span className="w-5 h-5 rounded-full bg-[#FFF0F0] text-[#FF4D4F] flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                      ✕
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#F0F0F0] px-6 py-5">
              {/* Alternative: email request */}
              <div className="bg-[#F5F3FF] rounded-xl px-5 py-4 mb-6">
                <p className="text-sm text-[#5B4FCF] font-semibold mb-1">
                  تفضّل الحذف عن طريق البريد؟
                </p>
                <p className="text-sm text-[#666] leading-relaxed">
                  أرسل لنا طلبك من إيميلك المسجّل إلى{" "}
                  <a
                    href="mailto:support@hsk-ar.com"
                    className="text-[#7C5CFC] font-semibold underline"
                  >
                    support@hsk-ar.com
                  </a>{" "}
                  وسنُنهي الحذف خلال 7 أيام عمل.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.back()}
                  className="flex-1 py-3 rounded-xl border border-[#DCDCDC] text-[#444] text-sm font-semibold hover:bg-[#F5F5F5] transition-colors"
                >
                  تراجع
                </button>
                <button
                  onClick={() => setStep("confirm")}
                  className="flex-1 py-3 rounded-xl bg-[#FF4D4F] text-white text-sm font-semibold hover:bg-[#E53E3E] transition-colors"
                >
                  أكمل — أريد الحذف
                </button>
              </div>
            </div>
          </>
        )}

        {step === "confirm" && (
          <div className="px-6 py-8">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">
              تأكيد الحذف
            </h2>
            <p className="text-sm text-[#666] mb-6 leading-relaxed">
              لحماية حسابك، أدخل كلمة المرور لتأكيد أنك صاحب الحساب.
            </p>

            <label className="block text-sm font-semibold text-[#333] mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-[#DCDCDC] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] bg-[#FAFAF8] focus:outline-none focus:border-[#FF4D4F] mb-2 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleDelete()}
            />

            {error && (
              <p className="text-xs text-[#FF4D4F] mb-4 mt-1">{error}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setStep("info");
                  setError("");
                  setPassword("");
                }}
                className="flex-1 py-3 rounded-xl border border-[#DCDCDC] text-[#444] text-sm font-semibold hover:bg-[#F5F5F5] transition-colors"
              >
                تراجع
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-[#FF4D4F] text-white text-sm font-semibold hover:bg-[#E53E3E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "جارٍ الحذف..." : "احذف حسابي نهائياً"}
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-3">
              تم حذف حسابك
            </h2>
            <p className="text-sm text-[#666] leading-relaxed mb-8">
              حُذفت جميع بياناتك بنجاح. شكراً لاستخدامك المنصة — نتمنى أن
              نراك مجدداً.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 rounded-xl bg-[#11A88E] text-white text-sm font-semibold hover:bg-[#0E9278] transition-colors"
            >
              العودة للرئيسية
            </a>
          </div>
        )}
      </div>

      {/* Footer note */}
      {step !== "done" && (
        <p className="mt-8 text-xs text-[#999] text-center max-w-sm leading-relaxed">
          إذا واجهت أي مشكلة، تواصل معنا على{" "}
          <a href="mailto:support@hsk-ar.com" className="text-[#7C5CFC]">
            support@hsk-ar.com
          </a>
          . نلتزم بمعالجة طلبات الحذف خلال 7 أيام عمل وفق سياسة الخصوصية.
        </p>
      )}
    </main>
  );
}

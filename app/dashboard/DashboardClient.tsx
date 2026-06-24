"use client";

import { useRouter } from "next/navigation";
import { LogOut, Sparkles, BookOpen, Trophy, Zap, ChevronLeft, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

type Props = {
  email: string;
  fullName: string | null;
  subscriptionStatus: string;
  trialEndsAt: string | null;
};

export function DashboardClient({
  email,
  fullName,
  subscriptionStatus,
  trialEndsAt,
}: Props) {
  const router = useRouter();
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  }

  // على iOS: كل المحتوى مجاني (الدفع لاحقاً عبر Apple IAP فقط)
  const isIOSApp =
    typeof window !== "undefined" &&
    (window as any).Capacitor &&
    typeof (window as any).Capacitor.getPlatform === "function" &&
    (window as any).Capacitor.getPlatform() === "ios";
  const isPaid =
    isIOSApp ||
    subscriptionStatus === "paid" ||
    subscriptionStatus === "active";

  const trialDaysLeft = trialEndsAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      )
    : null;

  const firstName = fullName?.split(" ")[0] ?? null;

  return (
    <main className="min-h-screen px-4 py-8" style={{ background: "#FAFAF8" }} dir="rtl">
      <div className="mx-auto max-w-xl">

        {/* رأس الصفحة */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-ink">
              أهلاً{firstName ? `، ${firstName}` : ""} 👋
            </h1>
            <p className="mt-0.5 text-sm text-muted" dir="ltr">{email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-[13px] font-bold text-ink hover:bg-gray-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>

        {/* بطاقة الاشتراك */}
        {isPaid ? (
          <div
            className="mb-5 rounded-2xl p-5"
            style={{
              background: "linear-gradient(135deg, #6B46C1 0%, #7C5CFC 100%)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">مشترك مدفوع ✨</h2>
                <p className="mt-0.5 text-[12.5px] text-white/80">
                  تمتع بالوصول الكامل لجميع الكلمات
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="mb-5 rounded-2xl p-5"
            style={{
              background: "linear-gradient(135deg, #FFF3D6 0%, #FFEAE0 55%, #FFE3E1 100%)",
              border: "1.5px solid #F3C97A",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/60">
                  <Sparkles className="h-6 w-6" style={{ color: "#B45309" }} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold" style={{ color: "#B45309" }}>
                    {trialDaysLeft !== null && trialDaysLeft > 0
                      ? `${trialDaysLeft} يوم متبقٍّ في التجربة`
                      : "الحساب المجاني"}
                  </h2>
                  <p className="mt-0.5 text-[12px] font-semibold" style={{ color: "#C2761A" }}>
                    أول 50 كلمة مجانية في كل مستوى
                  </p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="shrink-0 rounded-xl px-4 py-2 text-[12.5px] font-bold text-white transition-colors"
                style={{ background: "#B45309" }}
              >
                اشترك
              </Link>
            </div>
          </div>
        )}

        {/* روابط سريعة */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <QuickLink
            href="/hsk-levels"
            icon={<BookOpen className="h-5 w-5" />}
            label="المستويات"
            sublabel="HSK 1 → 9"
            color="#7C5CFC"
            bg="#F2EEFF"
          />
          <QuickLink
            href="/practice"
            icon={<Zap className="h-5 w-5" />}
            label="التمارين"
            sublabel="فلاش كاردز"
            color="#11A88E"
            bg="#E6F7F3"
          />
          <QuickLink
            href="/classifiers"
            icon={<BookOpen className="h-5 w-5" />}
            label="كلمات الكمية"
            sublabel="المصنّفات"
            color="#E8A03A"
            bg="#FDF6E7"
          />
          <QuickLink
            href="/achievements"
            icon={<Trophy className="h-5 w-5" />}
            label="إنجازاتي"
            sublabel="تقدمك وجوائزك"
            color="#E05C6A"
            bg="#FEF0F2"
          />
        </div>

        {/* بطاقة الترقية — فقط للمجانيين */}
        {!isPaid && (
          <div
            className="rounded-2xl p-5"
            style={{
              background: "#fff",
              border: "1px solid #EAEAEA",
              boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 4px 12px rgba(17,24,39,0.05)",
            }}
          >
            <h3 className="text-base font-extrabold text-ink mb-1">🔓 افتح كل الكلمات</h3>
            <p className="text-[13px] text-muted mb-4">
              اشترك للوصول لأكثر من 12,000 كلمة في جميع مستويات HSK
            </p>
            <div className="space-y-2 mb-4">
              {[
                "وصول كامل لكل الكلمات",
                "جميع مستويات HSK 1-9",
                "فلاش كاردز بدون حدود",
                "تتبع التقدم الكامل",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-[13px] text-ink">
                  <span className="text-green-500 font-bold">✓</span>
                  {f}
                </div>
              ))}
            </div>
            <Link
              href="/pricing"
              className="block w-full rounded-xl py-3 text-center text-[14px] font-extrabold text-white transition-colors"
              style={{ background: "linear-gradient(135deg, #6B46C1 0%, #7C5CFC 100%)" }}
            >
              اشترك الآن ←
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}

function QuickLink({
  href, icon, label, sublabel, color, bg,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  color: string;
  bg: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl bg-white p-4 transition-colors hover:bg-gray-50"
      style={{
        border: "1px solid #EAEAEA",
        boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 4px 12px rgba(17,24,39,0.05)",
      }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: bg, color }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-extrabold text-ink">{label}</p>
        <p className="text-[11.5px] text-muted">{sublabel}</p>
      </div>
      <ChevronLeft className="h-4 w-4 shrink-0 text-gray-300" />
    </Link>
  );
}

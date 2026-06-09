"use client";

import { useRouter } from "next/navigation";
import { LogOut, Calendar, User as UserIcon, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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

  // نحسب الأيام المتبقية في التجربة
  const trialDaysLeft = trialEndsAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      )
    : null;

  const statusLabel: Record<string, string> = {
    free: "مجاني",
    active: "مشترك",
    canceled: "ملغى",
  };

  return (
    <main className="min-h-screen px-5 py-10" style={{ background: "#FAFAF8" }}>
      <div className="mx-auto max-w-2xl">
        {/* رأس الصفحة */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-ink">
              أهلاً{fullName ? `، ${fullName}` : ""} 👋
            </h1>
            <p className="mt-1 text-sm text-muted" dir="ltr">
              {email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-[13px] font-bold text-ink transition-colors hover:bg-[#F7F7F7]"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>

        {/* بطاقة فترة التجربة */}
        {subscriptionStatus === "free" && trialDaysLeft !== null && (
          <div
            className="mb-5 rounded-2xl p-5"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #FFF3D6 0%, #FFEAE0 55%, #FFE3E1 100%)",
              border: "1.5px solid #F3C97A",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/60">
                <Sparkles className="h-6 w-6" style={{ color: "#B45309" }} />
              </div>
              <div>
                <h2 className="text-base font-extrabold" style={{ color: "#B45309" }}>
                  {trialDaysLeft > 0
                    ? `تجربتك المجانية: ${trialDaysLeft} يوم متبقٍّ`
                    : "انتهت فترتك التجريبية"}
                </h2>
                <p className="mt-0.5 text-[12.5px] font-semibold" style={{ color: "#C2761A" }}>
                  استمتع بكل الميزات خلال فترة التجربة
                </p>
              </div>
            </div>
          </div>
        )}

        {/* بطاقات المعلومات */}
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoCard
            icon={<UserIcon className="h-5 w-5" />}
            label="الاسم"
            value={fullName ?? "—"}
            accent="#7C5CFC"
            accentBg="#F2EEFF"
          />
          <InfoCard
            icon={<Sparkles className="h-5 w-5" />}
            label="الحالة"
            value={statusLabel[subscriptionStatus] ?? subscriptionStatus}
            accent="#11A88E"
            accentBg="#E6F7F3"
          />
          {trialEndsAt && (
            <InfoCard
              icon={<Calendar className="h-5 w-5" />}
              label="تنتهي التجربة"
              value={new Date(trialEndsAt).toLocaleDateString("ar-SA")}
              accent="#E8A03A"
              accentBg="#FDF6E7"
            />
          )}
        </div>

        {/* رابط العودة للتطبيق */}
        <div className="mt-8 text-center">
          <a href="/" className="text-[13.5px] font-bold text-coral hover:underline">
            ← العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
  accent,
  accentBg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  accentBg: string;
}) {
  return (
    <div
      className="rounded-2xl bg-white p-5"
      style={{
        border: "1px solid #EAEAEA",
        boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 4px 12px rgba(17,24,39,0.05)",
      }}
    >
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: accentBg, color: accent }}
      >
        {icon}
      </div>
      <p className="text-[12px] font-semibold text-muted">{label}</p>
      <p className="mt-0.5 text-[15px] font-extrabold text-ink">{value}</p>
    </div>
  );
}

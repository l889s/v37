import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./DashboardClient";

/**
 * صفحة لوحة التحكم — محمية (الـ middleware يمنع غير المسجّلين).
 * نجلب المستخدم وملفه (profile) من الخادم ونمرّرها للعميل.
 */
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // حماية إضافية على مستوى الصفحة (إلى جانب الـ middleware)
  if (!user) {
    redirect("/sign-in?redirect=/dashboard");
  }

  // نجلب ملف المستخدم (الاسم + حالة الاشتراك + نهاية التجربة)
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, subscription_status, trial_ends_at")
    .eq("user_id", user.id)
    .single();

  return (
    <DashboardClient
      email={user.email ?? ""}
      fullName={profile?.full_name ?? null}
      subscriptionStatus={profile?.subscription_status ?? "free"}
      trialEndsAt={profile?.trial_ends_at ?? null}
    />
  );
}

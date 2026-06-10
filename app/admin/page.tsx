import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // إحصائيات المستخدمين
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: freeUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("subscription_status", "free");

  const { count: paidUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("subscription_status", "paid");

  // التسجيلات آخر 7 أيام
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: recentSignups } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  // بناء بيانات الرسم البياني (آخر 7 أيام)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const chartData = days.map((day) => ({
    day,
    label: new Date(day).toLocaleDateString("ar-SA", { weekday: "short" }),
    count: recentSignups?.filter((s) =>
      s.created_at.startsWith(day)
    ).length ?? 0,
  }));

  // سجل النشاط
  const { data: activityLog } = await supabase
    .from("activity_log")
    .select("id, action, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(10);

  // جلب أسماء المستخدمين
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name");

  const profileMap = Object.fromEntries(
    (profiles || []).map((p) => [p.id, p.full_name])
  );

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  const stats = [
    { label: "إجمالي المستخدمين", value: totalUsers ?? 0, icon: "👥", color: "bg-violet-50 text-violet-600" },
    { label: "مستخدمون مجانيون", value: freeUsers ?? 0, icon: "🆓", color: "bg-mint-50 text-mint-600" },
    { label: "مشتركون مدفوعون", value: paidUsers ?? 0, icon: "💎", color: "bg-amber-50 text-amber-600" },
    {
      label: "تسجيلات هذا الأسبوع",
      value: recentSignups?.length ?? 0,
      icon: "📈",
      color: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">الإحصائيات العامة</h2>
        <p className="text-gray-500 mt-1">نظرة عامة على المشروع</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`inline-flex p-2.5 rounded-xl ${stat.color} mb-3`}>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* رسم بياني */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">التسجيلات — آخر 7 أيام</h3>
        <div className="flex items-end gap-3 h-40">
          {chartData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-gray-600">{d.count || ""}</span>
              <div className="w-full flex items-end" style={{ height: "100px" }}>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${Math.max((d.count / maxCount) * 100, d.count > 0 ? 8 : 2)}px`,
                    background: d.count > 0
                      ? "linear-gradient(180deg, #7C5CFC 0%, #9F7AEA 100%)"
                      : "#F3F4F6",
                  }}
                />
              </div>
              <span className="text-[11px] text-gray-400">{d.label}</span>
            </div>
          ))}
        </div>
        {recentSignups?.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-2">لا توجد تسجيلات هذا الأسبوع</p>
        )}
      </div>

      {/* سجل النشاط */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">سجل النشاط</h3>
          <span className="text-sm text-gray-400">آخر 10 أحداث</span>
        </div>
        <div className="divide-y divide-gray-50">
          {activityLog?.length === 0 && (
            <p className="p-6 text-gray-400 text-center">لا يوجد نشاط بعد</p>
          )}
          {activityLog?.map((log) => (
            <div key={log.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-sm">
                  {log.action.includes("تسجيل") ? "🆕" : log.action.includes("ترقية") ? "💎" : "⚡"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {profileMap[log.user_id] || "مستخدم"}
                  </p>
                  <p className="text-xs text-gray-500">{log.action}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(log.created_at).toLocaleDateString("ar-SA")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

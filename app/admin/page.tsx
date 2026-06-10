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

  // آخر المسجلين
  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("id, full_name, created_at, subscription_status, role")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      label: "إجمالي المستخدمين",
      value: totalUsers ?? 0,
      icon: "👥",
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "مستخدمون مجانيون",
      value: freeUsers ?? 0,
      icon: "🆓",
      color: "bg-mint-50 text-mint-600",
    },
    {
      label: "مشتركون مدفوعون",
      value: paidUsers ?? 0,
      icon: "💎",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">الإحصائيات العامة</h2>
        <p className="text-gray-500 mt-1">نظرة عامة على المشروع</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-4`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">آخر المسجلين</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {recentUsers?.length === 0 && (
            <p className="p-6 text-gray-400 text-center">لا يوجد مستخدمون بعد</p>
          )}
          {recentUsers?.map((user) => (
            <div
              key={user.id}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {user.full_name || "بدون اسم"}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(user.created_at).toLocaleDateString("ar-SA")}
                </p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  user.subscription_status === "paid"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {user.subscription_status === "paid" ? "مدفوع" : "مجاني"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

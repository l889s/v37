"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  subscription_status: string | null;
  role: string | null;
  created_at: string;
};

type FilterType = "all" | "free" | "paid";

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase
      .from("profiles_with_email")
      .select("id, full_name, email, subscription_status, role, created_at")
      .order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }

  async function updateSubscription(userId: string, status: string) {
    setUpdating(userId);
    const { data, error } = await supabase
      .from("profiles")
      .update({ subscription_status: status })
      .eq("id", userId)
      .select();

    if (error) {
      alert("خطأ في التحديث: " + error.message);
      console.error("Update error:", error);
    } else if (!data || data.length === 0) {
      alert("لم يتم تحديث أي صف — على الأغلب صلاحيات RLS تمنع التعديل. راجع سياسات الأمان في Supabase.");
      console.warn("No rows updated. Likely RLS blocking the update.");
    }

    await fetchUsers();
    setUpdating(null);
  }

  const filtered = users.filter((u) => {
    const matchSearch =
      (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "free" && u.subscription_status !== "paid") ||
      (filter === "paid" && u.subscription_status === "paid");
    return matchSearch && matchFilter;
  });

  const counts = {
    all: users.length,
    free: users.filter((u) => u.subscription_status !== "paid").length,
    paid: users.filter((u) => u.subscription_status === "paid").length,
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">المستخدمون</h2>
          <p className="text-gray-500 mt-1">إدارة الاشتراكات والصلاحيات</p>
        </div>
        <span className="bg-violet-100 text-violet-700 text-sm px-4 py-2 rounded-full font-medium">
          {users.length} مستخدم
        </span>
      </div>

      {/* فلاتر الاشتراك */}
      <div className="flex gap-2 mb-5">
        {(["all", "free", "paid"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "الكل" : f === "free" ? "مجاني" : "مدفوع"}
            <span className="mr-1.5 opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* بحث */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="ابحث بالاسم أو الإيميل..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 text-right"
        />
      </div>

      {/* جدول */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">جاري التحميل...</div>
        ) : (
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الاسم</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الإيميل</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">تاريخ التسجيل</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الدور</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الاشتراك</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.full_name || "بدون اسم"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dir-ltr">
                    {user.email || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.role === "admin" ? "مدير" : "مستخدم"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      user.subscription_status === "paid"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.subscription_status === "paid" ? "مدفوع" : "مجاني"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {updating === user.id ? (
                      <span className="text-sm text-gray-400">جاري...</span>
                    ) : user.subscription_status === "paid" ? (
                      <button
                        onClick={() => updateSubscription(user.id, "free")}
                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                      >
                        إلغاء الاشتراك
                      </button>
                    ) : (
                      <button
                        onClick={() => updateSubscription(user.id, "paid")}
                        className="text-sm text-amber-500 hover:text-amber-600 font-medium"
                      >
                        ترقية للمدفوع
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    لا يوجد مستخدمون
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

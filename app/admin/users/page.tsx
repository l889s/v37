"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Profile = {
  id: string;
  full_name: string | null;
  subscription_status: string | null;
  role: string | null;
  created_at: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, subscription_status, role, created_at")
      .order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }

  async function updateSubscription(userId: string, status: string) {
    setUpdating(userId);
    await supabase
      .from("profiles")
      .update({ subscription_status: status })
      .eq("id", userId);
    await fetchUsers();
    setUpdating(null);
  }

  const filtered = users.filter((u) =>
    (u.full_name || "").toLowerCase().includes(search.toLowerCase())
  );

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

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="ابحث باسم المستخدم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 text-right"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">جاري التحميل...</div>
        ) : (
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الاسم</th>
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
                      <span className="text-sm text-gray-400">جاري التحديث...</span>
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
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
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

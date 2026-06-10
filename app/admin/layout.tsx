import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-gray-200 flex flex-col fixed h-full shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-sm text-gray-500 mt-1">HSK Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-coral-50 hover:text-coral-600 transition-colors font-medium"
          >
            <span className="text-lg">📊</span>
            الإحصائيات
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-coral-50 hover:text-coral-600 transition-colors font-medium"
          >
            <span className="text-lg">👥</span>
            المستخدمون
          </Link>
          <Link
            href="/admin/words"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-coral-50 hover:text-coral-600 transition-colors font-medium"
          >
            <span className="text-lg">📚</span>
            إدارة الكلمات
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            مرحباً، {profile?.full_name || user.email}
          </p>
          <Link
            href="/"
            className="text-sm text-coral-500 hover:text-coral-600 mt-1 block"
          >
            ← العودة للموقع
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64 p-8">
        {children}
      </main>
    </div>
  );
}

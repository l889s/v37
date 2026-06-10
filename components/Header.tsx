"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md"
      dir="rtl"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        {/* الشعار */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-ink">中 HSK</span>
        </Link>

        {/* أزرار الحالة */}
        {user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-bold transition-colors"
              style={{ background: "#F2EEFF", color: "#7C5CFC" }}
            >
              <User className="h-3.5 w-3.5" />
              لوحتي
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2 text-[13px] font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              خروج
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/sign-in"
              className="rounded-xl border border-gray-200 px-3.5 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              تسجيل دخول
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl px-3.5 py-2 text-[13px] font-bold text-white transition-colors"
              style={{ background: "linear-gradient(135deg, #6B46C1 0%, #7C5CFC 100%)" }}
            >
              ابدأ مجاناً
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

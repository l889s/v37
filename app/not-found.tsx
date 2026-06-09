import Link from "next/link";
import { Home, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-white px-6"
    >
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-violet-soft">
          <span className="text-4xl">🧭</span>
        </div>

        <h1 className="mb-3 text-xl font-extrabold text-ink">
          الصفحة غير موجودة
        </h1>

        <p className="mb-6 text-[13px] leading-relaxed text-muted">
          لم نتمكّن من العثور على ما تبحث عنه. ربما تم نقل الصفحة أو الرابط
          خاطئ.
        </p>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-ink py-3 text-[13px] font-bold text-white hover:bg-black"
          >
            <Home className="h-4 w-4" />
            العودة للرئيسية
          </Link>
          <Link
            href="/hsk-levels"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#F7F7F7] py-3 text-[13px] font-bold text-muted hover:bg-[#EEEEEE]"
          >
            <BookOpen className="h-4 w-4" />
            تصفّح المستويات
          </Link>
        </div>
      </div>
    </main>
  );
}

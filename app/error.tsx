"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

/**
 * Next.js error boundary
 * يظهر تلقائياً لو حصل خطأ غير متوقّع في أي صفحة
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // في الإنتاج، الأخطاء تُسجّل بنظام monitoring لاحقاً
    if (process.env.NODE_ENV === "development") {
      console.error("App error:", error);
    }
  }, [error]);

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-white px-6"
    >
      <div className="max-w-sm text-center">
        {/* أيقونة في صندوق ملوّن */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-coral-soft">
          <span className="text-4xl">😕</span>
        </div>

        <h1 className="mb-3 text-xl font-extrabold text-ink">
          حدث خطأ غير متوقّع
        </h1>

        <p className="mb-6 text-[13px] leading-relaxed text-muted">
          لا تقلق، بياناتك محفوظة. حاول تحديث الصفحة، أو ارجع للرئيسية إن استمرت
          المشكلة.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-lg bg-ink py-3 text-[13px] font-bold text-white hover:bg-black"
          >
            <RefreshCw className="h-4 w-4" />
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#F7F7F7] py-3 text-[13px] font-bold text-muted hover:bg-[#EEEEEE]"
          >
            <Home className="h-4 w-4" />
            العودة للرئيسية
          </Link>
        </div>

        {/* تفاصيل تقنية للمطور (مخفية افتراضياً) */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-right">
            <summary className="cursor-pointer text-[11px] font-bold text-muted">
              تفاصيل تقنية
            </summary>
            <pre
              className="mt-2 max-h-40 overflow-auto rounded-lg bg-[#FAFAFA] p-3 text-[10px] leading-relaxed text-coral"
              dir="ltr"
            >
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </main>
  );
}

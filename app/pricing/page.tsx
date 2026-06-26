"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const features = [
  "وصول كامل لجميع الكلمات",
  "أكثر من 12,000 كلمة HSK 1-9",
  "فلاش كاردز بدون حدود",
  "تتبع التقدم الكامل",
  "نطق صوتي لكل الكلمات",
  "أمثلة وجمل تطبيقية",
  "جميع تمارين المستويات",
];

export default function PricingPage() {
  return (
    <main
      className="min-h-screen px-4 py-10"
      style={{ background: "#FAFAF8" }}
      dir="rtl"
    >
      <div className="mx-auto max-w-lg">
        {/* رأس الصفحة */}
        <div className="mb-8 text-center">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] font-bold"
            style={{ background: "#F2EEFF", color: "#7C5CFC" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            محتوى المنصة
          </div>
          <h1 className="text-3xl font-extrabold text-ink mb-2">
            كل ما تقدّمه المنصة
          </h1>
          <p className="text-[14px] text-muted">
            أكثر من 12,000 كلمة صينية بالعربي — تعلّم بدون حدود
          </p>
        </div>

        {/* المميزات */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "#fff",
            border: "1px solid #EAEAEA",
          }}
        >
          <h3 className="text-[14px] font-extrabold text-ink mb-4">
            ما تحصل عليه في المنصة:
          </h3>
          <div className="space-y-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "#E6F7F3" }}
                >
                  <span style={{ color: "#11A88E" }} className="text-xs font-bold">
                    ✓
                  </span>
                </div>
                <span className="text-[13.5px] text-ink">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* رابط العودة */}
        <div className="text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-muted hover:text-ink transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للوحة التحكم
          </Link>
        </div>
      </div>
    </main>
  );
}

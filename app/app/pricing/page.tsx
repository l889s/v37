"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles, Crown } from "lucide-react";

const plans = [
  {
    id: "weekly",
    label: "أسبوعي",
    price: 19,
    period: "أسبوع",
    perMonth: null,
    saving: null,
    popular: false,
  },
  {
    id: "monthly",
    label: "شهري",
    price: 49,
    period: "شهر",
    perMonth: 49,
    saving: null,
    popular: false,
  },
  {
    id: "3months",
    label: "3 أشهر",
    price: 119,
    period: "3 أشهر",
    perMonth: 40,
    saving: 28,
    popular: false,
  },
  {
    id: "6months",
    label: "6 أشهر",
    price: 199,
    period: "6 أشهر",
    perMonth: 33,
    saving: 32,
    popular: false,
  },
  {
    id: "yearly",
    label: "سنوي",
    price: 375,
    period: "سنة",
    perMonth: 31,
    saving: 36,
    popular: true,
  },
];

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
  const [selected, setSelected] = useState("yearly");

  const selectedPlan = plans.find((p) => p.id === selected)!;

  return (
    <main className="min-h-screen px-4 py-10" style={{ background: "#FAFAF8" }} dir="rtl">
      <div className="mx-auto max-w-lg">

        {/* رأس الصفحة */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] font-bold"
            style={{ background: "#F2EEFF", color: "#7C5CFC" }}>
            <Crown className="h-3.5 w-3.5" />
            اشتراك مدفوع
          </div>
          <h1 className="text-3xl font-extrabold text-ink mb-2">
            افتح كل الكلمات
          </h1>
          <p className="text-[14px] text-muted">
            أكثر من 12,000 كلمة صينية بالعربي — تعلّم بدون حدود
          </p>
        </div>

        {/* خطط الاشتراك */}
        <div className="space-y-3 mb-6">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className="w-full rounded-2xl p-4 text-right transition-all"
              style={{
                background: selected === plan.id ? "#fff" : "#fff",
                border: selected === plan.id
                  ? "2px solid #7C5CFC"
                  : "1.5px solid #E5E7EB",
                boxShadow: selected === plan.id
                  ? "0 0 0 4px #F2EEFF"
                  : "none",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Radio */}
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                    style={{
                      borderColor: selected === plan.id ? "#7C5CFC" : "#D1D5DB",
                      background: selected === plan.id ? "#7C5CFC" : "transparent",
                    }}
                  >
                    {selected === plan.id && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-extrabold text-ink">
                        {plan.label}
                      </span>
                      {plan.popular && (
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                          style={{ background: "#7C5CFC" }}
                        >
                          الأفضل قيمة
                        </span>
                      )}
                      {plan.saving && (
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                          style={{ background: "#E6F7F3", color: "#11A88E" }}
                        >
                          وفّر {plan.saving}%
                        </span>
                      )}
                    </div>
                    {plan.perMonth && (
                      <p className="text-[12px] text-muted mt-0.5">
                        {plan.perMonth} ريال / شهر
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[20px] font-extrabold text-ink">
                    {plan.price}
                  </span>
                  <span className="text-[12px] text-muted"> ر.س</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* زر الاشتراك */}
        <button
          className="w-full rounded-2xl py-4 text-[16px] font-extrabold text-white transition-all mb-4"
          style={{
            background: "linear-gradient(135deg, #6B46C1 0%, #7C5CFC 100%)",
            boxShadow: "0 4px 20px rgba(124,92,252,0.4)",
          }}
          onClick={() => alert("سيتم ربط الدفع قريباً")}
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5" />
            اشترك الآن — {selectedPlan.price} ريال / {selectedPlan.period}
          </span>
        </button>

        {/* المميزات */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "#fff",
            border: "1px solid #EAEAEA",
          }}
        >
          <h3 className="text-[14px] font-extrabold text-ink mb-4">
            كل ما تحصل عليه:
          </h3>
          <div className="space-y-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "#E6F7F3" }}
                >
                  <Check className="h-3 w-3" style={{ color: "#11A88E" }} />
                </div>
                <span className="text-[13.5px] text-ink">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ملاحظة */}
        <p className="text-center text-[12px] text-muted mb-6">
          لا توجد رسوم خفية • يمكن الإلغاء في أي وقت
        </p>

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

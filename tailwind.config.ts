import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coral:  { DEFAULT: "#FF4D4F", soft: "#FFF1F0" },
        violet: { DEFAULT: "#7C5CFC", soft: "#F2EEFF" },
        mint:   { DEFAULT: "#11A88E", soft: "#E6F7F3", deep: "#0F8B73" }, // deep = للنص (تباين AA)
        sky:    { DEFAULT: "#2F8FE0", soft: "#E8F3FC" }, // أزرق — كلمات الكمية
        amber:  { DEFAULT: "#E08A1E", soft: "#FDF2E0" }, // برتقالي — جذور الكلمات
        ink: "#1A1A1A",
        muted: "#6B7280", // ← رفع التباين من #8C8C8C لـ#6B7280 (يجتاز AA)
        line:  "#EAEAEA", // ← حدود ناعمة على الأبيض النقي
      },
      fontFamily: {
        sans: ["'IBM Plex Sans Arabic'", "'Noto Sans SC'", "sans-serif"],
        cn:   ["'Noto Sans SC'", "sans-serif"],
      },
      borderRadius: {
        // 8px موحّد للزوايا (حسب طلب المستخدم)
        DEFAULT: "8px",
      },
      boxShadow: {
        // 3 طبقات ظلال
        card:      "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        cardLg:    "0 4px 12px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
        cardHover: "0 4px 16px rgba(0,0,0,0.08)",
        // ظلال البطاقات المتدرّجة (عمق ناعم — مستوحى من v28)
        cardSoft:  "0 1px 2px rgba(17,24,39,0.04), 0 3px 8px rgba(17,24,39,0.05), 0 8px 20px rgba(17,24,39,0.04)",
        cardSoftHover: "0 2px 4px rgba(17,24,39,0.05), 0 6px 14px rgba(17,24,39,0.08), 0 14px 30px rgba(17,24,39,0.06)",
        coral:     "0 8px 24px rgba(255,77,79,0.28)",
        violet:    "0 8px 24px rgba(124,92,252,0.28)",
        sky:       "0 8px 24px rgba(47,143,224,0.28)",
        amber:     "0 8px 24px rgba(224,138,30,0.28)",
        nav:       "0 -2px 16px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;

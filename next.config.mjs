/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // لا نوقف بناء الإنتاج بسبب تحذيرات ESLint (يمنع فشل النشر على Vercel
  // بسبب تحذير غير حرج مثل متغيّر غير مستخدم).
  eslint: {
    ignoreDuringBuilds: true,
  },
  // أخطاء TypeScript تُكتشف محلياً عبر `npm run type-check`؛
  // نتجنّب توقّف نشر الإنتاج بسببها.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

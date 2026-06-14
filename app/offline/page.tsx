export default function OfflinePage() {
  return (
    <main
      dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
      className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="text-6xl mb-6">📵</div>
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3">
        لا يوجد اتصال بالإنترنت
      </h1>
      <p className="text-[#666] text-base mb-8 max-w-xs leading-relaxed">
        تحقق من اتصالك وحاول مجدداً. الصفحات التي زرتها سابقاً متاحة بدون
        إنترنت.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 rounded-xl bg-[#FF4D4F] text-white font-semibold text-sm"
      >
        إعادة المحاولة
      </button>
    </main>
  );
}

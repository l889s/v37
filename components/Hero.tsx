export function Hero({
  title,
  subtitle,
  emoji = "中",
  kicker = "汉语学习 · تعلُّم الصينية",
}: {
  title: string;
  subtitle: string;
  emoji?: string;
  kicker?: string;
}) {
  return (
    <section className="mx-auto max-w-2xl px-6 pb-4 pt-6 sm:pt-7">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-[44px] w-[44px] items-center justify-center rounded-2xl bg-coral font-cn text-[22px] font-black text-white shadow-[0_8px_20px_rgba(255,77,79,0.32)]">
          {emoji}
        </div>
        <span className="text-[13px] font-semibold tracking-wide text-muted">
          {kicker}
        </span>
      </div>

      <h1 className="mb-2 whitespace-pre-line text-[23px] sm:text-[26px] font-extrabold leading-tight tracking-tight text-ink">
        {title}
      </h1>
      <p className="text-[14px] leading-relaxed text-muted">{subtitle}</p>
    </section>
  );
}

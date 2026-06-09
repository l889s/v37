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
    <section className="mx-auto max-w-2xl px-6 pb-7 pt-12 sm:pt-14">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-coral font-cn text-[26px] font-black text-white shadow-[0_8px_20px_rgba(255,77,79,0.32)]">
          {emoji}
        </div>
        <span className="text-[13px] font-semibold tracking-wide text-muted">
          {kicker}
        </span>
      </div>

      <h1 className="mb-3 whitespace-pre-line text-[28px] sm:text-[32px] font-extrabold leading-tight tracking-tight text-ink">
        {title}
      </h1>
      <p className="text-[15px] leading-relaxed text-muted">{subtitle}</p>
    </section>
  );
}

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
    <section className="mx-auto max-w-2xl px-6 pb-2.5 pt-3">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-xl bg-coral font-cn text-[18px] font-black text-white shadow-[0_5px_14px_rgba(255,77,79,0.28)]">
          {emoji}
        </div>
        <span className="text-[12px] font-semibold tracking-wide text-muted">
          {kicker}
        </span>
      </div>

      <h1 className="mb-1 whitespace-pre-line text-[19px] sm:text-[22px] font-extrabold leading-snug tracking-tight text-ink">
        {title}
      </h1>
      <p className="text-[13px] leading-relaxed text-muted">{subtitle}</p>
    </section>
  );
}

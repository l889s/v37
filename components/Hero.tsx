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
    <section className="mx-auto max-w-2xl px-6 pb-3 pt-4 sm:pt-5">
      <div className="mb-2.5 flex items-center gap-2.5">
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-xl bg-coral font-cn text-[20px] font-black text-white shadow-[0_6px_16px_rgba(255,77,79,0.30)]">
          {emoji}
        </div>
        <span className="text-[12.5px] font-semibold tracking-wide text-muted">
          {kicker}
        </span>
      </div>

      <h1 className="mb-1.5 whitespace-pre-line text-[21px] sm:text-[24px] font-extrabold leading-tight tracking-tight text-ink">
        {title}
      </h1>
      <p className="text-[13.5px] leading-relaxed text-muted">{subtitle}</p>
    </section>
  );
}

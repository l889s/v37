"use client";

export default function TermsPage() {
  const lastUpdated = "١٤ يونيو ٢٠٢٥";

  const sections = [
    {
      id: "01",
      title: "قبول الشروط",
      content: `باستخدامك لمنصة HSK بالعربي (hsk-ar.com)، سواء بالتسجيل أو تصفّح المحتوى، فأنت توافق على هذه الشروط كاملةً.

إذا كنت لا توافق على أي بند، يُرجى عدم استخدام المنصة.`,
    },
    {
      id: "02",
      title: "وصف الخدمة",
      content: `HSK بالعربي منصة تعليمية إلكترونية تقدّم:`,
      items: [
        "محتوى تعليمي لمستويات HSK 1 إلى 6 (مفردات، قواعد، كلمات الكمية)",
        "تتبّع التقدّم التعليمي وحفظ الإنجازات",
        "تمارين تفاعلية وبطاقات تعلّم",
        "خطط اشتراك مجانية ومدفوعة للوصول للمحتوى الكامل",
      ],
    },
    {
      id: "03",
      title: "الحساب والتسجيل",
      subsections: [
        {
          label: "إنشاء الحساب",
          items: [
            "يجب أن يكون عمرك 13 سنة أو أكثر لإنشاء حساب",
            "تلتزم بتقديم معلومات صحيحة عند التسجيل",
            "أنت مسؤول عن سرية كلمة مرورك وعن كل النشاطات التي تتم من حسابك",
          ],
        },
        {
          label: "أمان الحساب",
          items: [
            "أخبرنا فوراً على support@hsk-ar.com إذا اشتبهت في اختراق حسابك",
            "لا نتحمّل مسؤولية أي ضرر ناتج عن إهمالك في حماية بياناتك",
          ],
        },
      ],
    },
    {
      id: "04",
      title: "الاشتراكات والدفع",
      subsections: [
        {
          label: "الخطة المجانية",
          items: [
            "تتيح الوصول لعدد محدود من الكلمات والمحتوى في كل مستوى",
            "متاحة دون حدّ زمني",
          ],
        },
        {
          label: "الخطة المدفوعة",
          items: [
            "تتيح الوصول الكامل لجميع المحتوى في كل المستويات",
            "الأسعار معروضة في صفحة الاشتراك وتشمل ضريبة القيمة المضافة إن طُبِّقت",
            "تُجدَّد الاشتراكات تلقائياً ما لم تُلغِها قبل موعد التجديد",
            "بيانات الدفع تُعالَج بأمان عبر مزوّد دفع خارجي معتمد — لا نحتفظ ببياناتك البنكية",
          ],
        },
        {
          label: "الإلغاء والاسترداد",
          items: [
            "يمكنك إلغاء اشتراكك في أي وقت — يبقى نشطاً حتى نهاية الفترة المدفوعة",
            "لا نقدّم استرداداً على الفترات المنقضية من الاشتراك",
            "في حالات استثنائية (أعطال تقنية من طرفنا)، يُدرَس طلب الاسترداد على support@hsk-ar.com",
          ],
        },
      ],
    },
    {
      id: "05",
      title: "حقوق الملكية الفكرية",
      content: `جميع المحتويات على المنصة — بما فيها النصوص العربية والصينية، الشرح التعليمي، التصميمات، الأيقونات، وقواعد البيانات — هي ملك حصري لمنصة HSK بالعربي ومحميّة بحقوق النشر.`,
      items: [
        "يُسمح لك باستخدام المحتوى لأغراض تعليمية شخصية فقط",
        "يُحظر نسخ المحتوى أو إعادة توزيعه أو بيعه أو استخدامه تجارياً بأي شكل",
        "يُحظر استخدام أدوات آلية لاستخراج البيانات (Scraping) من المنصة",
      ],
    },
    {
      id: "06",
      title: "القيود والاستخدام المقبول",
      content: "تلتزم بعدم القيام بما يلي:",
      items: [
        "مشاركة حسابك مع أشخاص آخرين",
        "محاولة اختراق المنصة أو التلاعب بنتائجها أو تقدّمها",
        "استخدام المنصة بأي طريقة تخالف القوانين السعودية أو الدولية المعمول بها",
        "نشر أي محتوى مسيء أو مضلّل عبر أي قناة مرتبطة بالمنصة",
      ],
    },
    {
      id: "07",
      title: "تعليق الحساب وإنهاؤه",
      items: [
        "نحتفظ بحق تعليق أو إنهاء حسابك فوراً عند انتهاك هذه الشروط",
        "في حال التعليق بسبب خطأ من طرفنا، سنُعيد تفعيل الحساب ونمدّد الاشتراك بما يعادل فترة التعليق",
        "يمكنك حذف حسابك في أي وقت من hsk-ar.com/delete-account",
      ],
    },
    {
      id: "08",
      title: "إخلاء المسؤولية",
      content: `المنصة تُقدَّم «كما هي» بذل جهد معقول في الدقة والجودة. لا نضمن:`,
      items: [
        "خلوّ المنصة من أي أخطاء تقنية أو انقطاعات مؤقتة",
        "أن تُحقّق نتائج دراسية محددة جراء استخدام المنصة",
        "توافر المنصة بشكل مستمر ١٠٠٪ من الوقت",
      ],
      note: "مسؤوليتنا القصوى تجاهك لا تتجاوز المبلغ الذي دفعته خلال آخر 12 شهراً.",
    },
    {
      id: "09",
      title: "التعديلات على الشروط",
      content: `يحق لنا تعديل هذه الشروط في أي وقت. عند إجراء تغييرات جوهرية:`,
      items: [
        "سنُخطرك عبر البريد الإلكتروني المسجّل قبل 14 يوماً من التطبيق",
        "أو عبر إشعار واضح داخل المنصة",
        "استمرارك في الاستخدام بعد التاريخ المحدد يُعدّ قبولاً للشروط الجديدة",
      ],
    },
    {
      id: "10",
      title: "القانون المطبّق",
      content: `تخضع هذه الشروط لأنظمة المملكة العربية السعودية. أي نزاع يُحال أولاً للتسوية الودّية خلال 30 يوماً، وفي حال تعذّر ذلك تُختص به المحاكم السعودية المختصة.`,
    },
    {
      id: "11",
      title: "التواصل معنا",
      content: `لأي استفسار بخصوص هذه الشروط:
البريد الإلكتروني: support@hsk-ar.com
الموقع: hsk-ar.com`,
    },
  ];

  return (
    <main
      dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
      className="min-h-screen bg-[#FAFAF8]"
    >
      {/* Hero */}
      <div className="bg-white border-b border-[#EBEBEB]">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <a href="/" className="inline-block mb-8">
            <span className="text-2xl font-bold text-[#FF4D4F]">HSK</span>
            <span className="text-2xl font-bold text-[#1A1A1A]"> بالعربي</span>
          </a>
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
            شروط الاستخدام
          </h1>
          <p className="text-[#666] text-base">آخر تحديث: {lastUpdated}</p>
          <div className="mt-6 inline-flex items-center gap-2 bg-[#FFF8F0] text-[#C47D0E] text-sm font-medium px-4 py-2 rounded-full border border-[#F5DFA0]">
            <span>📋</span>
            <span>باستخدامك للمنصة، أنت توافق على هذه الشروط</span>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 mb-10">
          <p className="text-xs text-[#999] font-semibold uppercase tracking-widest mb-4">
            المحتويات
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#section-${s.id}`}
                className="flex items-center gap-3 text-sm text-[#444] hover:text-[#7C5CFC] transition-colors group"
              >
                <span className="text-xs font-mono text-[#CCC] group-hover:text-[#7C5CFC] transition-colors">
                  {s.id}
                </span>
                <span>{s.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.id}
              id={`section-${section.id}`}
              className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden scroll-mt-6"
            >
              {/* Header */}
              <div className="flex items-center gap-4 px-6 py-5 border-b border-[#F5F5F5]">
                <span className="text-xs font-mono text-[#CCC] w-6 flex-shrink-0">
                  {section.id}
                </span>
                <h2 className="text-base font-bold text-[#1A1A1A]">
                  {section.title}
                </h2>
              </div>

              <div className="px-6 py-5 space-y-4">
                {/* Plain text */}
                {section.content && (
                  <p className="text-sm text-[#444] leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                )}

                {/* Simple items */}
                {section.items && (
                  <ul className="space-y-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#444]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] flex-shrink-0 mt-2" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Note */}
                {section.note && (
                  <div className="bg-[#FFF8F0] rounded-xl px-4 py-3 border border-[#F5DFA0]">
                    <p className="text-sm text-[#8B5E00]">{section.note}</p>
                  </div>
                )}

                {/* Subsections */}
                {section.subsections && (
                  <div className="space-y-5">
                    {section.subsections.map((sub, i) => (
                      <div key={i}>
                        <p className="text-xs font-bold text-[#999] uppercase tracking-wide mb-3">
                          {sub.label}
                        </p>
                        <ul className="space-y-2">
                          {sub.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-[#444]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#11A88E] flex-shrink-0 mt-2" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pb-16">
          <p className="text-sm text-[#888] mb-4">
            لديك سؤال بخصوص هذه الشروط؟
          </p>
          <a
            href="mailto:support@hsk-ar.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7C5CFC] text-white text-sm font-semibold hover:bg-[#6B4DE6] transition-colors"
          >
            <span>✉️</span>
            <span>تواصل مع الدعم</span>
          </a>
          <div className="mt-8 flex justify-center gap-6 text-sm text-[#AAA]">
            <a href="/privacy" className="hover:text-[#7C5CFC] transition-colors">
              سياسة الخصوصية
            </a>
            <span>·</span>
            <a href="/delete-account" className="hover:text-[#FF4D4F] transition-colors">
              حذف الحساب
            </a>
            <span>·</span>
            <a href="/" className="hover:text-[#7C5CFC] transition-colors">
              الرئيسية
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

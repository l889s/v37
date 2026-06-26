"use client";

export default function PrivacyPage() {
  const lastUpdated = "٢٦ يونيو ٢٠٢٦";

  const sections = [
    {
      id: "01",
      title: "من نحن",
      content: `منصة HSK بالعربي (hsk-ar.com) هي منصة تعليمية متخصصة في تعليم اللغة الصينية للناطقين بالعربية، تغطي مستويات HSK من 1 إلى 6. المنصة مملوكة ومشغّلة من المملكة العربية السعودية.

للتواصل: support@hsk-ar.com`,
    },
    {
      id: "02",
      title: "البيانات التي نجمعها",
      subsections: [
        {
          label: "عند إنشاء الحساب",
          items: [
            "الاسم الذي تختاره",
            "عنوان البريد الإلكتروني",
            "كلمة المرور (مشفّرة — لا أحد يطّلع عليها بما فينا نحن)",
          ],
        },
        {
          label: "أثناء استخدام المنصة",
          items: [
            "الكلمات والمستويات التي درستها",
            "نتائج التمارين والاختبارات",
            "الإنجازات التي حققتها",
            "وقت وتاريخ جلسات التعلّم",
          ],
        },
        {
          label: "بيانات تقنية تُجمع تلقائياً",
          items: [
            "نوع المتصفح والجهاز",
            "عنوان IP (للتحقق من المنطقة الجغرافية وأمان الحساب)",
            "بيانات الاستخدام العامة لتحسين المنصة",
          ],
        },
      ],
    },
    {
      id: "03",
      title: "كيف نستخدم بياناتك",
      items: [
        "تشغيل حسابك وتقديم الخدمة التعليمية",
        "تتبّع تقدّمك وحفظ إنجازاتك",
        "إرسال إشعارات ضرورية تتعلق بحسابك (تأكيد التسجيل، تنبيهات أمنية)",
        "تحسين محتوى المنصة بناءً على أنماط الاستخدام العامة",
        "الامتثال للمتطلبات القانونية",
      ],
      note: "لا نستخدم بياناتك للإعلانات ولا نبيعها لأي طرف ثالث.",
    },
    {
      id: "04",
      title: "مشاركة البيانات مع أطراف ثالثة",
      content: `نتعامل مع عدد محدود من الخدمات الخارجية الضرورية لتشغيل المنصة:`,
      thirdParties: [
        {
          name: "Supabase",
          role: "قاعدة البيانات والمصادقة",
          note: "خوادم في الاتحاد الأوروبي أو الولايات المتحدة",
        },
        {
          name: "Vercel",
          role: "استضافة الموقع",
          note: "شبكة عالمية CDN",
        },
      ],
      footer:
        "لا نشارك بياناتك مع أي جهة أخرى إلا بموجب أمر قضائي أو طلب قانوني ملزم.",
    },
    {
      id: "05",
      title: "حقوقك كمستخدم",
      items: [
        "الاطلاع على بياناتك — يمكنك طلب نسخة من بياناتك في أي وقت",
        "تصحيح بياناتك — تواصل معنا إذا كانت هناك معلومات غير دقيقة",
        "حذف حسابك وجميع بياناتك — من خلال صفحة حذف الحساب مباشرة أو عبر support@hsk-ar.com",
        "الاعتراض على معالجة بياناتك — تواصل معنا وسنردّ خلال 7 أيام عمل",
      ],
    },
    {
      id: "06",
      title: "حذف الحساب والبيانات",
      content: `عند حذف حسابك، نحذف فوراً:
- بياناتك الشخصية (الاسم، الإيميل)
- كل تقدّمك التعليمي وإنجازاتك

قد نحتفظ ببعض البيانات المجهولة الهوية (غير المرتبطة بك) لأغراض إحصائية فقط، لمدة لا تتجاوز 90 يوماً.

لطلب الحذف: hsk-ar.com/delete-account أو support@hsk-ar.com`,
    },
    {
      id: "07",
      title: "أمان البيانات",
      items: [
        "كلمات المرور مشفّرة بـ bcrypt — لا يمكن لأحد قراءتها",
        "الاتصال بالموقع محمي بـ HTTPS/TLS",
        "الوصول لقاعدة البيانات محدود بصلاحيات دقيقة (Row Level Security)",
      ],
      note: "في حال حدوث أي اختراق أمني يؤثر على بياناتك، سنُخطرك على بريدك الإلكتروني خلال 72 ساعة.",
    },
    {
      id: "08",
      title: "الأطفال دون 13 سنة",
      content: `المنصة موجّهة للبالغين وطلاب المرحلة الثانوية والجامعية. لا نجمع بيانات من أشخاص دون 13 سنة عن قصد. إذا علمنا بوجود مثل هذه البيانات، نحذفها فوراً.`,
    },
    {
      id: "09",
      title: "ملفات تعريف الارتباط (Cookies)",
      content: `نستخدم Cookies ضرورية فقط لتشغيل الحساب وجلسة تسجيل الدخول. لا نستخدم Cookies إعلانية أو تتبعية خارجية.`,
    },
    {
      id: "10",
      title: "التغييرات على هذه السياسة",
      content: `في حال تحديث السياسة بشكل جوهري، سنُخطرك عبر البريد الإلكتروني أو عبر إشعار داخل المنصة قبل تطبيق التغيير بـ 14 يوماً على الأقل.`,
    },
    {
      id: "11",
      title: "التواصل معنا",
      content: `لأي استفسار يخص خصوصيتك:
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
            سياسة الخصوصية
          </h1>
          <p className="text-[#666] text-base">
            آخر تحديث: {lastUpdated}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-[#F0FDF9] text-[#11A88E] text-sm font-medium px-4 py-2 rounded-full border border-[#B2EADF]">
            <span>🔒</span>
            <span>لا نبيع بياناتك — لا إعلانات — لا مشاركة مع أطراف خارجية</span>
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
        <div className="space-y-10">
          {sections.map((section) => (
            <section
              key={section.id}
              id={`section-${section.id}`}
              className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden"
            >
              {/* Section Header */}
              <div className="flex items-center gap-4 px-6 py-5 border-b border-[#F5F5F5]">
                <span className="text-xs font-mono text-[#CCC] w-6">
                  {section.id}
                </span>
                <h2 className="text-base font-bold text-[#1A1A1A]">
                  {section.title}
                </h2>
              </div>

              <div className="px-6 py-5">
                {/* Plain content */}
                {section.content && (
                  <p className="text-sm text-[#444] leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                )}

                {/* Simple list */}
                {section.items && (
                  <ul className="space-y-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#444]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#11A88E] flex-shrink-0 mt-2" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Note after list */}
                {section.note && (
                  <div className="mt-4 bg-[#F5F3FF] rounded-xl px-4 py-3">
                    <p className="text-sm text-[#5B4FCF]">{section.note}</p>
                  </div>
                )}

                {/* Subsections */}
                {section.subsections && (
                  <div className="space-y-6">
                    {section.subsections.map((sub, i) => (
                      <div key={i}>
                        <p className="text-xs font-bold text-[#999] uppercase tracking-wide mb-3">
                          {sub.label}
                        </p>
                        <ul className="space-y-2">
                          {sub.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-[#444]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] flex-shrink-0 mt-2" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Third parties table */}
                {section.thirdParties && (
                  <div className="mt-4 space-y-3">
                    {section.thirdParties.map((tp, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 bg-[#FAFAF8] rounded-xl px-4 py-3 border border-[#F0F0F0]"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#1A1A1A]">
                            {tp.name}
                          </p>
                          <p className="text-xs text-[#666] mt-0.5">{tp.role}</p>
                        </div>
                        <span className="text-xs text-[#999] mt-1 text-left">
                          {tp.note}
                        </span>
                      </div>
                    ))}
                    {section.footer && (
                      <p className="text-xs text-[#888] mt-3 leading-relaxed">
                        {section.footer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center pb-16">
          <p className="text-sm text-[#888] mb-4">
            لديك سؤال حول بياناتك؟
          </p>
          <a
            href="mailto:support@hsk-ar.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7C5CFC] text-white text-sm font-semibold hover:bg-[#6B4DE6] transition-colors"
          >
            <span>✉️</span>
            <span>تواصل مع الدعم</span>
          </a>
          <div className="mt-8 flex justify-center gap-6 text-sm text-[#AAA]">
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

# HSK — تطبيق تعلُّم اللغة الصينية (v0.3)

تطبيق Next.js 14 احترافي لتعلُّم الصينية للمتحدثين بالعربية، RTL كامل + PWA + تجربة تعليمية تفاعلية.

## ✨ الجديد في v0.3

- 🔍 **بحث قوي** في المصنِّفات (حرف، بينيين، عربي، استخدام، أمثلة)
- 🎯 **فلاتر متعددة**: مستوى HSK + المفضلة فقط
- 🎴 **Flashcards بقلب 3D** مع تنقّل بلوحة المفاتيح
- 🔊 **Web Speech API** للنطق الصيني التلقائي
- ❤️ **مفضلات محفوظة** في localStorage
- 📊 **شريط تقدم** في الرئيسية (محفوظات + بطاقات مراجَعة)
- 🍞 **Toast notifications** لكل تفاعل
- 🔗 **شارات قابلة للنقر** في الكروت — تنقل لـ`/hsk-levels` أو `/classifiers` مع فلتر تلقائي

## 🛠️ التقنيات

- Next.js 14 (App Router) + TypeScript صارم
- Tailwind CSS مع نظام ألوان (coral / violet / mint)
- lucide-react
- localStorage للمفضلات والتقدم
- Web Speech API للنطق

## 🚀 التشغيل

```bash
npm install
npm run dev
```

## 🗺️ الـRouting

| المسار | المحتوى |
|--------|---------|
| `/` | الرئيسية — البطاقات + شريط التقدم |
| `/hsk-levels?system=2` | HSK 2.0 (5 مستويات) |
| `/hsk-levels?system=3` | HSK 3.0 (7 مستويات) |
| `/hsk-levels?system=2&level=3` | يُمَيّز HSK 3 تلقائياً |
| `/classifiers` | كل المصنِّفات مع البحث والفلاتر |
| `/classifiers?hsk=4` | المصنِّفات المفلترة على HSK 4 |
| `/practice` | Flashcards عامة |
| `/progress` | التقدم |

## 📁 الهيكل

```
hsk-app/
├── app/
│   ├── layout.tsx              ← RTL + Toast + BottomNav
│   ├── page.tsx                ← الرئيسية + ProgressWidget
│   ├── globals.css             ← Tailwind + flip animation + toast animation
│   ├── hsk-levels/page.tsx     ← مع تمييز المستوى المحدد
│   ├── classifiers/page.tsx    ← + Suspense للـsearch params
│   ├── practice/page.tsx
│   └── progress/page.tsx
├── components/
│   ├── Hero.tsx
│   ├── BottomNav.tsx
│   ├── Toast.tsx               ← ToastProvider + useToast
│   ├── SectionCard.tsx         ← شارات قابلة للنقر
│   ├── HskLevelCard.tsx
│   ├── ClassifiersClient.tsx   ← بحث + فلاتر + مفضلات + تشغيل التمرين
│   ├── ClassifierFlashcards.tsx ← وضع التمرين بقلب 3D
│   ├── FlashcardDeck.tsx       ← تمارين عامة في /practice
│   ├── ProgressWidget.tsx      ← شريط تقدم الرئيسية
│   └── ui/{Badge,Card}.tsx
├── lib/
│   ├── utils.ts
│   ├── types.ts
│   ├── data.ts                 ← قارئات JSON
│   ├── storage.ts              ← useFavorites + useProgress
│   └── useSpeech.ts            ← Web Speech API
├── data/
│   ├── sections.json
│   ├── hsk-levels.json
│   ├── classifiers.json
│   └── nav.json
└── public/manifest.json
```

## 🎯 التفاعلات الجديدة

### المصنِّفات `/classifiers`

- بحث فوري بأي حقل (صيني/بينيين/عربي/استخدام/أمثلة)
- فلتر مستوى HSK (1-6 + الكل)
- فلتر "المفضلة فقط" مع عدّاد
- زر **"ابدأ التمرين"** يفتح Flashcards بنفس الفلاتر المطبّقة
- ضغط الحرف الصيني → نطق صوتي
- ضغط القلب → إضافة/إزالة من المفضلة + Toast
- ضغط مثال → نطق المثال كاملاً

### Flashcards `ClassifierFlashcards`

- بطاقة بقلب 3D حقيقي (`transform-style: preserve-3d`)
- أمامي: الحرف الكبير + بينيين + زر نطق
- خلفي: HSK + المعنى + الاستخدام + أمثلة منطوقة
- شريط تقدم
- تنقّل بلوحة المفاتيح: ← → للتنقل، Space/Enter للقلب، Esc للإغلاق
- زر إعادة الخلط
- Toast عند الانتهاء + تحديث التقدم

### الرئيسية

- شريط تقدم: مصنِّفات محفوظة (N/33) + بطاقات راجعتها
- شارات المستويات في كل بطاقة قابلة للنقر:
  - كروت HSK → `/hsk-levels?system=X&level=Y` (يُمَيَّز المستوى)
  - كرت المصنِّفات → `/classifiers?hsk=N` (يطبّق الفلتر)

## ⌨️ اختصارات لوحة المفاتيح (Flashcards)

| المفتاح | الإجراء |
|---------|---------|
| `Space` / `Enter` | قلب البطاقة |
| `←` | التالي |
| `→` | السابق |
| `Esc` | إغلاق |

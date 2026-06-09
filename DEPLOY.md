# 🚀 دليل النشر

## ⚠️ المشكلة الشائعة: 404 على Vercel

إذا رفعت ملف ZIP لـGitHub، Vercel يرى ملف واحد بدل مشروع كامل → النتيجة 404. لازم ترفع **الملفات نفسها** مفكوكة من الـZIP، مو الـZIP.

---

## ✅ الطريقة الصحيحة: من الكمبيوتر (الأسهل)

### الخطوة 1: فكّ الـZIP

- نزّل `hsk-nextjs-v4.zip` على جهازك
- فكّه (Right-click → Extract All / Unzip)
- بيظهر مجلد اسمه `hsk-app` فيه: `app/`, `components/`, `data/`, `lib/`, `public/`, `package.json`, إلخ

### الخطوة 2: نظّف الـGitHub repo القديم

في صفحة الـrepo على github.com:
1. اضغط على ملف الـZIP اللي رفعته → Delete (الزر الأحمر)
2. تأكد إن الـrepo فاضي

### الخطوة 3: ارفع الملفات الصحيحة

**الطريقة (أ) — من واجهة GitHub:**
1. افتح الـrepo → اضغط `Add file` → `Upload files`
2. اسحب **كل المحتويات داخل مجلد `hsk-app`** (مو المجلد نفسه — بل ما بداخله)
3. تأكد إن `package.json` يظهر في **جذر** الـrepo (مو داخل مجلد فرعي)
4. اضغط `Commit changes`

**الطريقة (ب) — من Terminal (أفضل):**
```bash
cd hsk-app
git init
git add .
git commit -m "Initial commit — Next.js HSK app"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main --force
```

### الخطوة 4: إعادة النشر على Vercel

1. افتح المشروع في Vercel Dashboard
2. اضغط `Deployments` → آخر deployment → `Redeploy`
3. أو في Settings → Git → اضغط Reconnect لو احتاج

---

## 📱 الطريقة البديلة: من الجوال

GitHub Mobile App محدود — أسهل خياران:

### الخيار (أ): فك ZIP على iPhone

1. نزّل الـZIP من Claude → اختر **حفظ في "الملفات"** (Files app)
2. افتح Files → اضغط على الـZIP → ينفك تلقائياً لمجلد
3. حمّل تطبيق **Working Copy** (مجاني) من App Store — git client للموبايل
4. في Working Copy:
   - Clone الـrepo من GitHub
   - استورد ملفات `hsk-app` من Files
   - Commit & Push

### الخيار (ب): استخدم github.dev (الأسهل من الجوال)

1. افتح الـrepo على github.com من المتصفح
2. اضغط زر `.` (نقطة) في لوحة المفاتيح، أو غيّر الرابط من `github.com` إلى `github.dev`
3. ينفتح محرر VS Code كامل في المتصفح
4. احذف الملفات القديمة وارفع الجديدة بسحب وإفلات (drag-and-drop)
5. Commit من اللوحة الجانبية

---

## ✅ التحقق من نجاح النشر

بعد الـpush، Vercel يبدأ build تلقائياً. تحقّق من:

1. **Vercel Dashboard → Deployments** — لازم تشوف "Building" ثم "Ready"
2. **Build logs** — لو فشل، اضغط عليه واقرأ السبب (غالباً مشكلة في tsconfig أو missing package)
3. افتح رابط `your-app.vercel.app` — لازم تشوف الشاشة الرئيسية

## 🔧 لو واجهت أخطاء في البناء

| الخطأ | الحل |
|------|------|
| `Module not found: @/lib/...` | تأكد إن `tsconfig.json` فيه `"paths": { "@/*": ["./*"] }` |
| `Cannot find module 'tailwindcss'` | الـ`devDependencies` ما رُفعت — تأكد من `package.json` كامل |
| `next: command not found` | `package.json` ناقص — أعد رفعه |
| 404 بعد deploy ناجح | الـbuild نجح لكن الملفات في مجلد فرعي — لازم `package.json` في الجذر |

## 🎯 الهيكل الصحيح على GitHub

الـrepo لازم يبدو هكذا في الجذر:

```
your-repo/
├── app/
├── components/
├── data/
├── lib/
├── public/
├── package.json       ← هذا الملف لازم يكون في الجذر مباشرة
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
└── README.md
```

**ليس** هكذا (هذا اللي يسبب 404):

```
your-repo/
└── hsk-app/           ← ❌ غلط - الملفات داخل مجلد فرعي
    ├── app/
    ├── package.json
    └── ...
```

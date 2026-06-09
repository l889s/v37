/**
 * مطابقة إجابة وضع الكتابة مع التسامح المناسب.
 *
 * القواعد:
 *  1. الإدخال الأساسي: الحرف الصيني — مقارنة دقيقة بعد تنظيف.
 *  2. الإدخال الثانوي: البينيين — يقبل بدون نبرات (tones).
 *  3. التنظيف الموحّد:
 *     - إزالة المسافات الزائدة
 *     - تجاهل علامات الترقيم (، . , ' " ! ? ؛ : etc.)
 *     - توحيد حالة الأحرف (للبينيين)
 *  4. تسامح حروف بسيط:
 *     - حرف واحد ناقص/زائد/مختلف في كلمات ≥ 4 حروف (للبينيين فقط)
 */

/** تنظيف عام: إزالة المسافات والترقيم */
function clean(s: string): string {
  return s
    .trim()
    .replace(/[\s\u3000]+/g, "") // كل أنواع المسافات
    .replace(/[.,;:!?'"`~()[\]{}<>«»،؛؟·。，；：！？""'']/g, "");
}

/** إزالة نبرات البينيين: nǐ → ni, hǎo → hao */
function stripTones(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // إزالة كل diacritics
    .toLowerCase();
}

/** هل النص يبدو وكأنه بينيين (أحرف لاتينية فقط)؟ */
function looksLikePinyin(s: string): boolean {
  return /^[a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹ\s]+$/i.test(s);
}

/** Levenshtein distance — لقياس فرق الحروف */
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

export type MatchResult = {
  /** true = إجابة مقبولة (دقيقة أو ضمن التسامح) */
  match: boolean;
  /** هل كانت الإجابة دقيقة 100%؟ */
  exact: boolean;
  /** نوع المطابقة */
  via: "chinese" | "pinyin" | "none";
};

/**
 * تحقّق من إجابة المستخدم.
 * @param userInput ما كتبه المستخدم
 * @param chineseAnswer الحرف الصيني الصحيح (مثل "本")
 * @param pinyinAnswer النطق بالبينيين (مثل "běn")
 */
export function matchTypingAnswer(
  userInput: string,
  chineseAnswer: string,
  pinyinAnswer: string
): MatchResult {
  const input = clean(userInput);
  if (!input) return { match: false, exact: false, via: "none" };

  // 1. مطابقة الحرف الصيني (أساسي)
  const cnTarget = clean(chineseAnswer);
  if (input === cnTarget) {
    return { match: true, exact: true, via: "chinese" };
  }

  // 2. مطابقة البينيين (ثانوي)
  if (looksLikePinyin(input)) {
    const userPy = stripTones(input);
    const targetPy = stripTones(clean(pinyinAnswer));

    // مطابقة دقيقة بعد إزالة النبرات
    if (userPy === targetPy) {
      return { match: true, exact: true, via: "pinyin" };
    }

    // تسامح: حرف واحد فرق للكلمات ≥ 4 حروف
    if (targetPy.length >= 4) {
      const dist = levenshtein(userPy, targetPy);
      if (dist <= 1) {
        return { match: true, exact: false, via: "pinyin" };
      }
    }
  }

  return { match: false, exact: false, via: "none" };
}

/**
 * أدوات التحقق من إجابات وضع الكتابة.
 * - الأولوية للحرف الصيني
 * - الـPinyin مقبول كإجابة ثانوية
 * - tolerance خفيف: مسافات + علامات ترقيم + اختلاف نغمة بسيط
 */

/** أزل المسافات الزائدة وعلامات الترقيم */
function normalize(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, "")
    // علامات ترقيم شائعة (لاتينية + صينية)
    .replace(/[.,!?;:'"()،.؟!ـ。，！？；：「」（）]/g, "")
    .toLowerCase();
}

/** أزل علامات النغمة من الـpinyin: nǐ → ni, jué → jue */
function stripTones(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** هل النص يحتوي أحرف صينية؟ */
export function containsHan(s: string): boolean {
  return /[\u4E00-\u9FFF]/.test(s);
}

export type CheckResult = {
  correct: boolean;
  /** ما الذي قبله النظام: "exact" حرف صيني، "pinyin" بينيين، false غلط */
  matchType: "exact" | "pinyin" | "pinyin-no-tones" | "none";
};

/**
 * تحقّق من إجابة المستخدم.
 *
 * Tolerance:
 *  - مسافات زائدة → تُحذف
 *  - علامات ترقيم → تُتجاهل
 *  - حالة الأحرف (للـpinyin) → غير حساس
 *  - علامات نغمة الـpinyin → اختياري (نسامح بدونها)
 */
export function checkAnswer(
  userInput: string,
  expectedChar: string,
  expectedPinyin: string
): CheckResult {
  if (!userInput.trim()) {
    return { correct: false, matchType: "none" };
  }

  const normInput = normalize(userInput);

  // 1) مطابقة الحرف الصيني (الأولوية)
  if (normInput === normalize(expectedChar)) {
    return { correct: true, matchType: "exact" };
  }

  // إذا الإدخال صيني لكن مختلف → غلط مباشرة (ما فيه tolerance للحروف الصينية)
  if (containsHan(userInput)) {
    return { correct: false, matchType: "none" };
  }

  // 2) مطابقة الـpinyin (إجابة ثانوية)
  const normExpected = normalize(expectedPinyin);
  if (normInput === normExpected) {
    return { correct: true, matchType: "pinyin" };
  }

  // 3) Pinyin بدون نغمات (tolerance)
  if (stripTones(normInput) === stripTones(normExpected)) {
    return { correct: true, matchType: "pinyin-no-tones" };
  }

  return { correct: false, matchType: "none" };
}

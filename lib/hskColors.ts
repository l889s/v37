/**
 * نظام ألوان HSK المركزي — مصدر واحد للحقيقة.
 *
 * كل مستوى HSK له لون ثابت يُستخدم في كل الصفحات (المستويات + كلمات الكمية)
 * حتى يبني المستخدم ربطاً ذهنياً ثابتاً: "HSK 5 = مرجاني" في كل مكان.
 *
 * المفتاح = رقم مستوى HSK (1-6، و789 لـ HSK 7-9).
 * ملاحظة: في النظام القديم 2.0، "hsk1-2" يُعامل كـ HSK 1 (mint).
 */

export type HskColor = {
  /** اللون الأساسي (شريط، أيقونة، نص بارز) */
  hex: string;
  /** خلفية ناعمة (badges، حاويات) */
  soft: string;
  /** اسم اللون للتوثيق */
  name: string;
};

export const HSK_COLORS: Record<number, HskColor> = {
  1:   { hex: "#11A88E", soft: "#E6F7F3", name: "mint" },
  2:   { hex: "#1E40AF", soft: "#EAF2FE", name: "blue" },
  3:   { hex: "#7C5CFC", soft: "#F2EEFF", name: "violet" },
  4:   { hex: "#E8A03A", soft: "#FDF6E7", name: "amber" },
  5:   { hex: "#FF4D4F", soft: "#FFF1F0", name: "coral" },
  6:   { hex: "#0E7490", soft: "#E8F5FA", name: "teal" },
  789: { hex: "#A63A2F", soft: "#FCEDEB", name: "brick" },
};

/** لون نص بتباين AA لكل مستوى (أغمق قليلاً من hex حيث يلزم) */
export const HSK_TEXT_COLOR: Record<number, string> = {
  1:   "#0F8B73", // mint deep
  2:   "#1E40AF",
  3:   "#7C5CFC",
  4:   "#92700E", // amber-700
  5:   "#FF4D4F",
  6:   "#0E7490",
  789: "#A63A2F",
};

/**
 * يحوّل معرّف مستوى (من hsk-levels.json) إلى رقم HSK للبحث في الخريطة.
 * "hsk1-2" → 1، "hsk3"/"n3" → 3، "n789" → 789.
 */
export function levelIdToHsk(levelId: string): number {
  if (levelId === "n789") return 789;
  if (levelId === "hsk1-2") return 1;
  const m = levelId.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 1;
}

/** يُرجع لون المستوى (مع fallback آمن لـ HSK 1) */
export function getHskColor(level: number): HskColor {
  return HSK_COLORS[level] ?? HSK_COLORS[1];
}

export function getHskTextColor(level: number): string {
  return HSK_TEXT_COLOR[level] ?? HSK_TEXT_COLOR[1];
}

/**
 * درجة خلفية أوضح قليلاً لرأس الكلمة (header) — تمزج soft مع hex.
 * تعطي تبايناً ملموساً مع خلفية الشرح الرمادية دون أن تطغى.
 * المستويات الباهتة (amber) تأخذ نسبة مزج أعلى لضمان وضوحها.
 */
export function getHskHeaderColor(level: number): string {
  const c = getHskColor(level);
  // amber قريب من الرمادي، فيحتاج مزجاً أقوى ليتمايز
  const ratio = level === 4 ? 0.32 : 0.24;
  const soft = c.soft.replace("#", "");
  const hex = c.hex.replace("#", "");
  const sr = parseInt(soft.slice(0, 2), 16);
  const sg = parseInt(soft.slice(2, 4), 16);
  const sb = parseInt(soft.slice(4, 6), 16);
  const hr = parseInt(hex.slice(0, 2), 16);
  const hg = parseInt(hex.slice(2, 4), 16);
  const hb = parseInt(hex.slice(4, 6), 16);
  const r = Math.round(sr * (1 - ratio) + hr * ratio);
  const g = Math.round(sg * (1 - ratio) + hg * ratio);
  const b = Math.round(sb * (1 - ratio) + hb * ratio);
  const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

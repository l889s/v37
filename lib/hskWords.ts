import type { Word } from "@/lib/types";

// ===== النظام 2.0 =====
import hsk1_2 from "@/data/hsk-words/hsk2/hsk1-2.json";
import hsk3 from "@/data/hsk-words/hsk2/hsk3.json";
import hsk4 from "@/data/hsk-words/hsk2/hsk4.json";
import hsk5 from "@/data/hsk-words/hsk2/hsk5.json";
import hsk6 from "@/data/hsk-words/hsk2/hsk6.json";

// ===== النظام 3.0 =====
import n1 from "@/data/hsk-words/hsk3/n1.json";
import n2 from "@/data/hsk-words/hsk3/n2.json";
import n3 from "@/data/hsk-words/hsk3/n3.json";
import n4 from "@/data/hsk-words/hsk3/n4.json";
import n5 from "@/data/hsk-words/hsk3/n5.json";
import n6 from "@/data/hsk-words/hsk3/n6.json";
import n789 from "@/data/hsk-words/hsk3/n789.json";

type WordLevelFile = {
  levelId: string;
  label: string;
  cn: string;
  count: number;
  words: Word[];
};

/**
 * كل ملفات الكلمات مجمّعة.
 * البنية: ملف JSON لكل مستوى، منظّمة في مجلدين حسب النظام (hsk2/ و hsk3/).
 * المستويات شبه الفارغة ستُملأ تدريجياً دون لمس الكود.
 */
const WORD_FILES: WordLevelFile[] = [
  hsk1_2 as WordLevelFile,
  hsk3 as WordLevelFile,
  hsk4 as WordLevelFile,
  hsk5 as WordLevelFile,
  hsk6 as WordLevelFile,
  n1 as WordLevelFile,
  n2 as WordLevelFile,
  n3 as WordLevelFile,
  n4 as WordLevelFile,
  n5 as WordLevelFile,
  n6 as WordLevelFile,
  n789 as WordLevelFile,
];

/** خريطة levelId → words[] (للوصول السريع) */
export const WORDS_BY_LEVEL: Record<string, Word[]> = Object.fromEntries(
  WORD_FILES.map((f) => [f.levelId, f.words])
);

/** كلمات مستوى محدّد (نفس واجهة getWordsForLevel القديمة) */
export function getWordsForLevel(levelId: string): Word[] {
  return WORDS_BY_LEVEL[levelId] ?? [];
}

import type { GrammarRule, GrammarLevel } from "@/lib/types";

import hsk1 from "@/data/grammar-pro/hsk1.json";
import hsk2 from "@/data/grammar-pro/hsk2.json";
import hsk3 from "@/data/grammar-pro/hsk3.json";
import hsk4 from "@/data/grammar-pro/hsk4.json";
import hsk5 from "@/data/grammar-pro/hsk5.json";
import hsk6 from "@/data/grammar-pro/hsk6.json";
import hsk789 from "@/data/grammar-pro/hsk789.json";

/**
 * كل مستويات القواعد النحوية مرتّبة.
 * المستويات الفارغة (rules: []) ستُملأ تدريجياً.
 */
export const GRAMMAR_LEVELS: GrammarLevel[] = [
  hsk1 as GrammarLevel,
  hsk2 as GrammarLevel,
  hsk3 as GrammarLevel,
  hsk4 as GrammarLevel,
  hsk5 as GrammarLevel,
  hsk6 as GrammarLevel,
  hsk789 as GrammarLevel,
];

/** كل القواعد في قائمة واحدة (للبحث والإحصاء) */
export const ALL_GRAMMAR: GrammarRule[] = GRAMMAR_LEVELS.flatMap(
  (lvl) => lvl.rules as GrammarRule[]
);

/** المستويات التي تحتوي بيانات فعلية فقط */
export const GRAMMAR_LEVELS_WITH_DATA = GRAMMAR_LEVELS.filter(
  (lvl) => lvl.rules.length > 0
);

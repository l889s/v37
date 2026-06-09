import type { Classifier, ClassifierLevel } from "@/lib/types";

import hsk1 from "@/data/classifiers-pro/hsk1.json";
import hsk2 from "@/data/classifiers-pro/hsk2.json";
import hsk3 from "@/data/classifiers-pro/hsk3.json";
import hsk4 from "@/data/classifiers-pro/hsk4.json";
import hsk5 from "@/data/classifiers-pro/hsk5.json";
import hsk6 from "@/data/classifiers-pro/hsk6.json";
import hsk789 from "@/data/classifiers-pro/hsk789.json";

/**
 * كل مستويات كلمات الكمية مرتّبة.
 * كل مستوى يحتوي بياناته الغنية (nickname/meaning/rule/notes/commonMistake/comparison).
 * المستويات الفارغة (classifiers: []) ستُملأ تدريجياً.
 */
export const CLASSIFIER_LEVELS: ClassifierLevel[] = [
  hsk1 as ClassifierLevel,
  hsk2 as ClassifierLevel,
  hsk3 as ClassifierLevel,
  hsk4 as ClassifierLevel,
  hsk5 as ClassifierLevel,
  hsk6 as ClassifierLevel,
  hsk789 as ClassifierLevel,
];

/** كل المصنّفات في قائمة واحدة (للبحث والممارسة) */
export const ALL_CLASSIFIERS: Classifier[] = CLASSIFIER_LEVELS.flatMap(
  (lvl) => lvl.classifiers as Classifier[]
);

/** المستويات التي تحتوي بيانات فعلية فقط */
export const CLASSIFIER_LEVELS_WITH_DATA = CLASSIFIER_LEVELS.filter(
  (lvl) => lvl.classifiers.length > 0
);

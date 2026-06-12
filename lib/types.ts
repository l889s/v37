export type Accent = "coral" | "violet" | "mint";

export type Section = {
  id: "hsk" | "lc" | "n1";
  href: string;
  emoji: string;
  accent: Accent;
  tag: string;
  badge: string;
  zh: string;
  title: string;
  sub: string;
  count: string;
  unit: string;
  levels: string[];
};

export type HskLevel = {
  id: string;
  label: string;
  cn: string;
  emoji: string;
  color: string;
  soft: string;
  count: number;
  desc: string;
};

export type HskSystem = {
  name: string;
  subtitle: string;
  accent: Accent;
  levels: HskLevel[];
};

export type ClassifierExample = {
  zh: string;
  pinyin?: string;
  ar: string;
};

export type ClassifierComparison = {
  with: string;
  note: string;
};

export type ClassifierMistake = {
  wrong: string;
  right: string;
  explanation: string;
};

export type Classifier = {
  id: string;
  char: string;
  pinyin: string;
  ar: string;
  hsk: number;
  usage: string;
  examples: ClassifierExample[];
  /** الحقول الاحترافية (اختيارية — للبيانات الغنية) */
  nickname?: string;
  meaning?: string;
  rule?: string;
  ruleExample?: string;
  notes?: string[];
  commonMistake?: ClassifierMistake;
  comparison?: ClassifierComparison[];
};

export type ClassifierLevel = {
  level: number;
  label: string;
  cn: string;
  desc: string;
  count: number;
  classifiers: Classifier[];
};

export type NavItem = {
  href: string;
  label: string;
  icon: "Home" | "Layers" | "BookOpen" | "Sparkles" | "TrendingUp" | "Trophy";
};

export type Word = {
  w: string;
  p: string;
  m: string;
  s: string;
  sa: string;
};

/* ============================================================
   أنواع القواعد النحوية (语法)
   ============================================================ */

export type GrammarExample = {
  zh: string;
  pinyin?: string;
  ar: string;
};

export type GrammarComparison = {
  with: string;
  note: string;
};

export type GrammarMistake = {
  wrong: string;
  right: string;
  explanation: string;
};

export type GrammarRule = {
  id: string;
  /** التركيب/الصيغة بالصينية، يُعرض بخط CN كبير */
  pattern: string;
  pinyin: string;
  /** الاسم العربي للقاعدة */
  ar: string;
  hsk: number;
  /** الاستخدام التفصيلي */
  usage: string;
  examples: GrammarExample[];
  /** الحقول الاحترافية (اختيارية — للبيانات الغنية) */
  nickname?: string;
  meaning?: string;
  /** الصيغة المجردة، تُعرض في صندوق منقّط */
  structure?: string;
  structureExample?: string;
  notes?: string[];
  commonMistake?: GrammarMistake;
  comparison?: GrammarComparison[];
};

export type GrammarLevel = {
  level: number;
  label: string;
  cn: string;
  desc: string;
  count: number;
  rules: GrammarRule[];
};

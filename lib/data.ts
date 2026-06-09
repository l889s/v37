import sectionsData from "@/data/sections.json";
import hskData from "@/data/hsk-levels.json";
import navData from "@/data/nav.json";
import { getWordsForLevel as getWordsFromSource } from "@/lib/hskWords";
import type { Section, HskSystem, NavItem, Word, HskLevel } from "@/lib/types";

export function getSections(): Section[] {
  return sectionsData.sections as Section[];
}

export function getHskSystems(): Record<string, HskSystem> {
  return hskData.systems as Record<string, HskSystem>;
}

export function getHskSystem(id: "2" | "3"): HskSystem | null {
  const sys = (hskData.systems as Record<string, HskSystem>)[id];
  return sys ?? null;
}

export function getHskLevel(id: string): { level: HskLevel; systemId: "2" | "3" } | null {
  const systems = hskData.systems as Record<string, HskSystem>;
  for (const sysId of ["2", "3"] as const) {
    const lv = systems[sysId].levels.find(l => l.id === id);
    if (lv) return { level: lv, systemId: sysId };
  }
  return null;
}

export function getNavItems(): NavItem[] {
  return navData.items as NavItem[];
}

export function getWordsForLevel(levelId: string): Word[] {
  return getWordsFromSource(levelId);
}

/* ============ دوال مساعدة لتقدّم المستوى ============ */

/** يولّد id مستقر لكل كلمة بناءً على المستوى + النص الصيني */
export function wordIdFor(levelId: string, w: { w: string }): string {
  return `${levelId}:${w.w}`;
}

/** يُرجع كل ids الكلمات في مستوى معيّن — للاستخدام مع SRS */
export function getWordIdsForLevel(levelId: string): string[] {
  return getWordsForLevel(levelId).map((w) => wordIdFor(levelId, w));
}

/** يُرجع ids كل الكلمات في كل المستويات — لتسجيلها في SRS */
export function getAllWordIds(): string[] {
  const ids: string[] = [];
  const systems = hskData.systems as Record<string, HskSystem>;
  for (const sysId of ["2", "3"] as const) {
    for (const lv of systems[sysId].levels) {
      ids.push(...getWordIdsForLevel(lv.id));
    }
  }
  return ids;
}

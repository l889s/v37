"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, BookOpen, Sparkles, TrendingUp, Trophy, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSrs } from "@/lib/spacedRepetition";
import { ALL_CLASSIFIERS } from "@/lib/classifiersPro";
import type { NavItem } from "@/lib/types";

const ICONS: Record<NavItem["icon"], LucideIcon> = {
  Home, Layers, BookOpen, Sparkles, TrendingUp, Trophy,
};

export function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  // عدّاد المراجعات المستحقة لعرض الشارة على tab "التمارين"
  const classifierIds = ALL_CLASSIFIERS.map((c) => c.id);
  const { dueCount } = useSrs(classifierIds);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-2xl border-t border-[#F0F0F0] bg-white/95 backdrop-blur shadow-nav"
      aria-label="التنقل الرئيسي"
    >
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = ICONS[it.icon];
          const isActive =
            it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          // الشارة على /practice (مكان التمارين الفعلية)
          const showBadge = it.href === "/practice" && dueCount > 0;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-0.5 py-3 text-[10px] font-semibold transition-colors",
                  isActive ? "text-coral" : "text-muted hover:text-ink"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn("h-5 w-5", isActive ? "stroke-[2.5]" : "stroke-2")}
                  />
                  {showBadge && (
                    <span
                      className="absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-violet px-1 text-[10px] font-extrabold text-white"
                      aria-label={`${dueCount} مراجعة مستحقة`}
                    >
                      {dueCount > 99 ? "99+" : dueCount}
                    </span>
                  )}
                </div>
                <span className="whitespace-nowrap">{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

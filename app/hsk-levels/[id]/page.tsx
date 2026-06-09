import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHskLevel, getWordsForLevel } from "@/lib/data";
import { LevelWordsClient } from "@/components/LevelWordsClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const found = getHskLevel(id);
  if (!found) return { title: "المستوى غير موجود" };
  const { level } = found;
  return {
    title: level.label,
    description: `${level.label} (${level.cn}) — ${level.desc}. ${level.count.toLocaleString("en-US")} كلمة في المنهج الرسمي.`,
  };
}

export default async function LevelDetailPage({ params }: Props) {
  const { id } = await params;
  const found = getHskLevel(id);
  if (!found) return notFound();
  const words = getWordsForLevel(id);
  return (
    <main className="min-h-screen">
      <LevelWordsClient level={found.level} words={words} />
    </main>
  );
}

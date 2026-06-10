"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Word = {
  id: string;
  chinese: string;
  pinyin: string;
  arabic: string;
  hsk: number;
  created_at: string;
};

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hskFilter, setHskFilter] = useState<number | "all">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [newWord, setNewWord] = useState({ chinese: "", pinyin: "", arabic: "", hsk: 1 });

  const supabase = createClient();

  useEffect(() => {
    fetchWords();
  }, []);

  async function fetchWords() {
    setLoading(true);
    const { data } = await supabase
      .from("words")
      .select("*")
      .order("hsk", { ascending: true });
    setWords(data || []);
    setLoading(false);
  }

  async function addWord() {
    if (!newWord.chinese || !newWord.arabic) return;
    setSaving(true);
    await supabase.from("words").insert([newWord]);
    await fetchWords();
    setNewWord({ chinese: "", pinyin: "", arabic: "", hsk: 1 });
    setShowAdd(false);
    setSaving(false);
  }

  async function deleteWord(id: string) {
    setDeleting(id);
    await supabase.from("words").delete().eq("id", id);
    await fetchWords();
    setDeleting(null);
  }

  const filtered = words.filter((w) => {
    const matchSearch =
      w.chinese.includes(search) ||
      (w.pinyin || "").toLowerCase().includes(search.toLowerCase()) ||
      w.arabic.includes(search);
    const matchHsk = hskFilter === "all" || w.hsk === hskFilter;
    return matchSearch && matchHsk;
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة الكلمات</h2>
          <p className="text-gray-500 mt-1">
            {words.length} كلمة في قاعدة البيانات
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-violet-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-violet-700 transition-colors"
        >
          + إضافة كلمة
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="ابحث بالصيني أو العربي أو البينيين..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 text-right flex-1 min-w-48"
        />
        <select
          value={hskFilter}
          onChange={(e) =>
            setHskFilter(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <option value="all">كل المستويات</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <option key={n} value={n}>HSK {n}</option>
          ))}
        </select>
      </div>

      {/* Add Word Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" dir="rtl">
            <h3 className="text-lg font-bold mb-4">إضافة كلمة جديدة</h3>
            <div className="space-y-3">
              <input
                placeholder="الكلمة بالصينية *"
                value={newWord.chinese}
                onChange={(e) => setNewWord({ ...newWord, chinese: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <input
                placeholder="البينيين"
                value={newWord.pinyin}
                onChange={(e) => setNewWord({ ...newWord, pinyin: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <input
                placeholder="المعنى بالعربي *"
                value={newWord.arabic}
                onChange={(e) => setNewWord({ ...newWord, arabic: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <select
                value={newWord.hsk}
                onChange={(e) => setNewWord({ ...newWord, hsk: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>HSK {n}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={addWord}
                disabled={saving || !newWord.chinese || !newWord.arabic}
                className="flex-1 bg-violet-600 text-white py-2 rounded-xl font-medium hover:bg-violet-700 disabled:opacity-50"
              >
                {saving ? "جاري الحفظ..." : "إضافة"}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 border border-gray-200 py-2 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Words Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">جاري التحميل...</div>
        ) : (
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الكلمة</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">البينيين</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">المعنى</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">المستوى</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((word) => (
                <tr key={word.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-2xl font-bold text-gray-900">{word.chinese}</td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-sm">{word.pinyin}</td>
                  <td className="px-6 py-4 text-gray-800">{word.arabic}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-medium">
                      HSK {word.hsk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {deleting === word.id ? (
                      <span className="text-sm text-gray-400">جاري الحذف...</span>
                    ) : (
                      <button
                        onClick={() => deleteWord(word.id)}
                        className="text-sm text-red-400 hover:text-red-600 font-medium"
                      >
                        حذف
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    لا توجد كلمات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

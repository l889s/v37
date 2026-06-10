"use client";

import { useState } from "react";

// بيانات تجريبية — لاحقاً تربطها بـ Supabase
const SAMPLE_WORDS = [
  { id: 1, chinese: "你好", pinyin: "nǐ hǎo", arabic: "مرحبا", hsk: 1 },
  { id: 2, chinese: "谢谢", pinyin: "xiè xiè", arabic: "شكراً", hsk: 1 },
  { id: 3, chinese: "学习", pinyin: "xué xí", arabic: "يتعلم / دراسة", hsk: 2 },
  { id: 4, chinese: "中国", pinyin: "zhōng guó", arabic: "الصين", hsk: 1 },
  { id: 5, chinese: "朋友", pinyin: "péng yǒu", arabic: "صديق", hsk: 2 },
];

type Word = {
  id: number;
  chinese: string;
  pinyin: string;
  arabic: string;
  hsk: number;
};

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>(SAMPLE_WORDS);
  const [search, setSearch] = useState("");
  const [hskFilter, setHskFilter] = useState<number | "all">("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newWord, setNewWord] = useState({ chinese: "", pinyin: "", arabic: "", hsk: 1 });

  const filtered = words.filter((w) => {
    const matchSearch =
      w.chinese.includes(search) ||
      w.pinyin.toLowerCase().includes(search.toLowerCase()) ||
      w.arabic.includes(search);
    const matchHsk = hskFilter === "all" || w.hsk === hskFilter;
    return matchSearch && matchHsk;
  });

  function addWord() {
    if (!newWord.chinese || !newWord.arabic) return;
    setWords([...words, { ...newWord, id: Date.now() }]);
    setNewWord({ chinese: "", pinyin: "", arabic: "", hsk: 1 });
    setShowAdd(false);
  }

  function deleteWord(id: number) {
    setWords(words.filter((w) => w.id !== id));
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة الكلمات</h2>
          <p className="text-gray-500 mt-1">إضافة وتعديل وحذف كلمات HSK</p>
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
          placeholder="ابحث..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 text-right w-48"
        />
        <select
          value={hskFilter}
          onChange={(e) =>
            setHskFilter(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <option value="all">كل المستويات</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>HSK {n}</option>
          ))}
        </select>
      </div>

      {/* Add Word Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" dir="rtl">
            <h3 className="text-lg font-bold mb-4">إضافة كلمة جديدة</h3>
            <div className="space-y-3">
              <input
                placeholder="الكلمة بالصينية"
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
                placeholder="المعنى بالعربي"
                value={newWord.arabic}
                onChange={(e) => setNewWord({ ...newWord, arabic: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <select
                value={newWord.hsk}
                onChange={(e) => setNewWord({ ...newWord, hsk: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>HSK {n}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={addWord}
                className="flex-1 bg-violet-600 text-white py-2 rounded-xl font-medium hover:bg-violet-700"
              >
                إضافة
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
                <td className="px-6 py-4 text-gray-600 font-mono">{word.pinyin}</td>
                <td className="px-6 py-4 text-gray-800">{word.arabic}</td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-medium">
                    HSK {word.hsk}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteWord(word.id)}
                    className="text-sm text-red-400 hover:text-red-600 font-medium"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  لا توجد نتائج
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { X, Eye, PencilLine, RotateCcw } from "lucide-react";

export function HanziWriterModal({
  chars,
  color,
  onClose,
}: {
  chars: string;        // الكلمة كاملة، مثل "杯子"
  color: string;        // لون المستوى
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writersRef = useRef<any[]>([]);
  const [mode, setMode] = useState<"idle" | "animate" | "quiz">("idle");

  // قائمة الحروف الصينية فقط (نحذف الفراغات والرموز)
  const charList = Array.from(chars).filter((c) => /[\u4e00-\u9fff]/.test(c));

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      const HanziWriter = (await import("hanzi-writer")).default;
      if (cancelled || !containerRef.current) return;

      containerRef.current.innerHTML = "";
      writersRef.current = [];

      charList.forEach((char) => {
        const target = document.createElement("div");
        target.style.cssText =
          "width:200px;height:200px;background:#fff;border-radius:14px;box-shadow:inset 0 0 0 1.5px #00000014;";
        containerRef.current!.appendChild(target);

        const writer = HanziWriter.create(target, char, {
          width: 200,
          height: 200,
          padding: 8,
          showOutline: true,
          showCharacter: false,
          strokeColor: color,
          radicalColor: "#999",
          drawingColor: color,
          strokeAnimationSpeed: 1,
          delayBetweenStrokes: 220,
          drawingWidth: 22,
        });

        // رسم خطوط الشبكة المتقطعة 米字格
        const ns = "http://www.w3.org/2000/svg";
        const svg = target.querySelector("svg");
        if (svg) {
          const mk = (x1: number, y1: number, x2: number, y2: number) => {
            const l = document.createElementNS(ns, "line");
            l.setAttribute("x1", String(x1)); l.setAttribute("y1", String(y1));
            l.setAttribute("x2", String(x2)); l.setAttribute("y2", String(y2));
            l.setAttribute("stroke", "#DADADA");
            l.setAttribute("stroke-width", "1");
            l.setAttribute("stroke-dasharray", "4 4");
            svg.insertBefore(l, svg.firstChild);
          };
          mk(100, 0, 100, 200); mk(0, 100, 200, 100);
          mk(0, 0, 200, 200); mk(200, 0, 0, 200);
        }

        writersRef.current.push(writer);
      });
    }

    setup();
    return () => { cancelled = true; };
  }, [chars]);

  // شاهد: يرسم كل حرف بالتسلسل — الحرف التالي يبدأ فقط بعد انتهاء السابق
  function handleAnimate() {
    setMode("animate");
    const writers = writersRef.current;
    if (writers.length === 0) return;

    // إخفاء الكل أولاً
    writers.forEach((w) => w.hideCharacter());

    const animateAt = (idx: number) => {
      if (idx >= writers.length) return;
      writers[idx].animateCharacter({
        onComplete: () => {
          // انتظار بسيط بين حرف وحرف ثم نبدأ التالي
          setTimeout(() => animateAt(idx + 1), 400);
        },
      });
    };
    animateAt(0);
  }

  function handleQuiz() {
    setMode("quiz");
    writersRef.current.forEach((w) => {
      w.hideCharacter();
      w.quiz();
    });
  }

  function handleReset() {
    setMode("idle");
    writersRef.current.forEach((w) => {
      w.hideCharacter();
      w.cancelQuiz?.();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-cn text-[22px] font-extrabold" style={{ color }}>
            {chars}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-[#F0F0F0]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* لوحات الكتابة */}
        <div
          ref={containerRef}
          className="flex flex-wrap items-center justify-center gap-3"
        />

        {/* أزرار التحكم */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <CtrlBtn onClick={handleAnimate} active={mode === "animate"} color={color}>
            <Eye className="h-4 w-4" /> شاهد
          </CtrlBtn>
          <CtrlBtn onClick={handleQuiz} active={mode === "quiz"} color={color}>
            <PencilLine className="h-4 w-4" /> تدرّب
          </CtrlBtn>
          <CtrlBtn onClick={handleReset} active={false} color={color}>
            <RotateCcw className="h-4 w-4" /> إعادة
          </CtrlBtn>
        </div>

        <p className="mt-3 text-center text-[11.5px] text-muted">
          اضغط «تدرّب» واكتب الحرف بإصبعك بالترتيب الصحيح
        </p>
      </div>
    </div>
  );
}

function CtrlBtn({
  onClick, active, color, children,
}: {
  onClick: () => void; active: boolean; color: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-bold transition-colors"
      style={
        active
          ? { background: color, color: "#fff" }
          : { background: "#FFF1F0", color: "#C05C00", boxShadow: "inset 0 0 0 1px rgba(255,77,79,.2)" }
      }
    >
      {children}
    </button>
  );
}

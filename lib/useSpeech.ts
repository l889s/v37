"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeech() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);

    const load = () => {
      const all = window.speechSynthesis.getVoices();
      const zh = all.filter(
        (v) => v.lang === "zh-CN" || v.lang === "zh_CN" || v.lang.startsWith("zh")
      );
      if (zh.length) {
        const best =
          zh.find((v) => /tingting/i.test(v.name)) ||
          zh.find((v) => /google/i.test(v.name)) ||
          zh[0];
        setVoice(best);
      }
    };

    if (window.speechSynthesis.getVoices().length) load();
    window.speechSynthesis.onvoiceschanged = load;
    const t = window.setTimeout(load, 800);
    return () => window.clearTimeout(t);
  }, []);

  const speak = useCallback(
    (text: string, opts?: { rate?: number; pitch?: number }) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.lang = "zh-CN";
      u.rate = opts?.rate ?? 0.85;
      u.pitch = opts?.pitch ?? 1.1;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      utterRef.current = u;
      window.speechSynthesis.speak(u);
    },
    [voice, supported]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { speak, stop, voice, speaking, supported };
}

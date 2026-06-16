"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// ── مترجم فوري عربي ⇄ صيني ⇄ إنجليزي ──────────────────────────
// صفحة hsk-ar.com/translate
// المراحل: التعرّف على الصوت (المتصفّح) → الترجمة (عبر /api/translate الآمن) → النطق

const LANGS = {
  ar: { code: "ar-SA", label: "العربية", flag: "🇸🇦", ttsLang: "ar", name: "Arabic" },
  zh: { code: "zh-CN", label: "中文", flag: "🇨🇳", ttsLang: "zh-CN", name: "Chinese (Simplified)" },
  en: { code: "en-US", label: "English", flag: "🇬🇧", ttsLang: "en", name: "English" },
};
const ORDER = ["ar", "zh", "en"];

export default function App() {
  const [source, setSource] = useState("ar"); // اللغة المصدر
  const [target, setTarget] = useState("zh"); // اللغة الهدف

  const [mode, setMode] = useState("voice"); // voice | camera | text
  const [typed, setTyped] = useState("");
  const [imgPreview, setImgPreview] = useState("");
  const fileInputRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");      // النص الملتقط (interim + final)
  const [translation, setTranslation] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [status, setStatus] = useState("idle"); // idle | listening | translating | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState([]);
  const [voices, setVoices] = useState([]);

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");

  // ── تحميل أصوات النطق ──────────────────────────────────
  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis?.getVoices() || []);
    load();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = load;
  }, []);

  const speechSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  // ── الترجمة عبر Claude ──────────────────────────────────
  const translate = useCallback(
    async (text) => {
      if (!text.trim()) return;
      setStatus("translating");
      setErrorMsg("");
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "text",
            text,
            source,
            target,
          }),
        });

        if (!res.ok) throw new Error("request failed");
        const parsed = await res.json();

        setTranslation(parsed.translation || "");
        setPinyin(parsed.pinyin || "");
        setStatus("done");
        setHistory((h) =>
          [
            {
              id: Date.now(),
              from: source,
              to: target,
              src: text,
              out: parsed.translation || "",
              py: parsed.pinyin || "",
            },
            ...h,
          ].slice(0, 8)
        );
        speak(parsed.translation || "", target);
      } catch (e) {
        setStatus("error");
        setErrorMsg("تعذّرت الترجمة. تأكّد من الاتصال وحاول مرة ثانية.");
      }
    },
    [source, target]
  );

  // ── الترجمة بالكاميرا (OCR عبر Claude vision) ─────────────
  const handleImage = useCallback(
    async (file) => {
      if (!file) return;
      const previewUrl = URL.createObjectURL(file);
      setImgPreview(previewUrl);
      setHeard("");
      setTranslation("");
      setPinyin("");
      setStatus("translating");
      setErrorMsg("");

      try {
        const base64 = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result.split(",")[1]);
          r.onerror = () => rej(new Error("read failed"));
          r.readAsDataURL(file);
        });
        const mediaType = file.type || "image/jpeg";

        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "image",
            image: base64,
            mediaType,
            source,
            target,
          }),
        });

        if (!res.ok) throw new Error("request failed");
        const parsed = await res.json();

        if (!parsed.translation && !parsed.detected) {
          setStatus("error");
          setErrorMsg("ما لقيت نص واضح في الصورة. جرّب صورة أوضح أو أقرب.");
          return;
        }

        setHeard(parsed.detected || "");
        setTranslation(parsed.translation || "");
        setPinyin(parsed.pinyin || "");
        setStatus("done");
        setHistory((h) =>
          [
            {
              id: Date.now(),
              from: source,
              to: target,
              src: parsed.detected || "(نص من صورة)",
              out: parsed.translation || "",
              py: parsed.pinyin || "",
            },
            ...h,
          ].slice(0, 8)
        );
        speak(parsed.translation || "", target);
      } catch (e) {
        setStatus("error");
        setErrorMsg("تعذّرت قراءة الصورة. حاول مرة ثانية.");
      }
    },
    [source, target]
  );

  // ── النطق (TTS) ──────────────────────────────────
  const speak = useCallback(
    (text, lang) => {
      if (!text || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const wanted = LANGS[lang].ttsLang;
      // تفضيل Tingting للصيني
      const preferred =
        voices.find((v) => lang === "zh" && /ting-?ting/i.test(v.name)) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith(wanted.toLowerCase())) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith(lang));
      if (preferred) u.voice = preferred;
      u.lang = preferred?.lang || wanted;
      u.rate = lang === "zh" ? 0.9 : 1;
      window.speechSynthesis.speak(u);
    },
    [voices]
  );

  // ── التعرّف على الصوت (STT) ──────────────────────────────────
  const startListening = () => {
    if (!speechSupported) {
      setStatus("error");
      setErrorMsg("متصفّحك ما يدعم التعرّف على الصوت. جرّب Chrome على الكمبيوتر.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = LANGS[source].code;
    rec.interimResults = true;
    rec.continuous = false;
    finalTranscriptRef.current = "";

    rec.onstart = () => {
      setListening(true);
      setStatus("listening");
      setHeard("");
      setTranslation("");
      setPinyin("");
    };
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTranscriptRef.current += t;
        else interim += t;
      }
      setHeard(finalTranscriptRef.current + interim);
    };
    rec.onerror = (e) => {
      setListening(false);
      if (e.error === "no-speech") {
        setStatus("idle");
      } else {
        setStatus("error");
        setErrorMsg(
          e.error === "not-allowed"
            ? "ما فيه إذن للمايكروفون. فعّله من إعدادات المتصفّح."
            : "صار خطأ في التقاط الصوت. حاول مرة ثانية."
        );
      }
    };
    rec.onend = () => {
      setListening(false);
      const finalText = finalTranscriptRef.current.trim();
      if (finalText) translate(finalText);
      else if (status === "listening") setStatus("idle");
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const resetIO = () => {
    setHeard("");
    setTranslation("");
    setPinyin("");
    setImgPreview("");
    setStatus("idle");
  };

  const swap = () => {
    setSource(target);
    setTarget(source);
    resetIO();
  };

  const pickSource = (lang) => {
    setSource(lang);
    if (lang === target) setTarget(ORDER.find((l) => l !== lang)); // امنع التطابق
    resetIO();
  };

  const pickTarget = (lang) => {
    setTarget(lang);
    if (lang === source) setSource(ORDER.find((l) => l !== lang));
    resetIO();
  };

  const statusLabel = {
    idle: "اضغط للتحدّث",
    listening: "أسمعك الآن…",
    translating: "أترجم…",
    done: "تمّت الترجمة",
    error: "خطأ",
  }[status];

  return (
    <div dir="rtl" style={S.page}>
      <style>{globalCSS}</style>

      <header style={S.header}>
        <div style={S.brandMark}>译</div>
        <div>
          <h1 style={S.title}>مترجم فوري</h1>
          <p style={S.subtitle}>عربي · صيني · إنجليزي · نموذج أولي</p>
        </div>
      </header>

      {/* محوّل اللغة (ثلاث لغات) */}
      <div style={S.langBar}>
        <label style={S.langSelectWrap}>
          <span style={S.langCaption}>من</span>
          <div style={{ ...S.selectBox, ...S.selectSource }}>
            <span style={S.flag}>{LANGS[source].flag}</span>
            <select
              value={source}
              onChange={(e) => pickSource(e.target.value)}
              style={S.select}
              aria-label="اللغة المصدر"
            >
              {ORDER.map((l) => (
                <option key={l} value={l}>{LANGS[l].label}</option>
              ))}
            </select>
          </div>
        </label>

        <button onClick={swap} style={S.swapBtn} aria-label="عكس اتجاه الترجمة">
          ⇄
        </button>

        <label style={S.langSelectWrap}>
          <span style={S.langCaption}>إلى</span>
          <div style={{ ...S.selectBox, ...S.selectTarget }}>
            <span style={S.flag}>{LANGS[target].flag}</span>
            <select
              value={target}
              onChange={(e) => pickTarget(e.target.value)}
              style={S.select}
              aria-label="اللغة الهدف"
            >
              {ORDER.map((l) => (
                <option key={l} value={l}>{LANGS[l].label}</option>
              ))}
            </select>
          </div>
        </label>
      </div>

      {/* محوّل الوضع: صوت / كاميرا */}
      <div style={S.modeBar}>
        <button
          onClick={() => { setMode("voice"); setImgPreview(""); setStatus("idle"); }}
          style={{ ...S.modeTab, ...(mode === "voice" ? S.modeActive : {}) }}
        >
          🎙 صوت
        </button>
        <button
          onClick={() => { setMode("camera"); if (listening) stopListening(); setStatus("idle"); }}
          style={{ ...S.modeTab, ...(mode === "camera" ? S.modeActive : {}) }}
        >
          📷 كاميرا
        </button>
        <button
          onClick={() => { setMode("text"); if (listening) stopListening(); setImgPreview(""); setStatus("idle"); }}
          style={{ ...S.modeTab, ...(mode === "text" ? S.modeActive : {}) }}
        >
          ⌨️ كتابة
        </button>
      </div>

      {/* لوحة السماع / النص المقروء */}
      {mode !== "text" && (
        <div style={S.panel}>
          <div style={S.panelLabel}>
            {LANGS[source].flag} {mode === "voice" ? "ما قُلته" : "النص في الصورة"}
          </div>
          {imgPreview && mode === "camera" && (
            <img src={imgPreview} alt="معاينة" style={S.imgPreview} />
          )}
          <div style={{ ...S.heardText, opacity: heard ? 1 : 0.4 }}>
            {heard || (mode === "voice" ? "كلامك يظهر هنا…" : "النص المقروء يظهر هنا…")}
          </div>
        </div>
      )}

      {/* منطقة الإدخال */}
      {mode === "voice" ? (
        <div style={S.micWrap}>
          <button
            onClick={listening ? stopListening : startListening}
            style={{
              ...S.mic,
              ...(listening ? S.micActive : {}),
            }}
            aria-label={listening ? "إيقاف" : "تحدّث"}
          >
            {listening ? "■" : "🎙"}
            {listening && <span style={S.pulse} />}
          </button>
          <div style={S.statusText}>
            {status === "translating" && <span style={S.spinner} />}
            {statusLabel}
          </div>
        </div>
      ) : mode === "camera" ? (
        <div style={S.micWrap}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={(e) => handleImage(e.target.files?.[0])}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={S.camBtn}
            disabled={status === "translating"}
          >
            📷 صوّر أو اختر صورة
          </button>
          <div style={S.statusText}>
            {status === "translating" && <span style={S.spinner} />}
            {status === "translating"
              ? "أقرأ الصورة…"
              : status === "done"
              ? "تمّت الترجمة"
              : "وجّه الكاميرا على النص"}
          </div>
        </div>
      ) : (
        <div style={S.textWrap}>
          <div style={S.panelLabel}>
            {LANGS[source].flag} اكتب النص
          </div>
          <textarea
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            dir={source === "en" ? "ltr" : "rtl"}
            placeholder={
              source === "ar" ? "اكتب هنا…"
                : source === "en" ? "Type here…"
                : "在这里输入…"
            }
            style={S.textarea}
            rows={3}
          />
          <button
            onClick={() => { setHeard(typed); translate(typed); }}
            style={{ ...S.translateBtn, ...(typed.trim() && status !== "translating" ? {} : S.btnDisabled) }}
            disabled={!typed.trim() || status === "translating"}
          >
            {status === "translating" ? "أترجم…" : "ترجم"}
          </button>
        </div>
      )}

      {/* لوحة الترجمة */}
      <div style={{ ...S.panel, ...S.panelTarget }}>
        <div style={S.panelLabel}>
          {LANGS[target].flag} الترجمة
        </div>
        <div style={{ ...S.transText, opacity: translation ? 1 : 0.4 }}>
          {translation || "النتيجة تظهر هنا…"}
        </div>
        {pinyin && <div style={S.pinyin}>{pinyin}</div>}
        {translation && (
          <button onClick={() => speak(translation, target)} style={S.replay}>
            ▶ إعادة النطق
          </button>
        )}
      </div>

      {errorMsg && <div style={S.error}>{errorMsg}</div>}

      {!speechSupported && (
        <div style={S.warn}>
          ملاحظة: التعرّف على الصوت يشتغل أفضل على Chrome في الكمبيوتر. على
          الآيفون يحتاج Capacitor مع plugin أصلي.
        </div>
      )}

      {/* السجل */}
      {history.length > 0 && (
        <div style={S.history}>
          <div style={S.historyTitle}>آخر الترجمات</div>
          {history.map((h) => (
            <div key={h.id} style={S.histItem}>
              <span style={S.histFrom}>{LANGS[h.from].flag}</span>
              <div style={S.histBody}>
                <div style={S.histSrc}>{h.src}</div>
                <div style={S.histOut}>{h.out}</div>
                {h.py && <div style={S.histPy}>{h.py}</div>}
              </div>
              <button
                onClick={() => speak(h.out, h.to)}
                style={S.histPlay}
                aria-label="نطق"
              >
                ▶
              </button>
            </div>
          ))}
        </div>
      )}

      <footer style={S.footer}>
        STT المتصفّح · ترجمة Claude · نطق SpeechSynthesis
      </footer>
    </div>
  );
}

// ── الأنماط ──────────────────────────────────
const ink = "#0E1B2A";
const jade = "#1F8A70";
const jadeLight = "#E8F4F0";
const sand = "#F6F3EC";
const gold = "#C9A24B";

const S = {
  page: {
    maxWidth: 480,
    margin: "0 auto",
    minHeight: "100vh",
    background: sand,
    padding: "20px 18px 40px",
    fontFamily:
      "'Cairo', 'Segoe UI', system-ui, sans-serif",
    color: ink,
    boxSizing: "border-box",
  },
  header: { display: "flex", alignItems: "center", gap: 14, marginBottom: 22 },
  brandMark: {
    width: 52,
    height: 52,
    borderRadius: 16,
    background: ink,
    color: gold,
    display: "grid",
    placeItems: "center",
    fontSize: 30,
    fontWeight: 700,
    boxShadow: "0 6px 18px rgba(14,27,42,0.22)",
  },
  title: { margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" },
  subtitle: { margin: "2px 0 0", fontSize: 13, color: "#6B7785", fontWeight: 600 },

  langBar: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8,
    marginBottom: 18,
  },
  langSelectWrap: { flex: 1, display: "block" },
  langCaption: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "#8A94A0",
    marginBottom: 5,
    paddingInlineStart: 4,
  },
  selectBox: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 12px",
    background: "#fff",
    borderRadius: 14,
    border: "1.5px solid #E4DECF",
  },
  selectSource: { borderColor: ink },
  selectTarget: { borderColor: jade },
  select: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontSize: 16,
    fontWeight: 700,
    color: ink,
    fontFamily: "inherit",
    cursor: "pointer",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
  },
  flag: { fontSize: 20 },

  modeBar: {
    display: "flex",
    gap: 8,
    background: "#EDE7D8",
    padding: 5,
    borderRadius: 14,
    marginBottom: 16,
  },
  modeTab: {
    flex: 1,
    padding: "10px 0",
    borderRadius: 10,
    border: "none",
    background: "transparent",
    fontSize: 15,
    fontWeight: 700,
    color: "#7A8290",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background .15s, color .15s",
  },
  modeActive: {
    background: "#fff",
    color: ink,
    boxShadow: "0 2px 6px rgba(14,27,42,0.1)",
  },
  imgPreview: {
    width: "100%",
    maxHeight: 200,
    objectFit: "contain",
    borderRadius: 12,
    marginBottom: 10,
    background: "#000",
  },
  camBtn: {
    width: "100%",
    padding: "18px 0",
    borderRadius: 16,
    border: `2px dashed ${jade}`,
    background: jadeLight,
    color: jade,
    fontSize: 17,
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "inherit",
  },

  textWrap: { marginBottom: 18 },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: 16,
    border: "1.5px solid #E4DECF",
    background: "#fff",
    fontSize: 18,
    fontWeight: 600,
    fontFamily: "inherit",
    color: ink,
    resize: "vertical",
    outline: "none",
    lineHeight: 1.6,
  },
  translateBtn: {
    width: "100%",
    marginTop: 10,
    padding: "14px 0",
    borderRadius: 14,
    border: "none",
    background: ink,
    color: "#fff",
    fontSize: 17,
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnDisabled: { opacity: 0.45, cursor: "not-allowed" },
  swapBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    border: "none",
    background: jade,
    color: "#fff",
    fontSize: 20,
    cursor: "pointer",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(31,138,112,0.3)",
  },

  panel: {
    background: "#fff",
    borderRadius: 18,
    padding: "16px 18px",
    marginBottom: 14,
    minHeight: 64,
    border: "1px solid #ECE6D8",
  },
  panelTarget: { background: jadeLight, borderColor: "#CDE7DF" },
  panelLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#8A94A0",
    marginBottom: 8,
  },
  heardText: { fontSize: 20, fontWeight: 600, lineHeight: 1.5, minHeight: 28 },
  transText: { fontSize: 22, fontWeight: 700, lineHeight: 1.5, color: ink },
  pinyin: { fontSize: 15, color: jade, marginTop: 6, fontWeight: 600, direction: "ltr", textAlign: "right" },
  replay: {
    marginTop: 12,
    background: "#fff",
    border: `1.5px solid ${jade}`,
    color: jade,
    borderRadius: 10,
    padding: "6px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },

  micWrap: { textAlign: "center", margin: "10px 0 18px" },
  mic: {
    position: "relative",
    width: 84,
    height: 84,
    borderRadius: "50%",
    border: "none",
    background: ink,
    color: "#fff",
    fontSize: 32,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(14,27,42,0.3)",
    transition: "transform .15s",
  },
  micActive: { background: "#C0392B", transform: "scale(1.05)" },
  pulse: {
    position: "absolute",
    inset: -6,
    borderRadius: "50%",
    border: "3px solid rgba(192,57,43,0.4)",
    animation: "ping 1.2s ease-out infinite",
  },
  statusText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: 700,
    color: "#56616E",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  spinner: {
    width: 14,
    height: 14,
    border: "2px solid #CBD3DC",
    borderTopColor: jade,
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin .7s linear infinite",
  },

  error: {
    background: "#FDECEA",
    color: "#C0392B",
    padding: "12px 16px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 14,
  },
  warn: {
    background: "#FFF7E6",
    color: "#8A6D1A",
    padding: "12px 16px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 14,
    lineHeight: 1.6,
  },

  history: { marginTop: 8 },
  historyTitle: {
    fontSize: 13,
    fontWeight: 800,
    color: "#8A94A0",
    marginBottom: 10,
  },
  histItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    background: "#fff",
    borderRadius: 12,
    padding: "10px 12px",
    marginBottom: 8,
    border: "1px solid #ECE6D8",
  },
  histFrom: { fontSize: 18, flexShrink: 0 },
  histBody: { flex: 1, minWidth: 0 },
  histSrc: { fontSize: 14, color: "#6B7785", fontWeight: 600 },
  histOut: { fontSize: 16, fontWeight: 700, marginTop: 2 },
  histPy: { fontSize: 12, color: jade, marginTop: 2, direction: "ltr", textAlign: "right" },
  histPlay: {
    background: jadeLight,
    border: "none",
    color: jade,
    width: 30,
    height: 30,
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    flexShrink: 0,
  },

  footer: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 11,
    color: "#A3ABB5",
    fontWeight: 600,
  },
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
  * { -webkit-tap-highlight-color: transparent; }
  @keyframes ping { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(1.5);opacity:0} }
  @keyframes spin { to { transform: rotate(360deg) } }
  button:focus-visible, textarea:focus-visible, select:focus-visible { outline: 3px solid ${gold}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important } }
`;

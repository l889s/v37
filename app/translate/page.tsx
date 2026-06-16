"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// ── المترجم ──────────────────────────
// صفحة الترجمة


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

  // ── الترجمة ──────────────────────────────────
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

        setHeard(text);
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
        // لا نطق تلقائي — الطالب يضغط زر الاستماع وقت ما يبي
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
        // لا نطق تلقائي — الطالب يضغط زر الاستماع وقت ما يبي
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
        <div style={S.bigChar}>译</div>
        <div style={S.eyebrow}>翻译 · الترجمة الفورية</div>
        <h1 style={S.title}>المترجم</h1>
        <p style={S.subtitle}>
          ترجمة فورية بين العربية والصينية والإنجليزية — صوت، كاميرا، وكتابة
        </p>
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

        {translation ? (
          <>
            {/* النص الأصلي (في وضع الكتابة فقط، لأن الصوت/الكاميرا يعرضونه فوق) */}
            {heard && mode === "text" && (
              <div style={S.origText} dir={source === "en" ? "ltr" : "rtl"}>
                {heard}
              </div>
            )}

            {/* الترجمة */}
            <div style={S.transText} dir={target === "en" ? "ltr" : "rtl"}>
              {translation}
            </div>
            {pinyin && <div style={S.pinyin}>{pinyin}</div>}

            {/* علامتا الاستماع */}
            <div style={S.listenRow}>
              {heard && (
                <button
                  onClick={() => speak(heard, source)}
                  style={S.listenChip}
                  aria-label={`استماع ${LANGS[source].label}`}
                >
                  <span style={S.chipLang}>{LANGS[source].label}</span>
                  <span style={S.chipIcon}>🔊</span>
                </button>
              )}
              <button
                onClick={() => speak(translation, target)}
                style={S.listenChip}
                aria-label={`استماع ${LANGS[target].label}`}
              >
                <span style={S.chipLang}>{LANGS[target].label}</span>
                <span style={S.chipIcon}>🔊</span>
              </button>
            </div>
          </>
        ) : (
          <div style={{ ...S.transText, opacity: 0.4 }}>النتيجة تظهر هنا…</div>
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

      {/* شريط التنقّل السفلي — مطابق للموقع */}
      <nav style={S.bottomNav}>
        <a href="/" style={S.navItem}>
          <span style={S.navIcon}>⌂</span>
          <span style={S.navLabel}>الرئيسية</span>
        </a>
        <a href="/hsk-levels" style={S.navItem}>
          <span style={S.navIcon}>水</span>
          <span style={S.navLabel}>المستويات</span>
        </a>
        <a href="/classifiers" style={S.navItem}>
          <span style={S.navIcon}>量</span>
          <span style={S.navLabel}>كلمات الكمية</span>
        </a>
        <a href="/grammar" style={S.navItem}>
          <span style={S.navIcon}>语</span>
          <span style={S.navLabel}>القواعد</span>
        </a>
        <a href="/translate" style={{ ...S.navItem, ...S.navActive }}>
          <span style={S.navIcon}>译</span>
          <span style={S.navLabel}>المترجم</span>
        </a>
      </nav>
    </div>
  );
}

// ── الأنماط — مطابقة لهوية hsk-ar.com ──────────────────────
const red = "#FF4D4F";        // اللون الأساسي للموقع
const redSoft = "#FFF1F1";    // خلفية حمراء فاتحة
const redDeep = "#D9363E";    // أحمر غامق للتأكيد
const ink = "#1A1A2E";        // نص أساسي
const muted = "#8A8AA0";      // نص ثانوي
const bg = "#FBF7F4";         // خلفية الصفحة الدافئة
const card = "#FFFFFF";       // البطاقات
const line = "#EFE7E2";       // الحدود الناعمة

const S = {
  page: {
    maxWidth: 500,
    margin: "0 auto",
    minHeight: "100vh",
    background: bg,
    padding: "26px 18px 110px", // مساحة سفلية لشريط التنقّل
    fontFamily: "'Cairo', 'Segoe UI', system-ui, sans-serif",
    color: ink,
    boxSizing: "border-box",
  },

  header: { textAlign: "center", marginBottom: 24 },
  bigChar: {
    fontSize: 60,
    fontWeight: 700,
    color: red,
    lineHeight: 1,
    marginBottom: 10,
    fontFamily: "'Noto Serif SC', serif",
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: 700,
    color: red,
    marginBottom: 8,
    letterSpacing: "0.2px",
  },
  title: { margin: 0, fontSize: 30, fontWeight: 800, color: ink, letterSpacing: "-0.5px" },
  subtitle: {
    margin: "8px auto 0",
    fontSize: 14,
    color: muted,
    fontWeight: 600,
    maxWidth: 360,
    lineHeight: 1.7,
  },

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
    color: muted,
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
    border: `1.5px solid ${line}`,
  },
  selectSource: { borderColor: "#D8D0CB" },
  selectTarget: { borderColor: red },
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
    background: "#F2EAE5",
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
    color: muted,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background .15s, color .15s",
  },
  modeActive: {
    background: "#fff",
    color: red,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
    border: `2px dashed ${red}`,
    background: redSoft,
    color: red,
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
    border: `1.5px solid ${line}`,
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
    background: red,
    color: "#fff",
    fontSize: 17,
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 14px rgba(255,77,79,0.3)",
  },
  btnDisabled: { opacity: 0.45, cursor: "not-allowed", boxShadow: "none" },
  swapBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    border: "none",
    background: red,
    color: "#fff",
    fontSize: 20,
    cursor: "pointer",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(255,77,79,0.3)",
  },

  panel: {
    background: "#fff",
    borderRadius: 18,
    padding: "16px 18px",
    marginBottom: 14,
    minHeight: 64,
    border: `1px solid ${line}`,
  },
  panelTarget: { background: redSoft, borderColor: "#FBD9DA" },
  panelLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: muted,
    marginBottom: 8,
  },
  heardText: { fontSize: 20, fontWeight: 600, lineHeight: 1.5, minHeight: 28 },

  origText: {
    fontSize: 19,
    fontWeight: 700,
    lineHeight: 1.5,
    color: "#5B5B6B",
    paddingBottom: 12,
    marginBottom: 12,
    borderBottom: `1px dashed #F0CFCF`,
  },
  transText: { fontSize: 23, fontWeight: 800, lineHeight: 1.5, color: ink },
  pinyin: { fontSize: 15, color: red, marginTop: 6, fontWeight: 600, direction: "ltr", textAlign: "right" },

  listenRow: {
    display: "flex",
    gap: 10,
    marginTop: 14,
    flexWrap: "wrap",
  },
  listenChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: "#fff",
    border: `1.5px solid ${red}`,
    color: red,
    borderRadius: 999,
    padding: "7px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  chipLang: { fontWeight: 800 },
  chipIcon: { fontSize: 15, lineHeight: 1 },

  micWrap: { textAlign: "center", margin: "10px 0 18px" },
  mic: {
    position: "relative",
    width: 88,
    height: 88,
    borderRadius: "50%",
    border: "none",
    background: red,
    color: "#fff",
    fontSize: 34,
    cursor: "pointer",
    boxShadow: "0 10px 28px rgba(255,77,79,0.35)",
    transition: "transform .15s",
  },
  micActive: { background: redDeep, transform: "scale(1.05)" },
  pulse: {
    position: "absolute",
    inset: -6,
    borderRadius: "50%",
    border: "3px solid rgba(255,77,79,0.4)",
    animation: "ping 1.2s ease-out infinite",
  },
  statusText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: 700,
    color: muted,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  spinner: {
    width: 14,
    height: 14,
    border: "2px solid #F0DADA",
    borderTopColor: red,
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin .7s linear infinite",
  },

  error: {
    background: redSoft,
    color: redDeep,
    padding: "12px 16px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 14,
    border: "1px solid #FBD9DA",
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
    color: muted,
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
    border: `1px solid ${line}`,
  },
  histFrom: { fontSize: 18, flexShrink: 0 },
  histBody: { flex: 1, minWidth: 0 },
  histSrc: { fontSize: 14, color: muted, fontWeight: 600 },
  histOut: { fontSize: 16, fontWeight: 700, marginTop: 2 },
  histPy: { fontSize: 12, color: red, marginTop: 2, direction: "ltr", textAlign: "right" },
  histPlay: {
    background: redSoft,
    border: "none",
    color: red,
    width: 30,
    height: 30,
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    flexShrink: 0,
  },

  credit: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 11,
    color: "#B7AEA8",
    fontWeight: 600,
    lineHeight: 1.7,
  },

  // شريط التنقّل السفلي الثابت
  bottomNav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 500,
    margin: "0 auto",
    background: "rgba(255,255,255,0.96)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderTop: `1px solid ${line}`,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "8px 4px",
    paddingBottom: "max(8px, env(safe-area-inset-bottom))",
    zIndex: 50,
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    textDecoration: "none",
    color: muted,
    flex: 1,
    padding: "4px 0",
  },
  navActive: { color: red },
  navIcon: { fontSize: 20, fontWeight: 700, lineHeight: 1 },
  navLabel: { fontSize: 11, fontWeight: 700 },
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Noto+Serif+SC:wght@600;700&display=swap');
  * { -webkit-tap-highlight-color: transparent; }
  @keyframes ping { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(1.5);opacity:0} }
  @keyframes spin { to { transform: rotate(360deg) } }
  a:active { opacity: .7; }
  button:focus-visible, textarea:focus-visible, select:focus-visible, a:focus-visible { outline: 3px solid ${red}; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important } }
`;

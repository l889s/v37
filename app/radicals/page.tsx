import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "جذور الحروف الصينية · الدفعة الأولى · HSK",
  description: "خمسة جذور أساسية: 人 女 水 火 月 — لكل جذر قاعدة ذهبية وأمثلة مفكّكة واختبار سريع.",
};

export default function RadicalsPage() {
  return (
    <>
      <style>{`

*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{
  --coral:#FF4D4F;
  --coral-soft:#FFF0F0;
  --ink:#111111;
  --ink2:#3A3A3A;
  --muted:#717171;
  --line:#E8E8E8;
  --bg:#FAFAF8;
  --card:#FFFFFF;
  --violet:#6B4EE6;
  --violet-soft:#F0ECFE;
  --mint:#0E9E82;
  --mint-soft:#E8F7F4;
  --gold:#C49320;
  --gold-soft:#FBF4E0;
  --radius:16px;
  --radius-sm:10px;
  --shadow:0 2px 12px rgba(0,0,0,.06);
}
body{
  font-family:"IBM Plex Sans Arabic",system-ui,sans-serif;
  background:var(--bg);color:var(--ink);
  line-height:1.8;
  -webkit-font-smoothing:antialiased;
  font-size:16px;
}
.zh,.big-zi,.form-zi,.zh-title,.vs-zi,.pill-zi{font-family:"Noto Sans SC",sans-serif}

/* ── hero ── */
header.hero{
  position:relative;overflow:hidden;
  background:#fff;
  border-bottom:1px solid var(--line);
  padding:40px 0 32px;
}
.hero-bgzi{
  position:absolute;top:-30px;left:-6px;
  font-family:"Noto Sans SC",sans-serif;
  font-weight:900;font-size:240px;line-height:1;
  color:var(--coral);opacity:.06;
  pointer-events:none;user-select:none;
}
.wrap{max-width:780px;margin:0 auto;padding:0 16px}
.hero-inner{position:relative}
.hero-kicker{
  font-weight:600;color:var(--coral);
  font-size:.9rem;margin-bottom:12px;
  display:flex;align-items:center;gap:7px;flex-wrap:wrap;
}
h1.hero-title{font-size:1.85rem;font-weight:700;letter-spacing:-.01em;margin-bottom:8px;line-height:1.3}
.hero-sub{color:var(--muted);font-size:.97rem;max-width:46ch;line-height:1.7}
.hero-badges{display:flex;gap:7px;margin-top:16px;flex-wrap:wrap}
.hbadge{
  background:var(--coral-soft);color:var(--coral);
  font-weight:600;font-size:.85rem;
  padding:5px 13px;border-radius:999px;
  white-space:nowrap;
}
.hbadge.alt{background:var(--mint-soft);color:var(--mint)}
.hbadge.alt2{background:var(--violet-soft);color:var(--violet)}

/* ── sticky nav pills ── */
nav.pills{
  position:sticky;top:0;z-index:30;
  background:rgba(250,250,248,.95);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line);
  padding:9px 0;
}
.pills-row{
  display:flex;gap:7px;overflow-x:auto;
  max-width:780px;margin:0 auto;padding:0 16px;
  scrollbar-width:none;
}
.pills-row::-webkit-scrollbar{display:none}
.pill{
  display:flex;align-items:center;gap:6px;
  flex:0 0 auto;text-decoration:none;
  background:var(--card);border:1.5px solid var(--line);
  border-radius:999px;padding:7px 14px;
  transition:border-color .15s,transform .15s;
}
.pill:hover{border-color:var(--coral);transform:translateY(-1px)}
.pill:active{transform:scale(.97)}
.pill-zi{font-size:1.2rem;color:var(--coral);font-weight:700;line-height:1}
.pill-mn{font-size:.85rem;font-weight:600;color:var(--ink2)}

/* ── main ── */
main{padding:22px 0 56px}

/* ── card ── */
.card{
  background:var(--card);
  border:1px solid var(--line);
  border-radius:var(--radius);
  padding:20px 18px;
  margin-bottom:18px;
  scroll-margin-top:66px;
  box-shadow:var(--shadow);
}
.card-head{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.big-zi{
  font-weight:900;font-size:2.9rem;line-height:1;
  color:#fff;background:var(--coral);
  width:76px;height:76px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  flex:0 0 auto;
  box-shadow:0 4px 14px rgba(255,77,79,.3);
}
.head-meta{flex:1;min-width:0}
.head-meta h2{font-size:1.3rem;font-weight:700;line-height:1.25;margin-bottom:4px}
.head-meta .py{
  font-family:"Noto Sans SC",sans-serif;
  color:var(--muted);font-size:.97rem;display:inline;
}
.head-meta .liu{
  display:inline-block;font-size:.78rem;font-weight:600;
  color:var(--coral);background:var(--coral-soft);
  padding:2px 9px;border-radius:999px;margin-top:5px;
}

/* ── sections ── */
.sec,.exs,.expect,.forms{margin-top:16px}
.t{
  display:block;font-size:1rem;font-weight:700;
  color:var(--ink);margin-bottom:8px;
  padding-right:10px;border-right:3px solid var(--coral);
}
.sec p{font-size:.97rem;margin-bottom:6px;color:var(--ink2)}
.keyidea{
  background:var(--gold-soft);
  border-right:3px solid var(--gold);
  border-radius:var(--radius-sm);
  padding:10px 13px;font-size:.95rem;
  margin-top:10px;color:var(--ink2);
}

/* ── forms ── */
.forms{
  background:#F7F7F5;border:1px solid var(--line);
  border-radius:var(--radius-sm);padding:13px 14px;
}
.forms>b{font-size:.92rem;display:block;margin-bottom:8px;color:var(--ink)}
.form-row{display:flex;align-items:center;gap:11px;padding:6px 0}
.form-row+.form-row{border-top:1px solid var(--line)}
.form-zi{font-size:1.65rem;color:var(--coral);width:40px;text-align:center;flex:0 0 auto}
.form-row span{font-size:.95rem;color:var(--muted)}

/* ── examples ── */
.exs .grp{
  font-size:.9rem;font-weight:700;
  margin:13px 0 5px;padding:8px 12px;
  border-radius:var(--radius-sm);
}
.grp small{display:block;font-weight:400;font-size:.85rem;margin-top:2px;opacity:.75}
.grp-sem{background:var(--mint-soft);color:var(--mint)}
.grp-pho{background:var(--violet-soft);color:var(--violet)}

.ex-line{padding:13px 0;border-bottom:1px solid var(--line)}
.ex-line:last-child{border-bottom:0;padding-bottom:2px}
.ex-line .zh{font-size:1.45rem;font-weight:700;color:var(--ink)}
.ex-line .py{
  font-family:"Noto Sans SC",sans-serif;
  color:var(--coral);font-size:.92rem;margin:0 6px;
}
.ex-line .mn{font-weight:700;font-size:1rem;color:var(--ink)}
.ex-note{
  display:block;color:var(--ink2);
  font-size:.95rem;line-height:1.8;margin-top:5px;
}

/* ── golden rule ── */
.golden{
  background:var(--gold-soft);
  border:1px solid #E8D39A;
  border-radius:var(--radius-sm);
  padding:14px 15px;margin-top:8px;
}
.gh{display:block;font-weight:700;color:var(--gold);margin-bottom:9px;font-size:1rem}
.gline{display:flex;align-items:baseline;gap:8px;font-size:.97rem;margin-bottom:7px;flex-wrap:wrap}
.yes{
  background:var(--mint-soft);color:var(--mint);
  font-weight:700;padding:2px 9px;border-radius:6px;
  white-space:nowrap;
}
.no{
  background:var(--coral-soft);color:var(--coral);
  font-weight:700;padding:2px 9px;border-radius:6px;
  white-space:nowrap;
}
.gmemo{
  background:#fff;border-radius:8px;
  padding:9px 12px;font-size:.95rem;
  margin-top:8px;border:1px dashed #E8D39A;
  color:var(--ink2);
}

/* ── howto ── */
.howto{
  background:#F5F8FB;border:1px solid #DDE6EF;
  border-radius:var(--radius-sm);padding:12px 14px;
  margin-top:11px;font-size:.95rem;color:var(--ink2);
}
.ht{display:block;font-weight:700;margin-bottom:5px;color:var(--ink)}
.rel{
  display:inline-block;font-size:.8rem;font-weight:700;
  padding:3px 11px;border-radius:999px;margin-top:8px;
}
.rel-high{background:var(--mint-soft);color:var(--mint)}
.rel-mid{background:var(--gold-soft);color:var(--gold)}

/* ── distinction boxes ── */
.distinct{
  background:#FFF5F5;border:1px solid #FACACA;
  border-radius:var(--radius-sm);padding:14px 15px;margin-top:12px;
}
.dt{display:block;font-weight:700;color:var(--coral);margin-bottom:12px;font-size:.97rem}
.vs-row{
  display:flex;align-items:stretch;justify-content:center;gap:10px;
}
.vs-box{
  flex:1;max-width:180px;background:#fff;
  border:1.5px solid #F5CCCC;border-radius:var(--radius-sm);
  padding:13px 10px;text-align:center;
}
.vs-zi{font-size:2.2rem;color:var(--coral);line-height:1}
.vs-name{font-size:.85rem;font-weight:700;margin:6px 0 7px;color:var(--ink)}
.vs-bars{display:flex;flex-direction:column;align-items:center;gap:6px;margin:6px 0}
.vs-bars .bar{height:4px;background:var(--coral);border-radius:3px;width:40px;opacity:.7}
.vs-bars .bar.short{width:24px}.vs-bars .bar.long{width:50px}
.vs-desc{font-size:.87rem;color:var(--muted);margin-top:4px}
.vs-sep{font-size:1.4rem;color:#C8A0A0;font-weight:700;flex:0 0 auto;align-self:center}
.vs-left{font-size:.9rem;margin:.3rem 0;color:var(--ink2)}
.trick{
  background:#fff;border-radius:8px;
  padding:9px 12px;font-size:.95rem;
  margin-top:10px;border:1px dashed #FACACA;
  color:var(--ink2);
}

/* ── test / quiz ── */
.test{
  background:var(--mint-soft);
  border:1px solid #B8E2D8;
  border-radius:var(--radius-sm);padding:14px 15px;margin-top:12px;
}
.tt{display:block;font-weight:700;color:var(--mint);margin-bottom:11px;font-size:.97rem}
.tq{
  background:#fff;border:1px solid #CCE8E2;
  border-radius:var(--radius-sm);padding:12px 13px;
  margin-bottom:9px;font-size:.95rem;color:var(--ink2);
}
.tq:last-child{margin-bottom:0}
.lvl{
  display:inline-block;font-size:.78rem;font-weight:700;
  padding:3px 10px;border-radius:999px;
  background:var(--mint-soft);color:var(--mint);
  margin-left:6px;vertical-align:middle;
}
.lvl.mid{background:var(--gold-soft);color:var(--gold)}
.lvl.hard{background:var(--coral-soft);color:var(--coral)}
.qz{font-size:1.25rem;font-weight:700;color:var(--ink);margin:0 5px;vertical-align:middle}
.py{font-family:"Noto Sans SC",sans-serif}
.ans{
  display:block;color:#444;font-size:.93rem;
  margin-top:8px;padding-top:8px;
  border-top:1px dashed #CCE8E2;
  line-height:1.7;
}

/* ── expert / errors ── */
.expert{margin-top:16px}
.err{
  border-right:3px solid var(--coral);
  border-radius:var(--radius-sm);
  padding:11px 13px;margin-bottom:9px;
  font-size:.95rem;color:var(--ink2);
  background:#FAFAFA;
  border-left:none;border-top:none;border-bottom:none;
  border:1px solid var(--line);border-right:3px solid var(--coral);
}
.eh{font-weight:700;color:var(--coral);display:block;margin-bottom:3px}
.fix{font-weight:700;color:var(--mint)}

/* ── cultural window ── */
.cult{
  background:var(--violet-soft);
  border:1px solid #C8B8F6;
  border-radius:var(--radius-sm);
  padding:14px 15px;margin-top:14px;
}
.cult>b{display:block;font-weight:700;color:var(--violet);margin-bottom:7px;font-size:.97rem}
.cult p{font-size:.95rem;line-height:1.85;color:var(--ink2)}

/* ── sound pill (if exists) ── */
.sound-pill{
  display:inline-block;background:var(--mint-soft);color:var(--mint);
  font-family:"Noto Sans SC",sans-serif;font-size:.88rem;font-weight:600;
  padding:3px 10px;border-radius:6px;margin:2px 3px;
}

/* ── footer ── */
footer{
  border-top:1px solid var(--line);padding:28px 0 44px;
  text-align:center;color:var(--muted);font-size:.9rem;
}
footer .zh-title{color:var(--coral);font-weight:700;font-size:1rem;letter-spacing:.08em;display:block;margin-bottom:6px}
footer a{color:var(--coral);text-decoration:none;font-weight:600}

/* ── accessibility ── */
a:focus-visible,.pill:focus-visible{outline:2px solid var(--coral);outline-offset:2px}

/* ── MOBILE: ≤ 520px ── */
@media (max-width:520px){
  header.hero{padding:30px 0 26px}
  h1.hero-title{font-size:1.55rem}
  .hero-bgzi{font-size:170px;top:-20px}
  .hero-sub{font-size:.93rem}
  .hbadge{font-size:.82rem}

  .pill{padding:6px 11px}
  .pill-zi{font-size:1.1rem}
  .pill-mn{font-size:.82rem}

  .card{padding:16px 14px;border-radius:14px}
  .card-head{gap:12px}
  .big-zi{width:66px;height:66px;font-size:2.5rem;border-radius:12px}
  .head-meta h2{font-size:1.18rem}

  .t{font-size:.97rem}
  .sec p,.keyidea,.ex-note,.gline,.howto,.cult p,.err,.trick,.gmemo,.tq,.ans{font-size:.93rem}
  .ex-line .zh{font-size:1.35rem}
  .ex-line .mn{font-size:.97rem}
  .qz{font-size:1.15rem}
  .lvl{font-size:.76rem;padding:2px 8px}

  /* vs-row: stack on very small screens */
  .vs-row{gap:7px}
  .vs-box{padding:11px 8px}
  .vs-zi{font-size:1.9rem}
  .vs-desc{font-size:.82rem}
  .vs-name{font-size:.82rem}

  .golden,.distinct,.test,.cult,.howto{padding:12px 12px}
}

/* ── TABLET: 521–780px ── */
@media (min-width:521px) and (max-width:780px){
  h1.hero-title{font-size:1.8rem}
  .card{padding:20px 18px}
}

@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto;transition:none}}

      `}</style>

      {/* hero */}
      <header className="hero">
        <div className="hero-bgzi">部</div>
        <div className="wrap hero-inner">
          <div className="hero-kicker">
            <span>汉字部首</span> · جذور الحروف الصينية
          </div>
          <h1 className="hero-title">جذور الحروف — الدفعة الأولى</h1>
          <p className="hero-sub">
            خمسة جذور تُبنى عليها آلاف الكلمات. لكل جذر: قاعدة ذهبية، أمثلة مفكّكة، اختبار سريع، وتمييز بصري للحروف المتشابهة.
          </p>
          <div className="hero-badges">
            <span className="hbadge">٥ جذور أساسية</span>
            <span className="hbadge alt">مستوى HSK 1</span>
            <span className="hbadge alt2">人 女 水 火 月</span>
          </div>
        </div>
      </header>

      {/* sticky nav */}
      <nav className="pills">
        <div className="pills-row">
          <a className="pill" href="#r-ren"><span className="pill-zi">人</span><span className="pill-mn">إنسان</span></a>
          <a className="pill" href="#r-nv"><span className="pill-zi">女</span><span className="pill-mn">امرأة</span></a>
          <a className="pill" href="#r-shui"><span className="pill-zi">水</span><span className="pill-mn">ماء</span></a>
          <a className="pill" href="#r-huo"><span className="pill-zi">火</span><span className="pill-mn">نار</span></a>
          <a className="pill" href="#r-yue"><span className="pill-zi">月</span><span className="pill-mn">قمر</span></a>
        </div>
      </nav>

      {/* cards */}
      <main className="wrap">
<div className="card" id="r-ren">
<div className="card-head">
<div className="big-zi">人</div>
<div className="head-meta"><h2>إنسان / شخص</h2><span className="py">rén</span><span className="liu">象形 · صورية</span></div>
</div>

<div className="sec root"><b className="t">١. الجذر الرئيسي</b>
<p>人 (rén) = إنسان. أصله رسم شخصٍ يمشي على ساقين.</p>
<p>له شكلان: الكامل 人، والجانبي 亻 على يسار الحرف.</p>
<div className="keyidea">📌 الشكل الجانبي 亻 يُسمى 单人旁 (جانب الإنسان).</div>
</div>

<div className="forms"><b>🧩 الجذر وأشكاله</b>
<div className="form-row"><div className="form-zi">人</div><span>إنسان — مستقلاً أو أسفل الحرف</span></div>
<div className="form-row"><div className="form-zi">亻</div><span>إنسان — جانبياً على يسار الحرف</span></div>
</div>

<div className="sec rel"><b className="t">٢. العلاقة الدلالية</b>
<p>يدلّ على <b>البشر وصفاتهم وأفعالهم</b>.</p>
<p>كل ما يخصّ الناس — ضمائرهم، مهنهم، علاقاتهم، أخلاقهم — يحمل هذا الجذر.</p>
<div className="keyidea">🔑 رأيت 亻 على اليسار؟ فكّر: <b>شخص أو صفة بشرية</b>.</div>
</div>

<div className="exs"><b className="t">٣. أمثلة على النمط</b>
<div className="ex-line"><span className="zh">你</span> <span className="py">nǐ</span> — <span className="mn">أنت</span>
<span className="ex-note">亻 (إنسان) + 尔 (ضمير المخاطب القديم): فصار 你 يدلّ على «أنت» = أنت.</span></div>
<div className="ex-line"><span className="zh">他</span> <span className="py">tā</span> — <span className="mn">هو</span>
<span className="ex-note">亻 (إنسان) + 也 (يقرّب النطق): ضمير الغائب المذكّر = هو.</span></div>
<div className="ex-line"><span className="zh">住</span> <span className="py">zhù</span> — <span className="mn">يسكن</span>
<span className="ex-note">亻 (إنسان) + 主 (السيّد / صاحب المكان، يقرّب النطق): الإنسان يثبت حيث يكون صاحباً أو مضيفاً = يسكن ويستقرّ.</span></div>
<div className="ex-line"><span className="zh">信</span> <span className="py">xìn</span> — <span className="mn">ثقة / رسالة</span>
<span className="ex-note">亻 (إنسان) + 言 (كلام): كلام الإنسان إذا صَدَق صار ثقة، وإذا نُقِل بين الناس صار رسالة = ثقة / صدق / رسالة.</span></div>
<div className="ex-line"><span className="zh">休</span> <span className="py">xiū</span> — <span className="mn">يستريح</span>
<span className="ex-note">亻 (إنسان) + 木 (شجرة): إنسانٌ يستند إلى شجرة = يستريح.</span></div>
<div className="ex-line"><span className="zh">体</span> <span className="py">tǐ</span> — <span className="mn">جسم</span>
<span className="ex-note">亻 (إنسان) + 本 (أصل / أساس): الجسم أصل الإنسان وأساس وجوده = جسم. (التقليدي 體 = 骨 عظم + 豊، أي بناءٌ قوامه العظام.)</span></div>
</div>

<div className="expect"><b className="t">٤. المعنى المتوقع — قواعد تطبيقية</b>

<div className="golden"><span className="gh">⭐ القاعدة الذهبية</span>
<span className="gline"><span className="yes">رأيت 亻 على اليسار؟</span> → المعنى عن <b>شخص أو صفة بشرية</b>.</span>
<span className="gmemo">🧠 «亻 يسار = إنسان أو فعلٌ بشري.»</span>
</div>

<div className="howto"><span className="ht">دلالي غالباً</span>
亻 يعطي المعنى البشري، والجزء الآخر يقرّب النطق.
<span className="rel rel-high">موثوقية عالية</span></div>

<div className="distinct"><span className="dt">⚠️ الفرق بين 人 و入</span>
<div className="vs-row">
<div className="vs-box"><div className="vs-zi">人</div><div className="vs-name">rén · إنسان</div><div className="vs-desc">الضربة <b>اليمنى</b> أطول</div></div>
<div className="vs-sep">≠</div>
<div className="vs-box"><div className="vs-zi">入</div><div className="vs-name">rù · يدخل</div><div className="vs-desc">الضربة <b>اليسرى</b> أطول وبرأس</div></div>
</div>
<div className="trick">🔑 الإنسان 人 يفرد يمينه · الدخول 入 يميل يساره.</div>
</div>

<div className="test"><span className="tt">🧪 اختبار سريع — شخص أم لا؟</span>
<div className="tq"><span className="lvl">سهل</span> <span className="qz">你</span> <span className="py">nǐ</span> — يساره 亻.
<span className="ans">亻 إنسان → ضمير شخص (أنت). ✓</span></div>
<div className="tq"><span className="lvl mid">متوسط</span> <span className="qz">休</span> <span className="py">xiū</span> — فيه 亻 + 木.
<span className="ans">إنسان يستند إلى شجرة → يستريح. ✓</span></div>
<div className="tq"><span className="lvl hard">صعب</span> <span className="qz">入</span> <span className="py">rù</span>
<span className="ans">⚠️ ليس 人! ضربته اليسرى أطول = 入 (يدخل). ✓</span></div>
</div>
</div>

<div className="sec expert"><b className="t">٥. ملاحظة خبير — أخطاء شائعة</b>
<div className="err"><span className="eh">خطأ ١:</span> الخلط بين 人 (إنسان) و入 (يدخل).<br />
<span className="fix">✓ الصواب:</span> 人 يمينه أطول، 入 يساره أطول وبرأس مائل.</div>
<div className="keyidea">💡 亻 من أغزر الجذور — معظم كلمات الناس والمهن تحمله.</div>
</div>

<div className="cult"><b>🏛️ نافذة ثقافية</b>
<p>الحرف 人 رمزٌ للإنسانية في الفكر الصيني. والكلمة 人们 (rénmen) = «الناس». والمثل 三人行，必有我师 لكونفوشيوس: «إن سار ثلاثةٌ معاً، فلا بدّ أن أحدهم معلّمي» — أي تعلّم من كل من حولك.</p></div>
</div>


<!-- ================= 女 ================= -->
<div className="card" id="r-nv">
<div className="card-head">
<div className="big-zi">女</div>
<div className="head-meta"><h2>امرأة / أنثى</h2><span className="py">nǚ</span><span className="liu">象形 · صورية</span></div>
</div>

<div className="sec root"><b className="t">١. الجذر الرئيسي</b>
<p>女 (nǚ) = امرأة. أصله رسم امرأةٍ جالسة بانحناء.</p>
<p>يأتي مستقلاً، أو على يسار الحرف. شكله ثابت.</p>
<div className="keyidea">📌 جذر الأنوثة — يربط كلمات النساء والعلاقات الأسرية.</div>
</div>

<div className="forms"><b>🧩 الجذر وأشكاله</b>
<div className="form-row"><div className="form-zi">女</div><span>امرأة — مستقلاً أو على يسار الحرف</span></div>
</div>

<div className="sec rel"><b className="t">٢. العلاقة الدلالية</b>
<p>يدلّ على <b>النساء والقرابة الأنثوية وصفاتها</b>.</p>
<p>أسماء القريبات (الأم، الأخت)، وبعض الصفات، تحمل هذا الجذر.</p>
<div className="keyidea">🔑 رأيت 女 على اليسار؟ فكّر: <b>أنثى أو قرابة</b>.</div>
</div>

<div className="exs"><b className="t">٣. أمثلة على النمط</b>
<div className="grp grp-sem">👩 قرابة أنثوية</div>
<div className="ex-line"><span className="zh">妈</span> <span className="py">mā</span> — <span className="mn">أم</span>
<span className="ex-note">女 (امرأة) + 马 (يقرّب النطق ma): الأنثى الأقرب للطفل. وترتبط 马 رمزياً بالقوّة والتحمّل والخدمة، وهي صفاتٌ تشبه دور الأم في حمل المسؤولية ورعاية أسرتها = أم.</span></div>
<div className="ex-line"><span className="zh">姐</span> <span className="py">jiě</span> — <span className="mn">أخت كبرى</span>
<span className="ex-note">女 (امرأة) + 且 (يقرّب النطق): الأنثى الأكبر بين الإخوة = أخت كبرى.</span></div>
<div className="ex-line"><span className="zh">妹</span> <span className="py">mèi</span> — <span className="mn">أخت صغرى</span>
<span className="ex-note">女 (امرأة) + 未 (لم يكبر / غير ناضج بعد): البنت التي لم تبلغ بعد = أخت صغرى.</span></div>
<div className="ex-line"><span className="zh">奶</span> <span className="py">nǎi</span> — <span className="mn">جدّة</span>
<span className="ex-note">女 (امرأة) + 乃 (يقرّب النطق): تُضاعف 奶奶 للجدّة. وترتبط 乃 رمزياً بالثدي والرضاعة، ومن هنا اقترنت 奶 بالجدّة كرمز للحنان والرعاية = جدّة.</span></div>
<div className="grp grp-pho">🏠 صفات ومعانٍ</div>
<div className="ex-line"><span className="zh">她</span> <span className="py">tā</span> — <span className="mn">هي</span>
<span className="ex-note">女 (امرأة) + 也 (يقرّب النطق): ضمير الغائبة، يقابل 他 للمذكّر = هي.</span></div>
<div className="ex-line"><span className="zh">嫁</span> <span className="py">jià</span> — <span className="mn">تتزوّج</span>
<span className="ex-note">女 (امرأة) + 家 (بيت): الزواج في المفهوم التقليدي هو انتقال المرأة إلى بيت الزوج وتأسيس أسرة جديدة = تتزوّج.</span></div>
<div className="ex-line"><span className="zh">安</span> <span className="py">ān</span> — <span className="mn">أمان</span>
<span className="ex-note">女 (امرأة) تحت 宀 (سقف): امرأةٌ مستقرّة في بيتها = سكينة وأمان.</span></div>
</div>

<div className="expect"><b className="t">٤. المعنى المتوقع — قواعد تطبيقية</b>

<div className="golden"><span className="gh">⭐ القاعدة الذهبية</span>
<span className="gline"><span className="yes">رأيت 女 على اليسار؟</span> → المعنى عن <b>أنثى أو قرابة</b>.</span>
<span className="gmemo">🧠 «女 يسار = امرأة أو علاقة أسرية.»</span>
</div>

<div className="howto"><span className="ht">دلالي غالباً</span>
女 يعطي المعنى الأنثوي، والجزء الآخر يقرّب النطق.
<span className="rel rel-high">موثوقية عالية</span></div>

<div className="distinct"><span className="dt">⚠️ الفرق بين 女 و母</span>
<div className="vs-row">
<div className="vs-box"><div className="vs-zi">女</div><div className="vs-name">nǚ · امرأة</div><div className="vs-desc">بلا نقاط</div></div>
<div className="vs-sep">≠</div>
<div className="vs-box"><div className="vs-zi">母</div><div className="vs-name">mǔ · أمّ</div><div className="vs-desc">فيه <b>نقطتان</b> (الصدر)</div></div>
</div>
<div className="trick">🔑 الأمّ 母 لها نقطتان ترمزان للإرضاع · 女 بلا نقاط.</div>
</div>

<div className="test"><span className="tt">🧪 اختبار سريع — أنثى أم لا؟</span>
<div className="tq"><span className="lvl">سهل</span> <span className="qz">妈</span> <span className="py">mā</span> — يساره 女.
<span className="ans">女 امرأة → قرابة أنثوية (أم). ✓</span></div>
<div className="tq"><span className="lvl mid">متوسط</span> <span className="qz">安</span> <span className="py">ān</span> — 女 تحت سقف.
<span className="ans">امرأة مستقرّة في بيتها → أمان. ✓</span></div>
<div className="tq"><span className="lvl hard">صعب</span> <span className="qz">母</span> <span className="py">mǔ</span>
<span className="ans">⚠️ ليس 女! فيه نقطتان = 母 (أمّ). ✓</span></div>
</div>
</div>

<div className="sec expert"><b className="t">٥. ملاحظة خبير — أخطاء شائعة</b>
<div className="err"><span className="eh">خطأ ١:</span> الخلط بين 女 (امرأة) و母 (أمّ).<br />
<span className="fix">✓ الصواب:</span> 母 فيه نقطتان، 女 بلا نقاط.</div>
<div className="keyidea">💡 الحرف 好 (جيّد) = 女 (امرأة) + 子 (طفل): الأمّ وطفلها = صورة الخير.</div>
</div>

<div className="cult"><b>🏛️ نافذة ثقافية</b>
<p>الحرف 好 (hǎo = جيّد) يجمع المرأة 女 وطفلها 子 — فاجتماعهما رمزٌ للخير والبركة. وكلمة 妈妈 (māma = ماما) من أوائل ما ينطقه الطفل الصيني، كما في معظم لغات العالم.</p></div>
</div>


<!-- ================= 水 ================= -->
<div className="card" id="r-shui">
<div className="card-head">
<div className="big-zi">水</div>
<div className="head-meta"><h2>ماء / سائل</h2><span className="py">shuǐ</span><span className="liu">象形 · صورية</span></div>
</div>

<div className="sec root"><b className="t">١. الجذر الرئيسي</b>
<p>水 (shuǐ) = ماء. أصله رسم جدولٍ يجري بتموّجاته.</p>
<p>له شكلان: الكامل 水، والجانبي 氵 (ثلاث نقاط) على اليسار.</p>
<div className="keyidea">📌 الشكل الجانبي 氵 يُسمى 三点水 (ثلاث نقاط الماء).</div>
</div>

<div className="forms"><b>🧩 الجذر وأشكاله</b>
<div className="form-row"><div className="form-zi">水</div><span>ماء — مستقلاً أو أسفل الحرف</span></div>
<div className="form-row"><div className="form-zi">氵</div><span>ماء — ثلاث نقاط على يسار الحرف</span></div>
</div>

<div className="sec rel"><b className="t">٢. العلاقة الدلالية</b>
<p>يدلّ على <b>الماء والسوائل والمسطّحات المائية</b>.</p>
<p>كل ما يجري أو يُشرب أو يتعلّق بالأنهار والبحار يحمل هذا الجذر.</p>
<div className="keyidea">🔑 رأيت 氵 على اليسار؟ فكّر فوراً: <b>ماء أو سائل</b>.</div>
</div>

<div className="exs"><b className="t">٣. أمثلة على النمط</b>
<div className="ex-line"><span className="zh">河</span> <span className="py">hé</span> — <span className="mn">نهر</span>
<span className="ex-note">氵 (ماء) + 可 (يقرّب النطق): مجرى ماءٍ يجري. وترتبط 可 رمزياً بفكرة «إجازة المرور»، فالنهر مسارٌ يتيح التنقّل والريّ = نهر.</span></div>
<div className="ex-line"><span className="zh">海</span> <span className="py">hǎi</span> — <span className="mn">بحر</span>
<span className="ex-note">氵 (ماء) + 每 (كلّ / كثير، يقرّب النطق): الماء الكثير الذي لا ينتهي = بحر.</span></div>
<div className="ex-line"><span className="zh">洗</span> <span className="py">xǐ</span> — <span className="mn">يغسل</span>
<span className="ex-note">氵 (ماء) + 先 (سابق / قبل، يقرّب النطق): الغسل بالماء أوّل ما تُستهلّ به الطهارة قبل كل شيء = يغسل.</span></div>
<div className="ex-line"><span className="zh">江</span> <span className="py">jiāng</span> — <span className="mn">نهر كبير</span>
<span className="ex-note">氵 (ماء) + 工 (يقرّب النطق): نهرٌ كبير، ومنها 长江 (اليانغتسي). ويقول بعض الصينيين إن 工 توحي بالعمل والهندسة لأن الأنهار الكبرى كانت مسرح مشاريع الريّ — روايةٌ شعبية، والأصل أن 工 صوتية.</span></div>
<div className="ex-line"><span className="zh">游</span> <span className="py">yóu</span> — <span className="mn">يسبح</span>
<span className="ex-note">氵 (ماء) + 斿 (يقرّب النطق): التحرّك في الماء (游泳). وتربط تفسيراتٌ شعبية 斿 (الراية ترفرف) بالحركة الانسيابية المستمرّة = يسبح.</span></div>
<div className="ex-line"><span className="zh">泪</span> <span className="py">lèi</span> — <span className="mn">دموع</span>
<span className="ex-note">氵 (ماء) + 目 (عين): ماء العين = دموع.</span></div>
</div>

<div className="expect"><b className="t">٤. المعنى المتوقع — قواعد تطبيقية</b>

<div className="golden"><span className="gh">⭐ القاعدة الذهبية</span>
<span className="gline"><span className="yes">رأيت 氵 على اليسار؟</span> → المعنى عن <b>ماء أو سائل</b>.</span>
<span className="gmemo">🧠 «氵 ثلاث نقاط = ماء، دائماً.»</span>
</div>

<div className="howto"><span className="ht">أقوى قاعدة في الباب</span>
氵 دلالي <b>دائماً</b>، والجزء الأيمن يقرّب النطق. من أوضح الجذور وأكثرها اطّراداً.
<span className="rel rel-high">موثوقية عالية جداً</span></div>

<div className="distinct"><span className="dt">⚠️ الفرق بين 氵 و冫</span>
<div className="vs-row">
<div className="vs-box"><div className="vs-zi">氵</div><div className="vs-name">ماء</div><div className="vs-desc"><b>ثلاث</b> نقاط</div></div>
<div className="vs-sep">≠</div>
<div className="vs-box"><div className="vs-zi">冫</div><div className="vs-name">جليد</div><div className="vs-desc"><b>نقطتان</b> فقط</div></div>
</div>
<div className="trick">🔑 الماء 氵 ثلاث نقاط (سائل) · الجليد 冫 نقطتان (متجمّد).</div>
</div>

<div className="test"><span className="tt">🧪 اختبار سريع — ماء أم لا؟</span>
<div className="tq"><span className="lvl">سهل</span> <span className="qz">河</span> <span className="py">hé</span> — يساره 氵.
<span className="ans">氵 ماء → مجرى ماء (نهر). ✓</span></div>
<div className="tq"><span className="lvl mid">متوسط</span> <span className="qz">泪</span> <span className="py">lèi</span> — 氵 + عين 目.
<span className="ans">ماء العين → دموع. ✓</span></div>
<div className="tq"><span className="lvl hard">صعب</span> <span className="qz">冷</span> <span className="py">lěng</span>
<span className="ans">⚠️ يساره 冫 (نقطتان = جليد) لا 氵! المعنى «بارد». ✓</span></div>
</div>
</div>

<div className="sec expert"><b className="t">٥. ملاحظة خبير — أخطاء شائعة</b>
<div className="err"><span className="eh">خطأ ١:</span> الخلط بين 氵 (ماء، ثلاث نقاط) و冫 (جليد، نقطتان).<br />
<span className="fix">✓ الصواب:</span> عُدّ النقاط: ثلاث = ماء، اثنتان = جليد/برودة.</div>
<div className="keyidea">💡 氵 من أكثر الجذور إنتاجاً — مئات الكلمات المائية تحمله.</div>
</div>

<div className="cult"><b>🏛️ نافذة ثقافية</b>
<p>الماء رمز الحكمة والمرونة في الفلسفة الصينية. يقول لاوتزه: 上善若水 («أعلى الخير كالماء») — لأن الماء ينفع كل شيء دون منازعة، ويتغلّب على الصلب باللين. والماء أحد العناصر الخمسة (五行).</p></div>
</div>


<!-- ================= 火 ================= -->
<div className="card" id="r-huo">
<div className="card-head">
<div className="big-zi">火</div>
<div className="head-meta"><h2>نار / حرارة</h2><span className="py">huǒ</span><span className="liu">象形 · صورية</span></div>
</div>

<div className="sec root"><b className="t">١. الجذر الرئيسي</b>
<p>火 (huǒ) = نار. أصله رسم لهبٍ يتصاعد بألسنته.</p>
<p>له شكلان: الكامل 火 (يسار)، والسفلي 灬 (أربع نقاط = الجمر) أسفل الحرف.</p>
<div className="keyidea">📌 الشكل السفلي 灬 يُسمى 四点底 (أربع نقاط الجمر).</div>
</div>

<div className="forms"><b>🧩 الجذر وأشكاله</b>
<div className="form-row"><div className="form-zi">火</div><span>نار — مستقلاً أو على يسار الحرف</span></div>
<div className="form-row"><div className="form-zi">灬</div><span>جمر — أربع نقاط أسفل الحرف</span></div>
</div>

<div className="sec rel"><b className="t">٢. العلاقة الدلالية</b>
<p>يدلّ على <b>النار والحرارة والطهي والضوء</b>.</p>
<p>كل ما يشتعل أو يسخّن أو يُطهى يحمل هذا الجذر بشكليه 火 أو 灬.</p>
<div className="keyidea">🔑 رأيت 火 أو 灬؟ فكّر: <b>نار أو حرارة أو طهي</b>.</div>
</div>

<div className="exs"><b className="t">٣. أمثلة على النمط</b>
<div className="grp grp-sem">🔥 نار جانبية (火)</div>
<div className="ex-line"><span className="zh">烧</span> <span className="py">shāo</span> — <span className="mn">يحرق / يطهو</span>
<span className="ex-note">火 (نار) + 尧 (يقرّب النطق): إشعالٌ وحرارة. وترتبط 尧 بدلالة العلوّ، أي تصاعُد اللهب = يحرق / يطهو.</span></div>
<div className="ex-line"><span className="zh">灯</span> <span className="py">dēng</span> — <span className="mn">مصباح</span>
<span className="ex-note">火 (نار) + 丁 (يقرّب النطق): مصدر ضوءٍ ناري = مصباح.</span></div>
<div className="ex-line"><span className="zh">烤</span> <span className="py">kǎo</span> — <span className="mn">يشوي</span>
<span className="ex-note">火 (نار) + 考 (يقرّب النطق): طبخٌ على النار مباشرة. وترتبط 考 بالاختبار والفحص، وكأن الشوي اختبارٌ للطعام حتى ينضج = يشوي.</span></div>
<div className="grp grp-pho">🔥 جمر سفلي (灬)</div>
<div className="ex-line"><span className="zh">热</span> <span className="py">rè</span> — <span className="mn">حار</span>
<span className="ex-note">灬 (جمر) + 执 (يمسك / يقبض): الحرارة تمسك بالجسم وتغيّر حاله، فدلّت على شدّة الحرّ = حار.</span></div>
<div className="ex-line"><span className="zh">煮</span> <span className="py">zhǔ</span> — <span className="mn">يسلق</span>
<span className="ex-note">灬 (جمر) + 者 (يقرّب النطق): دور 者 صوتيّ، والجمر تحتها يغلي الماء فوقه = يسلق.</span></div>
<div className="ex-line"><span className="zh">照</span> <span className="py">zhào</span> — <span className="mn">يضيء / يصوّر</span>
<span className="ex-note">灬 (نار / ضوء) + 昭 (واضح / يقرّب النطق): دلالة الوضوح مع الضوء = نورٌ يكشف ما حوله = يضيء، ومنها 照片 (صورة) لأنها تُظهر بوضوح.</span></div>
<div className="ex-line"><span className="zh">灾</span> <span className="py">zāi</span> — <span className="mn">كارثة</span>
<span className="ex-note">火 (نار) تحت 宀 (سقف): نارٌ تشتعل تحت سقف البيت فتحرقه = كارثة. (التقليدي 災 = 川 فيضان + 火 حريق: أعظم كوارث الطبيعة.)</span></div>
</div>

<div className="expect"><b className="t">٤. المعنى المتوقع — قواعد تطبيقية</b>

<div className="golden"><span className="gh">⭐ القاعدة الذهبية</span>
<span className="gline"><span className="yes">火 يسار أو 灬 أسفل؟</span> → المعنى عن <b>نار أو حرارة</b>.</span>
<span className="gmemo">🧠 «火 يسار · 灬 أسفل = نار وحرارة.»</span>
</div>

<div className="howto"><span className="ht">انتبه للنقاط الأربع</span>
灬 (أربع نقاط أسفل الحرف) ليست ماءً — بل جمرٌ يرمز للنار والحرارة.
<span className="rel rel-high">موثوقية عالية</span></div>

<div className="distinct"><span className="dt">⚠️ الفرق بين 灬 و 氺</span>
<div className="vs-row">
<div className="vs-box"><div className="vs-zi">灬</div><div className="vs-name">جمر / نار</div><div className="vs-desc">أربع نقاط <b>منفصلة</b></div></div>
<div className="vs-sep">≠</div>
<div className="vs-box"><div className="vs-zi">水</div><div className="vs-name">shuǐ · ماء</div><div className="vs-desc">خطوط <b>متّصلة</b></div></div>
</div>
<div className="trick">🔑 أربع نقاط أسفل الحرف = جمرٌ (نار)، لا ماء. (热، 煮، 照)</div>
</div>

<div className="test"><span className="tt">🧪 اختبار سريع — نار أم لا؟</span>
<div className="tq"><span className="lvl">سهل</span> <span className="qz">烧</span> <span className="py">shāo</span> — يساره 火.
<span className="ans">火 نار → إشعال وحرارة (يحرق / يطهو). ✓</span></div>
<div className="tq"><span className="lvl mid">متوسط</span> <span className="qz">热</span> <span className="py">rè</span> — أسفله 灬.
<span className="ans">灬 جمر → حرارة تصعد (حار). ✓</span></div>
<div className="tq"><span className="lvl hard">صعب</span> <span className="qz">照</span> <span className="py">zhào</span> — أسفله 灬.
<span className="ans">灬 نار/ضوء → يضيء، ومنها 照片 (صورة)؛ ليست أربع نقاط ماء! ✓</span></div>
</div>
</div>

<div className="sec expert"><b className="t">٥. ملاحظة خبير — أخطاء شائعة</b>
<div className="err"><span className="eh">خطأ ١:</span> ظنّ النقاط الأربع 灬 ماءً.<br />
<span className="fix">✓ الصواب:</span> 灬 جمرٌ (نار) أسفل الحرف، لا ماء — كما في 热 و煮.</div>
<div className="keyidea">💡 النار 火 أحد العناصر الخمسة (五行)، وترمز للصيف والجنوب واللون الأحمر.</div>
</div>

<div className="cult"><b>🏛️ نافذة ثقافية</b>
<p>النار رمز الحماس والازدهار. التعبير 红火 (hónghuo = «أحمر ناري») يصف الحياة المزدهرة المليئة بالحيوية. وعبارة 火锅 (huǒguō = «قِدر النار») هي الهوت بوت الشهير — وجبة جماعية تُطهى على نارٍ وسط المائدة.</p></div>
</div>


<!-- ================= 月 ================= -->
<div className="card" id="r-yue">
<div className="card-head">
<div className="big-zi">月</div>
<div className="head-meta"><h2>قمر / شهر · لحم</h2><span className="py">yuè</span><span className="liu">象形 · صورية</span></div>
</div>

<div className="sec root"><b className="t">١. الجذر الرئيسي</b>
<p>月 (yuè) = قمر / شهر. أصله رسم الهلال.</p>
<p>مهم جداً: شكله يطابق جذر اللحم 肉 المدمج — فله <b>معنيان حسب الكلمة</b>.</p>
<div className="keyidea">📌 احذر: 月 أحياناً «قمر»، وأحياناً «لحم / جسد» (انظر القسم ٥).</div>
</div>

<div className="forms"><b>🧩 الجذر وأشكاله</b>
<div className="form-row"><div className="form-zi">月</div><span>قمر / شهر — في كلمات الزمن والضوء</span></div>
<div className="form-row"><div className="form-zi">月</div><span>لحم / جسد — في كلمات أعضاء الجسم (أصله 肉)</span></div>
</div>

<div className="sec rel"><b className="t">٢. العلاقة الدلالية</b>
<p>له معنيان: <b>القمر والزمن</b>، أو <b>اللحم والجسد</b>.</p>
<p>في كلمات الضوء والوقت = قمر. وفي أسماء أعضاء الجسم = لحم.</p>
<div className="keyidea">🔑 رأيت 月؟ اسأل: هل الكلمة عن وقتٍ وضوء، أم عن عضوٍ من الجسد؟</div>
</div>

<div className="exs"><b className="t">٣. أمثلة على النمط</b>
<div className="grp grp-sem">🌙 قمر ووقت</div>
<div className="ex-line"><span className="zh">明</span> <span className="py">míng</span> — <span className="mn">ساطع</span>
<span className="ex-note">日 (شمس) + 月 (قمر): يجتمع أقوى مصدرَي نور فيكتمل السطوع = ساطع. (في نقوش العظام 甲骨文 كُتب 囧 نافذة + 月: ضوء القمر يتسلّل من النافذة، ثم استُبدلت بـ日.)</span></div>
<div className="ex-line"><span className="zh">期</span> <span className="py">qī</span> — <span className="mn">فترة / موعد</span>
<span className="ex-note">月 (قمر) + 其 (يقرّب النطق): القمر يُحسب به الزمن، و其 صوّرت قديماً سلّةً منظّمة، فأوحت بـ«وعاء الزمن» ودورته = فترة / موعد.</span></div>
<div className="ex-line"><span className="zh">朝</span> <span className="py">zhāo / cháo</span> — <span className="mn">صباح / حقبة</span>
<span className="ex-note">月 (قمر) + 龺 (شمس تشرق بين العشب): عند الفجر يجتمع القمر غرباً والشمس شرقاً، فجاء معنى مواجهة النهار «صباح» ودورة الزمن «حقبة».</span></div>
<div className="grp grp-pho">🦵 لحم وجسد (月 = 肉)</div>
<div className="ex-line"><span className="zh">脸</span> <span className="py">liǎn</span> — <span className="mn">وجه</span>
<span className="ex-note">月 (لحم / جسد) + 佥 (يقرّب النطق): عضوٌ من الجسد، لا علاقة له بالقمر = وجه.</span></div>
<div className="ex-line"><span className="zh">胖</span> <span className="py">pàng</span> — <span className="mn">سمين</span>
<span className="ex-note">月 (لحم / جسد) + 半 (نصف، يقرّب النطق): امتلأ الجسم حتى صار كأنّ فيه نصفاً إضافياً من اللحم = سمين.</span></div>
<div className="ex-line"><span className="zh">肚</span> <span className="py">dù</span> — <span className="mn">بطن</span>
<span className="ex-note">月 (لحم / جسد) + 土 (تراب / أرض، يقرّب النطق): البطن أرض الجسد، يستقرّ فيه الطعام كالبذرة في التراب ثم يغذّي البدن = بطن (肚子).</span></div>
<div className="ex-line"><span className="zh">腿</span> <span className="py">tuǐ</span> — <span className="mn">ساق</span>
<span className="ex-note">月 (لحم / جسد) + 退 (يتراجع / يعود للخلف، يقرّب النطق): الساق تدفع البدن للتقدّم والتراجع = ساق.</span></div>
</div>

<div className="expect"><b className="t">٤. المعنى المتوقع — قواعد تطبيقية</b>

<div className="golden"><span className="gh">⭐ القاعدة الذهبية</span>
<span className="gline"><span className="yes">الكلمة عن عضوٍ من الجسد؟</span> → 月 هنا «لحم» (脸، 胖، 肚).</span>
<span className="gline"><span className="no">الكلمة عن وقتٍ أو ضوء؟</span> → 月 هنا «قمر» (明، 期).</span>
<span className="gmemo">🧠 «عضو جسد = لحم · وقت وضوء = قمر.»</span>
</div>

<div className="howto"><span className="ht">المفتاح: انظر لمعنى الكلمة</span>
نفس الشكل 月، لكن معناه يتحدّد من موضوع الكلمة كلها.
<span className="rel rel-mid">موثوقية متوسطة</span></div>

<div className="distinct"><span className="dt">⚠️ الفرق بين 月 و目</span>
<div className="vs-row">
<div className="vs-box"><div className="vs-zi">月</div><div className="vs-name">yuè · قمر / لحم</div><div className="vs-desc">مفتوح أسفل، ضربتان داخليتان</div></div>
<div className="vs-sep">≠</div>
<div className="vs-box"><div className="vs-zi">目</div><div className="vs-name">mù · عين</div><div className="vs-desc">مغلق، أطول، خطّان</div></div>
</div>
<div className="trick">🔑 القمر 月 منحنٍ مفتوح أسفل · العين 目 مستطيل مغلق.</div>
</div>

<div className="test"><span className="tt">🧪 اختبار سريع — قمر أم لحم؟</span>
<div className="tq"><span className="lvl">سهل</span> <span className="qz">明</span> <span className="py">míng</span> — شمس + 月.
<span className="ans">الكلمة عن الضوء → 月 قمر (ساطع). ✓</span></div>
<div className="tq"><span className="lvl mid">متوسط</span> <span className="qz">腿</span> <span className="py">tuǐ</span> — يساره 月.
<span className="ans">الكلمة عن عضو الجسد → 月 لحم (ساق). ✓</span></div>
<div className="tq"><span className="lvl hard">صعب</span> <span className="qz">脸</span> <span className="py">liǎn</span> — يساره 月.
<span className="ans">عضوٌ من الجسد → 月 لحم لا قمر (وجه). ✓</span></div>
</div>
</div>

<div className="sec expert"><b className="t">٥. ملاحظة خبير — أخطاء شائعة</b>
<div className="err"><span className="eh">خطأ ١:</span> ظنّ كل 月 «قمراً».<br />
<span className="fix">✓ الصواب:</span> في أسماء أعضاء الجسد (脸، 胖، 肚، 腿) هو «لحم» 肉 المدمج، لا قمر.</div>
<div className="err"><span className="eh">خطأ ٢:</span> الخلط بين 月 (قمر) و目 (عين).<br />
<span className="fix">✓ الصواب:</span> 月 مفتوح ومنحنٍ، 目 مغلق وأطول.</div>
<div className="keyidea">💡 قاعدة ذهبية: 月 على يسار اسم عضوٍ = لحم. 月 في كلمة وقتٍ أو ضوء = قمر.</div>
</div>

<div className="cult"><b>🏛️ نافذة ثقافية</b>
<p>القمر رمز الشوق ولمّ الشمل في الثقافة الصينية. في 中秋节 (عيد منتصف الخريف) تجتمع العائلات تحت اكتمال القمر وتأكل 月饼 (kعكة القمر). والقصيدة الشهيرة للشاعر لي باي تتغنّى بالحنين للوطن عند رؤية ضوء القمر.</p></div>
</div>

      </main>

      {/* footer */}
      <footer className="wrap">
        <span className="zh-title">汉字部首</span>
        <p>
          الدفعة الأولى من قاموس جذور الحروف الصينية ·{" "}
          <a href="https://hsk-ar.com">hsk-ar.com</a>
        </p>
      </footer>
    </>
  );
}

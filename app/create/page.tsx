"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const A      = "#6c5ce7";
const A2     = "#e84393";
const BG     = "#eeecfa";
const MUTED  = "#5f5887";
const TEXT   = "#1a1730";
const BORDER = "#d8d4f0";
const SURFACE  = "#ffffff";
const SURFACE2 = "#e8e4f8";
const gradBg   = "linear-gradient(135deg,#6c5ce7,#e84393)";
const MAX_CHARS = 300;

const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 4px 24px rgba(108,92,231,0.08)",
  ...extra,
});

// ── Data ──────────────────────────────────────────────────────────────────────
const MOODS = [
  { icon:"😭", label:"Confused",  color:"#5f5887" },
  { icon:"😤", label:"Angry",     color:"#c0392b" },
  { icon:"😍", label:"Excited",   color:"#e84393" },
  { icon:"😶", label:"Lost",      color:"#7b72a8" },
  { icon:"🔥", label:"Bold",      color:"#e67e22" },
  { icon:"😂", label:"Funny",     color:"#27ae60" },
];

const ANON_LEVELS = [
  { icon:"🕵️", label:"Fully anonymous",    desc:"No one can trace this to you",       color:A  },
  { icon:"👥", label:"Followers only",      desc:"Only your followers see this",       color:"#0f6e56" },
  { icon:"🌍", label:"Public trending",     desc:"Eligible for trending feed",         color:A2 },
];

const AUDIENCES = [
  { icon:"✨", label:"For You"       },
  { icon:"🔥", label:"Trending"      },
  { icon:"🎓", label:"College"       },
  { icon:"💻", label:"Tech"          },
  { icon:"❤️", label:"Relationships" },
  { icon:"💼", label:"Startup"       },
];

const TRENDING_TAGS = ["#AI","#Startup","#College","#Relationships","#Tech","#Crypto","#WorkLife","#Confession","#Prediction","#Bold"];

const DEADLINES = [
  { label:"24 hours", val:"1d" },
  { label:"3 days",   val:"3d" },
  { label:"1 week",   val:"7d" },
  { label:"1 month",  val:"30d"},
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function Avatar({ size=36 }:{ size?:number }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:"rgba(108,92,231,.15)", color:A, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.35, fontWeight:700, flexShrink:0 }}>?</div>;
}

function SectionLabel({ children }:{ children:React.ReactNode }) {
  return <div style={{ fontSize:11, fontWeight:700, color:MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>{children}</div>;
}

function Card({ children, delay=0 }:{ children:React.ReactNode; delay?:number }) {
  return (
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35, delay }}
      style={{ ...glass(), borderRadius:18, padding:"1.2rem 1.3rem", marginBottom:12 }}>
      {children}
    </motion.div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.85rem 2rem", background:"rgba(255,255,255,0.82)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${BORDER}` }}>
      <a href="/feed" style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:A, letterSpacing:"-0.04em", textDecoration:"none" }}>
        splitt<span style={{ color:A2 }}>.</span>
      </a>
      <motion.a href="/feed" style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${BORDER}`, color:MUTED, fontSize:13, fontWeight:600, cursor:"pointer", textDecoration:"none" }}
        whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.97 }}>← Feed</motion.a>
    </nav>
  );
}

// ── Poll Builder ──────────────────────────────────────────────────────────────
function PollBuilder({ options, setOptions }:{ options:string[]; setOptions:(o:string[])=>void }) {
  const colors = [A, A2, "#0f6e56", "#854f0b"];
  const bgs    = ["rgba(108,92,231,.12)","rgba(232,67,147,.12)","rgba(29,158,117,.12)","rgba(239,159,39,.12)"];
  return (
    <div>
      <SectionLabel>Poll options</SectionLabel>
      <AnimatePresence>
        {options.map((opt,i) => (
          <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:10 }} transition={{ duration:0.2 }}
            style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:bgs[i], color:colors[i], display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>
              {String.fromCharCode(65+i)}
            </div>
            <input value={opt} onChange={e=>setOptions(options.map((x,idx)=>idx===i?e.target.value:x))} placeholder={`Option ${String.fromCharCode(65+i)}`}
              style={{ flex:1, padding:"9px 12px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:SURFACE, fontSize:13, color:TEXT, outline:"none", fontFamily:"inherit" }}
              onFocus={e=>e.target.style.borderColor=A} onBlur={e=>e.target.style.borderColor=BORDER} />
            {options.length>2 && (
              <motion.button onClick={()=>setOptions(options.filter((_,idx)=>idx!==i))}
                style={{ width:28, height:28, borderRadius:8, border:`1px solid ${BORDER}`, background:"transparent", color:MUTED, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
                whileHover={{ background:"rgba(232,67,147,.1)", color:A2, borderColor:A2 }} whileTap={{ scale:0.9 }}>×</motion.button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      {options.length<4 && (
        <motion.button onClick={()=>setOptions([...options,""])}
          style={{ width:"100%", padding:"8px", borderRadius:10, border:`1.5px dashed ${BORDER}`, background:"transparent", color:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
          whileHover={{ borderColor:A, color:A, background:"rgba(108,92,231,.04)" }} whileTap={{ scale:0.98 }}>
          + Add option ({options.length}/4)
        </motion.button>
      )}
    </div>
  );
}

// ── Tag Input with Suggestions ────────────────────────────────────────────────
function TagInput({ tags, setTags }:{ tags:string[]; setTags:(t:string[])=>void }) {
  const [input, setInput] = useState("");
  const suggestions = TRENDING_TAGS.filter(t => !tags.includes(t) && (input ? t.toLowerCase().includes(input.toLowerCase()) : true)).slice(0,6);
  const add = (raw:string) => {
    const t = "#"+raw.replace(/^#+/,"").trim();
    if (t.length>1 && !tags.includes(t) && tags.length<5) { setTags([...tags,t]); setInput(""); }
  };
  return (
    <div>
      <SectionLabel>Tags <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>({tags.length}/5)</span></SectionLabel>

      {/* trending suggestions */}
      <div style={{ marginBottom:10 }}>
        <div style={{ fontSize:11, color:MUTED, marginBottom:6 }}>Trending suggestions:</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
          {suggestions.map(t => (
            <motion.button key={t} onClick={()=>add(t)}
              style={{ fontSize:11, padding:"3px 10px", borderRadius:999, border:`1px solid ${BORDER}`, background:SURFACE, color:MUTED, cursor:"pointer", fontFamily:"inherit", fontWeight:500 }}
              whileHover={{ borderColor:A, color:A, background:"rgba(108,92,231,.06)" }} whileTap={{ scale:0.94 }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      {/* selected tags */}
      {tags.length>0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
          <AnimatePresence>
            {tags.map(t => (
              <motion.span key={t} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.8 }}
                style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, color:A, fontWeight:600, padding:"4px 10px", borderRadius:999, background:"rgba(108,92,231,.1)", border:`1px solid rgba(108,92,231,.2)` }}>
                {t} <span onClick={()=>setTags(tags.filter(x=>x!==t))} style={{ cursor:"pointer", opacity:0.6 }}>×</span>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* custom input */}
      <div style={{ display:"flex", gap:8 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add(input)} placeholder="Custom tag..."
          style={{ flex:1, padding:"8px 12px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:SURFACE, fontSize:13, color:TEXT, outline:"none", fontFamily:"inherit" }}
          onFocus={e=>e.target.style.borderColor=A} onBlur={e=>e.target.style.borderColor=BORDER} />
        <motion.button onClick={()=>add(input)} style={{ padding:"8px 14px", borderRadius:10, border:"none", background:"rgba(108,92,231,.1)", color:A, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
          whileHover={{ background:"rgba(108,92,231,.18)" }} whileTap={{ scale:0.95 }}>Add</motion.button>
      </div>
    </div>
  );
}

// ── Media Upload ──────────────────────────────────────────────────────────────
function MediaUpload({ preview, setPreview }:{ preview:string|null; setPreview:(s:string|null)=>void }) {
  const ref = useRef<HTMLInputElement>(null);
  const handleFile = (e:React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setPreview(URL.createObjectURL(f));
  };
  return (
    <div>
      <SectionLabel>Media <span style={{ fontWeight:400, textTransform:"none" }}>(optional)</span></SectionLabel>
      {preview ? (
        <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:`1.5px solid ${BORDER}` }}>
          <img src={preview} alt="" style={{ width:"100%", maxHeight:180, objectFit:"cover", display:"block" }} />
          <motion.button onClick={()=>setPreview(null)} style={{ position:"absolute", top:8, right:8, width:28, height:28, borderRadius:8, background:"rgba(0,0,0,.5)", border:"none", color:"#fff", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
            whileHover={{ background:"rgba(0,0,0,.7)" }}>×</motion.button>
        </div>
      ) : (
        <motion.div onClick={()=>ref.current?.click()}
          style={{ border:`2px dashed ${BORDER}`, borderRadius:12, padding:"1.5rem", textAlign:"center", cursor:"pointer" }}
          whileHover={{ borderColor:A, background:"rgba(108,92,231,.04)" }} whileTap={{ scale:0.99 }}>
          <div style={{ fontSize:24, marginBottom:6 }}>📷</div>
          <div style={{ fontSize:12, color:MUTED, fontWeight:500 }}>Click to upload image or video</div>
          <div style={{ fontSize:11, color:MUTED, marginTop:3 }}>PNG, JPG, GIF, MP4 · max 10MB</div>
        </motion.div>
      )}
      <input ref={ref} type="file" accept="image/*,video/*" style={{ display:"none" }} onChange={handleFile} />
    </div>
  );
}

// ── Live Preview Card ─────────────────────────────────────────────────────────
function LivePreview({ type, text, options, tags, mediaPreview, mood, anonLevel, audience }:{ type:string; text:string; options:string[]; tags:string[]; mediaPreview:string|null; mood:string|null; anonLevel:number; audience:string }) {
  const moodObj = MOODS.find(m=>m.label===mood);
  const anonObj = ANON_LEVELS[anonLevel];
  const filledOpts = options.filter(o=>o.trim());
  const total = filledOpts.length * 100;

  return (
    <div style={{ ...glass(), borderRadius:18, padding:"1.2rem 1.4rem" }}>
      <SectionLabel>Live preview</SectionLabel>

      {/* header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <Avatar size={34} />
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
            <span style={{ fontSize:13, fontWeight:700 }}>@mystery_oracle</span>
            <span style={{ fontSize:10, background:"rgba(108,92,231,.1)", color:A, padding:"1px 7px", borderRadius:999, fontWeight:700 }}>anon</span>
            <span style={{ fontSize:10, background: type==="prediction" ? "rgba(232,67,147,.1)" : "rgba(239,159,39,.12)", color: type==="prediction" ? A2 : "#7a4a08", padding:"1px 7px", borderRadius:999, fontWeight:700 }}>{type}</span>
            {moodObj && <span style={{ fontSize:11 }}>{moodObj.icon}</span>}
          </div>
          <div style={{ fontSize:11, color:MUTED, marginTop:2, display:"flex", gap:6, alignItems:"center" }}>
            Just now · {anonObj.icon} {anonObj.label} · {audience}
          </div>
        </div>
      </div>

      {/* text */}
      {text
        ? <p style={{ fontSize:13, lineHeight:1.65, color:TEXT, marginBottom:10 }}>{text}</p>
        : <p style={{ fontSize:13, color:MUTED, fontStyle:"italic", marginBottom:10 }}>Your post appears here as you type...</p>}

      {/* media */}
      {mediaPreview && <img src={mediaPreview} alt="" style={{ width:"100%", maxHeight:130, objectFit:"cover", borderRadius:10, marginBottom:10, display:"block" }} />}

      {/* live poll bars */}
      {type==="prediction" && filledOpts.length>=2 && (
        <div style={{ marginBottom:8 }}>
          {filledOpts.map((o,i) => {
            const pct = Math.round(100/filledOpts.length);
            const fills = ["rgba(108,92,231,.2)","rgba(232,67,147,.15)","rgba(29,158,117,.15)","rgba(239,159,39,.15)"];
            return (
              <div key={i} style={{ marginBottom:6 }}>
                <div style={{ borderRadius:10, height:32, display:"flex", alignItems:"center", position:"relative", overflow:"hidden", background:SURFACE, border:`1.5px solid ${BORDER}` }}>
                  <motion.div style={{ position:"absolute", left:0, top:0, height:"100%", background:fills[i%fills.length], borderRadius:10 }}
                    initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.5 }} />
                  <span style={{ position:"relative", zIndex:1, padding:"0 12px", fontSize:12, fontWeight:500, flex:1 }}>{o}</span>
                  <span style={{ position:"relative", zIndex:1, padding:"0 12px", fontSize:11, fontWeight:700, color:MUTED }}>{pct}%</span>
                </div>
              </div>
            );
          })}
          <div style={{ fontSize:11, color:MUTED }}>Estimated equal split · {total} potential votes</div>
        </div>
      )}

      {/* tags */}
      {tags.length>0 && (
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          <AnimatePresence>
            {tags.map(t => (
              <motion.span key={t} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
                style={{ fontSize:11, color:A, fontWeight:600, padding:"2px 8px", borderRadius:999, background:"rgba(108,92,231,.08)" }}>{t}</motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── Success Modal ─────────────────────────────────────────────────────────────
function SuccessModal({ type, onClose }:{ type:string; onClose:()=>void }) {
  useEffect(() => {
    const t = setTimeout(() => { window.location.href="/feed"; }, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, background:"rgba(26,23,48,0.55)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 }}>
      <motion.div initial={{ opacity:0, scale:0.8, y:30 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.8, y:30 }}
        transition={{ type:"spring", stiffness:300, damping:24 }}
        style={{ ...glass(), borderRadius:24, padding:"2.5rem 2rem", textAlign:"center", maxWidth:380, width:"90%" }}>

        {/* animated emoji */}
        <motion.div animate={{ rotate:[0,15,-15,10,-5,0], scale:[1,1.3,1.1,1.2,1] }} transition={{ duration:0.8 }}
          style={{ fontSize:54, marginBottom:16 }}>
          {type==="confession" ? "👀" : "🔮"}
        </motion.div>

        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:TEXT, marginBottom:8 }}>
          {type==="confession" ? "Your confession is now live 👀" : "Prediction submitted! 🔮"}
        </h2>
        <p style={{ fontSize:13, color:MUTED, lineHeight:1.65, marginBottom:20 }}>
          {type==="confession"
            ? "It's out there, completely anonymous. The crowd is already reading it."
            : "Your prediction is live. Watch the votes pour in and track your accuracy."}
        </p>

        {/* confetti dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:20 }}>
          {["#6c5ce7","#e84393","#0f6e56","#f59e0b","#6c5ce7"].map((c,i) => (
            <motion.div key={i} animate={{ y:[0,-12,0], opacity:[1,0.6,1] }} transition={{ duration:0.8, delay:i*0.1, repeat:Infinity }}
              style={{ width:8, height:8, borderRadius:"50%", background:c }} />
          ))}
        </div>

        {/* progress bar */}
        <div style={{ background:SURFACE2, borderRadius:999, height:4, overflow:"hidden", marginBottom:16 }}>
          <motion.div style={{ height:"100%", background:gradBg, borderRadius:999 }} initial={{ width:0 }} animate={{ width:"100%" }} transition={{ duration:2.8 }} />
        </div>
        <div style={{ fontSize:11, color:MUTED }}>Redirecting to feed...</div>

        <motion.button onClick={onClose} style={{ marginTop:16, padding:"9px 24px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:"transparent", color:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
          whileHover={{ borderColor:A, color:A }}>Go to feed now →</motion.button>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CreatePostPage() {
  const [type, setType]           = useState<"confession"|"prediction">("confession");
  const [text, setText]           = useState("");
  const [options, setOptions]     = useState(["",""]);
  const [tags, setTags]           = useState<string[]>([]);
  const [mediaPreview, setMedia]  = useState<string|null>(null);
  const [deadline, setDeadline]   = useState("7d");
  const [mood, setMood]           = useState<string|null>(null);
  const [anonLevel, setAnonLevel] = useState(0);
  const [audience, setAudience]   = useState("For You");
  const [submitted, setSubmitted] = useState(false);

  const remaining = MAX_CHARS - text.length;
  const isNearLimit = remaining <= 50;
  const isAtLimit   = remaining <= 0;
  const canSubmit   = text.trim().length >= 10 && !isAtLimit &&
    (type==="confession" || options.filter(o=>o.trim()).length>=2);

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif", color:TEXT }}>
      {/* bg depth */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse at 10% 10%, rgba(108,92,231,.07) 0%, transparent 55%), radial-gradient(ellipse at 90% 80%, rgba(232,67,147,.06) 0%, transparent 50%)" }} />

      <AnimatePresence>
        {submitted && <SuccessModal type={type} onClose={()=>window.location.href="/feed"} />}
      </AnimatePresence>

      <div style={{ position:"relative", zIndex:1 }}>
        <Navbar />

        <div style={{ maxWidth:1060, margin:"0 auto", padding:"1.8rem 1.5rem", display:"grid", gridTemplateColumns:"1fr 370px", gap:"1.6rem", alignItems:"start" }}>

          {/* ── LEFT COLUMN ── */}
          <div>
            <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:A, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>Create post</div>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, letterSpacing:"-0.03em", marginBottom:3 }}>What's on your mind?</h1>
              <p style={{ fontSize:13, color:MUTED }}>Your identity is always hidden. Post freely.</p>
            </motion.div>

            {/* TYPE SELECTOR */}
            <Card delay={0.04}>
              <SectionLabel>Post type</SectionLabel>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {(["confession","prediction"] as const).map(t => (
                  <motion.button key={t} onClick={()=>setType(t)}
                    style={{ padding:"13px 10px", borderRadius:14, border:`2px solid ${type===t ? A : BORDER}`, background: type===t ? "rgba(108,92,231,.08)" : SURFACE, cursor:"pointer", fontFamily:"inherit", textAlign:"center" }}
                    whileHover={{ borderColor:A }} whileTap={{ scale:0.97 }}>
                    <div style={{ fontSize:22, marginBottom:5 }}>{t==="confession"?"💬":"🔮"}</div>
                    <div style={{ fontSize:13, fontWeight:700, color: type===t ? A : TEXT, marginBottom:2 }}>{t==="confession"?"Confession":"Prediction"}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{t==="confession"?"Share a secret anonymously":"Make a bold public prediction"}</div>
                  </motion.button>
                ))}
              </div>
            </Card>

            {/* TEXT + LIVE CHAR COUNTER */}
            <Card delay={0.08}>
              <SectionLabel>{type==="confession" ? "Your confession" : "Your prediction"}</SectionLabel>
              <textarea value={text} onChange={e=>{ if(e.target.value.length<=MAX_CHARS) setText(e.target.value); }}
                placeholder={type==="confession" ? "Share what's on your mind... no one will know it's you." : "Make a bold prediction. What do you think will happen?"}
                style={{ width:"100%", minHeight:120, padding:"4px 0", background:"transparent", border:"none", outline:"none", resize:"none", fontSize:14, color:TEXT, fontFamily:"'DM Sans',system-ui,sans-serif", lineHeight:1.7, boxSizing:"border-box" }} />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:8, borderTop:`1px solid ${BORDER}` }}>
                <span style={{ fontSize:11, color: text.length<10 ? A2 : MUTED }}>
                  {text.length<10 ? `${10-text.length} more chars needed` : "✓ Good to go"}
                </span>
                <motion.span animate={{ color: isAtLimit ? "#c0392b" : isNearLimit ? "#e67e22" : MUTED }}
                  style={{ fontSize:13, fontWeight:700 }}>
                  {text.length} / {MAX_CHARS}
                </motion.span>
              </div>
              {isNearLimit && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
                  style={{ marginTop:6, fontSize:11, color: isAtLimit ? "#c0392b" : "#e67e22", fontWeight:600 }}>
                  {isAtLimit ? "⚠️ Character limit reached" : `⚠️ ${remaining} characters remaining`}
                </motion.div>
              )}
            </Card>

            {/* MOOD SELECTOR */}
            <Card delay={0.1}>
              <SectionLabel>Mood <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional)</span></SectionLabel>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {MOODS.map(m => (
                  <motion.button key={m.label} onClick={()=>setMood(mood===m.label ? null : m.label)}
                    style={{ padding:"7px 13px", borderRadius:999, border:`1.5px solid ${mood===m.label ? m.color : BORDER}`, background: mood===m.label ? `${m.color}15` : SURFACE, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:500, color: mood===m.label ? m.color : MUTED }}
                    whileHover={{ borderColor:m.color, color:m.color }} whileTap={{ scale:0.94 }}>
                    <span style={{ fontSize:15 }}>{m.icon}</span> {m.label}
                  </motion.button>
                ))}
              </div>
            </Card>

            {/* POLL OPTIONS + DEADLINE */}
            <AnimatePresence>
              {type==="prediction" && (
                <motion.div key="poll" initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} transition={{ duration:0.3 }} style={{ overflow:"hidden" }}>
                  <Card>
                    <PollBuilder options={options} setOptions={setOptions} />
                    <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${BORDER}` }}>
                      <SectionLabel>Prediction deadline</SectionLabel>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        {DEADLINES.map(d => (
                          <motion.button key={d.val} onClick={()=>setDeadline(d.val)}
                            style={{ padding:"7px 15px", borderRadius:10, border:`1.5px solid ${deadline===d.val ? A : BORDER}`, background: deadline===d.val ? "rgba(108,92,231,.08)" : "transparent", color: deadline===d.val ? A : MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                            whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.96 }}>
                            ⏰ {d.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ANONYMOUS LEVEL */}
            <Card delay={0.14}>
              <SectionLabel>Anonymous level</SectionLabel>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {ANON_LEVELS.map((l,i) => (
                  <motion.div key={l.label} onClick={()=>setAnonLevel(i)}
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 13px", borderRadius:12, border:`1.5px solid ${anonLevel===i ? l.color : BORDER}`, background: anonLevel===i ? `${l.color}0f` : SURFACE, cursor:"pointer" }}
                    whileHover={{ borderColor:l.color }} whileTap={{ scale:0.98 }}>
                    <span style={{ fontSize:18 }}>{l.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color: anonLevel===i ? l.color : TEXT }}>{l.label}</div>
                      <div style={{ fontSize:11, color:MUTED }}>{l.desc}</div>
                    </div>
                    <motion.div animate={{ scale: anonLevel===i ? 1 : 0, opacity: anonLevel===i ? 1 : 0 }}
                      style={{ width:18, height:18, borderRadius:"50%", background:l.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontSize:10, color:"#fff", fontWeight:700 }}>✓</span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* AUDIENCE */}
            <Card delay={0.17}>
              <SectionLabel>Audience</SectionLabel>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                {AUDIENCES.map(a => (
                  <motion.button key={a.label} onClick={()=>setAudience(a.label)}
                    style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${audience===a.label ? A : BORDER}`, background: audience===a.label ? "rgba(108,92,231,.09)" : SURFACE, color: audience===a.label ? A : MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5 }}
                    whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.95 }}>
                    {a.icon} {a.label}
                  </motion.button>
                ))}
              </div>
            </Card>

            {/* MEDIA */}
            <Card delay={0.19}>
              <MediaUpload preview={mediaPreview} setPreview={setMedia} />
            </Card>

            {/* TAGS */}
            <Card delay={0.21}>
              <TagInput tags={tags} setTags={setTags} />
            </Card>

            {/* SUBMIT */}
            <Card delay={0.23}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>🔒 Post anonymously</div>
                  <div style={{ fontSize:11, color:MUTED }}>Your identity is always hidden from other users</div>
                </div>
                <div style={{ width:44, height:24, borderRadius:999, background:A, position:"relative", flexShrink:0 }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", background:SURFACE, position:"absolute", top:3, left:23 }} />
                </div>
              </div>
              <motion.button onClick={()=>canSubmit&&setSubmitted(true)}
                style={{ width:"100%", padding:"13px", borderRadius:12, background: canSubmit ? gradBg : SURFACE2, border:"none", color: canSubmit ? "#fff" : MUTED, fontSize:14, fontWeight:700, cursor: canSubmit ? "pointer" : "default", fontFamily:"inherit", boxShadow: canSubmit ? "0 4px 18px rgba(108,92,231,.28)" : "none" }}
                whileHover={canSubmit ? { y:-2, boxShadow:"0 8px 26px rgba(108,92,231,.4)", background:"linear-gradient(135deg,#7d6ef0,#f04aa0)" } : {}}
                whileTap={canSubmit ? { scale:0.97 } : {}}>
                {canSubmit ? (type==="confession" ? "🔒 Post confession anonymously" : "🔮 Submit prediction") : "Complete the form to post"}
              </motion.button>
              {!canSubmit && (
                <div style={{ marginTop:8, fontSize:11, color:MUTED, textAlign:"center" }}>
                  {text.trim().length<10 && "· Write at least 10 characters  "}
                  {type==="prediction" && options.filter(o=>o.trim()).length<2 && "· Add at least 2 poll options"}
                </div>
              )}
            </Card>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ position:"sticky", top:72 }}>
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}>
              <LivePreview type={type} text={text} options={options} tags={tags} mediaPreview={mediaPreview} mood={mood} anonLevel={anonLevel} audience={audience} />
            </motion.div>

            {/* tips */}
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem", marginTop:12 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:9 }}>💡 Tips</div>
              {[
                { icon:"🎯", tip: type==="confession" ? "Be specific — vague confessions get fewer reactions" : "Make it falsifiable — must be clearly true or false later" },
                { icon:"🔥", tip:"Add trending tags to get discovered faster" },
                { icon:"⏰", tip: type==="prediction" ? "Set a realistic deadline — too short = low votes" : "The more personal, the more relatable" },
                { icon:"📈", tip:"Accurate predictions build your rep score over time" },
              ].map((t,i) => (
                <div key={i} style={{ display:"flex", gap:8, padding:"6px 0", borderBottom: i<3 ? `1px solid ${BORDER}` : "none" }}>
                  <span style={{ fontSize:13, flexShrink:0 }}>{t.icon}</span>
                  <span style={{ fontSize:12, color:MUTED, lineHeight:1.55 }}>{t.tip}</span>
                </div>
              ))}
            </motion.div>

            {/* rules */}
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.28 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem", marginTop:12 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:9 }}>🛡️ Community rules</div>
              {["No harassment or targeted content","No personal info of others","Predictions must be verifiable","Keep it honest — this is anonymous for a reason"].map((r,i) => (
                <div key={i} style={{ display:"flex", gap:7, padding:"5px 0", borderBottom: i<3 ? `1px solid ${BORDER}` : "none" }}>
                  <span style={{ fontSize:11, color:"#0f6e56", fontWeight:700, flexShrink:0 }}>✓</span>
                  <span style={{ fontSize:12, color:MUTED, lineHeight:1.5 }}>{r}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
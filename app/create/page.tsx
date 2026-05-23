"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

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

const MOODS = [
  { icon:"😭", label:"Confused",  color:"#5f5887" },
  { icon:"😤", label:"Angry",     color:"#c0392b" },
  { icon:"😍", label:"Excited",   color:"#e84393" },
  { icon:"😶", label:"Lost",      color:"#7b72a8" },
  { icon:"🔥", label:"Bold",      color:"#e67e22" },
  { icon:"😂", label:"Funny",     color:"#27ae60" },
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

function PollBuilder({ options, setOptions }:{ options:string[]; setOptions:(o:string[])=>void }) {
  const colors = [A, A2, "#0f6e56", "#854f0b"];
  const bgs    = ["rgba(108,92,231,.12)","rgba(232,67,147,.12)","rgba(29,158,117,.12)","rgba(239,159,39,.12)"];
  return (
    <div>
      <div style={{ fontSize:11, fontWeight:700, color:MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Poll options</div>
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

function TagInput({ tags, setTags }:{ tags:string[]; setTags:(t:string[])=>void }) {
  const [input, setInput] = useState("");
  const suggestions = TRENDING_TAGS.filter(t => !tags.includes(t) && (input ? t.toLowerCase().includes(input.toLowerCase()) : true)).slice(0,6);
  const add = (raw:string) => {
    const t = "#"+raw.replace(/^#+/,"").trim();
    if (t.length>1 && !tags.includes(t) && tags.length<5) { setTags([...tags,t]); setInput(""); }
  };
  return (
    <div>
      <div style={{ fontSize:11, fontWeight:700, color:MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Tags ({tags.length}/5)</div>
      <div style={{ marginBottom:10 }}>
        <div style={{ fontSize:11, color:MUTED, marginBottom:6 }}>Trending:</div>
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

function MediaUpload({ preview, setPreview, onFileSelect }:{ preview:string|null; setPreview:(s:string|null)=>void; onFileSelect:(f:File|null)=>void }) {
  const ref = useRef<HTMLInputElement>(null);
  const handleFile = (e:React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    onFileSelect(f);
  };
  return (
    <div>
      <div style={{ fontSize:11, fontWeight:700, color:MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Media (optional)</div>
      {preview ? (
        <div style={{ position:"relative", borderRadius:12, overflow:"hidden", border:`1.5px solid ${BORDER}` }}>
          <img src={preview} alt="" style={{ width:"100%", maxHeight:180, objectFit:"cover", display:"block" }} />
          <motion.button onClick={()=>{ setPreview(null); onFileSelect(null); }}
            style={{ position:"absolute", top:8, right:8, width:28, height:28, borderRadius:8, background:"rgba(0,0,0,.5)", border:"none", color:"#fff", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
            whileHover={{ background:"rgba(0,0,0,.7)" }}>×</motion.button>
        </div>
      ) : (
        <motion.div onClick={()=>ref.current?.click()}
          style={{ border:`2px dashed ${BORDER}`, borderRadius:12, padding:"1.5rem", textAlign:"center", cursor:"pointer" }}
          whileHover={{ borderColor:A, background:"rgba(108,92,231,.04)" }} whileTap={{ scale:0.99 }}>
          <div style={{ fontSize:24, marginBottom:6 }}>📷</div>
          <div style={{ fontSize:12, color:MUTED, fontWeight:500 }}>Click to upload image or video</div>
        </motion.div>
      )}
      <input ref={ref} type="file" accept="image/*,video/*" style={{ display:"none" }} onChange={handleFile} />
    </div>
  );
}

function LivePreview({ type, text, options, tags, mediaPreview, mood, audience }:{ type:string; text:string; options:string[]; tags:string[]; mediaPreview:string|null; mood:string|null; audience:string }) {
  const moodObj = MOODS.find(m=>m.label===mood);
  const filledOpts = options.filter(o=>o.trim());
  return (
    <div style={{ ...glass(), borderRadius:18, padding:"1.2rem 1.4rem" }}>
      <div style={{ fontSize:11, fontWeight:700, color:MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Live preview</div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(108,92,231,.15)", color:A, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>?</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
            @anonymous
            <span style={{ fontSize:10, background:"rgba(108,92,231,.1)", color:A, padding:"1px 8px", borderRadius:999, fontWeight:700 }}>anon</span>
            <span style={{ fontSize:10, background: type==="prediction" ? "rgba(232,67,147,.1)" : "rgba(239,159,39,.12)", color: type==="prediction" ? A2 : "#7a4a08", padding:"1px 8px", borderRadius:999, fontWeight:700 }}>{type}</span>
            {moodObj && <span style={{ fontSize:11 }}>{moodObj.icon}</span>}
          </div>
          <div style={{ fontSize:11, color:MUTED }}>Just now · {audience}</div>
        </div>
      </div>
      {text
        ? <p style={{ fontSize:13, lineHeight:1.65, color:TEXT, marginBottom:10 }}>{text}</p>
        : <p style={{ fontSize:13, color:MUTED, fontStyle:"italic", marginBottom:10 }}>Your post appears here...</p>}
      {mediaPreview && <img src={mediaPreview} alt="" style={{ width:"100%", maxHeight:130, objectFit:"cover", borderRadius:10, marginBottom:10, display:"block" }} />}
      {type==="prediction" && filledOpts.length>=2 && (
        <div style={{ marginBottom:8 }}>
          {filledOpts.map((o,i) => (
            <div key={i} style={{ borderRadius:10, height:32, display:"flex", alignItems:"center", background:SURFACE2, marginBottom:5, paddingLeft:12, fontSize:12, fontWeight:500, border:`1px solid ${BORDER}` }}>{o}</div>
          ))}
        </div>
      )}
      {tags.length>0 && (
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {tags.map(t => <span key={t} style={{ fontSize:11, color:A, fontWeight:600, padding:"2px 8px", borderRadius:999, background:"rgba(108,92,231,.08)" }}>{t}</span>)}
        </div>
      )}
    </div>
  );
}

// ── Success Modal ─────────────────────────────────────────────────────────────
function SuccessModal({ type }:{ type:string }) {
  useEffect(() => {
    const t = setTimeout(() => { window.location.href="/feed"; }, 2500);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, background:"rgba(26,23,48,0.55)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 }}>
      <motion.div initial={{ opacity:0, scale:0.8, y:30 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.8 }}
        transition={{ type:"spring", stiffness:300, damping:24 }}
        style={{ ...glass(), borderRadius:24, padding:"2.5rem 2rem", textAlign:"center", maxWidth:380, width:"90%" }}>
        <motion.div animate={{ rotate:[0,15,-15,10,-5,0], scale:[1,1.3,1.1,1.2,1] }} transition={{ duration:0.8 }}
          style={{ fontSize:54, marginBottom:16 }}>
          {type==="confession" ? "👀" : "🔮"}
        </motion.div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:TEXT, marginBottom:8 }}>
          {type==="confession" ? "Your confession is live 👀" : "Prediction submitted! 🔮"}
        </h2>
        <p style={{ fontSize:13, color:MUTED, marginBottom:20 }}>Redirecting to feed...</p>
        <div style={{ background:SURFACE2, borderRadius:999, height:4, overflow:"hidden" }}>
          <motion.div style={{ height:"100%", background:gradBg, borderRadius:999 }} initial={{ width:0 }} animate={{ width:"100%" }} transition={{ duration:2.3 }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CreatePostPage() {
  const [currentUser, setCurrentUser] = useState<User|null>(null);
  const [type, setType]         = useState<"confession"|"prediction">("confession");
  const [text, setText]         = useState("");
  const [options, setOptions]   = useState(["",""]);
  const [tags, setTags]         = useState<string[]>([]);
  const [mediaPreview, setMedia]= useState<string|null>(null);
  const [mediaFile, setMediaFile]= useState<File|null>(null);
  const [deadline, setDeadline] = useState("7d");
  const [mood, setMood]         = useState<string|null>(null);
  const [audience, setAudience] = useState("For You");
  const [submitted, setSubmitted]= useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const remaining   = MAX_CHARS - text.length;
  const isNearLimit = remaining <= 50;
  const canSubmit   = text.trim().length >= 10 && !loading &&
    (type==="confession" || options.filter(o=>o.trim()).length>=2);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      if (!user) window.location.href = "/";
    });
    return () => unsub();
  },[]);

  const handleSubmit = async () => {
    if (!canSubmit || !currentUser) return;
    setLoading(true);
    setError("");

    try {
      // upload media if any
      let mediaUrl = null;
      let mediaType = null;
      if (mediaFile) {
        const formData = new FormData();
        formData.append("file", mediaFile);
        const uploadRes = await fetch("/api/upload", { method:"POST", body:formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          mediaUrl  = uploadData.url;
          mediaType = uploadData.type;
        }
      }

      // deadline calculation
      const deadlineMap:Record<string,number> = { "1d":1, "3d":3, "7d":7, "30d":30 };
      const deadlineDate = type==="prediction" ? new Date(Date.now() + deadlineMap[deadline]*24*60*60*1000).toISOString() : null;

      // create post
      const res = await fetch("/api/posts", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          firebaseUid: currentUser.uid,
          type,
          text,
          tags,
          mood,
          audience,
          isPoll: type==="prediction",
          options: type==="prediction" ? options.filter(o=>o.trim()) : null,
          deadline: deadlineDate,
          mediaUrl,
          mediaType,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to post. Try again.");
      }
    } catch(e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif", color:TEXT }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse at 10% 10%, rgba(108,92,231,.07) 0%, transparent 55%), radial-gradient(ellipse at 90% 80%, rgba(232,67,147,.06) 0%, transparent 50%)" }} />
      <AnimatePresence>{submitted && <SuccessModal type={type} />}</AnimatePresence>
      <div style={{ position:"relative", zIndex:1 }}>
        <Navbar />
        <div style={{ maxWidth:1060, margin:"0 auto", padding:"1.8rem 1.5rem", display:"grid", gridTemplateColumns:"1fr 370px", gap:"1.6rem", alignItems:"start" }}>

          {/* LEFT */}
          <div>
            <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:A, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>Create post</div>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, letterSpacing:"-0.03em", marginBottom:3 }}>What's on your mind?</h1>
              <p style={{ fontSize:13, color:MUTED }}>Your identity is always hidden. Post freely.</p>
            </motion.div>

            {error && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ padding:"10px 14px", borderRadius:10, background:"#fbeaf0", border:"1.5px solid #f4c0d1", color:"#993556", fontSize:13, marginBottom:14 }}>
                {error}
              </motion.div>
            )}

            {/* type selector */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.04 }}
              style={{ ...glass(), borderRadius:18, padding:"1.2rem", marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:MUTED, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Post type</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {(["confession","prediction"] as const).map(t => (
                  <motion.button key={t} onClick={()=>setType(t)}
                    style={{ padding:"13px 10px", borderRadius:14, border:`2px solid ${type===t ? A : BORDER}`, background: type===t ? "rgba(108,92,231,.08)" : SURFACE, cursor:"pointer", fontFamily:"inherit", textAlign:"center" }}
                    whileHover={{ borderColor:A }} whileTap={{ scale:0.97 }}>
                    <div style={{ fontSize:22, marginBottom:5 }}>{t==="confession"?"💬":"🔮"}</div>
                    <div style={{ fontSize:13, fontWeight:700, color: type===t ? A : TEXT, marginBottom:2 }}>{t==="confession"?"Confession":"Prediction"}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{t==="confession"?"Share a secret":"Make a prediction"}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* text */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
              style={{ ...glass(), borderRadius:18, padding:"1.2rem", marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:MUTED, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>
                {type==="confession" ? "Your confession" : "Your prediction"}
              </div>
              <textarea value={text} onChange={e=>{ if(e.target.value.length<=MAX_CHARS) setText(e.target.value); }}
                placeholder={type==="confession" ? "Share what's on your mind..." : "Make a bold prediction..."}
                style={{ width:"100%", minHeight:120, padding:"4px 0", background:"transparent", border:"none", outline:"none", resize:"none", fontSize:14, color:TEXT, fontFamily:"'DM Sans',system-ui,sans-serif", lineHeight:1.7, boxSizing:"border-box" }} />
              <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8, borderTop:`1px solid ${BORDER}` }}>
                <span style={{ fontSize:11, color: text.length<10 ? A2 : MUTED }}>
                  {text.length<10 ? `${10-text.length} more chars needed` : "✓ Good to go"}
                </span>
                <span style={{ fontSize:13, fontWeight:700, color: remaining<=0?"#c0392b":isNearLimit?"#e67e22":MUTED }}>
                  {text.length} / {MAX_CHARS}
                </span>
              </div>
            </motion.div>

            {/* mood */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
              style={{ ...glass(), borderRadius:18, padding:"1.2rem", marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:MUTED, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Mood (optional)</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {MOODS.map(m => (
                  <motion.button key={m.label} onClick={()=>setMood(mood===m.label?null:m.label)}
                    style={{ padding:"7px 13px", borderRadius:999, border:`1.5px solid ${mood===m.label?m.color:BORDER}`, background: mood===m.label?`${m.color}15`:SURFACE, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:500, color: mood===m.label?m.color:MUTED }}
                    whileHover={{ borderColor:m.color, color:m.color }} whileTap={{ scale:0.94 }}>
                    <span style={{ fontSize:15 }}>{m.icon}</span> {m.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* poll options */}
            <AnimatePresence>
              {type==="prediction" && (
                <motion.div key="poll" initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} transition={{ duration:0.3 }} style={{ overflow:"hidden" }}>
                  <div style={{ ...glass(), borderRadius:18, padding:"1.2rem", marginBottom:12 }}>
                    <PollBuilder options={options} setOptions={setOptions} />
                    <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${BORDER}` }}>
                      <div style={{ fontSize:11, fontWeight:700, color:MUTED, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Deadline</div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        {DEADLINES.map(d => (
                          <motion.button key={d.val} onClick={()=>setDeadline(d.val)}
                            style={{ padding:"7px 15px", borderRadius:10, border:`1.5px solid ${deadline===d.val?A:BORDER}`, background: deadline===d.val?"rgba(108,92,231,.08)":"transparent", color: deadline===d.val?A:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                            whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.96 }}>
                            ⏰ {d.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* audience */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.14 }}
              style={{ ...glass(), borderRadius:18, padding:"1.2rem", marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:MUTED, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Audience</div>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                {AUDIENCES.map(a => (
                  <motion.button key={a.label} onClick={()=>setAudience(a.label)}
                    style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${audience===a.label?A:BORDER}`, background: audience===a.label?"rgba(108,92,231,.09)":SURFACE, color: audience===a.label?A:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5 }}
                    whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.95 }}>
                    {a.icon} {a.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* media */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.17 }}
              style={{ ...glass(), borderRadius:18, padding:"1.2rem", marginBottom:12 }}>
              <MediaUpload preview={mediaPreview} setPreview={setMedia} onFileSelect={setMediaFile} />
            </motion.div>

            {/* tags */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.19 }}
              style={{ ...glass(), borderRadius:18, padding:"1.2rem", marginBottom:12 }}>
              <TagInput tags={tags} setTags={setTags} />
            </motion.div>

            {/* submit */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.21 }}
              style={{ ...glass(), borderRadius:18, padding:"1.2rem" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>🔒 Post anonymously</div>
                  <div style={{ fontSize:11, color:MUTED }}>Your identity is always hidden</div>
                </div>
                <div style={{ width:44, height:24, borderRadius:999, background:A, position:"relative", flexShrink:0 }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", background:SURFACE, position:"absolute", top:3, left:23 }} />
                </div>
              </div>
              <motion.button onClick={handleSubmit} disabled={!canSubmit}
                style={{ width:"100%", padding:"13px", borderRadius:12, background: canSubmit ? gradBg : SURFACE2, border:"none", color: canSubmit ? "#fff" : MUTED, fontSize:14, fontWeight:700, cursor: canSubmit ? "pointer" : "default", fontFamily:"inherit", boxShadow: canSubmit ? "0 4px 18px rgba(108,92,231,.3)" : "none" }}
                whileHover={canSubmit ? { y:-2, boxShadow:"0 8px 26px rgba(108,92,231,.4)" } : {}}
                whileTap={canSubmit ? { scale:0.97 } : {}}>
                {loading ? "Posting..." : canSubmit ? (type==="confession" ? "🔒 Post confession anonymously" : "🔮 Submit prediction") : "Complete the form to post"}
              </motion.button>
              {!canSubmit && !loading && (
                <div style={{ marginTop:8, fontSize:11, color:MUTED, textAlign:"center" }}>
                  {text.trim().length<10 && "· Write at least 10 characters  "}
                  {type==="prediction" && options.filter(o=>o.trim()).length<2 && "· Add at least 2 poll options"}
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT — live preview */}
          <div style={{ position:"sticky", top:72 }}>
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15 }}>
              <LivePreview type={type} text={text} options={options} tags={tags} mediaPreview={mediaPreview} mood={mood} audience={audience} />
            </motion.div>

            {/* tips */}
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem", marginTop:12 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:9 }}>💡 Tips</div>
              {[
                { icon:"🎯", tip: type==="confession" ? "Be specific — vague confessions get fewer reactions" : "Make it falsifiable — must be clearly true or false" },
                { icon:"🔥", tip:"Add trending tags to get discovered faster" },
                { icon:"⏰", tip: type==="prediction" ? "Set a realistic deadline" : "The more personal, the more relatable" },
                { icon:"📈", tip:"Accurate predictions build your rep score" },
              ].map((t,i) => (
                <div key={i} style={{ display:"flex", gap:8, padding:"6px 0", borderBottom: i<3 ? `1px solid ${BORDER}` : "none" }}>
                  <span style={{ fontSize:13, flexShrink:0 }}>{t.icon}</span>
                  <span style={{ fontSize:12, color:MUTED, lineHeight:1.55 }}>{t.tip}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
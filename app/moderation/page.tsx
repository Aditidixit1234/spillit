"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
const green = "#0f6e56"; const greenBg = "rgba(29,158,117,.1)";
const red   = "#c0392b"; const redBg   = "rgba(192,57,43,.1)";
const amber = "#854f0b"; const amberBg = "rgba(239,159,39,.1)";

const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: "rgba(255,255,255,0.68)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.92)",
  boxShadow: "0 4px 28px rgba(108,92,231,0.09)",
  ...extra,
});

function Navbar() {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.85rem 2rem", background:"rgba(255,255,255,0.82)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${BORDER}` }}>
      <a href="/feed" style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:A, letterSpacing:"-0.04em", textDecoration:"none" }}>splitt<span style={{ color:A2 }}>.</span></a>
      <motion.a href="/feed" style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${BORDER}`, color:MUTED, fontSize:13, fontWeight:600, cursor:"pointer", textDecoration:"none" }}
        whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.97 }}>← Feed</motion.a>
    </nav>
  );
}

function FlagCard({ flag, onAction }:{ flag:any; onAction:(postId:string,action:string)=>void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-20px" });
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading]   = useState(false);
  const sc = { high:red, medium:amber, low:green }[flag.severity as string] || green;

  const handle = async (action:string) => {
    setLoading(true);
    await onAction(flag.postId, action);
    setLoading(false);
    setExpanded(false);
  };

  return (
    <motion.div ref={ref} initial={{ opacity:0, y:18 }} animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:0.35 }} layout>
      <motion.div style={{ ...glass(), borderRadius:16, marginBottom:8, overflow:"hidden", borderLeft:`3px solid ${sc}` }}
        whileHover={{ y:-2, boxShadow:"0 10px 32px rgba(108,92,231,.12)" }} transition={{ duration:0.2 }}>
        <div style={{ padding:"0.9rem 1.1rem", cursor:"pointer" }} onClick={()=>setExpanded(e=>!e)}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap", marginBottom:5 }}>
                <span style={{ fontSize:10, fontWeight:700, padding:"1px 8px", borderRadius:999, background:{ high:redBg, medium:amberBg, low:greenBg }[flag.severity as string]||greenBg, color:sc }}>
                  {flag.severity==="high"?"🚨 High":flag.severity==="medium"?"⚠️ Medium":"🟡 Low"}
                </span>
                <span style={{ fontSize:10, background:"rgba(108,92,231,.1)", color:A, padding:"1px 7px", borderRadius:999, fontWeight:700 }}>{flag.post?.type||"post"}</span>
                <span style={{ fontSize:10, color:MUTED, marginLeft:"auto" }}>{new Date(flag.createdAt).toLocaleDateString()}</span>
              </div>
              <p style={{ fontSize:13, lineHeight:1.6, color:TEXT, marginBottom:5 }}>{flag.post?.text?.slice(0,120)}...</p>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, color:MUTED }}>Reported by {flag.reporter?.anonName}</span>
                <span style={{ fontSize:11, fontWeight:700, color:red }}>🚩 Reason: {flag.reason}</span>
              </div>
            </div>
            <motion.div animate={{ rotate:expanded?180:0 }} style={{ fontSize:12, color:MUTED, flexShrink:0 }}>▼</motion.div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
              transition={{ duration:0.25 }} style={{ overflow:"hidden" }}>
              <div style={{ padding:"0.8rem 1.1rem 1rem", borderTop:`1px solid ${BORDER}`, background:"rgba(255,255,255,.35)" }}>
                <div style={{ fontSize:10, fontWeight:700, color:MUTED, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Actions</div>
                <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                  <motion.button onClick={()=>handle("approved")} disabled={loading}
                    style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${green}44`, background:greenBg, color:green, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}
                    whileHover={{ background:"rgba(29,158,117,.2)" }} whileTap={{ scale:0.95 }}>
                    ✅ Approve
                  </motion.button>
                  <motion.button onClick={()=>handle("warned")} disabled={loading}
                    style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${amber}44`, background:amberBg, color:amber, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}
                    whileHover={{ background:"rgba(239,159,39,.2)" }} whileTap={{ scale:0.95 }}>
                    ⚠️ Warn
                  </motion.button>
                  <motion.button onClick={()=>handle("removed")} disabled={loading}
                    style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${red}44`, background:redBg, color:red, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}
                    whileHover={{ background:"rgba(192,57,43,.2)" }} whileTap={{ scale:0.95 }}>
                    🗑️ Remove
                  </motion.button>
                </div>
                {loading && <div style={{ fontSize:11, color:MUTED, marginTop:8 }}>Processing...</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function ModerationPage() {
  const [flags, setFlags]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User|null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      if (!user) window.location.href = "/";
      else {
        fetch("/api/moderation")
          .then(r=>r.json())
          .then(d=>{ setFlags(d.flags||[]); setLoading(false); })
          .catch(()=>setLoading(false));
      }
    });
    return ()=>unsub();
  },[]);

  const handleAction = async (postId:string, action:string) => {
    if (!currentUser) return;
    await fetch("/api/moderation", {
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ firebaseUid:currentUser.uid, postId, action }),
    });
    setFlags(prev=>prev.filter(f=>f.postId!==postId));
  };

  const filtered = flags.filter(f=> filter==="all"?true:f.severity===filter);
  const highCount = flags.filter(f=>f.severity==="high").length;

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif", color:TEXT }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse at 10% 10%, rgba(108,92,231,.06) 0%, transparent 55%)" }} />
      <div style={{ position:"relative", zIndex:1 }}>
        <Navbar />
        <div style={{ maxWidth:900, margin:"0 auto", padding:"1.8rem 1.5rem 4rem" }}>

          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:A, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>Admin</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, letterSpacing:"-0.03em" }}>Moderation Dashboard</h1>
              {highCount>0 && (
                <motion.div animate={{ scale:[1,1.04,1] }} transition={{ duration:1.5, repeat:Infinity }}
                  style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 14px", borderRadius:12, background:redBg, border:`1.5px solid ${red}33` }}>
                  <motion.div animate={{ opacity:[1,0.4,1] }} transition={{ duration:1, repeat:Infinity }}
                    style={{ width:7, height:7, borderRadius:"50%", background:red }} />
                  <span style={{ fontSize:12, fontWeight:700, color:red }}>🚨 {highCount} urgent</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
            {[
              { val:flags.filter(f=>f.status==="pending").length, label:"Pending", icon:"⏳", color:amber, bg:amberBg },
              { val:highCount,                                    label:"High severity", icon:"🚨", color:red,   bg:redBg   },
              { val:flags.length,                                 label:"Total flagged", icon:"🚩", color:A,    bg:"rgba(108,92,231,.1)" },
            ].map((s,i)=>(
              <motion.div key={s.label} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35, delay:i*0.07 }}>
                <div style={{ ...glass(), borderRadius:14, padding:"0.9rem 1rem" }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:11, color:MUTED }}>{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* filters */}
          <div style={{ display:"flex", gap:6, marginBottom:14 }}>
            {["all","high","medium","low"].map(f=>(
              <motion.button key={f} onClick={()=>setFilter(f)}
                style={{ padding:"6px 14px", borderRadius:9, border:`1.5px solid ${filter===f?A:BORDER}`, background:filter===f?"rgba(108,92,231,.09)":SURFACE, color:filter===f?A:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize" }}
                whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.95 }}>
                {f} {f==="all"?`(${flags.length})`:""}
              </motion.button>
            ))}
          </div>

          {loading ? (
            <>{[1,2,3].map(i=>(
              <div key={i} style={{ ...glass(), borderRadius:16, padding:"1rem 1.2rem", marginBottom:8 }}>
                {[80,60,40].map((w,j)=>(
                  <motion.div key={j} animate={{ opacity:[0.4,0.7,0.4] }} transition={{ duration:1.5, repeat:Infinity, delay:j*0.1 }}
                    style={{ height:12, borderRadius:999, background:SURFACE2, width:`${w}%`, marginBottom:8 }} />
                ))}
              </div>
            ))}</>
          ) : filtered.length>0 ? (
            <AnimatePresence mode="popLayout">
              {filtered.map(f=><FlagCard key={f.id} flag={f} onAction={handleAction} />)}
            </AnimatePresence>
          ) : (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:"center", padding:"3rem", color:MUTED }}>
              <motion.div animate={{ scale:[1,1.1,1], rotate:[0,5,-5,0] }} transition={{ duration:2, repeat:Infinity, repeatDelay:2 }}
                style={{ fontSize:40, marginBottom:10 }}>✅</motion.div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, marginBottom:4 }}>All clear!</div>
              <div style={{ fontSize:12 }}>No flagged content in this category.</div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
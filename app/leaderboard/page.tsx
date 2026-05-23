"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const A      = "#6c5ce7";
const A2     = "#e84393";
const BG     = "#eeecfa";
const MUTED  = "#5f5887";
const TEXT   = "#1a1730";
const BORDER = "#d8d4f0";
const SURFACE  = "#ffffff";
const SURFACE2 = "#e8e4f8";
const gradBg   = "linear-gradient(135deg,#6c5ce7,#e84393)";
const MEDAL_COLORS = ["#f59e0b","#9ca3af","#cd7c2f"];
const MEDAL_ICONS  = ["🥇","🥈","🥉"];

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
      <div style={{ display:"flex", gap:10 }}>
        <motion.a href="/feed" style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${BORDER}`, color:MUTED, fontSize:13, fontWeight:600, cursor:"pointer", textDecoration:"none" }}
          whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.97 }}>← Feed</motion.a>
      </div>
    </nav>
  );
}

function SkeletonRow() {
  return (
    <div style={{ ...glass(), borderRadius:16, padding:"0.85rem 1.2rem", marginBottom:8, display:"flex", gap:12, alignItems:"center" }}>
      {[32,80,120,60,40].map((w,i)=>(
        <motion.div key={i} animate={{ opacity:[0.4,0.7,0.4] }} transition={{ duration:1.5, repeat:Infinity, delay:i*0.1 }}
          style={{ height:12, borderRadius:999, background:SURFACE2, width:w, flexShrink:0 }} />
      ))}
    </div>
  );
}

function LeaderRow({ u, index }:{ u:any; index:number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-20px" });
  const isTop3 = u.rank<=3;
  const mcolor = isTop3 ? MEDAL_COLORS[u.rank-1] : null;

  return (
    <motion.div ref={ref} initial={{ opacity:0, x:-20 }} animate={inView?{ opacity:1, x:0 }:{}}
      transition={{ duration:0.35, delay:index*0.05 }}>
      <motion.div style={{ ...glass(), borderRadius:16, padding:"0.85rem 1.2rem", marginBottom:8, display:"flex", alignItems:"center", gap:12, cursor:"pointer",
        borderLeft: isTop3 ? `3px solid ${mcolor}` : "1px solid rgba(255,255,255,.92)" }}
        whileHover={{ y:-2, boxShadow: isTop3?`0 10px 32px ${mcolor}22`:"0 10px 32px rgba(108,92,231,.12)" }} transition={{ duration:0.2 }}>

        {isTop3 && (
          <div style={{ position:"absolute", inset:0, borderRadius:16, background:`radial-gradient(ellipse at left, ${mcolor}10, transparent 60%)`, pointerEvents:"none" }} />
        )}

        <div style={{ width:32, textAlign:"center", flexShrink:0 }}>
          {isTop3
            ? <motion.span animate={{ scale:[1,1.15,1] }} transition={{ duration:2, repeat:Infinity, delay:u.rank*0.3 }} style={{ fontSize:20, display:"block" }}>{MEDAL_ICONS[u.rank-1]}</motion.span>
            : <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:MUTED }}>#{u.rank}</span>}
        </div>

        <div style={{ width:40, height:40, borderRadius:"50%", background: isTop3?`linear-gradient(135deg,${mcolor},${mcolor}88)`:SURFACE2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, border:`2px solid ${isTop3?mcolor+"55":BORDER}`, boxShadow:isTop3?`0 0 14px ${mcolor}44`:"none" }}>
          ?
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
            <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>{u.anonName}</span>
            <span style={{ fontSize:9, background:"rgba(108,92,231,.1)", color:A, padding:"1px 6px", borderRadius:999, fontWeight:700 }}>anon</span>
            <span style={{ fontSize:9, background:SURFACE2, color:MUTED, padding:"1px 6px", borderRadius:999, fontWeight:600 }}>{u.level}</span>
          </div>
          <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>{u.totalPredictions||0} predictions · {u.streak>0?`🔥 ${u.streak}d`:""}</div>
        </div>

        <div style={{ width:100, flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, marginBottom:3 }}>
            <span style={{ color:MUTED }}>Accuracy</span>
            <span style={{ fontWeight:700, color:isTop3?mcolor!:A }}>{Math.round(u.accuracy||0)}%</span>
          </div>
          <div style={{ height:4, background:BORDER, borderRadius:999, overflow:"hidden" }}>
            <motion.div initial={{ width:0 }} animate={inView?{ width:`${u.accuracy||0}%` }:{}} transition={{ duration:0.8, delay:index*0.05+0.3 }}
              style={{ height:"100%", background:isTop3?`linear-gradient(90deg,${mcolor},${mcolor}88)`:gradBg, borderRadius:999 }} />
          </div>
        </div>

        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:isTop3?mcolor!:A }}>{u.rep?.toLocaleString()||0}</div>
          <div style={{ fontSize:10, color:MUTED }}>rep</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const [users, setUsers]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("rep");
  const [search, setSearch] = useState("");

  useEffect(()=>{
    onAuthStateChanged(auth, user => {
      if (!user) window.location.href = "/";
    });
  },[]);

  useEffect(()=>{
    setLoading(true);
    fetch(`/api/leaderboard?sortBy=${sortBy}&limit=20`)
      .then(r=>r.json())
      .then(d=>{ setUsers(d.users||[]); setLoading(false); })
      .catch(()=>setLoading(false));
  },[sortBy]);

  const filtered = users.filter(u=>u.anonName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif", color:TEXT }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse at 10% 10%, rgba(108,92,231,.07) 0%, transparent 55%), radial-gradient(ellipse at 90% 80%, rgba(245,158,11,.05) 0%, transparent 50%)" }} />
      <div style={{ position:"relative", zIndex:1 }}>
        <Navbar />
        <div style={{ maxWidth:980, margin:"0 auto", padding:"1.8rem 1.5rem 4rem" }}>

          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:A, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>Leaderboard</div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, letterSpacing:"-0.03em", marginBottom:4 }}>Top Predictors</h1>
            <p style={{ fontSize:13, color:MUTED }}>The most accurate anonymous minds on Splitt.</p>
          </motion.div>

          {/* filters */}
          <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
            {[["rep","🏆 Rep"],["accuracy","🎯 Accuracy"],["streak","🔥 Streak"]].map(([val,label])=>(
              <motion.button key={val} onClick={()=>setSortBy(val)}
                style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${sortBy===val?A:BORDER}`, background:sortBy===val?"rgba(108,92,231,.09)":SURFACE, color:sortBy===val?A:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.95 }}>
                {label}
              </motion.button>
            ))}
            <div style={{ position:"relative", flex:1, minWidth:200 }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:13, color:MUTED }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search predictor..."
                style={{ width:"100%", padding:"8px 10px 8px 32px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:SURFACE, fontSize:13, color:TEXT, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor=A} onBlur={e=>e.target.style.borderColor=BORDER} />
            </div>
          </div>

          {/* column headers */}
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"4px 1.2rem", marginBottom:4 }}>
            <div style={{ width:32, fontSize:10, color:MUTED, fontWeight:600 }}>RANK</div>
            <div style={{ width:40, flexShrink:0 }} />
            <div style={{ flex:1, fontSize:10, color:MUTED, fontWeight:600 }}>PREDICTOR</div>
            <div style={{ width:100, fontSize:10, color:MUTED, fontWeight:600, flexShrink:0 }}>ACCURACY</div>
            <div style={{ width:60, fontSize:10, color:MUTED, fontWeight:600, textAlign:"right", flexShrink:0 }}>REP</div>
          </div>

          {loading ? (
            <>{[1,2,3,4,5].map(i=><SkeletonRow key={i} />)}</>
          ) : filtered.length>0 ? (
            <AnimatePresence mode="popLayout">
              {filtered.map((u,i)=><LeaderRow key={u.id} u={u} index={i} />)}
            </AnimatePresence>
          ) : (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:"center", padding:"3rem", color:MUTED }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
              <div style={{ fontSize:13 }}>No predictors found</div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
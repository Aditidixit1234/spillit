"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const A      = "#6c5ce7";
const A2     = "#e84393";
const BG     = "#eeecfa";
const MUTED  = "#5f5887";
const TEXT   = "#1a1730";
const BORDER = "#d8d4f0";
const SURFACE  = "#ffffff";
const SURFACE2 = "#e8e4f8";
const gradBg   = "linear-gradient(135deg,#6c5ce7,#e84393)";

const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: "rgba(255,255,255,0.68)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.92)",
  boxShadow: "0 4px 28px rgba(108,92,231,0.09), inset 0 1px 0 rgba(255,255,255,0.6)",
  ...extra,
});

// ── Data ──────────────────────────────────────────────────────────────────────
const USERS = [
  { rank:1,  user:"@oracle_zero",    rep:9310, accuracy:87, predictions:124, streak:21, change:3,  aura:"🔮", badge:"Elite Predictor", correct:108, wrong:16,  viral:true,  badges:["🏆 Hall of Fame","🎯 Sharp Shooter","🔥 On Fire"] },
  { rank:2,  user:"@anon_prophet",   rep:8740, accuracy:82, predictions:98,  streak:14, change:0,  aura:"⚡", badge:"Prophet",         correct:80,  wrong:18,  viral:false, badges:["⚡ Power User","👁️ Trendsetter"] },
  { rank:3,  user:"@silent_prophet", rep:7820, accuracy:79, predictions:110, streak:9,  change:1,  aura:"🌑", badge:"Prophet",         correct:87,  wrong:23,  viral:false, badges:["🎭 Debate Starter","🌊 Rising Tide"] },
  { rank:4,  user:"@shadow_oracle",  rep:4820, accuracy:73, predictions:48,  streak:7,  change:-1, aura:"🎯", badge:"Oracle",          correct:35,  wrong:13,  viral:false, badges:["👻 Anon Legend"] },
  { rank:5,  user:"@ghost_writer",   rep:4210, accuracy:71, predictions:62,  streak:5,  change:3,  aura:"👁️", badge:"Oracle",          correct:44,  wrong:18,  viral:true,  badges:["🔥 Viral User","💬 Debate Starter"] },
  { rank:6,  user:"@nobody_knows",   rep:3890, accuracy:68, predictions:55,  streak:3,  change:0,  aura:"🎭", badge:"Truth Seeker",    correct:37,  wrong:18,  viral:false, badges:["🌱 Rising Star"] },
  { rank:7,  user:"@anon_9182",      rep:3340, accuracy:65, predictions:44,  streak:2,  change:2,  aura:"🌊", badge:"Truth Seeker",    correct:28,  wrong:16,  viral:false, badges:["📈 Trending"] },
  { rank:8,  user:"@tech_oracle",    rep:3100, accuracy:63, predictions:38,  streak:1,  change:-2, aura:"💡", badge:"Truth Seeker",    correct:24,  wrong:14,  viral:false, badges:[] },
  { rank:9,  user:"@bold_predictor", rep:2890, accuracy:61, predictions:33,  streak:4,  change:1,  aura:"🔥", badge:"Truth Seeker",    correct:20,  wrong:13,  viral:false, badges:["🎯 Sharp Shooter"] },
  { rank:10, user:"@anon_visionary", rep:2640, accuracy:59, predictions:29,  streak:0,  change:0,  aura:"✨", badge:"Truth Seeker",    correct:17,  wrong:12,  viral:false, badges:[] },
];

const MEDAL_COLORS = ["#f59e0b","#9ca3af","#cd7c2f"];
const MEDAL_ICONS  = ["🥇","🥈","🥉"];
const TABS = ["All Time","This Week","This Month","Accuracy","Streak","Most Viral"];
const STATS = [
  { val:10482, label:"Total predictors", icon:"👥", suffix:"+" },
  { val:48921, label:"Predictions made", icon:"🔮", suffix:"+" },
  { val:73,    label:"Avg accuracy",     icon:"🎯", suffix:"%" },
  { val:2100,  label:"Total votes (K)",  icon:"🗳️", suffix:"K+" },
];

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimCounter({ to, suffix="" }:{ to:number; suffix?:string }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });
  useEffect(() => {
    if (!inView) return;
    let cur=0; const steps=50; const step=to/steps;
    const t=setInterval(()=>{ cur=Math.min(cur+step,to); setVal(Math.round(cur)); if(cur>=to)clearInterval(t); },(1200/steps));
    return ()=>clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── Floating Blobs ────────────────────────────────────────────────────────────
function FloatingBlobs() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {[
        { w:500, h:500, bg:"rgba(108,92,231,.07)", top:"-10%", left:"-8%" },
        { w:400, h:400, bg:"rgba(232,67,147,.06)", top:"50%",  right:"-8%" },
        { w:300, h:300, bg:"rgba(245,158,11,.05)", bottom:"5%",left:"30%" },
      ].map((b,i)=>(
        <motion.div key={i} animate={{ scale:[1,1.1,1], x:[0,18,0], y:[0,-14,0] }}
          transition={{ duration:9+i*2, repeat:Infinity, ease:"easeInOut" }}
          style={{ position:"absolute", width:b.w, height:b.h, borderRadius:"50%", background:b.bg, filter:"blur(60px)", ...b }} />
      ))}
      {/* floating particles */}
      {Array.from({length:12}).map((_,i)=>(
        <motion.div key={`p${i}`}
          animate={{ y:[0,-30,0], x:[0,15,0], opacity:[0.3,0.7,0.3] }}
          transition={{ duration:4+i*0.7, repeat:Infinity, delay:i*0.4, ease:"easeInOut" }}
          style={{ position:"absolute", width:4, height:4, borderRadius:"50%", background:i%2===0?A:A2, opacity:0.4,
            top:`${10+i*7}%`, left:`${5+i*8}%`, filter:"blur(1px)" }} />
      ))}
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.85rem 2rem", background:"rgba(255,255,255,0.82)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${BORDER}`, boxShadow:"0 1px 20px rgba(108,92,231,.06)" }}>
      <a href="/feed" style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:A, letterSpacing:"-0.04em", textDecoration:"none" }}>splitt<span style={{ color:A2 }}>.</span></a>
      <div style={{ display:"flex", gap:10 }}>
        <motion.a href="/feed" style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${BORDER}`, color:MUTED, fontSize:13, fontWeight:600, cursor:"pointer", textDecoration:"none" }}
          whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.97 }}>← Feed</motion.a>
        <motion.a href="/create" style={{ padding:"8px 16px", borderRadius:10, background:gradBg, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", textDecoration:"none", border:"none", boxShadow:"0 4px 14px rgba(108,92,231,.3)" }}
          whileHover={{ y:-1, boxShadow:"0 8px 22px rgba(108,92,231,.4)" }} whileTap={{ scale:0.97 }}>+ Post</motion.a>
      </div>
    </nav>
  );
}

// ── #1 Sticky Banner ──────────────────────────────────────────────────────────
function TopBanner() {
  const top = USERS[0];
  return (
    <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
      style={{ position:"relative", overflow:"hidden", background:"linear-gradient(135deg,#1a1730,#2d1f5e)", padding:"1rem 2rem", borderBottom:`1px solid rgba(108,92,231,.3)` }}>
      {/* rotating spotlight */}
      <motion.div animate={{ rotate:360 }} transition={{ duration:8, repeat:Infinity, ease:"linear" }}
        style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"conic-gradient(from 0deg, transparent, rgba(245,158,11,.15), transparent)", top:-100, left:"40%" }} />
      {/* noise */}
      <div style={{ position:"absolute", inset:0, opacity:0.04, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <div style={{ maxWidth:980, margin:"0 auto", display:"flex", alignItems:"center", gap:16, position:"relative", zIndex:1 }}>
        <motion.div animate={{ rotate:[-5,5,-5] }} transition={{ duration:2, repeat:Infinity }}
          style={{ fontSize:22 }}>👑</motion.div>
        <motion.div animate={{ boxShadow:["0 0 10px #f59e0b44","0 0 25px #f59e0b77","0 0 10px #f59e0b44"] }} transition={{ duration:2, repeat:Infinity }}
          style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#f59e0b,#ef9f27)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, border:"2px solid #f59e0b66", flexShrink:0 }}>
          {top.aura}
        </motion.div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em" }}>🏆 Current #1 Predictor</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:15, fontWeight:800, color:"#fff" }}>{top.user}</span>
            <span style={{ fontSize:11, background:"rgba(245,158,11,.2)", color:"#f59e0b", padding:"1px 8px", borderRadius:999, fontWeight:700 }}>{top.badge}</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,.6)" }}>{top.rep.toLocaleString()} rep · {top.accuracy}% accuracy · 🔥 {top.streak}d streak</span>
          </div>
        </div>
        <motion.div animate={{ opacity:[1,0.5,1] }} transition={{ duration:1.5, repeat:Infinity }}
          style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(245,158,11,.15)", border:"1px solid rgba(245,158,11,.3)", padding:"5px 12px", borderRadius:999 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#f59e0b" }} />
          <span style={{ fontSize:11, color:"#f59e0b", fontWeight:600 }}>Live</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Animated Podium ───────────────────────────────────────────────────────────
function Podium() {
  const order  = [USERS[1], USERS[0], USERS[2]];
  const heights= [150, 195, 115];
  const delays = [0.25, 0, 0.4];

  return (
    <div style={{ ...glass(), borderRadius:20, padding:"1.5rem 1.5rem 0", marginBottom:14, overflow:"hidden", position:"relative" }}>
      {/* shimmer bg */}
      <motion.div animate={{ x:["-100%","200%"] }} transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut", repeatDelay:2 }}
        style={{ position:"absolute", top:0, left:0, width:"50%", height:"100%", background:"linear-gradient(105deg,transparent,rgba(255,255,255,.08),transparent)", zIndex:0 }} />

      <div style={{ textAlign:"center", marginBottom:20, position:"relative", zIndex:1 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, marginBottom:2 }}>🏆 Hall of Fame</div>
        <div style={{ fontSize:11, color:MUTED }}>This period's top anonymous predictors</div>
      </div>

      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:10, position:"relative", zIndex:1 }}>
        {order.map((u,i)=>{
          const isGold = i===1;
          const mcolor = MEDAL_COLORS[u.rank-1];
          const glowStr = isGold ? `0 0 30px ${mcolor}55` : `0 0 16px ${mcolor}33`;

          return (
            <motion.div key={u.rank} initial={{ opacity:0, y:50 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:delays[i], type:"spring", stiffness:180, damping:18 }}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1, maxWidth:220 }}>

              {/* floating user card */}
              <motion.div animate={isGold?{ y:[0,-7,0] }:{ y:[0,-4,0] }}
                transition={{ duration:isGold?2.5:3, repeat:Infinity, ease:"easeInOut" }}
                style={{ textAlign:"center", marginBottom:10, width:"100%" }}>
                {isGold && (
                  <motion.div animate={{ rotate:[-8,8,-8], scale:[1,1.1,1] }} transition={{ duration:2, repeat:Infinity }}
                    style={{ fontSize:26, marginBottom:4 }}>👑</motion.div>
                )}
                {/* avatar with glow */}
                <motion.div animate={{ boxShadow:[glowStr, glowStr.replace("55","88").replace("33","55"), glowStr] }}
                  transition={{ duration:2, repeat:Infinity }}
                  style={{ width:isGold?70:56, height:isGold?70:56, borderRadius:"50%", background:`linear-gradient(135deg,${mcolor},${mcolor}99)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:isGold?28:22, margin:"0 auto 8px", border:`3px solid ${mcolor}`, position:"relative" }}>
                  {u.aura}
                  {/* rank badge */}
                  <div style={{ position:"absolute", bottom:-4, right:-4, width:20, height:20, borderRadius:"50%", background:mcolor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, border:`2px solid ${SURFACE}` }}>
                    {MEDAL_ICONS[u.rank-1]}
                  </div>
                </motion.div>

                <div style={{ fontSize:isGold?14:12, fontWeight:800, color:TEXT, marginBottom:2 }}>{u.user}</div>
                <div style={{ fontSize:10, color:mcolor, fontWeight:700, marginBottom:2 }}>{u.badge}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:isGold?20:16, fontWeight:800, color:mcolor }}>{u.rep.toLocaleString()}</div>
                <div style={{ fontSize:10, color:MUTED, marginBottom:4 }}>{u.accuracy}% acc · 🔥{u.streak}d</div>

                {/* mini badges */}
                <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:3 }}>
                  {u.badges.slice(0,2).map(b=>(
                    <span key={b} style={{ fontSize:9, padding:"1px 6px", borderRadius:999, background:`${mcolor}18`, color:mcolor, fontWeight:700 }}>{b}</span>
                  ))}
                </div>
              </motion.div>

              {/* podium block */}
              <motion.div initial={{ height:0 }} animate={{ height:heights[i] }} transition={{ duration:0.8, delay:delays[i]+0.1, ease:"easeOut" }}
                style={{ width:"100%", borderRadius:"14px 14px 0 0", position:"relative", overflow:"hidden",
                  background: isGold ? "linear-gradient(180deg,#f59e0b,#d97706)" : u.rank===2 ? "linear-gradient(180deg,#9ca3af,#6b7280)" : "linear-gradient(180deg,#cd7c2f,#9a5c1f)",
                  display:"flex", flexDirection:"column", alignItems:"center", paddingTop:14 }}>
                {/* shimmer */}
                <motion.div animate={{ opacity:[0,0.3,0] }} transition={{ duration:2.5, repeat:Infinity, delay:i*0.4 }}
                  style={{ position:"absolute", inset:0, background:"rgba(255,255,255,.2)" }} />
                <span style={{ fontSize:28, position:"relative", zIndex:1 }}>{MEDAL_ICONS[u.rank-1]}</span>
                <span style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#fff", opacity:0.4, position:"relative", zIndex:1 }}>#{u.rank}</span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Profile Hover Card ────────────────────────────────────────────────────────
function ProfileHover({ u, children }:{ u:typeof USERS[0]; children:React.ReactNode }) {
  const [hov, setHov] = useState(false);
  const mcolor = u.rank<=3 ? MEDAL_COLORS[u.rank-1] : A;
  return (
    <div style={{ position:"relative", display:"inline-block" }} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {children}
      <AnimatePresence>
        {hov && (
          <motion.div initial={{ opacity:0, y:8, scale:0.92 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:6, scale:0.94 }}
            transition={{ duration:0.18 }}
            style={{ position:"absolute", top:"110%", left:0, zIndex:99, ...glass(), borderRadius:16, padding:"1rem", width:220, border:`1px solid ${mcolor}33`, boxShadow:`0 10px 36px rgba(108,92,231,.18)` }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:gradBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, border:`2px solid ${mcolor}44`, boxShadow:`0 0 12px ${mcolor}33` }}>{u.aura}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:TEXT }}>{u.user}</div>
                <div style={{ fontSize:10, color:mcolor, fontWeight:700 }}>{u.badge}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
              {[
                { v:u.rep.toLocaleString(), l:"Rep" },
                { v:`${u.accuracy}%`,        l:"Accuracy" },
                { v:u.predictions,           l:"Predictions" },
                { v:u.streak>0?`🔥${u.streak}d`:"None", l:"Streak" },
              ].map(s=>(
                <div key={s.l} style={{ background:SURFACE2, borderRadius:8, padding:"6px 8px", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:mcolor }}>{s.v}</div>
                  <div style={{ fontSize:9, color:MUTED }}>{s.l}</div>
                </div>
              ))}
            </div>
            {u.badges.length>0 && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                {u.badges.map(b=>(
                  <span key={b} style={{ fontSize:9, padding:"2px 7px", borderRadius:999, background:`${mcolor}15`, color:mcolor, fontWeight:700 }}>{b}</span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Leaderboard Row ───────────────────────────────────────────────────────────
function LeaderRow({ u, index }:{ u:typeof USERS[0]; index:number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-20px" });
  const isTop3 = u.rank<=3;
  const mcolor = isTop3 ? MEDAL_COLORS[u.rank-1] : null;
  const changePos = u.change>0; const changeNeg = u.change<0;
  const changeColor = changePos?"#0f6e56":changeNeg?A2:MUTED;
  const changeBg    = changePos?"rgba(29,158,117,.1)":changeNeg?"rgba(232,67,147,.1)":SURFACE2;
  const changeLabel = changePos?`+${u.change}`:changeNeg?`${u.change}`:"—";

  // streak flame size
  const flameSize = u.streak >= 14 ? 20 : u.streak >= 7 ? 17 : u.streak >= 3 ? 14 : u.streak > 0 ? 12 : 0;

  return (
    <motion.div ref={ref} initial={{ opacity:0, x:-24 }} animate={inView?{ opacity:1, x:0 }:{}}
      transition={{ duration:0.38, delay:index*0.05, ease:"easeOut" }}>
      <motion.div
        style={{ ...glass(), borderRadius:16, padding:"0.85rem 1.2rem", marginBottom:8, display:"flex", alignItems:"center", gap:12, cursor:"pointer", position:"relative", overflow:"hidden",
          border: isTop3 ? `1.5px solid ${mcolor}44` : "1px solid rgba(255,255,255,.92)" }}
        whileHover={{ y:-3, boxShadow: isTop3 ? `0 12px 36px ${mcolor}22` : "0 10px 32px rgba(108,92,231,.14)", borderColor: isTop3 ? `${mcolor}66` : "rgba(108,92,231,.3)" }}
        transition={{ duration:0.2 }}>

        {/* top3 left accent + glow */}
        {isTop3 && (
          <>
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:`linear-gradient(180deg,${mcolor},${mcolor}66)`, borderRadius:"16px 0 0 16px" }} />
            <motion.div animate={{ opacity:[0.15,0.3,0.15] }} transition={{ duration:2.5, repeat:Infinity }}
              style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at left, ${mcolor}12, transparent 60%)`, pointerEvents:"none" }} />
          </>
        )}

        {/* rank */}
        <div style={{ width:32, textAlign:"center", flexShrink:0, position:"relative", zIndex:1 }}>
          {isTop3
            ? <motion.span animate={{ scale:[1,1.15,1] }} transition={{ duration:2, repeat:Infinity, delay:u.rank*0.3 }} style={{ fontSize:20, display:"block" }}>{MEDAL_ICONS[u.rank-1]}</motion.span>
            : <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:MUTED }}>#{u.rank}</span>}
        </div>

        {/* avatar */}
        <ProfileHover u={u}>
          <motion.div whileHover={{ scale:1.12 }}
            style={{ width:40, height:40, borderRadius:"50%", background: isTop3 ? `linear-gradient(135deg,${mcolor},${mcolor}88)` : SURFACE2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0,
              border:`2px solid ${isTop3?mcolor+"55":BORDER}`, boxShadow:isTop3?`0 0 14px ${mcolor}44`:"none", cursor:"pointer" }}>
            {u.aura}
          </motion.div>
        </ProfileHover>

        {/* user info */}
        <div style={{ flex:1, minWidth:0, position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
            <ProfileHover u={u}>
              <span style={{ fontSize:13, fontWeight:700, color:TEXT, cursor:"pointer" }}>{u.user}</span>
            </ProfileHover>
            <span style={{ fontSize:9, background:"rgba(108,92,231,.1)", color:A, padding:"1px 6px", borderRadius:999, fontWeight:700 }}>anon</span>
            <span style={{ fontSize:9, background:SURFACE2, color:MUTED, padding:"1px 6px", borderRadius:999, fontWeight:600 }}>{u.badge}</span>
            {u.viral && <motion.span animate={{ scale:[1,1.1,1] }} transition={{ duration:1.5, repeat:Infinity }}
              style={{ fontSize:9, background:"rgba(232,67,147,.12)", color:A2, padding:"1px 7px", borderRadius:999, fontWeight:700 }}>🔥 Viral</motion.span>}
          </div>
          <div style={{ fontSize:11, color:MUTED, marginTop:2, display:"flex", alignItems:"center", gap:8 }}>
            <span>{u.predictions} predictions</span>
            {u.streak>0 && (
              <motion.span animate={{ scale:[1,1.08,1] }} transition={{ duration:1.5, repeat:Infinity }}
                style={{ fontSize:flameSize, display:"inline-block" }}>
                🔥
              </motion.span>
            )}
            {u.streak>0 && <span style={{ color:u.streak>=7?"#e67e22":MUTED, fontWeight:u.streak>=7?700:400 }}>{u.streak}d streak</span>}
          </div>
        </div>

        {/* rep progress bar */}
        <div style={{ width:100, flexShrink:0, position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, marginBottom:3 }}>
            <span style={{ color:MUTED }}>Acc</span>
            <span style={{ fontWeight:700, color: isTop3?mcolor!:A }}>{u.accuracy}%</span>
          </div>
          <div style={{ height:5, background:BORDER, borderRadius:999, overflow:"hidden" }}>
            <motion.div initial={{ width:0 }} animate={inView?{ width:`${u.accuracy}%` }:{}}
              transition={{ duration:0.9, delay:index*0.05+0.3, ease:"easeOut" }}
              style={{ height:"100%", background: isTop3 ? `linear-gradient(90deg,${mcolor},${mcolor}88)` : gradBg, borderRadius:999,
                boxShadow: isTop3 ? `0 0 6px ${mcolor}66` : "none" }} />
          </div>
        </div>

        {/* rep score */}
        <div style={{ textAlign:"right", flexShrink:0, position:"relative", zIndex:1 }}>
          <motion.div animate={isTop3?{ textShadow:[`0 0 8px ${mcolor}44`,`0 0 16px ${mcolor}66`,`0 0 8px ${mcolor}44`] }:{}}
            transition={{ duration:2, repeat:Infinity }}
            style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:isTop3?mcolor!:A }}>
            {u.rep.toLocaleString()}
          </motion.div>
          <div style={{ fontSize:10, color:MUTED }}>rep</div>
        </div>

        {/* rank change */}
        <div style={{ width:38, textAlign:"center", flexShrink:0, position:"relative", zIndex:1 }}>
          <motion.span animate={changePos?{ y:[0,-2,0] }:changeNeg?{ y:[0,2,0] }:{}}
            transition={{ duration:1.5, repeat:Infinity }}
            style={{ fontSize:11, fontWeight:700, padding:"2px 7px", borderRadius:999, background:changeBg, color:changeColor, display:"inline-block" }}>
            {changeLabel}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Your Rank Card ────────────────────────────────────────────────────────────
function YourRankCard() {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
      style={{ borderRadius:18, padding:"1.2rem 1.3rem", background:"linear-gradient(135deg,#1a1730,#2d1f5e)", position:"relative", overflow:"hidden", marginBottom:12 }}>
      <motion.div animate={{ rotate:360 }} transition={{ duration:12, repeat:Infinity, ease:"linear" }}
        style={{ position:"absolute", width:200, height:200, borderRadius:"50%", background:"conic-gradient(from 0deg,transparent,rgba(108,92,231,.2),transparent)", top:-60, right:-60, zIndex:0 }} />
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.55)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Your ranking</div>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:"#fff" }}>#4</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>@shadow_oracle</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.6)" }}>4,820 rep · 73% acc · 🔥7d</div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:7, marginBottom:12 }}>
          {[["180","rep to #3"],["🔥 7d","streak"],["−1","this week"]].map(([v,l])=>(
            <div key={l} style={{ background:"rgba(255,255,255,.1)", borderRadius:10, padding:"8px 8px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:"#fff" }}>{v}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,.6)" }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", marginBottom:5 }}>Progress to #3</div>
        <div style={{ height:5, background:"rgba(255,255,255,.1)", borderRadius:999, overflow:"hidden" }}>
          <motion.div initial={{ width:0 }} animate={{ width:"73%" }} transition={{ duration:1.1, delay:0.5 }}
            style={{ height:"100%", background:"linear-gradient(90deg,#6c5ce7,#e84393)", borderRadius:999 }} />
        </div>
      </div>
    </motion.div>
  );
}

// ── Rising Stars ──────────────────────────────────────────────────────────────
function RisingStars() {
  const risers = USERS.filter(u=>u.change>0).slice(0,4);
  return (
    <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25 }}
      style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem", marginBottom:12 }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>🚀 Rising this week</div>
      {risers.map((u,i)=>(
        <motion.div key={u.user} style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 0", borderBottom:i<risers.length-1?`1px solid ${BORDER}`:"none", cursor:"pointer" }}
          whileHover={{ x:3 }} transition={{ duration:0.13 }}>
          <motion.div animate={{ scale:[1,1.15,1] }} transition={{ duration:1.5+i*.3, repeat:Infinity }}
            style={{ width:30, height:30, borderRadius:"50%", background:"rgba(29,158,117,.12)", color:"#0f6e56", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0 }}>↑</motion.div>
          <ProfileHover u={u}>
            <div style={{ flex:1, cursor:"pointer" }}>
              <div style={{ fontSize:12, fontWeight:600, color:TEXT }}>{u.user}</div>
              <div style={{ fontSize:10, color:MUTED }}>{u.rep.toLocaleString()} rep · {u.accuracy}% acc</div>
            </div>
          </ProfileHover>
          <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:999, background:"rgba(29,158,117,.1)", color:"#0f6e56", flexShrink:0 }}>+{u.change}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [tab, setTab]       = useState("All Time");
  const [search, setSearch] = useState("");

  const sorted = tab==="Accuracy" ? [...USERS].sort((a,b)=>b.accuracy-a.accuracy)
    : tab==="Streak"     ? [...USERS].sort((a,b)=>b.streak-a.streak)
    : tab==="Most Viral" ? [...USERS].filter(u=>u.viral).concat([...USERS].filter(u=>!u.viral))
    : USERS;

  const filtered = sorted.filter(u=>u.user.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif", color:TEXT }}>
      <FloatingBlobs />
      <div style={{ position:"relative", zIndex:1 }}>
        <Navbar />
        <TopBanner />

        <div style={{ maxWidth:980, margin:"0 auto", padding:"1.8rem 1.5rem 0" }}>
          {/* page header */}
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, fontWeight:700, color:A, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>Leaderboard</div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, letterSpacing:"-0.03em", marginBottom:4 }}>Top Predictors</h1>
            <p style={{ fontSize:13, color:MUTED }}>The most accurate anonymous minds on Splitt. Can you crack the top 10?</p>
          </motion.div>

          {/* animated stat counters */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:22 }}>
            {STATS.map((s,i)=>{
              const ref=useRef(null); const inView=useInView(ref,{once:true});
              return (
                <motion.div key={s.label} ref={ref} initial={{ opacity:0, y:14 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.35, delay:i*0.07 }}>
                  <motion.div style={{ ...glass(), borderRadius:14, padding:"0.9rem 1rem", textAlign:"center" }}
                    whileHover={{ y:-3, boxShadow:"0 10px 28px rgba(108,92,231,.15)" }} transition={{ duration:0.2 }}>
                    <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:A }}>
                      <AnimCounter to={s.val} suffix={s.suffix} />
                    </div>
                    <div style={{ fontSize:10, color:MUTED, fontWeight:500 }}>{s.label}</div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* main grid */}
        <div style={{ maxWidth:980, margin:"0 auto", padding:"0 1.5rem 4rem", display:"grid", gridTemplateColumns:"1fr 280px", gap:"1.6rem" }}>

          {/* LEFT */}
          <div>
            <Podium />

            {/* tabs */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
              {TABS.map(t=>(
                <motion.button key={t} onClick={()=>setTab(t)}
                  style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${tab===t?A:BORDER}`, background:tab===t?"rgba(108,92,231,.09)":SURFACE, color:tab===t?A:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                  whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.95 }}>
                  {t}
                </motion.button>
              ))}
            </div>

            {/* search */}
            <div style={{ position:"relative", marginBottom:14 }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:MUTED }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search predictor..."
                style={{ width:"100%", padding:"10px 12px 10px 36px", borderRadius:12, border:`1.5px solid ${BORDER}`, background:SURFACE, fontSize:13, color:TEXT, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
                onFocus={e=>e.target.style.borderColor=A} onBlur={e=>e.target.style.borderColor=BORDER} />
            </div>

            {/* column headers */}
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"4px 1.2rem", marginBottom:4 }}>
              <div style={{ width:32, fontSize:10, color:MUTED, fontWeight:600 }}>RANK</div>
              <div style={{ width:40, flexShrink:0 }} />
              <div style={{ flex:1, fontSize:10, color:MUTED, fontWeight:600 }}>PREDICTOR</div>
              <div style={{ width:100, fontSize:10, color:MUTED, fontWeight:600, flexShrink:0 }}>ACCURACY</div>
              <div style={{ width:60, fontSize:10, color:MUTED, fontWeight:600, textAlign:"right", flexShrink:0 }}>REP</div>
              <div style={{ width:38, fontSize:10, color:MUTED, fontWeight:600, textAlign:"center", flexShrink:0 }}>CHG</div>
            </div>

            <AnimatePresence mode="popLayout">
              {filtered.map((u,i)=><LeaderRow key={`${tab}-${u.rank}`} u={u} index={i} />)}
            </AnimatePresence>

            {filtered.length===0 && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:"center", padding:"3rem", color:MUTED }}>
                <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
                <div style={{ fontSize:13 }}>No predictors found</div>
              </motion.div>
            )}

            <motion.button style={{ width:"100%", padding:"11px", borderRadius:12, border:`1.5px solid ${BORDER}`, background:"transparent", fontSize:13, color:A, fontWeight:600, cursor:"pointer", fontFamily:"inherit", marginTop:6 }}
              whileHover={{ background:SURFACE2, borderColor:A }} whileTap={{ scale:0.98 }}>
              Load more predictors ↓
            </motion.button>
          </div>

          {/* RIGHT */}
          <div style={{ position:"sticky", top:72, display:"flex", flexDirection:"column", gap:0 }}>
            <YourRankCard />
            <RisingStars />

            {/* rep guide */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem", marginBottom:12 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>⚡ Rep guide</div>
              {[
                { icon:"✅", label:"Correct prediction", val:"+12" },
                { icon:"❌", label:"Wrong prediction",   val:"−4"  },
                { icon:"💬", label:"Post engagement",    val:"+2"  },
                { icon:"🔥", label:"Daily streak",       val:"+5"  },
                { icon:"🏆", label:"Trending post",      val:"+20" },
              ].map((r,i)=>(
                <div key={r.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 0", borderBottom:i<4?`1px solid ${BORDER}`:"none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <span style={{ fontSize:13 }}>{r.icon}</span>
                    <span style={{ fontSize:12, color:TEXT }}>{r.label}</span>
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color:r.val.startsWith("+")?"#0f6e56":A2 }}>{r.val} rep</span>
                </div>
              ))}
            </motion.div>

            {/* season */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.35 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:8 }}>🗓️ Season 3</div>
              <div style={{ fontSize:12, color:TEXT, marginBottom:5, fontWeight:500 }}>Ends in 18 days</div>
              <div style={{ height:5, background:BORDER, borderRadius:999, overflow:"hidden", marginBottom:6 }}>
                <motion.div initial={{ width:0 }} animate={{ width:"62%" }} transition={{ duration:1, delay:0.5 }}
                  style={{ height:"100%", background:gradBg, borderRadius:999 }} />
              </div>
              <div style={{ fontSize:11, color:MUTED, marginBottom:10 }}>62% of season complete</div>
              {[
                { rank:"🥇 Top 10",  reward:"Elite badge + 500 rep" },
                { rank:"🥈 Top 50",  reward:"Prophet badge + 200 rep" },
                { rank:"🥉 Top 100", reward:"Oracle badge + 100 rep" },
              ].map((r,i)=>(
                <div key={r.rank} style={{ display:"flex", gap:8, padding:"5px 0", borderBottom:i<2?`1px solid ${BORDER}`:"none" }}>
                  <span style={{ fontSize:11, fontWeight:700, color:A, flexShrink:0 }}>{r.rank}</span>
                  <span style={{ fontSize:11, color:MUTED }}>{r.reward}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
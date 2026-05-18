"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from "framer-motion";

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

// ── Aura Themes ───────────────────────────────────────────────────────────────
const AURAS: Record<string, { name:string; grad:string; glow:string; particle:string; label:string }> = {
  shadow:    { name:"Shadow Aura",    grad:"linear-gradient(135deg,#6c5ce7,#2d2b55)", glow:"rgba(108,92,231,.5)",  particle:"#6c5ce7", label:"🌑" },
  oracle:    { name:"Oracle Aura",    grad:"linear-gradient(135deg,#6c5ce7,#e84393)", glow:"rgba(232,67,147,.45)", particle:"#e84393", label:"🔮" },
  chaos:     { name:"Chaos Aura",     grad:"linear-gradient(135deg,#e84393,#ff6b35)", glow:"rgba(255,107,53,.45)", particle:"#ff6b35", label:"⚡" },
  visionary: { name:"Visionary Aura", grad:"linear-gradient(135deg,#00b4d8,#6c5ce7)", glow:"rgba(0,180,216,.45)",  particle:"#00b4d8", label:"✨" },
};

// ── Rep Levels ────────────────────────────────────────────────────────────────
const REP_LEVELS = [
  { min:0,    label:"Anonymous Rookie",  icon:"🌱", color:"#7b72a8" },
  { min:500,  label:"Truth Seeker",      icon:"🔍", color:"#0f6e56" },
  { min:2000, label:"Oracle",            icon:"🔮", color:A         },
  { min:5000, label:"Prophet",           icon:"⚡", color:A2        },
  { min:8000, label:"Elite Predictor",   icon:"👑", color:"#f59e0b" },
];

const USER = {
  username:"@shadow_oracle", rep:4820, accuracy:73, predictions:48,
  streak:7, rank:12, joined:"March 2024",
  bio:"Anonymous predictor. I've called 3 startup failures, 2 market crashes, and one breakup before they happened. My track record speaks for itself.",
  signature:"Predicts chaos before it trends.",
  badges:[
    { icon:"🔥", label:"Viral Predictor",  desc:"Had a post with 10k+ votes" },
    { icon:"💬", label:"Debate Starter",   desc:"Sparked 200+ comment threads" },
    { icon:"📈", label:"Trend Breaker",    desc:"Called 5 trending topics early" },
    { icon:"👻", label:"Anon Legend",      desc:"500+ posts, identity never revealed" },
  ],
  personality:{ logical:87, controversial:73, bold:92, accurate:73 },
  radarData:{ Tech:82, Crypto:70, Career:65, Relationships:45, Politics:60, Startups:88 },
  milestones:[
    { rep:100,  label:"First prediction",  done:true  },
    { rep:500,  label:"Truth Seeker rank", done:true  },
    { rep:2000, label:"Oracle rank",       done:true  },
    { rep:5000, label:"Prophet rank",      done:false },
    { rep:8000, label:"Elite Predictor",   done:false },
  ],
  timeline:[
    { text:"Will AI replace devs by 2027?",           status:"correct",   time:"2h ago",  votes:2710 },
    { text:"Crypto hitting $150k BTC?",               status:"correct",   time:"3d ago",  votes:5500 },
    { text:"Twitter/X shutting down before 2026?",    status:"wrong",     time:"1w ago",  votes:3200 },
    { text:"GPT-5 makes junior devs obsolete?",       status:"pending",   time:"2w ago",  votes:1800 },
    { text:"My co-founder is secretly job hunting.",  status:"confession",time:"3w ago",  votes:0    },
  ],
  liveStatus:"Currently predicting",
};

const POSTS = [
  { id:1, type:"poll",       text:"Will AI replace software engineers by 2027?",             votes:2710, comments:84,  hearts:210, outcome:"correct",  tags:["#AI","#Tech"],    time:"2h ago" },
  { id:2, type:"confession", text:"I faked being sick for a week to finish a side project.", votes:0,    comments:56,  hearts:342, outcome:null,       tags:["#WorkLife"],      time:"1d ago" },
  { id:3, type:"poll",       text:"Crypto hitting $150k BTC before end of year?",            votes:5500, comments:201, hearts:890, outcome:"correct",  tags:["#Crypto","#BTC"],"time":"3d ago" },
  { id:4, type:"poll",       text:"Will Twitter/X shut down before 2026?",                   votes:3200, comments:143, hearts:430, outcome:"wrong",    tags:["#Tech"],          time:"1w ago" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const getLevel = (rep:number) => [...REP_LEVELS].reverse().find(l=>rep>=l.min) || REP_LEVELS[0];

function FloatingBlobs() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {[
        { w:500, h:500, bg:"rgba(108,92,231,.07)", top:"-10%", left:"-8%" },
        { w:400, h:400, bg:"rgba(232,67,147,.06)", top:"55%",  right:"-8%" },
        { w:300, h:300, bg:"rgba(108,92,231,.05)", bottom:"5%",left:"35%" },
      ].map((b,i)=>(
        <motion.div key={i} animate={{ scale:[1,1.1,1], x:[0,18,0], y:[0,-14,0] }}
          transition={{ duration:9+i*2, repeat:Infinity, ease:"easeInOut" }}
          style={{ position:"absolute", width:b.w, height:b.h, borderRadius:"50%", background:b.bg, filter:"blur(60px)", ...b }} />
      ))}
    </div>
  );
}

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

// ── 3D Tilt Card ──────────────────────────────────────────────────────────────
function TiltCard({ children, style }:{ children:React.ReactNode; style?:React.CSSProperties }) {
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rotX = useTransform(y, [-50,50], [4,-4]);
  const rotY = useTransform(x, [-50,50], [-4,4]);
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left - r.width/2);
    y.set(e.clientY - r.top  - r.height/2);
  };
  return (
    <motion.div onMouseMove={handleMove} onMouseLeave={()=>{ x.set(0); y.set(0); }}
      style={{ rotateX:rotX, rotateY:rotY, transformStyle:"preserve-3d", perspective:800, ...style }}>
      {children}
    </motion.div>
  );
}

// ── Reputation Orb ────────────────────────────────────────────────────────────
function RepOrb({ rep, aura }:{ rep:number; aura:string }) {
  const a = AURAS[aura];
  const level = getLevel(rep);
  return (
    <TiltCard style={{ display:"inline-block" }}>
      <div style={{ position:"relative", width:110, height:110 }}>
        {/* outer glow rings */}
        {[1,2,3].map(i=>(
          <motion.div key={i} animate={{ scale:[1,1.12+i*.06,1], opacity:[0.4,0.15,0.4] }}
            transition={{ duration:2.5+i*.4, repeat:Infinity, ease:"easeInOut" }}
            style={{ position:"absolute", inset:-(i*10), borderRadius:"50%", background:a.glow, filter:"blur(8px)", zIndex:0 }} />
        ))}
        {/* orb */}
        <motion.div animate={{ boxShadow:[`0 0 20px ${a.glow}`,`0 0 40px ${a.glow}`,`0 0 20px ${a.glow}`] }}
          transition={{ duration:2, repeat:Infinity }}
          style={{ position:"relative", zIndex:1, width:110, height:110, borderRadius:"50%", background:a.grad, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", border:"2px solid rgba(255,255,255,.3)" }}>
          <span style={{ fontSize:22, marginBottom:2 }}>{level.icon}</span>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#fff" }}>{rep.toLocaleString()}</span>
          <span style={{ fontSize:9, color:"rgba(255,255,255,.75)", fontWeight:600 }}>REP</span>
        </motion.div>
        {/* floating particles */}
        {[0,60,120,180,240,300].map((deg,i)=>(
          <motion.div key={i} animate={{ rotate:360 }} transition={{ duration:8+i, repeat:Infinity, ease:"linear" }}
            style={{ position:"absolute", inset:0, borderRadius:"50%" }}>
            <motion.div animate={{ scale:[1,1.4,1], opacity:[0.7,1,0.7] }} transition={{ duration:2+i*.3, repeat:Infinity }}
              style={{ position:"absolute", width:5, height:5, borderRadius:"50%", background:a.particle, top:"5%", left:"50%", transform:`translateX(-50%) rotate(${deg}deg) translateY(-52px)`, filter:"blur(1px)" }} />
          </motion.div>
        ))}
      </div>
    </TiltCard>
  );
}

// ── Radar Chart ───────────────────────────────────────────────────────────────
function RadarChart({ data }:{ data:Record<string,number> }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });
  const keys = Object.keys(data); const n = keys.length;
  const cx=100, cy=100, r=72;
  const angle = (i:number) => (i/n)*2*Math.PI - Math.PI/2;
  const pt = (i:number, val:number) => {
    const a = angle(i); const d = (val/100)*r;
    return [cx+d*Math.cos(a), cy+d*Math.sin(a)];
  };
  const [progress, setProgress] = useState(0);
  useEffect(() => { if (inView) { let p=0; const t=setInterval(()=>{ p=Math.min(p+0.04,1); setProgress(p); if(p>=1)clearInterval(t); },16); return()=>clearInterval(t); } },[inView]);
  const pts = keys.map((k,i)=>{ const [x,y]=pt(i,data[k]*progress); return `${x},${y}`; }).join(" ");
  return (
    <div ref={ref} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
      <svg width={200} height={200} viewBox="0 0 200 200">
        {/* grid circles */}
        {[25,50,75,100].map(pct=>(
          <polygon key={pct} points={keys.map((_,i)=>{ const [x,y]=pt(i,pct); return`${x},${y}`; }).join(" ")}
            fill="none" stroke={BORDER} strokeWidth={1} />
        ))}
        {/* axes */}
        {keys.map((_,i)=>{ const[x,y]=pt(i,100); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={BORDER} strokeWidth={1} />; })}
        {/* data area */}
        <motion.polygon points={pts} fill={`${A}22`} stroke={A} strokeWidth={2} strokeLinejoin="round" />
        {/* data points */}
        {keys.map((k,i)=>{ const[x,y]=pt(i,data[k]*progress); return <motion.circle key={k} cx={x} cy={y} r={4} fill={A} stroke={SURFACE} strokeWidth={2} />; })}
        {/* labels */}
        {keys.map((k,i)=>{ const[x,y]=pt(i,118); return <text key={k} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight={700} fill={MUTED}>{k}</text>; })}
      </svg>
    </div>
  );
}

// ── Accuracy Ring ─────────────────────────────────────────────────────────────
function AccuracyRing({ pct }:{ pct:number }) {
  const r=36; const circ=2*Math.PI*r;
  const ref=useRef(null); const inView=useInView(ref,{once:true});
  return (
    <div ref={ref} style={{ position:"relative", width:90, height:90, flexShrink:0 }}>
      <svg width={90} height={90} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={45} cy={45} r={r} fill="none" stroke={BORDER} strokeWidth={7} />
        <motion.circle cx={45} cy={45} r={r} fill="none" stroke="url(#g2)" strokeWidth={7} strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset:circ }} animate={inView?{ strokeDashoffset:circ-(pct/100)*circ }:{}} transition={{ duration:1.2, delay:0.3, ease:"easeOut" }} />
        <defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={A}/><stop offset="100%" stopColor={A2}/></linearGradient></defs>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:A }}>{pct}%</span>
        <span style={{ fontSize:9, color:MUTED }}>accuracy</span>
      </div>
    </div>
  );
}

// ── Heatmap ───────────────────────────────────────────────────────────────────
// Seeded deterministic values — avoids SSR/client hydration mismatch
const HEATMAP_VALS = [2,0,3,1,4,0,2,1,3,0,2,4,1,3,2,0,4,1,2,3,0,1,4,2,3,1,0,2,4,3,1,2,0,3,4,1,2,0,3,1,4,2,0,3,1,2,4,0,3,2,1,4,0,2,3,1,0,4,2,3,1,0,4,2,1,3,0,2,4,1,3,0,2,1,4,3,0,2,1,3,4,0,2,1,3,2,4,0,1,3,2,4,1,0,3,2,4,1,0,3,1,2,4,0,3,2,1,4,3,0,2,1];

function Heatmap() {
  const ref=useRef(null); const inView=useInView(ref,{once:true});
  const weeks=16; const days=7;
  const vals=HEATMAP_VALS.slice(0, weeks*days);
  const labels=["Mon","","Wed","","Fri","","Sun"];
  const intensities=["rgba(108,92,231,.08)","rgba(108,92,231,.25)","rgba(108,92,231,.45)","rgba(108,92,231,.7)","rgba(108,92,231,.9)"];
  return (
    <div ref={ref}>
      <div style={{ display:"flex", gap:2 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:2, marginRight:4 }}>
          {labels.map((l,i)=><div key={i} style={{ height:11, fontSize:8, color:MUTED, lineHeight:"11px" }}>{l}</div>)}
        </div>
        {Array.from({length:weeks}).map((_,wi)=>(
          <div key={wi} style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {Array.from({length:days}).map((_,di)=>{
              const v=vals[wi*days+di];
              return (
                <motion.div key={di} initial={{ opacity:0, scale:0 }} animate={inView?{ opacity:1, scale:1 }:{}}
                  transition={{ duration:0.3, delay:(wi*days+di)*0.004 }}
                  title={`${v} posts`}
                  style={{ width:11, height:11, borderRadius:3, background:intensities[v], cursor:"pointer" }} />
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ fontSize:10, color:MUTED, marginTop:6 }}>Last 16 weeks · GitHub-style activity</div>
    </div>
  );
}

// ── Prediction Timeline ───────────────────────────────────────────────────────
function PredictionTimeline() {
  const statusStyle: Record<string,{bg:string;color:string;label:string}> = {
    correct:   { bg:"rgba(29,158,117,.1)",  color:"#0f6e56", label:"✓ Correct"   },
    wrong:     { bg:"rgba(232,67,147,.1)",  color:A2,        label:"✗ Wrong"     },
    pending:   { bg:"rgba(239,159,39,.1)",  color:"#854f0b", label:"⏳ Pending"  },
    confession:{ bg:"rgba(108,92,231,.1)",  color:A,         label:"💬 Confession"},
  };
  return (
    <div style={{ position:"relative" }}>
      <div style={{ position:"absolute", left:16, top:20, bottom:20, width:2, background:`linear-gradient(to bottom,${A},${A2})`, opacity:0.2, borderRadius:2 }} />
      {USER.timeline.map((t,i)=>{
        const ref=useRef(null); const inView=useInView(ref,{once:true,margin:"-20px"});
        const s=statusStyle[t.status];
        return (
          <motion.div key={i} ref={ref} initial={{ opacity:0, x:-14 }} animate={inView?{ opacity:1, x:0 }:{}} transition={{ duration:0.35, delay:i*0.08 }}
            style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
            <motion.div whileHover={{ scale:1.2 }} style={{ width:32, height:32, borderRadius:"50%", background:s.bg, border:`2px solid ${s.color}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, position:"relative", zIndex:1, fontSize:12 }}>
              {t.status==="correct"?"✓":t.status==="wrong"?"✗":t.status==="pending"?"⏳":"💬"}
            </motion.div>
            <motion.div style={{ ...glass(), borderRadius:13, padding:"8px 11px", flex:1 }}
              whileHover={{ y:-2, boxShadow:"0 8px 24px rgba(108,92,231,.12)" }} transition={{ duration:0.2 }}>
              <div style={{ fontSize:12, fontWeight:500, color:TEXT, marginBottom:4, lineHeight:1.45 }}>{t.text}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:999, background:s.bg, color:s.color }}>{s.label}</span>
                <span style={{ fontSize:10, color:MUTED }}>{t.time}</span>
                {t.votes>0 && <span style={{ fontSize:10, color:MUTED }}>🗳️ {t.votes.toLocaleString()}</span>}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Personality Stats ─────────────────────────────────────────────────────────
function PersonalityStats({ stats }:{ stats:Record<string,number> }) {
  const ref=useRef(null); const inView=useInView(ref,{once:true});
  const labels:Record<string,string> = { logical:"🧠 Logical", controversial:"🔥 Controversial", bold:"⚡ Bold Takes", accurate:"🎯 Accurate" };
  const colors = [A, A2, "#e67e22", "#0f6e56"];
  return (
    <div ref={ref}>
      {Object.entries(stats).map(([k,v],i)=>(
        <div key={k} style={{ marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
            <span style={{ color:TEXT, fontWeight:500 }}>{labels[k]}</span>
            <span style={{ fontWeight:800, color:colors[i%colors.length] }}>{v}%</span>
          </div>
          <div style={{ height:7, background:BORDER, borderRadius:999, overflow:"hidden" }}>
            <motion.div initial={{ width:0 }} animate={inView?{ width:`${v}%` }:{}} transition={{ duration:0.9, delay:i*0.1, ease:"easeOut" }}
              style={{ height:"100%", borderRadius:999, background:`linear-gradient(90deg,${colors[i%colors.length]},${colors[(i+1)%colors.length]})`, opacity:0.85 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Reputation Journey ────────────────────────────────────────────────────────
function RepJourney({ milestones, currentRep }:{ milestones:typeof USER.milestones; currentRep:number }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0, position:"relative", padding:"0 8px" }}>
      {milestones.map((m,i)=>(
        <div key={i} style={{ display:"flex", alignItems:"center", flex: i<milestones.length-1 ? 1 : 0 }}>
          <motion.div whileHover={{ scale:1.2 }} title={m.label}
            style={{ width:28, height:28, borderRadius:"50%", background:m.done?gradBg:SURFACE2, border:`2px solid ${m.done?A:BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer", boxShadow:m.done?`0 0 10px rgba(108,92,231,.3)`:"none" }}>
            <span style={{ fontSize:10 }}>{m.done?"✓":"○"}</span>
          </motion.div>
          <div style={{ fontSize:9, color:m.done?A:MUTED, fontWeight:m.done?700:400, position:"absolute", top:32, left:`${(i/(milestones.length-1))*100}%`, transform:"translateX(-50%)", whiteSpace:"nowrap", textAlign:"center" }}>
            {m.rep>=1000?`${m.rep/1000}k`:m.rep}
          </div>
          {i<milestones.length-1 && (
            <div style={{ flex:1, height:2, background:m.done?gradBg:BORDER, margin:"0 2px" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Badge Card ────────────────────────────────────────────────────────────────
function BadgeCard({ badge }:{ badge:typeof USER.badges[0] }) {
  const [hov, setHov]=useState(false);
  return (
    <motion.div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ position:"relative" }}
      whileHover={{ y:-3 }} transition={{ duration:0.2 }}>
      <motion.div animate={{ boxShadow:hov?`0 8px 24px rgba(108,92,231,.2)`:"none", background:hov?"rgba(108,92,231,.08)":SURFACE2 }}
        style={{ padding:"8px 12px", borderRadius:12, border:`1.5px solid ${hov?A:BORDER}`, cursor:"pointer", display:"flex", alignItems:"center", gap:7, transition:"border-color .2s" }}>
        <motion.span animate={{ rotate:hov?[0,15,-10,5,0]:0 }} transition={{ duration:0.5 }} style={{ fontSize:18 }}>{badge.icon}</motion.span>
        <span style={{ fontSize:11, fontWeight:700, color:hov?A:TEXT }}>{badge.label}</span>
      </motion.div>
      <AnimatePresence>
        {hov && (
          <motion.div initial={{ opacity:0, y:4, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:4, scale:0.9 }}
            style={{ position:"absolute", bottom:"110%", left:"50%", transform:"translateX(-50%)", ...glass(), borderRadius:10, padding:"8px 12px", whiteSpace:"nowrap", zIndex:50, fontSize:11, color:MUTED, border:`1px solid rgba(108,92,231,.2)` }}>
            {badge.desc}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post, index }:{ post:typeof POSTS[0]; index:number }) {
  const ref=useRef(null); const inView=useInView(ref,{once:true,margin:"-20px"});
  const [hearted,setHearted]=useState(false); const [hearts,setHearts]=useState(post.hearts);
  const outMap:Record<string,{bg:string;color:string;label:string}> = {
    correct:{ bg:"rgba(29,158,117,.1)", color:"#0f6e56", label:"✓ Correct" },
    wrong:  { bg:"rgba(232,67,147,.1)", color:A2,        label:"✗ Wrong"   },
  };
  const out=post.outcome?outMap[post.outcome]:null;
  return (
    <motion.div ref={ref} initial={{ opacity:0, y:18 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.35, delay:index*0.07 }}>
      <motion.div style={{ ...glass(), borderRadius:16, padding:"1rem 1.2rem", marginBottom:10, position:"relative", overflow:"hidden", cursor:"pointer" }}
        whileHover={{ y:-3, boxShadow:"0 12px 32px rgba(108,92,231,.13)" }} transition={{ duration:0.2 }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:post.type==="poll"?gradBg:"linear-gradient(180deg,#ef9f27,#f04aa0)", borderRadius:"16px 0 0 16px" }} />
        <div style={{ paddingLeft:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
            <span style={{ fontSize:10, background:post.type==="poll"?"rgba(232,67,147,.1)":"rgba(239,159,39,.12)", color:post.type==="poll"?A2:"#7a4a08", padding:"1px 8px", borderRadius:999, fontWeight:700 }}>{post.type==="poll"?"prediction":"confession"}</span>
            {out && <span style={{ fontSize:10, background:out.bg, color:out.color, padding:"1px 8px", borderRadius:999, fontWeight:700 }}>{out.label}</span>}
            <span style={{ fontSize:10, color:MUTED, marginLeft:"auto" }}>{post.time}</span>
          </div>
          <p style={{ fontSize:13, lineHeight:1.6, color:TEXT, marginBottom:7 }}>{post.text}</p>
          <div style={{ display:"flex", gap:5, marginBottom:7 }}>
            {post.tags.map(t=><span key={t} style={{ fontSize:11, color:A, fontWeight:600, padding:"2px 8px", borderRadius:999, background:"rgba(108,92,231,.08)" }}>{t}</span>)}
          </div>
          <div style={{ display:"flex", gap:10, paddingTop:7, borderTop:`1px solid ${BORDER}` }}>
            {post.votes>0&&<span style={{ fontSize:11, color:MUTED }}>🗳️ {post.votes.toLocaleString()}</span>}
            <span style={{ fontSize:11, color:MUTED }}>💬 {post.comments}</span>
            <motion.button onClick={()=>{ setHearted(h=>!h); setHearts(h=>hearted?h-1:h+1); }}
              style={{ display:"flex", alignItems:"center", gap:4, padding:"2px 8px", borderRadius:8, border:"none", background:hearted?"rgba(232,67,147,.08)":"transparent", color:hearted?A2:MUTED, fontSize:11, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}
              whileTap={{ scale:0.85 }}>
              <motion.span animate={hearted?{scale:[1,1.4,1]}:{scale:1}} transition={{ duration:0.3 }}>{hearted?"❤️":"🤍"}</motion.span> {hearts}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [tab, setTab]   = useState("Posts");
  const [aura, setAura] = useState("oracle");
  const tabs = ["Posts","Predictions","Confessions","Correct","Wrong"];
  const level = getLevel(USER.rep);
  const a = AURAS[aura];

  const filtered = tab==="Predictions"?POSTS.filter(p=>p.type==="poll")
    :tab==="Confessions"?POSTS.filter(p=>p.type==="confession")
    :tab==="Correct"?POSTS.filter(p=>p.outcome==="correct")
    :tab==="Wrong"?POSTS.filter(p=>p.outcome==="wrong")
    :POSTS;

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif", color:TEXT }}>
      <FloatingBlobs />
      <div style={{ position:"relative", zIndex:1 }}>
        <Navbar />

        {/* ── GLASSMORPHISM PROFILE BANNER ── */}
        <div style={{ position:"relative", overflow:"hidden" }}>
          <div style={{ height:180, position:"relative", background:`linear-gradient(135deg,rgba(108,92,231,.15),rgba(232,67,147,.1))` }}>
            {/* animated gradient blobs in banner */}
            <motion.div animate={{ scale:[1,1.15,1], x:[0,30,0] }} transition={{ duration:8, repeat:Infinity }}
              style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:`${a.glow}`, filter:"blur(80px)", top:-150, right:-80, opacity:0.5 }} />
            <motion.div animate={{ scale:[1,1.1,1], x:[0,-20,0] }} transition={{ duration:10, repeat:Infinity }}
              style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"rgba(108,92,231,.15)", filter:"blur(60px)", bottom:-100, left:50 }} />
            {/* noise overlay */}
            <div style={{ position:"absolute", inset:0, opacity:0.04, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
            {/* live status */}
            <motion.div animate={{ opacity:[1,0.6,1] }} transition={{ duration:2, repeat:Infinity }}
              style={{ position:"absolute", top:16, right:16, display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,.2)", backdropFilter:"blur(10px)", padding:"5px 12px", borderRadius:999, border:"1px solid rgba(255,255,255,.3)" }}>
              <motion.div animate={{ scale:[1,1.4,1] }} transition={{ duration:1.5, repeat:Infinity }}
                style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e" }} />
              <span style={{ fontSize:11, color:"#fff", fontWeight:600 }}>{USER.liveStatus}</span>
            </motion.div>
          </div>

          {/* profile content */}
          <div style={{ maxWidth:980, margin:"0 auto", padding:"0 1.5rem" }}>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:-55, marginBottom:14, flexWrap:"wrap", gap:10 }}>
              <div style={{ display:"flex", alignItems:"flex-end", gap:16 }}>
                <RepOrb rep={USER.rep} aura={aura} />
                <motion.div initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }} style={{ paddingBottom:8 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:TEXT }}>{USER.username}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:999, background:`${level.color}18`, color:level.color, border:`1px solid ${level.color}33` }}>{level.icon} {level.label}</span>
                    <span style={{ fontSize:11, color:MUTED }}>Rank #{USER.rank} · {USER.joined}</span>
                  </div>
                  <div style={{ fontSize:12, color:MUTED, fontStyle:"italic", marginTop:4 }}>"{USER.signature}"</div>
                </motion.div>
              </div>
              <div style={{ display:"flex", gap:8, paddingBottom:8 }}>
                <motion.button style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:"transparent", color:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                  whileHover={{ borderColor:A, color:A }}>Follow</motion.button>
                <motion.button style={{ padding:"8px 16px", borderRadius:10, background:gradBg, border:"none", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(108,92,231,.3)" }}
                  whileHover={{ y:-1, boxShadow:"0 6px 20px rgba(108,92,231,.4)" }}>Share profile</motion.button>
              </div>
            </div>

            {/* bio */}
            <p style={{ fontSize:13, color:MUTED, lineHeight:1.7, maxWidth:560, marginBottom:12 }}>{USER.bio}</p>

            {/* aura selector */}
            <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
              <span style={{ fontSize:11, color:MUTED, fontWeight:600, alignSelf:"center" }}>Aura:</span>
              {Object.entries(AURAS).map(([key,val])=>(
                <motion.button key={key} onClick={()=>setAura(key)}
                  style={{ padding:"4px 12px", borderRadius:999, border:`1.5px solid ${aura===key?val.particle:BORDER}`, background:aura===key?`${val.particle}18`:"transparent", color:aura===key?val.particle:MUTED, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                  whileHover={{ borderColor:val.particle }} whileTap={{ scale:0.93 }}>
                  {val.label} {val.name}
                </motion.button>
              ))}
            </div>

            {/* badges */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
              {USER.badges.map((b,i)=>(
                <motion.div key={b.label} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.3+i*0.06 }}>
                  <BadgeCard badge={b} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{ maxWidth:980, margin:"0 auto", padding:"0 1.5rem 4rem", display:"grid", gridTemplateColumns:"1fr 280px", gap:"1.6rem" }}>

          {/* ── LEFT ── */}
          <div>
            {/* stat cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
              {[
                { val:USER.rep.toLocaleString(), label:"Rep score",   color:A,         icon:"⚡" },
                { val:`${USER.accuracy}%`,        label:"Accuracy",   color:A2,        icon:"🎯" },
                { val:USER.predictions,           label:"Predictions",color:A,         icon:"🔮" },
                { val:`${USER.streak}🔥`,          label:"Streak",     color:"#e67e22", icon:""   },
              ].map((s,i)=>{
                const ref=useRef(null); const inView=useInView(ref,{once:true});
                return (
                  <motion.div key={s.label} ref={ref} initial={{ opacity:0, y:14 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.35, delay:i*0.07 }}>
                    <motion.div style={{ ...glass(), borderRadius:14, padding:"0.9rem 1rem", textAlign:"center" }}
                      whileHover={{ y:-3, boxShadow:`0 10px 28px ${s.color}22` }} transition={{ duration:0.2 }}>
                      <div style={{ fontSize:18, marginBottom:3 }}>{s.icon}</div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:s.color }}>{s.val}</div>
                      <div style={{ fontSize:10, color:MUTED, fontWeight:500 }}>{s.label}</div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* rep journey */}
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.3rem", marginBottom:14 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:18 }}>🚀 Reputation journey</div>
              <RepJourney milestones={USER.milestones} currentRep={USER.rep} />
              <div style={{ fontSize:11, color:MUTED, marginTop:28 }}>
                {USER.rep.toLocaleString()} / 5,000 rep to reach Prophet rank
              </div>
              <div style={{ height:5, background:BORDER, borderRadius:999, overflow:"hidden", marginTop:6 }}>
                <motion.div initial={{ width:0 }} animate={{ width:`${(USER.rep/5000)*100}%`}} transition={{ duration:1.1, delay:0.4 }}
                  style={{ height:"100%", background:gradBg, borderRadius:999 }} />
              </div>
            </motion.div>

            {/* prediction timeline */}
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.3rem", marginBottom:14 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:12 }}>📅 Prediction timeline</div>
              <PredictionTimeline />
            </motion.div>

            {/* posts tabs */}
            <div style={{ display:"flex", borderBottom:`1.5px solid ${BORDER}`, marginBottom:12, position:"relative" }}>
              {tabs.map(t=>(
                <motion.button key={t} onClick={()=>setTab(t)}
                  style={{ flex:1, padding:"10px 4px", border:"none", background:"transparent", fontSize:12, fontWeight:tab===t?700:500, color:tab===t?A:MUTED, cursor:"pointer", fontFamily:"inherit", position:"relative" }}
                  whileHover={{ color:A }}>
                  {t}
                  {tab===t && <motion.div layoutId="ptab" style={{ position:"absolute", bottom:-1.5, left:0, right:0, height:2.5, background:gradBg, borderRadius:999 }} transition={{ type:"spring", stiffness:400, damping:30 }} />}
                </motion.button>
              ))}
            </div>
            <AnimatePresence mode="popLayout">
              {filtered.map((p,i)=><PostCard key={`${tab}-${p.id}`} post={p} index={i} />)}
            </AnimatePresence>
            {filtered.length===0 && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:"center", padding:"2.5rem", color:MUTED }}>
                <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
                <div style={{ fontSize:13, fontWeight:500 }}>No posts in this category yet</div>
              </motion.div>
            )}
          </div>

          {/* ── RIGHT ── */}
          <div style={{ position:"sticky", top:72, display:"flex", flexDirection:"column", gap:12 }}>

            {/* accuracy ring + record */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>🎯 Prediction record</div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
                <AccuracyRing pct={USER.accuracy} />
                <div style={{ flex:1 }}>
                  {[{ label:"Correct",val:35,color:"#0f6e56"},{ label:"Wrong",val:13,color:A2}].map(s=>(
                    <div key={s.label} style={{ marginBottom:7 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
                        <span style={{ color:TEXT, fontWeight:500 }}>{s.label}</span>
                        <span style={{ fontWeight:700, color:s.color }}>{s.val}</span>
                      </div>
                      <div style={{ height:5, background:BORDER, borderRadius:999, overflow:"hidden" }}>
                        <motion.div initial={{ width:0 }} animate={{ width:`${(s.val/48)*100}%` }} transition={{ duration:0.8, delay:0.4 }}
                          style={{ height:"100%", background:s.color, borderRadius:999, opacity:0.8 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* radar chart */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.14 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:4 }}>📡 Prediction radar</div>
              <div style={{ fontSize:11, color:MUTED, marginBottom:8 }}>Accuracy by category</div>
              <RadarChart data={USER.radarData} />
            </motion.div>

            {/* personality stats */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.18 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>🧬 Personality stats</div>
              <PersonalityStats stats={USER.personality} />
            </motion.div>

            {/* heatmap */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.22 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>📊 Activity heatmap</div>
              <Heatmap />
            </motion.div>

            {/* rank card */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.26 }}
              style={{ borderRadius:18, padding:"1.1rem 1.2rem", background:a.grad, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,.07)", top:-30, right:-30 }} />
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.7)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>Global rank</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:"#fff", marginBottom:3 }}>#{USER.rank}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.75)", marginBottom:12 }}>Top 0.1% of all predictors</div>
                <motion.a href="/leaderboard" style={{ display:"inline-block", padding:"6px 14px", borderRadius:9, background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.3)", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", textDecoration:"none" }}
                  whileHover={{ background:"rgba(255,255,255,.25)" }}>Leaderboard →</motion.a>
              </div>
            </motion.div>

            {/* streak */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>🔥 Active streak</div>
              <div style={{ display:"flex", gap:4 }}>
                {Array.from({length:7}).map((_,i)=>(
                  <motion.div key={i} initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.35+i*0.05, type:"spring" }}>
                    <motion.div animate={i<USER.streak?{ boxShadow:["0 0 6px rgba(108,92,231,.4)","0 0 14px rgba(232,67,147,.4)","0 0 6px rgba(108,92,231,.4)"] }:{}} transition={{ duration:2, repeat:Infinity }}
                      style={{ flex:1, width:28, height:28, borderRadius:8, background:i<USER.streak?gradBg:SURFACE2, border:`1px solid ${BORDER}` }} />
                  </motion.div>
                ))}
              </div>
              <div style={{ fontSize:11, color:MUTED, marginTop:8 }}>{USER.streak} day streak 🚀</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
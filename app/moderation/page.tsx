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
const green = "#0f6e56"; const greenBg = "rgba(29,158,117,.1)";
const red   = "#c0392b"; const redBg   = "rgba(192,57,43,.1)";
const amber = "#854f0b"; const amberBg = "rgba(239,159,39,.1)";

const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
  background:"rgba(255,255,255,0.68)", backdropFilter:"blur(20px)",
  WebkitBackdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.92)",
  boxShadow:"0 4px 28px rgba(108,92,231,0.09), inset 0 1px 0 rgba(255,255,255,0.6)", ...extra,
});

// ── Data ──────────────────────────────────────────────────────────────────────
type FlaggedPost = { id:number; type:string; text:string; user:string; time:string; reports:number; reason:string; severity:"high"|"medium"|"low"; status:"pending"|"approved"|"removed"|"warned"; votes:number; comments:number; };

const FLAGGED: FlaggedPost[] = [
  { id:1, type:"confession", text:"I know who @shadow_oracle is in real life and I'm going to expose them publicly next week.", user:"@anon_7821", time:"5m ago",  reports:14, reason:"Doxxing threat",       severity:"high",   status:"pending", votes:0,   comments:3  },
  { id:2, type:"poll",       text:"Rate the attractiveness of these female colleagues (poll options are their names).",          user:"@unknown_x", time:"12m ago", reports:9,  reason:"Harassment",           severity:"high",   status:"pending", votes:234, comments:12 },
  { id:3, type:"confession", text:"I've been sending anonymous hate messages to my ex every day for 3 months. She has no idea.", user:"@ghost_99",  time:"28m ago", reports:7,  reason:"Cyberbullying",        severity:"high",   status:"pending", votes:0,   comments:8  },
  { id:4, type:"confession", text:"My boss is sleeping with HR and that's why I keep getting passed over for promotions.",       user:"@anon_4521", time:"1h ago",  reports:5,  reason:"Defamation",           severity:"medium", status:"pending", votes:0,   comments:22 },
  { id:5, type:"poll",       text:"Will my coworker get fired before end of Q2? (I'm the reason they're being investigated)",   user:"@anon_1122", time:"2h ago",  reports:4,  reason:"Workplace misconduct", severity:"medium", status:"pending", votes:156, comments:6  },
  { id:6, type:"confession", text:"I've been leaking our company's unreleased product roadmap to a competitor for 6 months.",   user:"@insider_x", time:"3h ago",  reports:3,  reason:"Illegal activity",     severity:"medium", status:"pending", votes:0,   comments:34 },
  { id:7, type:"poll",       text:"Which political party should I vote for? [lists extreme fringe options as the only choices]", user:"@voter_99",  time:"5h ago",  reports:2,  reason:"Political manipulation",severity:"low",    status:"pending", votes:89,  comments:4  },
  { id:8, type:"confession", text:"I faked my resume to get this job and I've been here for 2 years. Nobody noticed at all.",   user:"@fake_it",   time:"6h ago",  reports:1,  reason:"Misinformation",       severity:"low",    status:"approved",votes:0,   comments:56 },
];

const LIVE_FEED = [
  { icon:"🚩", text:"@anon_7821 post flagged 14 times",    time:"just now", color:red   },
  { icon:"✅", text:"@fake_it post approved by mod",        time:"2m ago",  color:green },
  { icon:"💬", text:"84 new comments on AI prediction",    time:"4m ago",  color:A     },
  { icon:"🔥", text:"#AITakeover is now trending",         time:"6m ago",  color:"#e67e22" },
  { icon:"⚡", text:"+20 rep awarded to @oracle_zero",     time:"8m ago",  color:A     },
  { icon:"🗑️", text:"@spam_bot_x removed for spam",        time:"11m ago", color:red   },
  { icon:"📈", text:"1,000 vote milestone hit on poll",    time:"14m ago", color:green },
  { icon:"🏆", text:"@anon_prophet climbed to rank #2",    time:"18m ago", color:"#f59e0b" },
];

const SIDEBAR_ITEMS = [
  { icon:"📊", label:"Overview",   id:"overview"  },
  { icon:"🚩", label:"Flagged",    id:"flagged"   },
  { icon:"🤖", label:"Auto-mod",   id:"automod"   },
  { icon:"📈", label:"Analytics",  id:"analytics" },
  { icon:"👥", label:"Users",      id:"users"     },
  { icon:"⚙️", label:"Settings",   id:"settings"  },
];

const WEEKLY_DATA = [12,8,19,14,23,17,8];
const ENGAGEMENT  = [65,72,58,81,76,90,84];
const DAYS = ["M","T","W","T","F","S","S"];

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimCounter({ to, suffix="" }:{ to:number; suffix?:string }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null); const inView = useInView(ref,{once:true});
  useEffect(()=>{
    if(!inView)return;
    let c=0; const steps=50; const step=to/steps;
    const t=setInterval(()=>{ c=Math.min(c+step,to); setVal(Math.round(c)); if(c>=to)clearInterval(t); },1200/steps);
    return ()=>clearInterval(t);
  },[inView,to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── Progress Ring ─────────────────────────────────────────────────────────────
function ProgressRing({ pct, size=72, stroke=7, color=A, label="" }:{ pct:number; size?:number; stroke?:number; color?:string; label?:string }) {
  const r = (size-stroke*2)/2; const circ = 2*Math.PI*r;
  const ref = useRef(null); const inView = useInView(ref,{once:true});
  return (
    <div ref={ref} style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={BORDER} strokeWidth={stroke} />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset:circ }}
          animate={inView?{ strokeDashoffset:circ-(pct/100)*circ }:{}}
          transition={{ duration:1.2, delay:0.3, ease:"easeOut" }}
          style={{ filter:`drop-shadow(0 0 4px ${color}66)` }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:size*.22, fontWeight:800, color }}>{pct}%</span>
        {label && <span style={{ fontSize:size*.1, color:MUTED, textAlign:"center", lineHeight:1.2 }}>{label}</span>}
      </div>
    </div>
  );
}

// ── Mini Bar Chart ────────────────────────────────────────────────────────────
function BarChart({ data, days, color=A, height=56 }:{ data:number[]; days:string[]; color?:string; height?:number }) {
  const max=Math.max(...data); const ref=useRef(null); const inView=useInView(ref,{once:true});
  const [hov, setHov] = useState<number|null>(null);
  return (
    <div ref={ref} style={{ display:"flex", alignItems:"flex-end", gap:4, height:height+20 }}>
      {data.map((v,i)=>(
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}
          onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
          <AnimatePresence>
            {hov===i && (
              <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                style={{ fontSize:9, fontWeight:700, color, background:SURFACE2, padding:"1px 5px", borderRadius:5, whiteSpace:"nowrap", marginBottom:2 }}>
                {v}
              </motion.div>
            )}
          </AnimatePresence>
          <div style={{ width:"100%", position:"relative", height, display:"flex", alignItems:"flex-end" }}>
            <motion.div initial={{ height:0 }} animate={inView?{ height:`${(v/max)*100}%` }:{}}
              transition={{ duration:0.6, delay:i*0.07, ease:"easeOut" }}
              style={{ width:"100%", borderRadius:4, background:hov===i?color:`${color}55`, minHeight:4, transition:"background .2s" }} />
          </div>
          <span style={{ fontSize:8, color:MUTED }}>{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Floating Blobs ────────────────────────────────────────────────────────────
function FloatingBlobs() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {[
        { w:500, h:500, bg:"rgba(108,92,231,.07)", top:"-10%", left:"-8%" },
        { w:400, h:400, bg:"rgba(192,57,43,.04)",  top:"55%",  right:"-8%" },
        { w:300, h:300, bg:"rgba(232,67,147,.04)", bottom:"5%",left:"30%" },
      ].map((b,i)=>(
        <motion.div key={i} animate={{ scale:[1,1.1,1], x:[0,18,0], y:[0,-14,0] }}
          transition={{ duration:9+i*2, repeat:Infinity, ease:"easeInOut" }}
          style={{ position:"absolute", width:b.w, height:b.h, borderRadius:"50%", background:b.bg, filter:"blur(60px)", ...b }} />
      ))}
      {/* noise */}
      <div style={{ position:"absolute", inset:0, opacity:0.025, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive }:{ active:string; setActive:(s:string)=>void }) {
  return (
    <div style={{ width:200, position:"sticky", top:0, height:"100vh", display:"flex", flexDirection:"column", padding:"1.4rem 0.8rem", gap:3, background:"rgba(255,255,255,.5)", backdropFilter:"blur(16px)", borderRight:`1px solid ${BORDER}`, flexShrink:0 }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:A, marginBottom:20, paddingLeft:8 }}>
        splitt<span style={{ color:A2 }}>.</span>
        <div style={{ fontSize:9, color:MUTED, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>Admin Panel</div>
      </div>
      {SIDEBAR_ITEMS.map(item=>{
        const isActive = active===item.id;
        return (
          <motion.div key={item.id} onClick={()=>setActive(item.id)}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:12, cursor:"pointer", position:"relative",
              borderLeft: isActive ? `3px solid ${A}` : "3px solid transparent",
              background: isActive ? "rgba(108,92,231,.1)" : "transparent", color: isActive ? A : TEXT, fontWeight: isActive?600:400, fontSize:13 }}
            whileHover={{ background:"rgba(108,92,231,.07)", x:2 }} whileTap={{ scale:0.97 }} transition={{ duration:0.14 }}>
            {isActive && <motion.div layoutId="sidebar-glow" style={{ position:"absolute", inset:0, borderRadius:12, background:"rgba(108,92,231,.08)", zIndex:0 }} transition={{ type:"spring", stiffness:400, damping:30 }} />}
            <span style={{ fontSize:16, position:"relative", zIndex:1 }}>{item.icon}</span>
            <span style={{ position:"relative", zIndex:1 }}>{item.label}</span>
            {item.id==="flagged" && (
              <motion.span animate={{ scale:[1,1.15,1] }} transition={{ duration:1.5, repeat:Infinity }}
                style={{ marginLeft:"auto", fontSize:9, fontWeight:700, background:redBg, color:red, padding:"1px 6px", borderRadius:999, position:"relative", zIndex:1 }}>8</motion.span>
            )}
          </motion.div>
        );
      })}

      {/* FAB */}
      <motion.button style={{ marginTop:"auto", padding:"11px", borderRadius:12, background:gradBg, border:"none", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(108,92,231,.3)", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
        whileHover={{ scale:1.04, boxShadow:"0 8px 24px rgba(108,92,231,.45)", background:"linear-gradient(135deg,#7d6ef0,#f04aa0)" }}
        whileTap={{ scale:0.96 }}>
        <motion.span whileHover={{ rotate:90 }} transition={{ duration:0.2 }} style={{ fontSize:16 }}>+</motion.span>
        New rule
      </motion.button>

      {/* online status */}
      <div style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 12px", borderRadius:10, background:SURFACE2, marginTop:8 }}>
        <motion.div animate={{ scale:[1,1.3,1], opacity:[1,0.6,1] }} transition={{ duration:1.5, repeat:Infinity }}
          style={{ width:8, height:8, borderRadius:"50%", background:green, flexShrink:0 }} />
        <div>
          <div style={{ fontSize:11, fontWeight:600, color:TEXT }}>@mod_admin</div>
          <div style={{ fontSize:9, color:green, fontWeight:600 }}>Online · Active now</div>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ val, label, icon, color, bg, suffix="", delay=0 }:{ val:number; label:string; icon:string; color:string; bg:string; suffix?:string; delay?:number }) {
  const ref=useRef(null); const inView=useInView(ref,{once:true});
  return (
    <motion.div ref={ref} initial={{ opacity:0, y:16 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.35, delay }}>
      <motion.div style={{ ...glass(), borderRadius:16, padding:"1rem 1.1rem", position:"relative", overflow:"hidden" }}
        whileHover={{ y:-4, boxShadow:`0 14px 36px ${color}22` }} transition={{ duration:0.22 }}>
        <motion.div animate={{ opacity:[0.08,0.16,0.08] }} transition={{ duration:3, repeat:Infinity }}
          style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at top right,${bg},transparent 65%)`, pointerEvents:"none" }} />
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <motion.div whileHover={{ scale:1.2, rotate:-8 }} style={{ width:40, height:40, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{icon}</motion.div>
          <motion.div animate={{ opacity:[1,0.5,1] }} transition={{ duration:2, repeat:Infinity }}
            style={{ fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:999, background:bg, color, textTransform:"uppercase", letterSpacing:"0.05em" }}>Live</motion.div>
        </div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color, marginBottom:2 }}>
          <AnimCounter to={val} suffix={suffix} />
        </div>
        <div style={{ fontSize:11, color:MUTED, fontWeight:500 }}>{label}</div>
      </motion.div>
    </motion.div>
  );
}

// ── Live Feed ─────────────────────────────────────────────────────────────────
function LiveFeed() {
  const [items, setItems] = useState(LIVE_FEED);
  useEffect(()=>{
    const t = setInterval(()=>{
      setItems(prev=>{
        const newItem = { icon:"🚩", text:`New report on post #${Math.floor(Math.random()*100)+1}`, time:"just now", color:red };
        return [newItem,...prev.slice(0,7)];
      });
    }, 8000);
    return ()=>clearInterval(t);
  },[]);
  return (
    <div style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800 }}>⚡ Live activity</div>
        <motion.div animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.2, repeat:Infinity }}
          style={{ width:7, height:7, borderRadius:"50%", background:green }} />
        <span style={{ fontSize:10, color:green, fontWeight:600 }}>Real-time</span>
      </div>
      <div style={{ maxHeight:280, overflowY:"auto" }}>
        <AnimatePresence>
          {items.map((item,i)=>(
            <motion.div key={`${item.text}-${i}`}
              initial={{ opacity:0, x:-14, height:0 }} animate={{ opacity:1, x:0, height:"auto" }} exit={{ opacity:0, height:0 }}
              transition={{ duration:0.3 }}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:i<items.length-1?`1px solid ${BORDER}`:"none" }}>
              <motion.span whileHover={{ scale:1.3 }} style={{ fontSize:14, flexShrink:0 }}>{item.icon}</motion.span>
              <span style={{ fontSize:11, color:TEXT, flex:1, lineHeight:1.4 }}>{item.text}</span>
              <span style={{ fontSize:9, color:MUTED, flexShrink:0 }}>{item.time}</span>
              <div style={{ width:5, height:5, borderRadius:"50%", background:item.color, flexShrink:0 }} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Flagged Card ──────────────────────────────────────────────────────────────
function FlagCard({ post, index, onAction }:{ post:FlaggedPost; index:number; onAction:(id:number,a:string)=>void }) {
  const ref=useRef(null); const inView=useInView(ref,{once:true,margin:"-20px"});
  const [expanded, setExpanded] = useState(false);
  const [hov, setHov] = useState(false);
  const isPending = post.status==="pending";
  const sc = { high:red, medium:amber, low:green }[post.severity];

  return (
    <motion.div ref={ref} initial={{ opacity:0, x:-20 }} animate={inView?{opacity:1,x:0}:{}}
      transition={{ duration:0.35, delay:index*0.05 }} layout>
      <motion.div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        animate={{ y:hov?-3:0, boxShadow:hov?"0 12px 36px rgba(108,92,231,.14)":glass().boxShadow }}
        transition={{ duration:0.2 }}
        style={{ ...glass(), borderRadius:16, marginBottom:8, overflow:"hidden", borderLeft:`3px solid ${sc}`, opacity:!isPending?.78:1 }}>
        {post.severity==="high" && isPending && (
          <motion.div animate={{ opacity:[0.06,0.14,0.06] }} transition={{ duration:2, repeat:Infinity }}
            style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at left,${redBg},transparent 60%)`, pointerEvents:"none" }} />
        )}
        <div style={{ padding:"0.9rem 1.1rem", cursor:"pointer" }} onClick={()=>setExpanded(e=>!e)}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:7 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap", marginBottom:5 }}>
                <span style={{ fontSize:10, fontWeight:700, padding:"1px 8px", borderRadius:999, background:{ high:redBg, medium:amberBg, low:greenBg }[post.severity], color:sc }}>
                  {post.severity==="high"?"🚨 High":post.severity==="medium"?"⚠️ Medium":"🟡 Low"}
                </span>
                <span style={{ fontSize:10, fontWeight:700, padding:"1px 8px", borderRadius:999,
                  background:{ pending:amberBg, approved:greenBg, removed:redBg, warned:"rgba(232,67,147,.1)" }[post.status],
                  color:{ pending:amber, approved:green, removed:red, warned:A2 }[post.status], textTransform:"capitalize" }}>{post.status}</span>
                <span style={{ fontSize:10, background:"rgba(108,92,231,.1)", color:A, padding:"1px 7px", borderRadius:999, fontWeight:700 }}>{post.type}</span>
                <span style={{ fontSize:10, color:MUTED, marginLeft:"auto" }}>{post.time}</span>
              </div>
              <p style={{ fontSize:13, lineHeight:1.6, color:!isPending?MUTED:TEXT, marginBottom:5 }}>{post.text}</p>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, color:MUTED }}>{post.user}</span>
                <motion.span animate={post.reports>=7?{ scale:[1,1.05,1] }:{}} transition={{ duration:1.5, repeat:Infinity }}
                  style={{ fontSize:11, fontWeight:700, color:red }}>🚩 {post.reports} reports</motion.span>
                <span style={{ fontSize:11, color:MUTED }}>Reason: <span style={{ fontWeight:600, color:TEXT }}>{post.reason}</span></span>
              </div>
            </div>
            <motion.div animate={{ rotate:expanded?180:0 }} style={{ fontSize:12, color:MUTED, flexShrink:0, marginTop:2 }}>▼</motion.div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
              transition={{ duration:0.25 }} style={{ overflow:"hidden" }}>
              <div style={{ padding:"0.8rem 1.1rem 1rem", borderTop:`1px solid ${BORDER}`, background:"rgba(255,255,255,.35)" }}>
                <div style={{ fontSize:10, fontWeight:700, color:MUTED, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Moderation actions</div>
                <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:10 }}>
                  {isPending && (<>
                    <motion.button onClick={()=>onAction(post.id,"approved")}
                      style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${green}44`, background:greenBg, color:green, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}
                      whileHover={{ background:"rgba(29,158,117,.2)", boxShadow:`0 0 0 2px ${green}33` }} whileTap={{ scale:0.94 }}>✅ Approve</motion.button>
                    <motion.button onClick={()=>onAction(post.id,"warned")}
                      style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${amber}44`, background:amberBg, color:amber, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}
                      whileHover={{ background:"rgba(239,159,39,.2)" }} whileTap={{ scale:0.94 }}>⚠️ Warn user</motion.button>
                    <motion.button onClick={()=>onAction(post.id,"removed")}
                      style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${red}44`, background:redBg, color:red, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}
                      whileHover={{ background:"rgba(192,57,43,.2)", boxShadow:`0 0 0 2px ${red}33` }} whileTap={{ scale:0.94 }}>🗑️ Remove</motion.button>
                    <motion.button style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:"transparent", color:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                      whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.94 }}>🔺 Escalate</motion.button>
                  </>)}
                  {!isPending && <div style={{ fontSize:12, color:MUTED }}>This post has been <b>{post.status}</b>.</div>}
                </div>
                <div style={{ padding:"8px 12px", borderRadius:10, background:SURFACE2, border:`1px solid ${BORDER}`, fontSize:11, color:MUTED }}>
                  🤖 <b>Auto-mod score:</b> {post.severity==="high"?"94/100 — High risk":post.severity==="medium"?"67/100 — Moderate risk":"31/100 — Low risk"}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ── Loading Skeleton ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ ...glass(), borderRadius:16, padding:"1rem 1.2rem", marginBottom:8 }}>
      {[80,60,40].map((w,i)=>(
        <motion.div key={i} animate={{ opacity:[0.4,0.7,0.4] }} transition={{ duration:1.5, repeat:Infinity, delay:i*0.15 }}
          style={{ height:12, borderRadius:999, background:SURFACE2, width:`${w}%`, marginBottom:i<2?8:0 }} />
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ModerationPage() {
  const [posts, setPosts]     = useState<FlaggedPost[]>(FLAGGED);
  const [sideTab, setSideTab] = useState("overview");
  const [filter, setFilter]   = useState("All");
  const [search, setSearch]   = useState("");
  const [sortBy, setSortBy]   = useState("Reports");
  const [loading, setLoading] = useState(false);

  const handleAction = (id:number, action:string) => {
    setPosts(prev=>prev.map(p=>p.id===id?{...p,status:action as any}:p));
  };

  const pending = posts.filter(p=>p.status==="pending").length;
  const highSev = posts.filter(p=>p.severity==="high"&&p.status==="pending").length;

  const filtered = posts
    .filter(p=> filter==="All"?true:filter==="High"?p.severity==="high":filter==="Medium"?p.severity==="medium":filter==="Low"?p.severity==="low":filter==="Approved"?p.status==="approved":filter==="Removed"?p.status==="removed":true)
    .filter(p=> search?p.text.toLowerCase().includes(search.toLowerCase())||p.user.toLowerCase().includes(search.toLowerCase()):true)
    .sort((a,b)=> sortBy==="Reports"?b.reports-a.reports:sortBy==="Severity"?["high","medium","low"].indexOf(a.severity)-["high","medium","low"].indexOf(b.severity):0);

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif", color:TEXT }}>
      <FloatingBlobs />

      {/* top navbar */}
      <motion.nav initial={{ y:-60 }} animate={{ y:0 }} transition={{ duration:0.4, ease:"easeOut" }}
        style={{ position:"sticky", top:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.75rem 1.5rem", background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${BORDER}`, boxShadow:"0 1px 20px rgba(108,92,231,.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <a href="/feed" style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:A, textDecoration:"none" }}>splitt<span style={{ color:A2 }}>.</span></a>
          <div style={{ width:1, height:20, background:BORDER }} />
          <span style={{ fontSize:12, fontWeight:600, color:MUTED }}>Moderation Dashboard</span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {highSev>0 && (
            <motion.div animate={{ scale:[1,1.04,1] }} transition={{ duration:1.5, repeat:Infinity }}
              style={{ display:"flex", alignItems:"center", gap:5, background:redBg, border:`1px solid ${red}33`, padding:"5px 12px", borderRadius:999 }}>
              <motion.div animate={{ opacity:[1,0.4,1] }} transition={{ duration:1, repeat:Infinity }}
                style={{ width:7, height:7, borderRadius:"50%", background:red }} />
              <span style={{ fontSize:11, color:red, fontWeight:700 }}>🚨 {highSev} urgent</span>
            </motion.div>
          )}
          <motion.a href="/feed" style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${BORDER}`, color:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", textDecoration:"none" }}
            whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.97 }}>← Feed</motion.a>
        </div>
      </motion.nav>

      <div style={{ display:"flex", position:"relative", zIndex:1 }}>
        <Sidebar active={sideTab} setActive={setSideTab} />

        {/* main content */}
        <motion.main initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4, ease:"easeOut" }}
          style={{ flex:1, padding:"1.8rem 1.5rem 4rem", overflowX:"hidden" }}>

          {/* page title */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:A, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>Admin · Overview</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, letterSpacing:"-0.03em" }}>Moderation Dashboard</h1>
              <div style={{ display:"flex", gap:8 }}>
                <motion.button style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:SURFACE, color:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                  whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.97 }}>📄 Export</motion.button>
                <motion.button style={{ padding:"7px 14px", borderRadius:10, background:gradBg, border:"none", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(108,92,231,.3)" }}
                  whileHover={{ y:-1, boxShadow:"0 8px 22px rgba(108,92,231,.4)" }} whileTap={{ scale:0.97 }}>⚙️ Settings</motion.button>
              </div>
            </div>
          </div>

          {/* stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
            <StatCard val={pending} label="Pending review"  icon="⏳" color={amber} bg={amberBg} delay={0}    />
            <StatCard val={highSev} label="High severity"   icon="🚨" color={red}   bg={redBg}   delay={0.07} />
            <StatCard val={142}     label="Resolved today"  icon="✅" color={green} bg={greenBg} delay={0.14} />
            <StatCard val={94}      label="Auto-caught"     icon="🤖" color={A}     bg="rgba(108,92,231,.1)" suffix="%" delay={0.21} />
          </div>

          {/* charts row */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20 }}>
            {/* reports chart */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, marginBottom:3 }}>📊 Reports / day</div>
              <div style={{ fontSize:10, color:MUTED, marginBottom:10 }}>101 total this week</div>
              <BarChart data={WEEKLY_DATA} days={DAYS} color={red} height={50} />
            </motion.div>

            {/* engagement chart */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, marginBottom:3 }}>📈 Engagement %</div>
              <div style={{ fontSize:10, color:MUTED, marginBottom:10 }}>Avg 75% this week</div>
              <BarChart data={ENGAGEMENT} days={DAYS} color={A} height={50} />
            </motion.div>

            {/* progress rings */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, marginBottom:10 }}>🎯 Pipeline health</div>
              <div style={{ display:"flex", justifyContent:"space-around", alignItems:"center" }}>
                <ProgressRing pct={94} size={68} stroke={6} color={green} label="Auto" />
                <ProgressRing pct={78} size={68} stroke={6} color={A}     label="Acc" />
                <ProgressRing pct={31} size={68} stroke={6} color={amber} label="Queue" />
              </div>
            </motion.div>
          </div>

          {/* main grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:"1.4rem" }}>

            {/* flagged posts */}
            <div>
              {/* filters */}
              <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
                {["All","High","Medium","Low","Approved","Removed"].map(t=>(
                  <motion.button key={t} onClick={()=>setFilter(t)}
                    style={{ padding:"5px 12px", borderRadius:9, border:`1.5px solid ${filter===t?A:BORDER}`, background:filter===t?"rgba(108,92,231,.09)":SURFACE, color:filter===t?A:MUTED, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                    whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.94 }}>
                    {t}{t==="All"?` (${pending})`:""}
                  </motion.button>
                ))}
              </div>

              {/* search + sort */}
              <div style={{ display:"flex", gap:7, marginBottom:12 }}>
                <div style={{ position:"relative", flex:1 }}>
                  <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:12, color:MUTED }}>🔍</span>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search flagged content..."
                    style={{ width:"100%", padding:"8px 10px 8px 30px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:SURFACE, fontSize:12, color:TEXT, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
                    onFocus={e=>e.target.style.borderColor=A} onBlur={e=>e.target.style.borderColor=BORDER} />
                </div>
                {["Reports","Severity","Newest"].map(s=>(
                  <motion.button key={s} onClick={()=>setSortBy(s)}
                    style={{ padding:"8px 11px", borderRadius:10, border:`1.5px solid ${sortBy===s?A:BORDER}`, background:sortBy===s?"rgba(108,92,231,.08)":SURFACE, color:sortBy===s?A:MUTED, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                    whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.94 }}>
                    {s}
                  </motion.button>
                ))}
              </div>

              <div style={{ fontSize:10, fontWeight:700, color:MUTED, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8, display:"flex", alignItems:"center", gap:8 }}>
                Flagged content — {filtered.length} items
                <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${BORDER},transparent)` }} />
              </div>

              <AnimatePresence mode="popLayout">
                {filtered.map((p,i)=><FlagCard key={p.id} post={p} index={i} onAction={handleAction} />)}
              </AnimatePresence>

              {filtered.length===0 && (
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ textAlign:"center", padding:"3rem", color:MUTED }}>
                  <motion.div animate={{ scale:[1,1.1,1], rotate:[0,5,-5,0] }} transition={{ duration:2, repeat:Infinity, repeatDelay:2 }}
                    style={{ fontSize:40, marginBottom:10 }}>✅</motion.div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, marginBottom:4 }}>All clear!</div>
                  <div style={{ fontSize:12 }}>No flagged content in this category.</div>
                </motion.div>
              )}
            </div>

            {/* right sticky widgets */}
            <div style={{ position:"sticky", top:72, display:"flex", flexDirection:"column", gap:12, alignSelf:"start" }}>

              {/* live feed */}
              <LiveFeed />

              {/* auto-mod pipeline */}
              <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }}
                style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, marginBottom:10 }}>🤖 Auto-mod stats</div>
                {[{ l:"Posts scanned",val:"1,284",c:A },{ l:"Auto-removed",val:"94",c:red },{ l:"Sent for review",val:"23",c:amber },{ l:"False positive",val:"6%",c:green }].map((s,i)=>(
                  <div key={s.l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:i<3?`1px solid ${BORDER}`:"none" }}>
                    <span style={{ fontSize:11, color:TEXT }}>{s.l}</span>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:s.c }}>{s.val}</span>
                  </div>
                ))}
              </motion.div>

              {/* top reporters */}
              <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25 }}
                style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, marginBottom:10 }}>🏅 Top reporters</div>
                {[{ u:"@community_guard",r:34,a:"91%" },{ u:"@safety_first",r:28,a:"87%" },{ u:"@anon_watch",r:19,a:"79%" }].map((r,i)=>(
                  <motion.div key={r.u} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:i<2?`1px solid ${BORDER}`:"none", cursor:"pointer" }}
                    whileHover={{ x:3 }} transition={{ duration:0.13 }}>
                    <div style={{ width:26, height:26, borderRadius:"50%", background:"rgba(108,92,231,.12)", color:A, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>#{i+1}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, fontWeight:600, color:TEXT }}>{r.u}</div>
                      <div style={{ fontSize:9, color:MUTED }}>{r.r} reports · {r.a} acc</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* quick actions */}
              <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}
                style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, marginBottom:10 }}>⚡ Quick actions</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {[{ l:"Export report",icon:"📄",c:A },{ l:"Adjust rules",icon:"⚙️",c:amber },{ l:"Banned accounts",icon:"🚫",c:red },{ l:"Guidelines",icon:"📋",c:green }].map(a=>(
                    <motion.button key={a.l}
                      style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 10px", borderRadius:9, border:`1.5px solid ${BORDER}`, background:"transparent", color:TEXT, fontSize:11, fontWeight:500, cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}
                      whileHover={{ borderColor:a.c, color:a.c, background:`${a.c}08`, x:2 }} whileTap={{ scale:0.96 }}>
                      <motion.span whileHover={{ scale:1.2 }} style={{ fontSize:14 }}>{a.icon}</motion.span> {a.l}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
"use client";
import { useState, useRef } from "react";
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

// ── Notification types ────────────────────────────────────────────────────────
type Notif = {
  id: number; type: string; read: boolean; time: string;
  title: string; body: string; icon: string; color: string; bg: string;
  action?: string; rep?: number;
};

const ALL_NOTIFS: Notif[] = [
  { id:1,  type:"outcome",    read:false, time:"2m ago",   icon:"✅", color:"#0f6e56", bg:"rgba(29,158,117,.1)",   title:"Prediction correct!",          body:"Your prediction 'Will AI replace devs by 2027?' is leading with 68% of votes.", action:"View prediction", rep:12 },
  { id:2,  type:"rep",        read:false, time:"5m ago",   icon:"⚡", color:A,         bg:"rgba(108,92,231,.1)",   title:"+20 rep earned",               body:"Your post went trending! Bonus reputation awarded for viral content.", action:"View post", rep:20 },
  { id:3,  type:"comment",    read:false, time:"12m ago",  icon:"💬", color:A2,        bg:"rgba(232,67,147,.1)",   title:"@tech_oracle replied to you",  body:"'Partially agree. AI won't replace devs but devs who use AI will replace those who don't.'", action:"View thread" },
  { id:4,  type:"vote",       read:false, time:"24m ago",  icon:"🗳️", color:"#854f0b", bg:"rgba(239,159,39,.1)",   title:"1,000 votes milestone!",       body:"Your prediction just hit 1,000 votes. It's now one of the top posts this week.", action:"See results" },
  { id:5,  type:"streak",     read:false, time:"1h ago",   icon:"🔥", color:"#e67e22", bg:"rgba(230,126,34,.1)",   title:"7-day streak! Keep it up 🔥",  body:"You've posted 7 days in a row. Your streak bonus is now active — +5 rep per post.", rep:5 },
  { id:6,  type:"badge",      read:true,  time:"2h ago",   icon:"🏆", color:"#f59e0b", bg:"rgba(245,158,11,.1)",   title:"New badge unlocked!",          body:"You earned the 'Oracle' badge for reaching 4,000 rep. Your predictions carry more weight now.", action:"View profile" },
  { id:7,  type:"comment",    read:true,  time:"3h ago",   icon:"💬", color:A2,        bg:"rgba(232,67,147,.1)",   title:"@ghost_writer liked your comment", body:"Your comment on 'My startup is about to run out of runway' got 42 likes." },
  { id:8,  type:"outcome",    read:true,  time:"5h ago",   icon:"❌", color:A2,        bg:"rgba(232,67,147,.08)",  title:"Prediction outcome revealed",  body:"'Twitter/X shutting down before 2026?' was marked incorrect. −4 rep deducted.", rep:-4, action:"View results" },
  { id:9,  type:"rep",        read:true,  time:"8h ago",   icon:"⚡", color:A,         bg:"rgba(108,92,231,.1)",   title:"+12 rep for correct prediction",body:"Your prediction about crypto markets was confirmed correct. Great call!", rep:12 },
  { id:10, type:"rank",       read:true,  time:"1d ago",   icon:"📈", color:"#0f6e56", bg:"rgba(29,158,117,.1)",   title:"Rank up! You're now #4",       body:"You've climbed 2 spots on the leaderboard this week. Keep predicting!", action:"View leaderboard" },
  { id:11, type:"vote",       read:true,  time:"1d ago",   icon:"🗳️", color:"#854f0b", bg:"rgba(239,159,39,.1)",   title:"Your confession is trending",  body:"'I've been faking seniority at work' has 670 reactions and is trending in #WorkLife." },
  { id:12, type:"badge",      read:true,  time:"2d ago",   icon:"🏆", color:"#f59e0b", bg:"rgba(245,158,11,.1)",   title:"'Viral Predictor' badge earned!",body:"One of your posts got 10,000+ votes. You're officially a Viral Predictor.", action:"View profile" },
  { id:13, type:"streak",     read:true,  time:"3d ago",   icon:"🔥", color:"#e67e22", bg:"rgba(230,126,34,.1)",   title:"Streak broken 😔",             body:"Your 5-day streak ended. Start a new one today to earn your bonus rep.", action:"Post now" },
  { id:14, type:"comment",    read:true,  time:"3d ago",   icon:"💬", color:A2,        bg:"rgba(232,67,147,.1)",   title:"84 comments on your prediction",body:"Your AI prediction post has 84 comments and is sparking debate across the platform." },
  { id:15, type:"rank",       read:true,  time:"1w ago",   icon:"📈", color:"#0f6e56", bg:"rgba(29,158,117,.1)",   title:"Season 2 final rank: #6",      body:"You finished Season 2 at rank #6. Season 3 has started — climb higher!" },
];

const FILTER_TABS = [
  { label:"All",       icon:"🔔", count: ALL_NOTIFS.filter(n=>!n.read).length },
  { label:"Outcomes",  icon:"✅", count: ALL_NOTIFS.filter(n=>n.type==="outcome"&&!n.read).length },
  { label:"Rep",       icon:"⚡", count: ALL_NOTIFS.filter(n=>n.type==="rep"&&!n.read).length },
  { label:"Comments",  icon:"💬", count: ALL_NOTIFS.filter(n=>n.type==="comment"&&!n.read).length },
  { label:"Streaks",   icon:"🔥", count: 0 },
  { label:"Badges",    icon:"🏆", count: 0 },
  { label:"Ranks",     icon:"📈", count: 0 },
];

const QUICK_STATS = [
  { val:"+44", label:"Rep this week",    color:"#0f6e56", icon:"⚡" },
  { val:"73%", label:"Accuracy rate",   color:A,         icon:"🎯" },
  { val:"7d",  label:"Current streak",  color:"#e67e22", icon:"🔥" },
  { val:"#4",  label:"Global rank",     color:A2,        icon:"🏆" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function FloatingBlobs() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {[
        { w:500, h:500, bg:"rgba(108,92,231,.06)", top:"-10%", left:"-8%"  },
        { w:400, h:400, bg:"rgba(232,67,147,.05)", top:"55%",  right:"-8%" },
      ].map((b,i)=>(
        <motion.div key={i} animate={{ scale:[1,1.1,1], x:[0,16,0], y:[0,-12,0] }}
          transition={{ duration:9+i*2, repeat:Infinity, ease:"easeInOut" }}
          style={{ position:"absolute", width:b.w, height:b.h, borderRadius:"50%", background:b.bg, filter:"blur(60px)", ...b }} />
      ))}
    </div>
  );
}

function Navbar({ unread }:{ unread:number }) {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.85rem 2rem", background:"rgba(255,255,255,0.82)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${BORDER}`, boxShadow:"0 1px 20px rgba(108,92,231,.06)" }}>
      <a href="/feed" style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:A, letterSpacing:"-0.04em", textDecoration:"none" }}>splitt<span style={{ color:A2 }}>.</span></a>
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        {unread>0 && (
          <motion.div animate={{ scale:[1,1.08,1] }} transition={{ duration:1.5, repeat:Infinity }}
            style={{ fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:999, background:"rgba(232,67,147,.1)", color:A2, border:"1px solid rgba(232,67,147,.2)" }}>
            {unread} unread
          </motion.div>
        )}
        <motion.a href="/feed" style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${BORDER}`, color:MUTED, fontSize:13, fontWeight:600, cursor:"pointer", textDecoration:"none" }}
          whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.97 }}>← Feed</motion.a>
      </div>
    </nav>
  );
}

// ── Notification Card ─────────────────────────────────────────────────────────
function NotifCard({ n, index, onRead, onDismiss }:{ n:Notif; index:number; onRead:(id:number)=>void; onDismiss:(id:number)=>void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-20px" });
  const [hov, setHov] = useState(false);

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, x:-20, scale:0.97 }}
      animate={inView?{ opacity:1, x:0, scale:1 }:{}}
      exit={{ opacity:0, x:60, scale:0.95 }}
      transition={{ duration:0.35, delay:index*0.04, ease:"easeOut" }}
      layout>
      <motion.div
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        animate={{ y:hov?-3:0, boxShadow:hov?"0 10px 32px rgba(108,92,231,.14)":glass().boxShadow }}
        transition={{ duration:0.2 }}
        style={{ ...glass(), borderRadius:16, padding:"1rem 1.2rem", marginBottom:8, display:"flex", gap:12, alignItems:"flex-start", position:"relative", overflow:"hidden",
          borderLeft: !n.read ? `3px solid ${n.color}` : "1.5px solid rgba(255,255,255,.92)",
          opacity: n.read ? 0.8 : 1 }}>

        {/* unread glow bg */}
        {!n.read && (
          <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at left, ${n.bg}, transparent 60%)`, pointerEvents:"none", borderRadius:16 }} />
        )}

        {/* icon */}
        <motion.div whileHover={{ scale:1.15, rotate:-5 }} transition={{ duration:0.2 }}
          style={{ width:42, height:42, borderRadius:12, background:n.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, position:"relative", zIndex:1, border:`1px solid ${n.color}22` }}>
          {n.icon}
          {!n.read && (
            <motion.div animate={{ scale:[1,1.3,1], opacity:[1,0.5,1] }} transition={{ duration:1.5, repeat:Infinity }}
              style={{ position:"absolute", top:-3, right:-3, width:10, height:10, borderRadius:"50%", background:n.color, border:`2px solid ${SURFACE}` }} />
          )}
        </motion.div>

        {/* content */}
        <div style={{ flex:1, minWidth:0, position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:3 }}>
            <div style={{ fontSize:13, fontWeight: n.read ? 500 : 700, color:TEXT, lineHeight:1.3 }}>{n.title}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
              {n.rep && (
                <span style={{ fontSize:11, fontWeight:700, padding:"1px 8px", borderRadius:999,
                  background: n.rep>0 ? "rgba(29,158,117,.1)" : "rgba(232,67,147,.1)",
                  color: n.rep>0 ? "#0f6e56" : A2 }}>
                  {n.rep>0?"+":""}{n.rep} rep
                </span>
              )}
              <span style={{ fontSize:10, color:MUTED, whiteSpace:"nowrap" }}>{n.time}</span>
            </div>
          </div>

          <p style={{ fontSize:12, color:MUTED, lineHeight:1.6, marginBottom:n.action?8:0 }}>{n.body}</p>

          {n.action && (
            <motion.button onClick={()=>onRead(n.id)}
              style={{ fontSize:11, fontWeight:700, color:n.color, padding:"4px 12px", borderRadius:8, border:`1.5px solid ${n.color}33`, background:`${n.bg}`, cursor:"pointer", fontFamily:"inherit" }}
              whileHover={{ background:`${n.color}22`, borderColor:n.color }} whileTap={{ scale:0.95 }}>
              {n.action} →
            </motion.button>
          )}
        </div>

        {/* dismiss */}
        <AnimatePresence>
          {hov && (
            <motion.button initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.8 }}
              onClick={()=>onDismiss(n.id)}
              style={{ position:"absolute", top:10, right:10, width:24, height:24, borderRadius:8, border:`1px solid ${BORDER}`, background:SURFACE, color:MUTED, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2 }}
              whileHover={{ background:"rgba(232,67,147,.08)", color:A2, borderColor:A2 }} whileTap={{ scale:0.9 }}>
              ×
            </motion.button>
          )}
        </AnimatePresence>

        {/* read/unread indicator */}
        {!n.read && (
          <motion.div onClick={()=>onRead(n.id)}
            style={{ width:8, height:8, borderRadius:"50%", background:n.color, flexShrink:0, marginTop:6, cursor:"pointer", position:"relative", zIndex:1 }}
            animate={{ opacity:[1,0.5,1] }} transition={{ duration:1.8, repeat:Infinity }}
            title="Mark as read" />
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ textAlign:"center", padding:"4rem 2rem" }}>
      <motion.div animate={{ rotate:[0,10,-10,0], scale:[1,1.1,1] }} transition={{ duration:2, repeat:Infinity, repeatDelay:3 }}
        style={{ fontSize:52, marginBottom:16 }}>🔔</motion.div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, marginBottom:6 }}>All caught up!</div>
      <div style={{ fontSize:13, color:MUTED }}>No notifications in this category yet.</div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [notifs, setNotifs]   = useState<Notif[]>(ALL_NOTIFS);
  const [filter, setFilter]   = useState("All");
  const [showRead, setShowRead] = useState(true);

  const unread = notifs.filter(n=>!n.read).length;

  const markRead = (id:number) => setNotifs(prev=>prev.map(n=>n.id===id?{...n,read:true}:n));
  const dismiss  = (id:number) => setNotifs(prev=>prev.filter(n=>n.id!==id));
  const markAllRead = () => setNotifs(prev=>prev.map(n=>({...n,read:true})));
  const clearAll    = () => setNotifs(prev=>prev.filter(n=>!n.read));

  const filtered = notifs.filter(n=>{
    const matchTab = filter==="All" || n.type===filter.toLowerCase().slice(0,-1) || (filter==="Comments"&&n.type==="comment") || (filter==="Outcomes"&&n.type==="outcome") || (filter==="Ranks"&&n.type==="rank") || (filter==="Badges"&&n.type==="badge") || (filter==="Streaks"&&n.type==="streak") || (filter==="Rep"&&n.type==="rep");
    const matchRead = showRead ? true : !n.read;
    return matchTab && matchRead;
  });

  const grouped = {
    new:    filtered.filter(n=>!n.read),
    earlier: filtered.filter(n=>n.read),
  };

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif", color:TEXT }}>
      <FloatingBlobs />
      <div style={{ position:"relative", zIndex:1 }}>
        <Navbar unread={unread} />

        <div style={{ maxWidth:980, margin:"0 auto", padding:"1.8rem 1.5rem 4rem", display:"grid", gridTemplateColumns:"1fr 270px", gap:"1.6rem" }}>

          {/* ── LEFT ── */}
          <div>
            {/* header */}
            <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:A, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>Notifications</div>
                  <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, letterSpacing:"-0.03em" }}>
                    What's happening
                    {unread>0 && (
                      <motion.span animate={{ scale:[1,1.12,1] }} transition={{ duration:1.5, repeat:Infinity }}
                        style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:28, height:28, borderRadius:"50%", background:gradBg, color:"#fff", fontSize:12, fontWeight:700, marginLeft:10, verticalAlign:"middle" }}>
                        {unread}
                      </motion.span>
                    )}
                  </h1>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <motion.button onClick={()=>setShowRead(s=>!s)}
                    style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:!showRead?"rgba(108,92,231,.08)":SURFACE, color:!showRead?A:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                    whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.96 }}>
                    {showRead ? "Unread only" : "Show all"}
                  </motion.button>
                  {unread>0 && (
                    <motion.button onClick={markAllRead}
                      style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:SURFACE, color:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                      whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.96 }}>
                      Mark all read
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* filter tabs */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
              {FILTER_TABS.map(t=>(
                <motion.button key={t.label} onClick={()=>setFilter(t.label)}
                  style={{ padding:"6px 13px", borderRadius:10, border:`1.5px solid ${filter===t.label?A:BORDER}`, background:filter===t.label?"rgba(108,92,231,.09)":SURFACE, color:filter===t.label?A:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5, position:"relative" }}
                  whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.95 }}>
                  {t.icon} {t.label}
                  {t.count>0 && (
                    <motion.span animate={{ scale:[1,1.1,1] }} transition={{ duration:1.5, repeat:Infinity }}
                      style={{ fontSize:9, fontWeight:700, background:gradBg, color:"#fff", width:16, height:16, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {t.count}
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* NEW notifications */}
            <AnimatePresence mode="popLayout">
              {grouped.new.length>0 && (
                <motion.div key="new-group" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:TEXT }}>New</div>
                    <motion.div animate={{ opacity:[1,0.4,1] }} transition={{ duration:1.5, repeat:Infinity }}
                      style={{ width:7, height:7, borderRadius:"50%", background:A2 }} />
                    <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${BORDER},transparent)` }} />
                  </div>
                  {grouped.new.map((n,i)=>(
                    <NotifCard key={n.id} n={n} index={i} onRead={markRead} onDismiss={dismiss} />
                  ))}
                </motion.div>
              )}

              {/* EARLIER notifications */}
              {grouped.earlier.length>0 && showRead && (
                <motion.div key="earlier-group" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, margin:"16px 0 10px" }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:MUTED }}>Earlier</div>
                    <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${BORDER},transparent)` }} />
                    <motion.button onClick={clearAll}
                      style={{ fontSize:11, color:MUTED, fontWeight:600, cursor:"pointer", background:"transparent", border:"none", fontFamily:"inherit" }}
                      whileHover={{ color:A2 }}>Clear read</motion.button>
                  </div>
                  {grouped.earlier.map((n,i)=>(
                    <NotifCard key={n.id} n={n} index={i} onRead={markRead} onDismiss={dismiss} />
                  ))}
                </motion.div>
              )}

              {filtered.length===0 && <EmptyState />}
            </AnimatePresence>
          </div>

          {/* ── RIGHT ── */}
          <div style={{ position:"sticky", top:72, display:"flex", flexDirection:"column", gap:12 }}>

            {/* quick stats */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>⚡ Your stats</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {QUICK_STATS.map(s=>(
                  <div key={s.label} style={{ background:SURFACE2, borderRadius:11, padding:"9px 10px", border:`1px solid ${BORDER}` }}>
                    <div style={{ fontSize:16, marginBottom:3 }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:10, color:MUTED }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* rep activity */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>📈 Rep activity</div>
              {[
                { label:"Today",     val:"+32 rep", color:"#0f6e56", bar:80 },
                { label:"Yesterday", val:"+12 rep", color:A,         bar:30 },
                { label:"This week", val:"+44 rep", color:A2,        bar:55 },
              ].map((r,i)=>(
                <div key={r.label} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
                    <span style={{ color:MUTED, fontWeight:500 }}>{r.label}</span>
                    <span style={{ fontWeight:700, color:r.color }}>{r.val}</span>
                  </div>
                  <div style={{ height:5, background:BORDER, borderRadius:999, overflow:"hidden" }}>
                    <motion.div initial={{ width:0 }} animate={{ width:`${r.bar}%` }} transition={{ duration:0.9, delay:0.3+i*0.1 }}
                      style={{ height:"100%", background:r.color, borderRadius:999, opacity:0.8 }} />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* streak tracker */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>🔥 Streak tracker</div>
              <div style={{ display:"flex", gap:4, marginBottom:8 }}>
                {Array.from({length:7}).map((_,i)=>(
                  <motion.div key={i} initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.25+i*0.05, type:"spring" }}>
                    <motion.div animate={i<7?{ boxShadow:["0 0 4px rgba(230,126,34,.3)","0 0 12px rgba(230,126,34,.5)","0 0 4px rgba(230,126,34,.3)"] }:{}}
                      transition={{ duration:2, repeat:Infinity, delay:i*0.2 }}
                      style={{ width:30, height:30, borderRadius:8, background: i<7 ? "linear-gradient(135deg,#f59e0b,#e67e22)" : SURFACE2, border:`1px solid ${BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>
                      {i<7?"🔥":""}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <div style={{ fontSize:12, color:MUTED }}>7 day streak · <span style={{ color:"#e67e22", fontWeight:700 }}>+5 rep bonus active</span></div>
            </motion.div>

            {/* notification settings */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>⚙️ Notification settings</div>
              {[
                { label:"Prediction outcomes", on:true  },
                { label:"Rep changes",          on:true  },
                { label:"Comments & replies",   on:true  },
                { label:"Streak reminders",     on:true  },
                { label:"Badge unlocks",        on:true  },
                { label:"Rank changes",         on:false },
              ].map((s,i,arr)=>{
                const [on, setOn] = useState(s.on);
                return (
                  <div key={s.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:i<arr.length-1?`1px solid ${BORDER}`:"none" }}>
                    <span style={{ fontSize:12, color:TEXT }}>{s.label}</span>
                    <motion.div onClick={()=>setOn(o=>!o)}
                      animate={{ background: on ? A : BORDER }}
                      style={{ width:36, height:20, borderRadius:999, cursor:"pointer", position:"relative", flexShrink:0 }}>
                      <motion.div animate={{ left: on ? 18 : 2 }} transition={{ type:"spring", stiffness:400, damping:25 }}
                        style={{ width:16, height:16, borderRadius:"50%", background:SURFACE, position:"absolute", top:2 }} />
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>

            {/* upcoming */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>⏰ Closing soon</div>
              {[
                { text:"Will AI replace devs?",    closes:"3d left",  votes:"2.7k" },
                { text:"Crypto hitting $150k BTC?", closes:"5d left",  votes:"5.5k" },
                { text:"GPT-5 makes devs obsolete?",closes:"12d left", votes:"1.8k" },
              ].map((p,i)=>(
                <motion.div key={p.text} style={{ padding:"7px 0", borderBottom:i<2?`1px solid ${BORDER}`:"none", cursor:"pointer" }}
                  whileHover={{ x:3 }} transition={{ duration:0.13 }}>
                  <div style={{ fontSize:12, color:TEXT, fontWeight:500, lineHeight:1.4, marginBottom:3 }}>{p.text}</div>
                  <div style={{ display:"flex", gap:8 }}>
                    <span style={{ fontSize:10, color:A2, fontWeight:600 }}>⏰ {p.closes}</span>
                    <span style={{ fontSize:10, color:MUTED }}>🗳️ {p.votes}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
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

const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: "rgba(255,255,255,0.68)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.92)",
  boxShadow: "0 4px 28px rgba(108,92,231,0.09)",
  ...extra,
});

function Navbar({ unread }:{ unread:number }) {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.85rem 2rem", background:"rgba(255,255,255,0.82)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${BORDER}` }}>
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

function NotifCard({ n, onRead, onDismiss }:{ n:any; onRead:(id:string)=>void; onDismiss:(id:string)=>void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-20px" });
  const [hov, setHov] = useState(false);

  return (
    <motion.div ref={ref} initial={{ opacity:0, x:-20 }} animate={inView?{ opacity:1, x:0 }:{}}
      exit={{ opacity:0, x:60 }} transition={{ duration:0.35 }} layout>
      <motion.div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        animate={{ y:hov?-3:0, boxShadow:hov?"0 10px 32px rgba(108,92,231,.14)":glass().boxShadow }}
        transition={{ duration:0.2 }}
        style={{ ...glass(), borderRadius:16, padding:"1rem 1.2rem", marginBottom:8, display:"flex", gap:12, alignItems:"flex-start", position:"relative", overflow:"hidden",
          borderLeft: !n.read ? `3px solid ${n.color||A}` : "1px solid rgba(255,255,255,.92)", opacity: n.read?0.8:1 }}>

        {!n.read && (
          <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at left, ${n.color||A}15, transparent 60%)`, pointerEvents:"none", borderRadius:16 }} />
        )}

        <motion.div whileHover={{ scale:1.15, rotate:-5 }} style={{ width:42, height:42, borderRadius:12, background:`${n.color||A}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, position:"relative", zIndex:1 }}>
          {n.icon||"🔔"}
          {!n.read && (
            <motion.div animate={{ scale:[1,1.3,1], opacity:[1,0.5,1] }} transition={{ duration:1.5, repeat:Infinity }}
              style={{ position:"absolute", top:-3, right:-3, width:10, height:10, borderRadius:"50%", background:n.color||A, border:`2px solid ${SURFACE}` }} />
          )}
        </motion.div>

        <div style={{ flex:1, minWidth:0, position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:3 }}>
            <div style={{ fontSize:13, fontWeight: n.read?500:700, color:TEXT, lineHeight:1.3 }}>{n.title}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
              {n.repChange && (
                <span style={{ fontSize:11, fontWeight:700, padding:"1px 8px", borderRadius:999, background: n.repChange>0?"rgba(29,158,117,.1)":"rgba(232,67,147,.1)", color: n.repChange>0?"#0f6e56":A2 }}>
                  {n.repChange>0?"+":""}{n.repChange} rep
                </span>
              )}
              <span style={{ fontSize:10, color:MUTED, whiteSpace:"nowrap" }}>{new Date(n.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <p style={{ fontSize:12, color:MUTED, lineHeight:1.6, marginBottom:n.actionUrl?8:0 }}>{n.body}</p>
          {n.actionUrl && (
            <motion.a href={n.actionUrl}
              style={{ fontSize:11, fontWeight:700, color:n.color||A, padding:"4px 12px", borderRadius:8, border:`1.5px solid ${n.color||A}33`, background:`${n.color||A}10`, cursor:"pointer", textDecoration:"none", display:"inline-block" }}
              whileHover={{ background:`${n.color||A}22` }} whileTap={{ scale:0.95 }}>
              View →
            </motion.a>
          )}
        </div>

        <AnimatePresence>
          {hov && (
            <motion.button initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.8 }}
              onClick={()=>onDismiss(n.id)}
              style={{ position:"absolute", top:10, right:10, width:24, height:24, borderRadius:8, border:`1px solid ${BORDER}`, background:SURFACE, color:MUTED, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2 }}
              whileHover={{ background:"rgba(232,67,147,.08)", color:A2 }} whileTap={{ scale:0.9 }}>
              ×
            </motion.button>
          )}
        </AnimatePresence>

        {!n.read && (
          <motion.div onClick={()=>onRead(n.id)}
            style={{ width:8, height:8, borderRadius:"50%", background:n.color||A, flexShrink:0, marginTop:6, cursor:"pointer", position:"relative", zIndex:1 }}
            animate={{ opacity:[1,0.5,1] }} transition={{ duration:1.8, repeat:Infinity }} title="Mark as read" />
        )}
      </motion.div>
    </motion.div>
  );
}

export default function NotificationsPage() {
  const [notifs, setNotifs]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [currentUser, setCurrentUser] = useState<User|null>(null);
  const [filter, setFilter]     = useState("All");

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      if (!user) window.location.href = "/";
      else {
        fetch(`/api/notifications?firebaseUid=${user.uid}`)
          .then(r=>r.json())
          .then(d=>{ setNotifs(d.notifications||[]); setLoading(false); })
          .catch(()=>setLoading(false));
      }
    });
    return ()=>unsub();
  },[]);

  const markRead = async (id:string) => {
    if (!currentUser) return;
    setNotifs(prev=>prev.map(n=>n.id===id?{...n,read:true}:n));
    await fetch("/api/notifications", {
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ firebaseUid:currentUser.uid, notificationId:id }),
    });
  };

  const markAllRead = async () => {
    if (!currentUser) return;
    setNotifs(prev=>prev.map(n=>({...n,read:true})));
    await fetch("/api/notifications", {
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ firebaseUid:currentUser.uid }),
    });
  };

  const dismiss = (id:string) => setNotifs(prev=>prev.filter(n=>n.id!==id));

  const unread  = notifs.filter(n=>!n.read).length;
  const filtered = notifs.filter(n=> filter==="All"?true:filter==="Unread"?!n.read:n.type===filter.toLowerCase());

  const FILTER_TABS = ["All","Unread","outcome","rep","comment","streak","badge"];

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif", color:TEXT }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse at 10% 10%, rgba(108,92,231,.06) 0%, transparent 55%)" }} />
      <div style={{ position:"relative", zIndex:1 }}>
        <Navbar unread={unread} />
        <div style={{ maxWidth:760, margin:"0 auto", padding:"1.8rem 1.5rem 4rem" }}>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:18 }}>
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
            {unread>0 && (
              <motion.button onClick={markAllRead}
                style={{ padding:"7px 14px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:SURFACE, color:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.96 }}>
                Mark all read
              </motion.button>
            )}
          </div>

          {/* filter tabs */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
            {FILTER_TABS.map(t=>(
              <motion.button key={t} onClick={()=>setFilter(t)}
                style={{ padding:"5px 12px", borderRadius:9, border:`1.5px solid ${filter===t?A:BORDER}`, background:filter===t?"rgba(108,92,231,.09)":SURFACE, color:filter===t?A:MUTED, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize" }}
                whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.95 }}>
                {t}
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
            <>
              {filtered.filter(n=>!n.read).length>0 && (
                <>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800 }}>New</div>
                    <motion.div animate={{ opacity:[1,0.4,1] }} transition={{ duration:1.5, repeat:Infinity }}
                      style={{ width:7, height:7, borderRadius:"50%", background:A2 }} />
                    <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${BORDER},transparent)` }} />
                  </div>
                  <AnimatePresence mode="popLayout">
                    {filtered.filter(n=>!n.read).map(n=><NotifCard key={n.id} n={n} onRead={markRead} onDismiss={dismiss} />)}
                  </AnimatePresence>
                </>
              )}
              {filtered.filter(n=>n.read).length>0 && (
                <>
                  <div style={{ display:"flex", alignItems:"center", gap:10, margin:"16px 0 10px" }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:MUTED }}>Earlier</div>
                    <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${BORDER},transparent)` }} />
                  </div>
                  <AnimatePresence mode="popLayout">
                    {filtered.filter(n=>n.read).map(n=><NotifCard key={n.id} n={n} onRead={markRead} onDismiss={dismiss} />)}
                  </AnimatePresence>
                </>
              )}
            </>
          ) : (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ textAlign:"center", padding:"4rem", color:MUTED }}>
              <motion.div animate={{ rotate:[0,10,-10,0], scale:[1,1.1,1] }} transition={{ duration:2, repeat:Infinity, repeatDelay:3 }}
                style={{ fontSize:40, marginBottom:10 }}>🔔</motion.div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, marginBottom:4 }}>All caught up!</div>
              <div style={{ fontSize:12 }}>No notifications here yet.</div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
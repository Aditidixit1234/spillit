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

const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: "rgba(255,255,255,0.68)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.92)",
  boxShadow: "0 4px 28px rgba(108,92,231,0.09)",
  ...extra,
});

const HEATMAP_VALS = [2,0,3,1,4,0,2,1,3,0,2,4,1,3,2,0,4,1,2,3,0,1,4,2,3,1,0,2,4,3,1,2,0,3,4,1,2,0,3,1,4,2,0,3,1,2,4,0,3,2,1,4,0,2,3,1,0,4,2,3,1,0,4,2,1,3,0,2,4,1,3,0,2,1,4,3,0,2,1,3,4,0,2,1,3,2,4,0,1,3,2,4,1,0,3,2,4,1,0,3,1,2,4,0,3,2,1,4,3,0,2,1];

function Navbar() {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.85rem 2rem", background:"rgba(255,255,255,0.82)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${BORDER}` }}>
      <a href="/feed" style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:A, letterSpacing:"-0.04em", textDecoration:"none" }}>splitt<span style={{ color:A2 }}>.</span></a>
      <div style={{ display:"flex", gap:10 }}>
        <motion.a href="/feed" style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${BORDER}`, color:MUTED, fontSize:13, fontWeight:600, cursor:"pointer", textDecoration:"none" }}
          whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.97 }}>← Feed</motion.a>
        <motion.a href="/create" style={{ padding:"8px 16px", borderRadius:10, background:gradBg, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", textDecoration:"none", border:"none", boxShadow:"0 4px 14px rgba(108,92,231,.3)" }}
          whileHover={{ y:-1 }} whileTap={{ scale:0.97 }}>+ Post</motion.a>
      </div>
    </nav>
  );
}

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
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:A }}>{Math.round(pct)}%</span>
        <span style={{ fontSize:9, color:MUTED }}>accuracy</span>
      </div>
    </div>
  );
}

function Heatmap() {
  const ref=useRef(null); const inView=useInView(ref,{once:true});
  const weeks=16; const days=7;
  const vals=HEATMAP_VALS.slice(0,weeks*days);
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
                  style={{ width:11, height:11, borderRadius:3, background:intensities[v], cursor:"pointer" }} />
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ fontSize:10, color:MUTED, marginTop:6 }}>Last 16 weeks activity</div>
    </div>
  );
}

function PostCard({ post, index }:{ post:any; index:number }) {
  const ref=useRef(null); const inView=useInView(ref,{once:true,margin:"-20px"});
  const [hearted,setHearted]=useState(false);
  const [hearts,setHearts]=useState(post.totalHearts||0);
  return (
    <motion.div ref={ref} initial={{ opacity:0, y:18 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.35, delay:index*0.07 }}>
      <motion.div style={{ ...glass(), borderRadius:16, padding:"1rem 1.2rem", marginBottom:10, cursor:"pointer", position:"relative", overflow:"hidden" }}
        whileHover={{ y:-3, boxShadow:"0 12px 32px rgba(108,92,231,.13)" }} transition={{ duration:0.2 }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:post.type==="prediction"?gradBg:"linear-gradient(180deg,#ef9f27,#f04aa0)", borderRadius:"16px 0 0 16px" }} />
        <div style={{ paddingLeft:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
            <span style={{ fontSize:10, background:post.type==="prediction"?"rgba(232,67,147,.1)":"rgba(239,159,39,.12)", color:post.type==="prediction"?A2:"#7a4a08", padding:"1px 8px", borderRadius:999, fontWeight:700 }}>{post.type}</span>
            <span style={{ fontSize:10, color:MUTED, marginLeft:"auto" }}>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <p style={{ fontSize:13, lineHeight:1.6, color:TEXT, marginBottom:7 }}>{post.text}</p>
          <div style={{ display:"flex", gap:5, marginBottom:7 }}>
            {post.tags?.map((t:string)=><span key={t} style={{ fontSize:11, color:A, fontWeight:600, padding:"2px 8px", borderRadius:999, background:"rgba(108,92,231,.08)" }}>{t}</span>)}
          </div>
          <div style={{ display:"flex", gap:10, paddingTop:7, borderTop:`1px solid ${BORDER}` }}>
            {post.totalVotes>0&&<span style={{ fontSize:11, color:MUTED }}>🗳️ {post.totalVotes}</span>}
            <span style={{ fontSize:11, color:MUTED }}>💬 {post.totalComments||0}</span>
            <motion.button onClick={()=>{ setHearted(h=>!h); setHearts((h:number)=>hearted?h-1:h+1); }}
              style={{ display:"flex", alignItems:"center", gap:4, padding:"2px 8px", borderRadius:8, border:"none", background:hearted?"rgba(232,67,147,.08)":"transparent", color:hearted?A2:MUTED, fontSize:11, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}
              whileTap={{ scale:0.85 }}>
              {hearted?"❤️":"🤍"} {hearts}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ ...glass(), borderRadius:16, padding:"1rem 1.2rem", marginBottom:10 }}>
      {[80,60,40].map((w,i)=>(
        <motion.div key={i} animate={{ opacity:[0.4,0.7,0.4] }} transition={{ duration:1.5, repeat:Infinity, delay:i*0.1 }}
          style={{ height:12, borderRadius:999, background:SURFACE2, width:`${w}%`, marginBottom:8 }} />
      ))}
    </div>
  );
}

export default function ProfilePage({ params }:{ params:{ username:string } }) {
  const [user, setUser]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]       = useState("Posts");
  const tabs = ["Posts","Predictions","Confessions"];

  useEffect(()=>{
    onAuthStateChanged(auth, firebaseUser => {
      if (!firebaseUser) window.location.href = "/";
    });
  },[]);

  useEffect(()=>{
    fetch(`/api/profile/${params.username}`)
      .then(r=>r.json())
      .then(d=>{ setUser(d.user); setLoading(false); })
      .catch(()=>setLoading(false));
  },[params.username]);

  const filtered = user?.posts?.filter((p:any)=>
    tab==="Predictions" ? p.type==="prediction" :
    tab==="Confessions" ? p.type==="confession" : true
  ) || [];

  if (loading) return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth:980, margin:"0 auto", padding:"3rem 1.5rem" }}>
        {[100,80,60].map((w,i)=>(
          <motion.div key={i} animate={{ opacity:[0.4,0.7,0.4] }} transition={{ duration:1.5, repeat:Infinity, delay:i*0.1 }}
            style={{ height:20, borderRadius:999, background:SURFACE2, width:`${w}%`, marginBottom:16 }} />
        ))}
      </div>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <Navbar />
      <div style={{ textAlign:"center", padding:"5rem", color:MUTED }}>
        <div style={{ fontSize:40, marginBottom:12 }}>👤</div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800 }}>User not found</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif", color:TEXT }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse at 10% 10%, rgba(108,92,231,.07) 0%, transparent 55%)" }} />
      <div style={{ position:"relative", zIndex:1 }}>
        <Navbar />

        {/* banner */}
        <div style={{ height:160, background:"linear-gradient(135deg,rgba(108,92,231,.18),rgba(232,67,147,.14))", position:"relative", overflow:"hidden" }}>
          <motion.div animate={{ x:[0,30,0], y:[0,-10,0] }} transition={{ duration:8, repeat:Infinity }}
            style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"rgba(108,92,231,.12)", filter:"blur(50px)", top:-80, right:-50 }} />
        </div>

        <div style={{ maxWidth:980, margin:"0 auto", padding:"0 1.5rem" }}>
          {/* profile header */}
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:-40, marginBottom:14, flexWrap:"wrap", gap:10 }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:16 }}>
              <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ duration:0.4, type:"spring" }}
                style={{ width:80, height:80, borderRadius:"50%", background:gradBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:700, color:"#fff", border:`3px solid ${SURFACE}`, boxShadow:"0 4px 20px rgba(108,92,231,.3)" }}>?</motion.div>
              <div style={{ paddingBottom:8 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:TEXT }}>{user.anonName}</div>
                <div style={{ fontSize:11, color:MUTED }}>{user.level} · Rank #{user.rank || "—"} · Joined {new Date(user.createdAt).toLocaleDateString("en",{month:"long",year:"numeric"})}</div>
                {user.signature && <div style={{ fontSize:12, color:MUTED, fontStyle:"italic", marginTop:4 }}>"{user.signature}"</div>}
              </div>
            </div>
            <motion.a href="/create" style={{ padding:"8px 18px", borderRadius:10, background:gradBg, color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", textDecoration:"none", boxShadow:"0 4px 14px rgba(108,92,231,.3)", paddingBottom:8 }}
              whileHover={{ y:-1 }}>+ New post</motion.a>
          </div>

          {user.bio && <p style={{ fontSize:13, color:MUTED, lineHeight:1.7, maxWidth:560, marginBottom:14 }}>{user.bio}</p>}

          {/* badges */}
          {user.badges?.length>0 && (
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
              {user.badges.map((b:string,i:number)=>(
                <motion.span key={i} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.06 }}
                  style={{ fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:999, background:"rgba(108,92,231,.1)", color:A, border:`1px solid rgba(108,92,231,.2)` }}>
                  {b}
                </motion.span>
              ))}
            </div>
          )}
        </div>

        <div style={{ maxWidth:980, margin:"0 auto", padding:"0 1.5rem 4rem", display:"grid", gridTemplateColumns:"1fr 280px", gap:"1.6rem" }}>

          {/* LEFT */}
          <div>
            {/* stat cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
              {[
                { val:user.rep?.toLocaleString()||"0",  label:"Rep score",   color:A,         icon:"⚡" },
                { val:`${Math.round(user.accuracy||0)}%`, label:"Accuracy",  color:A2,        icon:"🎯" },
                { val:user.totalPredictions||0,          label:"Predictions",color:A,         icon:"🔮" },
                { val:`${user.streak||0}🔥`,              label:"Streak",    color:"#e67e22", icon:""   },
              ].map((s,i)=>(
                <motion.div key={s.label} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35, delay:i*0.07 }}>
                  <motion.div style={{ ...glass(), borderRadius:14, padding:"0.9rem 1rem", textAlign:"center" }}
                    whileHover={{ y:-3, boxShadow:`0 10px 28px ${s.color}22` }} transition={{ duration:0.2 }}>
                    <div style={{ fontSize:18, marginBottom:3 }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:10, color:MUTED, fontWeight:500 }}>{s.label}</div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* tabs */}
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
              {filtered.map((p:any,i:number)=><PostCard key={`${tab}-${p.id}`} post={p} index={i} />)}
            </AnimatePresence>

            {filtered.length===0 && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:"center", padding:"2.5rem", color:MUTED }}>
                <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
                <div style={{ fontSize:13, fontWeight:500 }}>No posts in this category yet</div>
              </motion.div>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ position:"sticky", top:72, display:"flex", flexDirection:"column", gap:12 }}>

            {/* accuracy ring */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>🎯 Prediction record</div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
                <AccuracyRing pct={user.accuracy||0} />
                <div style={{ flex:1 }}>
                  {[
                    { label:"Correct", val:user.correctPredictions||0, color:"#0f6e56", total:user.totalPredictions||1 },
                    { label:"Wrong",   val:user.wrongPredictions||0,   color:A2,        total:user.totalPredictions||1 },
                  ].map(s=>(
                    <div key={s.label} style={{ marginBottom:7 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
                        <span style={{ color:TEXT, fontWeight:500 }}>{s.label}</span>
                        <span style={{ fontWeight:700, color:s.color }}>{s.val}</span>
                      </div>
                      <div style={{ height:5, background:BORDER, borderRadius:999, overflow:"hidden" }}>
                        <motion.div initial={{ width:0 }} animate={{ width:`${(s.val/s.total)*100}%` }} transition={{ duration:0.8, delay:0.4 }}
                          style={{ height:"100%", background:s.color, borderRadius:999, opacity:0.8 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* heatmap */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.18 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>📊 Activity</div>
              <Heatmap />
            </motion.div>

            {/* streak */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.22 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>🔥 Streak</div>
              <div style={{ display:"flex", gap:4 }}>
                {Array.from({length:7}).map((_,i)=>(
                  <motion.div key={i} initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.3+i*0.05, type:"spring" }}
                    style={{ flex:1, height:28, borderRadius:8, background: i<(user.streak||0) ? gradBg : SURFACE2, border:`1px solid ${BORDER}` }} />
                ))}
              </div>
              <div style={{ fontSize:11, color:MUTED, marginTop:8 }}>{user.streak||0} day streak</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const A      = "#6c5ce7";
const A2     = "#e84393";
const BG     = "#eeecfa";
const MUTED  = "#5f5887";   // improved contrast
const TEXT   = "#1a1730";
const BORDER = "#d8d4f0";
const SURFACE  = "#ffffff";
const SURFACE2 = "#e8e4f8";
const CARD_BG  = "rgba(255,255,255,0.72)";
const gradBg   = "linear-gradient(135deg,#6c5ce7,#e84393)";

const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: CARD_BG,
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: `1px solid rgba(255,255,255,0.9)`,
  boxShadow: "0 4px 24px rgba(108,92,231,0.08)",
  ...extra,
});

// ── Mock Data ─────────────────────────────────────────────────────────────────
const POSTS = [
  { id:1, type:"poll",       user:"@shadow_oracle",  time:"2m ago",  rep:4820, text:"Will AI replace software engineers by 2027? I'm betting yes — my whole team got notices last week.", options:[{label:"Yes, definitely",votes:1240},{label:"No, never",votes:580}], totalVotes:1820, comments:84,  hearts:210, tags:["#AITakeover","#Tech"] },
  { id:2, type:"confession", user:"@ghost_9182",     time:"14m ago", rep:2140, text:"My startup is about to run out of runway. Confession: I haven't told the team yet. We have maybe 3 weeks left and I'm interviewing elsewhere.", options:[], totalVotes:0, comments:56, hearts:342, tags:["#StartupLife","#Confession"] },
  { id:3, type:"poll",       user:"@oracle_zero",    time:"32m ago", rep:9310, text:"Crypto bull run hitting $150k BTC before end of year — yes or no? I've been right the last 3 cycles.", options:[{label:"Yes 🚀",votes:3400},{label:"No 📉",votes:2100}], totalVotes:5500, comments:201, hearts:890, tags:["#CryptoAgain","#BTC"] },
  { id:4, type:"confession", user:"@nobody_knows",   time:"1h ago",  rep:1200, text:"I've been faking my seniority at work for 2 years. I'm a junior dev pretending to be senior. The team still doesn't know.", options:[], totalVotes:0, comments:128, hearts:670, tags:["#WorkLife","#Confession"] },
  { id:5, type:"poll",       user:"@anon_prophet",   time:"2h ago",  rep:6700, text:"Will Elon Musk start a new social media platform after X fails? Prediction: yes, within 18 months.", options:[{label:"Yes, definitely",votes:890},{label:"No way",votes:1200},{label:"Already failed",votes:430}], totalVotes:2520, comments:93, hearts:445, tags:["#Tech","#Prediction"] },
];

const TRENDING = [
  { tag:"#AITakeover", posts:"2.1k", hot:true  },
  { tag:"#StartupFail",posts:"891",  hot:false },
  { tag:"#CryptoAgain",posts:"654",  hot:false },
  { tag:"#WorkLife",   posts:"543",  hot:false },
  { tag:"#Confession", posts:"432",  hot:false },
  { tag:"#BTC",        posts:"310",  hot:false },
];

const NAV_ITEMS = [
  { icon:"🏠", label:"Home"          },
  { icon:"🔥", label:"Trending"      },
  { icon:"🔮", label:"Predictions"   },
  { icon:"💬", label:"Confessions"   },
  { icon:"🏆", label:"Leaderboard"   },
  { icon:"🔔", label:"Notifications", badge:3 },
  { icon:"👤", label:"Profile"       },
];

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ size=36 }:{ size?:number }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:"rgba(108,92,231,.15)", color:A, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.35, fontWeight:700, flexShrink:0 }}>?</div>
  );
}

// ── Poll Option ───────────────────────────────────────────────────────────────
const FILLS = ["rgba(108,92,231,.18)","rgba(232,67,147,.15)","rgba(29,158,117,.15)"];

function PollOption({ label, votes, total, voted, onVote, index }:{ label:string; votes:number; total:number; voted:boolean; onVote:()=>void; index:number }) {
  const pct = total > 0 ? Math.round((votes/total)*100) : 0;
  return (
    <motion.div onClick={onVote}
      style={{ borderRadius:12, height:40, display:"flex", alignItems:"center", position:"relative", overflow:"hidden", cursor:"pointer", border:`1.5px solid ${voted ? A : BORDER}`, marginBottom:7, background:SURFACE }}
      whileHover={{ borderColor:A, boxShadow:`0 0 0 3px rgba(108,92,231,.08)` }}
      whileTap={{ scale:0.985 }} transition={{ duration:0.15 }}>
      <motion.div style={{ position:"absolute", left:0, top:0, height:"100%", background:FILLS[index%FILLS.length], borderRadius:12 }}
        initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.7, ease:"easeOut" }} />
      <span style={{ position:"relative", zIndex:1, padding:"0 14px", fontSize:13, fontWeight:500, flex:1, color:TEXT }}>{label}</span>
      <span style={{ position:"relative", zIndex:1, padding:"0 14px", fontSize:12, fontWeight:700, color:MUTED }}>{pct}%</span>
    </motion.div>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post, index }:{ post:typeof POSTS[0]; index:number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-40px" });
  const [voted, setVoted] = useState<number|null>(null);
  const [hearts, setHearts] = useState(post.hearts);
  const [hearted, setHearted] = useState(false);
  const [opts, setOpts] = useState(post.options);
  const [total, setTotal] = useState(post.totalVotes);
  const isPoll = post.type === "poll";

  const handleVote = (i:number) => {
    if (voted !== null) return;
    setVoted(i);
    setOpts(o => o.map((x,idx) => idx===i ? {...x, votes:x.votes+1} : x));
    setTotal(t => t+1);
  };

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:24 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.4, delay:index*0.07, ease:"easeOut" }}
      style={{ marginBottom:12 }}>
      <motion.div
        style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.3rem", cursor:"pointer" }}
        whileHover={{ y:-3, boxShadow:"0 12px 36px rgba(108,92,231,.14)", borderColor:"rgba(108,92,231,.25)" }}
        transition={{ duration:0.22 }}>

        {/* header */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <Avatar size={36} />
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
              <span style={{ fontSize:13, fontWeight:700, color:TEXT }}>{post.user}</span>
              <span style={{ fontSize:10, background:"rgba(108,92,231,.1)", color:A, padding:"1px 8px", borderRadius:999, fontWeight:700 }}>anon</span>
              {isPoll
                ? <span style={{ fontSize:10, background:"rgba(232,67,147,.1)", color:A2, padding:"1px 8px", borderRadius:999, fontWeight:700 }}>prediction</span>
                : <span style={{ fontSize:10, background:"rgba(239,159,39,.12)", color:"#7a4a08", padding:"1px 8px", borderRadius:999, fontWeight:700 }}>confession</span>}
            </div>
            <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>{post.time} · Rep: {post.rep.toLocaleString()}</div>
          </div>
          <span style={{ fontSize:16, color:MUTED, cursor:"pointer", letterSpacing:2 }}>···</span>
        </div>

        {/* body */}
        <p style={{ fontSize:14, lineHeight:1.68, marginBottom:isPoll ? 12 : 8, color:TEXT, fontWeight:400 }}>{post.text}</p>

        {/* poll */}
        {isPoll && (
          <div style={{ marginBottom:6 }}>
            {opts.map((o,i) => <PollOption key={i} label={o.label} votes={o.votes} total={total} voted={voted===i} onVote={()=>handleVote(i)} index={i} />)}
            <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>{total.toLocaleString()} votes · {voted!==null ? "✓ You voted" : "Tap to vote"}</div>
          </div>
        )}

        {/* tags */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
          {post.tags.map(t => (
            <motion.span key={t} style={{ fontSize:11, color:A, fontWeight:600, cursor:"pointer", padding:"2px 8px", borderRadius:999, background:"rgba(108,92,231,.07)" }}
              whileHover={{ background:"rgba(108,92,231,.14)" }}>{t}</motion.span>
          ))}
        </div>

        {/* actions */}
        <div style={{ display:"flex", alignItems:"center", gap:2, paddingTop:8, borderTop:`1px solid ${BORDER}` }}>
          {[
            { icon: hearted?"❤️":"🤍", count:hearts, onClick:()=>{ setHearted(h=>!h); setHearts(h=>hearted?h-1:h+1); }, active:hearted },
            { icon:"💬", count:post.comments, onClick:()=>{} },
            { icon:"🔗", label:"Share", onClick:()=>{} },
          ].map((btn,i) => (
            <motion.button key={i} onClick={btn.onClick}
              style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 11px", borderRadius:10, border:"none", background: btn.active ? "rgba(232,67,147,.08)" : "transparent", color: btn.active ? A2 : MUTED, fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}
              whileHover={{ background:"rgba(108,92,231,.07)", color:A }}
              whileTap={{ scale:0.88 }}>
              {btn.icon} {"count" in btn ? btn.count : btn.label}
            </motion.button>
          ))}
          <motion.button
            style={{ marginLeft:"auto", padding:"6px 14px", borderRadius:10, border:"none", background:"rgba(108,92,231,.08)", color:A, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}
            whileHover={{ background:"rgba(108,92,231,.16)", boxShadow:`0 0 0 3px rgba(108,92,231,.1)` }}
            whileTap={{ scale:0.93 }}>
            🔮 Predict
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Compose Box ───────────────────────────────────────────────────────────────
function ComposeBox() {
  const [text, setText] = useState("");
  const [type, setType] = useState<"confession"|"prediction">("confession");
  return (
    <motion.div style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.3rem", marginBottom:12 }}
      initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
      <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
        <Avatar size={34} />
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:6, marginBottom:8 }}>
            {(["confession","prediction"] as const).map(t => (
              <motion.button key={t} onClick={()=>setType(t)}
                style={{ padding:"5px 14px", borderRadius:10, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", border:"none", background: type===t ? gradBg : SURFACE2, color: type===t ? "#fff" : MUTED }}
                whileHover={{ opacity:0.9 }} whileTap={{ scale:0.96 }}>
                {t==="confession" ? "💬 Confession" : "🔮 Prediction"}
              </motion.button>
            ))}
          </div>
          <textarea value={text} onChange={e=>setText(e.target.value)}
            placeholder={type==="confession" ? "Share anonymously... no one will know it's you." : "Make a bold prediction... stake your reputation."}
            style={{ width:"100%", minHeight:72, padding:"8px 0", background:"transparent", border:"none", outline:"none", resize:"none", fontSize:14, color:TEXT, fontFamily:"'DM Sans',system-ui,sans-serif", lineHeight:1.6 }} />
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:8, borderTop:`1px solid ${BORDER}` }}>
            <div style={{ display:"flex", gap:6 }}>
              {["📷","📊"].map(ic => (
                <motion.button key={ic} style={{ padding:"5px 10px", borderRadius:8, border:`1px solid ${BORDER}`, background:"transparent", fontSize:13, cursor:"pointer", color:MUTED }}
                  whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.93 }}>{ic}</motion.button>
              ))}
            </div>
            <motion.button
              style={{ padding:"8px 20px", borderRadius:10, background: text.length>0 ? gradBg : SURFACE2, border:"none", color: text.length>0 ? "#fff" : MUTED, fontSize:13, fontWeight:600, cursor: text.length>0 ? "pointer" : "default", fontFamily:"inherit", boxShadow: text.length>0 ? "0 4px 14px rgba(108,92,231,.3)" : "none" }}
              whileHover={text.length>0 ? { y:-1, boxShadow:"0 6px 18px rgba(108,92,231,.4)" } : {}}
              whileTap={text.length>0 ? { scale:0.97 } : {}}>
              Post anonymously →
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Feed Tabs ─────────────────────────────────────────────────────────────────
function FeedTabs({ active, setActive }:{ active:string; setActive:(s:string)=>void }) {
  const tabs = ["For You","Predictions","Confessions","Following"];
  return (
    <div style={{ display:"flex", borderBottom:`1.5px solid ${BORDER}`, marginBottom:14, position:"relative" }}>
      {tabs.map(tab => (
        <motion.button key={tab} onClick={()=>setActive(tab)}
          style={{ flex:1, padding:"11px 6px", border:"none", background:"transparent", fontSize:13, fontWeight: active===tab ? 700 : 500, color: active===tab ? A : MUTED, cursor:"pointer", fontFamily:"inherit", position:"relative" }}
          whileHover={{ color:A }} transition={{ duration:0.15 }}>
          {tab}
          {active===tab && (
            <motion.div layoutId="tab-underline"
              style={{ position:"absolute", bottom:-1.5, left:0, right:0, height:2.5, background:gradBg, borderRadius:999 }}
              transition={{ type:"spring", stiffness:400, damping:30 }} />
          )}
        </motion.button>
      ))}
    </div>
  );
}

// ── Left Sidebar ──────────────────────────────────────────────────────────────
function LeftSidebar() {
  const [active, setActive] = useState("Home");
  return (
    <div style={{ position:"sticky", top:0, height:"100vh", display:"flex", flexDirection:"column", paddingTop:"1.4rem", gap:2, overflowY:"auto" }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:A, letterSpacing:"-0.04em", marginBottom:22, paddingLeft:10 }}>
        splitt<span style={{ color:A2 }}>.</span>
      </div>

      {NAV_ITEMS.map(item => {
        const isActive = active===item.label;
        return (
          <motion.div key={item.label} onClick={()=>setActive(item.label)}
            style={{ display:"flex", alignItems:"center", gap:11, padding:"10px 14px", borderRadius:13, cursor:"pointer", position:"relative", borderLeft: isActive ? `3px solid ${A}` : "3px solid transparent", background: isActive ? "rgba(108,92,231,.1)" : "transparent", color: isActive ? A : TEXT, fontWeight: isActive ? 600 : 400, fontSize:14 }}
            whileHover={{ background:"rgba(108,92,231,.07)", x:2 }}
            whileTap={{ scale:0.97 }} transition={{ duration:0.14 }}>
            {isActive && <motion.div layoutId="nav-glow" style={{ position:"absolute", inset:0, borderRadius:13, background:"rgba(108,92,231,.08)", zIndex:0 }} transition={{ type:"spring", stiffness:400, damping:30 }} />}
            <span style={{ fontSize:17, position:"relative", zIndex:1 }}>{item.icon}</span>
            <span style={{ position:"relative", zIndex:1 }}>{item.label}</span>
            {"badge" in item && item.badge && (
              <motion.span animate={{ scale:[1,1.15,1] }} transition={{ duration:1.4, repeat:Infinity }}
                style={{ marginLeft:"auto", width:18, height:18, borderRadius:"50%", background:A2, color:"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", zIndex:1 }}>
                {item.badge}
              </motion.span>
            )}
          </motion.div>
        );
      })}

      <motion.button
        style={{ margin:"14px 0 0", padding:"11px 18px", borderRadius:12, background:gradBg, border:"none", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(108,92,231,.28)" }}
        whileHover={{ y:-2, boxShadow:"0 8px 24px rgba(108,92,231,.42)", background:"linear-gradient(135deg,#7d6ef0,#f04aa0)" }}
        whileTap={{ scale:0.96 }}>
        + Post anonymously
      </motion.button>

      <div style={{ marginTop:"auto", padding:"11px 12px", borderRadius:14, background:SURFACE2, display:"flex", alignItems:"center", gap:10, border:`1px solid ${BORDER}` }}>
        <Avatar size={34} />
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:TEXT }}>@mystery_oracle</div>
          <div style={{ fontSize:11, color:MUTED }}>Rep: 1,240 · 12 predictions</div>
        </div>
      </div>
    </div>
  );
}

// ── Right Panel ───────────────────────────────────────────────────────────────
function RightPanel() {
  return (
    <div style={{ position:"sticky", top:0, height:"100vh", paddingTop:"1.4rem", display:"flex", flexDirection:"column", gap:12, overflowY:"auto" }}>

      {/* search */}
      <div style={{ position:"relative" }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:13, color:MUTED }}>🔍</span>
        <input placeholder="Search Splitt..." style={{ width:"100%", padding:"9px 12px 9px 34px", borderRadius:12, background:SURFACE, border:`1.5px solid ${BORDER}`, fontSize:13, color:TEXT, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
      </div>

      {/* trending */}
      <div style={{ ...glass(), borderRadius:18, padding:"1.1rem" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, marginBottom:10, color:TEXT }}>🔥 Trending now</div>
        {TRENDING.map((t,i) => (
          <motion.div key={t.tag}
            style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom: i<TRENDING.length-1 ? `1px solid ${BORDER}` : "none", cursor:"pointer" }}
            whileHover={{ x:3, background:"rgba(108,92,231,.03)" }} transition={{ duration:0.13 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:A, display:"flex", alignItems:"center", gap:5 }}>
                {t.tag}
                {t.hot && <span style={{ fontSize:10, background:"rgba(232,67,147,.1)", color:A2, padding:"1px 6px", borderRadius:999, fontWeight:700 }}>hot</span>}
              </div>
              <div style={{ fontSize:11, color:MUTED }}>{t.posts} posts</div>
            </div>
            <span style={{ fontSize:11, color:MUTED, fontWeight:600 }}>#{i+1}</span>
          </motion.div>
        ))}
      </div>

      {/* top predictors */}
      <div style={{ ...glass(), borderRadius:18, padding:"1.1rem" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, marginBottom:10, color:TEXT }}>🏆 Top Predictors</div>
        {[
          { name:"@oracle_zero",   rep:9310, acc:"87%" },
          { name:"@silent_prophet",rep:4820, acc:"73%" },
          { name:"@anon_prophet",  rep:6700, acc:"71%" },
        ].map((u,i) => (
          <motion.div key={u.name} style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 0", borderBottom: i<2 ? `1px solid ${BORDER}` : "none", cursor:"pointer" }}
            whileHover={{ x:2 }} transition={{ duration:0.13 }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:["#f59e0b","#9ca3af","#cd7c2f"][i], width:20, flexShrink:0 }}>#{i+1}</span>
            <Avatar size={28} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:600, color:TEXT }}>{u.name}</div>
              <div style={{ fontSize:11, color:MUTED }}>Rep: {u.rep.toLocaleString()} · {u.acc} acc</div>
            </div>
          </motion.div>
        ))}
        <motion.button style={{ marginTop:10, width:"100%", padding:"7px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:"transparent", fontSize:12, color:A, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
          whileHover={{ background:SURFACE2, borderColor:A }} whileTap={{ scale:0.97 }}>
          View leaderboard →
        </motion.button>
      </div>

      {/* rep stats */}
      <div style={{ ...glass(), borderRadius:18, padding:"1.1rem" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, marginBottom:10, color:TEXT }}>⚡ Your Rep</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:4 }}>
          {[["1,240","Rep score"],["12","Predictions"],["67%","Accuracy"],["3 🔥","Streak"]].map(([val,lbl]) => (
            <div key={lbl} style={{ background:SURFACE2, borderRadius:12, padding:"9px 11px", border:`1px solid ${BORDER}` }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:A }}>{val}</div>
              <div style={{ fontSize:11, color:MUTED, marginTop:1 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize:11, color:MUTED, lineHeight:1.8, paddingBottom:"1rem" }}>
        About · Privacy · Terms · Contact<br/>© 2025 Splitt
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FeedPage() {
  const [feedTab, setFeedTab] = useState("For You");

  const filtered = feedTab==="Predictions" ? POSTS.filter(p=>p.type==="poll")
    : feedTab==="Confessions" ? POSTS.filter(p=>p.type==="confession")
    : POSTS;

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif", color:TEXT }}>
      {/* subtle radial bg depth */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        background:"radial-gradient(ellipse at 10% 10%, rgba(108,92,231,.07) 0%, transparent 55%), radial-gradient(ellipse at 90% 80%, rgba(232,67,147,.06) 0%, transparent 50%)" }} />

      <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 1.5rem", display:"grid", gridTemplateColumns:"230px 1fr 290px", gap:"1.8rem", position:"relative", zIndex:1 }}>
        <LeftSidebar />

        {/* CENTER */}
        <main style={{ padding:"1.4rem 0", minHeight:"100vh" }}>
          <ComposeBox />
          <FeedTabs active={feedTab} setActive={setFeedTab} />
          <AnimatePresence mode="popLayout">
            {filtered.map((post,i) => (
              <PostCard key={`${feedTab}-${post.id}`} post={post} index={i} />
            ))}
          </AnimatePresence>
          <motion.button style={{ width:"100%", padding:"11px", borderRadius:12, border:`1.5px solid ${BORDER}`, background:"transparent", fontSize:13, color:A, fontWeight:600, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}
            whileHover={{ background:SURFACE2, borderColor:A }} whileTap={{ scale:0.97 }}>
            Load more posts ↓
          </motion.button>
        </main>

        <RightPanel />
      </div>
    </div>
  );
}
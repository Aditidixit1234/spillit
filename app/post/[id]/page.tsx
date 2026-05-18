"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

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

// ── Mock Data ─────────────────────────────────────────────────────────────────
const POST = {
  id:1, type:"poll",
  user:"@shadow_oracle", time:"2 hours ago", rep:4820,
  text:"Will AI replace software engineers by 2027? I'm betting yes — my whole team got notices last week. The writing is on the wall. Senior devs are already getting replaced by junior + AI combos. What do you think?",
  options:[
    { label:"Yes, definitely 🤖", votes:1240 },
    { label:"No, never 💪",       votes:580  },
    { label:"Partially, some roles",votes:890},
  ],
  totalVotes:2710, comments:84, hearts:210,
  tags:["#AITakeover","#Tech","#Prediction"],
  deadline:"3 days left", mood:"🔥",
  anonLevel:"Fully anonymous", audience:"Tech", accuracy:73,
};

const COMMENTS = [
  { id:1, user:"@ghost_writer", time:"1h ago",  rep:2100, text:"This is already happening at my company. 3 devs laid off last month, all replaced by one dev + Cursor AI.", hearts:42, replies:[] },
  { id:2, user:"@tech_oracle",  time:"45m ago", rep:5600, text:"Partially agree. AI won't replace devs but devs who use AI will replace those who don't. The skill set is shifting.", hearts:98,
    replies:[
      { id:21, user:"@anon_dev",      time:"30m ago", rep:1200, text:"This is the real take. Stop panicking and start learning how to use these tools.", hearts:31 },
      { id:22, user:"@shadow_oracle", time:"25m ago", rep:4820, text:"OP here — agree but the transition period is brutal. Mid level devs are getting squeezed most.", hearts:19 },
    ]},
  { id:3, user:"@nobody_knows", time:"30m ago", rep:890,  text:"Voted no. AI still can't handle complex system design, stakeholder communication, or legacy codebases. Too much hype.", hearts:67, replies:[] },
  { id:4, user:"@anon_9182",    time:"15m ago", rep:340,  text:"My manager literally said 'we're hiring 1 AI-native dev instead of 3 regular devs.' It's happening now.", hearts:124, replies:[] },
];

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimCounter({ to, duration=1.2 }:{ to:number; duration?:number }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });
  useEffect(() => {
    if (!inView) return;
    let start = 0; const steps = 40;
    const step = to / steps;
    const t = setInterval(() => { start = Math.min(start+step, to); setVal(Math.round(start)); if (start>=to) clearInterval(t); }, (duration*1000)/steps);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}</span>;
}

// ── Avatar + Profile Hover Card ───────────────────────────────────────────────
function Avatar({ size=36, color=A, user="" }:{ size?:number; color?:string; user?:string }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ position:"relative", flexShrink:0 }} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <div style={{ width:size, height:size, borderRadius:"50%", background:`${color}22`, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.33, fontWeight:700, cursor:"pointer", border:`1.5px solid ${color}33`, boxShadow:`0 0 10px ${color}22` }}>?</div>
      <AnimatePresence>
        {hov && user && (
          <motion.div initial={{ opacity:0, y:6, scale:0.92 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:4, scale:0.94 }} transition={{ duration:0.18 }}
            style={{ position:"absolute", top:"110%", left:0, zIndex:99, ...glass(), borderRadius:14, padding:"0.85rem 1rem", width:200, border:`1px solid rgba(108,92,231,.25)`, boxShadow:"0 8px 32px rgba(108,92,231,.18)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:`${color}22`, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>?</div>
              <div>
                <div style={{ fontSize:12, fontWeight:700 }}>{user}</div>
                <div style={{ fontSize:10, color:MUTED }}>Anonymous user</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:5 }}>
              {[["4820","Rep"],["73%","Acc"],["48","Posts"]].map(([v,l])=>(
                <div key={l} style={{ background:SURFACE2, borderRadius:8, padding:"5px 4px", textAlign:"center" }}>
                  <div style={{ fontSize:12, fontWeight:800, color:A }}>{v}</div>
                  <div style={{ fontSize:9, color:MUTED }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Floating Blobs ────────────────────────────────────────────────────────────
function FloatingBlobs() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {[
        { w:500, h:500, bg:"rgba(108,92,231,.07)", top:"-10%", left:"-8%",  anim:"blob1" },
        { w:400, h:400, bg:"rgba(232,67,147,.06)", top:"50%",  right:"-8%", anim:"blob2" },
        { w:350, h:350, bg:"rgba(108,92,231,.05)", bottom:"5%",left:"30%",  anim:"blob3" },
      ].map((b,i) => (
        <motion.div key={i} animate={{ scale:[1,1.08,1], x:[0,20,0], y:[0,-15,0] }}
          transition={{ duration:8+i*2, repeat:Infinity, ease:"easeInOut" }}
          style={{ position:"absolute", width:b.w, height:b.h, borderRadius:"50%", background:b.bg, filter:"blur(60px)", top:b.top, left:"left" in b?b.left:undefined, right:"right" in b?(b as any).right:undefined, bottom:"bottom" in b?(b as any).bottom:undefined }} />
      ))}
      {/* noise texture */}
      <div style={{ position:"absolute", inset:0, opacity:0.025, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
    </div>
  );
}

// ── Gradient Divider ──────────────────────────────────────────────────────────
function GradDivider() {
  return <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(108,92,231,.3),rgba(232,67,147,.2),transparent)", margin:"10px 0" }} />;
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.85rem 2rem", background:"rgba(255,255,255,0.82)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${BORDER}`, boxShadow:"0 1px 20px rgba(108,92,231,.06)" }}>
      <a href="/feed" style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:A, letterSpacing:"-0.04em", textDecoration:"none" }}>
        splitt<span style={{ color:A2 }}>.</span>
      </a>
      <div style={{ display:"flex", gap:10 }}>
        <motion.a href="/feed" style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${BORDER}`, color:MUTED, fontSize:13, fontWeight:600, cursor:"pointer", textDecoration:"none" }}
          whileHover={{ borderColor:A, color:A, boxShadow:`0 0 0 3px rgba(108,92,231,.08)` }} whileTap={{ scale:0.97 }}>← Feed</motion.a>
        <motion.a href="/create" style={{ padding:"8px 16px", borderRadius:10, background:gradBg, border:"none", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", textDecoration:"none", boxShadow:"0 4px 14px rgba(108,92,231,.3)" }}
          whileHover={{ y:-1, boxShadow:"0 8px 22px rgba(108,92,231,.45)", background:"linear-gradient(135deg,#7d6ef0,#f04aa0)" }} whileTap={{ scale:0.97 }}>+ Post</motion.a>
      </div>
    </nav>
  );
}

// ── Animated Poll Bar ─────────────────────────────────────────────────────────
function PollBar({ label, votes, total, voted, onVote, index, revealed }:{ label:string; votes:number; total:number; voted:boolean; onVote:()=>void; index:number; revealed:boolean }) {
  const pct = total>0 ? Math.round((votes/total)*100) : 0;
  const maxPct = Math.max(...POST.options.map(o=>Math.round((o.votes/total)*100)));
  const isWinner = pct===maxPct;
  const fills = [
    { bg:"rgba(108,92,231,.18)", glow:"rgba(108,92,231,.3)" },
    { bg:"rgba(232,67,147,.15)", glow:"rgba(232,67,147,.25)" },
    { bg:"rgba(29,158,117,.15)", glow:"rgba(29,158,117,.22)" },
  ];
  const f = fills[index%fills.length];

  return (
    <motion.div onClick={onVote}
      style={{ borderRadius:13, height:48, display:"flex", alignItems:"center", position:"relative", overflow:"hidden", cursor:voted?"default":"pointer", border:`1.5px solid ${voted?A:BORDER}`, marginBottom:9, background:SURFACE }}
      whileHover={!voted?{ borderColor:A, boxShadow:`0 0 0 3px rgba(108,92,231,.08), 0 4px 16px rgba(108,92,231,.1)` }:{}}
      whileTap={!voted?{ scale:0.99 }:{}} transition={{ duration:0.18 }}>
      {/* animated fill */}
      <motion.div style={{ position:"absolute", left:0, top:0, height:"100%", background:f.bg, borderRadius:13 }}
        initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.9, delay:index*0.12, ease:[0.34,1.56,0.64,1] }} />
      {/* winner glow pulse */}
      {isWinner && revealed && (
        <motion.div animate={{ opacity:[0.4,0.8,0.4], scale:[1,1.02,1] }} transition={{ duration:2, repeat:Infinity }}
          style={{ position:"absolute", inset:0, borderRadius:13, border:`2px solid ${fills[index%fills.length].glow}`, pointerEvents:"none" }} />
      )}
      <span style={{ position:"relative", zIndex:1, padding:"0 14px", fontSize:13, fontWeight:voted?600:500, flex:1, color:TEXT }}>{label}</span>
      <div style={{ position:"relative", zIndex:1, padding:"0 14px", display:"flex", alignItems:"center", gap:6 }}>
        {revealed && isWinner && <span style={{ fontSize:10, background:"rgba(29,158,117,.15)", color:"#0f6e56", padding:"2px 7px", borderRadius:999, fontWeight:700 }}>leading ✓</span>}
        <motion.span animate={{ color: isWinner&&revealed ? A : MUTED }} style={{ fontSize:14, fontWeight:700 }}>{pct}%</motion.span>
      </div>
    </motion.div>
  );
}

// ── Outcome Banner ────────────────────────────────────────────────────────────
function OutcomeBanner({ revealed, onReveal }:{ revealed:boolean; onReveal:()=>void }) {
  return (
    <AnimatePresence mode="wait">
      {!revealed ? (
        <motion.div key="pre" initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
          style={{ ...glass(), borderRadius:14, padding:"0.9rem 1.1rem", marginBottom:14, border:`1.5px solid rgba(108,92,231,.25)`, background:"rgba(108,92,231,.05)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:A, marginBottom:2 }}>⏰ Closes in {POST.deadline}</div>
            <div style={{ fontSize:11, color:MUTED }}>Vote now to earn rep when the outcome reveals</div>
          </div>
          <motion.button onClick={onReveal}
            style={{ padding:"8px 16px", borderRadius:10, background:gradBg, border:"none", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", boxShadow:"0 4px 14px rgba(108,92,231,.3)" }}
            whileHover={{ y:-1, boxShadow:"0 8px 22px rgba(108,92,231,.45)" }} whileTap={{ scale:0.95 }}>
            Reveal outcome 🔮
          </motion.button>
        </motion.div>
      ) : (
        <motion.div key="post" initial={{ opacity:0, scale:0.95, y:-8 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0 }}
          transition={{ type:"spring", stiffness:300, damping:22 }}
          style={{ borderRadius:14, padding:"0.9rem 1.1rem", marginBottom:14, background:"rgba(29,158,117,.09)", border:`1.5px solid rgba(29,158,117,.3)`, display:"flex", alignItems:"center", gap:12 }}>
          <motion.span animate={{ rotate:[0,15,-10,8,0] }} transition={{ duration:0.6 }} style={{ fontSize:22 }}>✅</motion.span>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#0f6e56", marginBottom:2 }}>Outcome revealed — "Yes, definitely" was leading!</div>
            <div style={{ fontSize:11, color:MUTED }}>1,240 predictors got this right and earned +12 rep each</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Comment Card ──────────────────────────────────────────────────────────────
function Comment({ c, depth=0, index=0 }:{ c:any; depth?:number; index?:number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-20px" });
  const [hearted, setHearted] = useState(false);
  const [hearts, setHearts]   = useState(c.hearts);
  const [replying, setReplying]= useState(false);
  const [replyText, setReplyText]= useState("");
  const [hov, setHov]         = useState(false);
  const colors = [A, A2, "#0f6e56"];
  const c_ = colors[depth%colors.length];

  return (
    <motion.div ref={ref} initial={{ opacity:0, y:20 }} animate={inView?{ opacity:1, y:0 }:{}}
      transition={{ duration:0.38, delay:index*0.08, ease:"easeOut" }}
      style={{ marginLeft:depth>0?44:0, marginBottom:10 }}>
      <motion.div
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        animate={{ y:hov?-3:0, boxShadow: hov?"0 10px 32px rgba(108,92,231,.14), inset 0 1px 0 rgba(255,255,255,.7)":"0 4px 24px rgba(108,92,231,.07), inset 0 1px 0 rgba(255,255,255,.5)", borderColor: hov?"rgba(108,92,231,.3)":"rgba(255,255,255,.92)" }}
        transition={{ duration:0.22 }}
        style={{ ...glass(), borderRadius:16, padding:"0.95rem 1.1rem" }}>
        {/* neon border on hover */}
        {hov && <div style={{ position:"absolute", inset:0, borderRadius:16, border:`1px solid rgba(108,92,231,.25)`, pointerEvents:"none", boxShadow:`inset 0 0 20px rgba(108,92,231,.04)` }} />}

        <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:8 }}>
          <Avatar size={30} color={c_} user={c.user} />
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:12, fontWeight:700 }}>{c.user}</span>
              <span style={{ fontSize:9, background:"rgba(108,92,231,.1)", color:A, padding:"1px 6px", borderRadius:999, fontWeight:700 }}>anon</span>
            </div>
            <div style={{ fontSize:10, color:MUTED }}>{c.time} · Rep: {c.rep.toLocaleString()}</div>
          </div>
        </div>

        <p style={{ fontSize:13, lineHeight:1.65, color:TEXT, marginBottom:9 }}>{c.text}</p>
        <GradDivider />

        <div style={{ display:"flex", alignItems:"center", gap:3, paddingTop:6 }}>
          <motion.button onClick={()=>{ setHearted(h=>!h); setHearts((h:number)=>hearted?h-1:h+1); }}
            style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", borderRadius:8, border:"none", background:hearted?"rgba(232,67,147,.08)":"transparent", color:hearted?A2:MUTED, fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}
            whileTap={{ scale:0.8 }} whileHover={{ background:"rgba(232,67,147,.08)" }}>
            <motion.span animate={ hearted?{ scale:[1,1.4,1] }:{ scale:1 } } transition={{ duration:0.3 }}>
              {hearted?"❤️":"🤍"}
            </motion.span> {hearts}
          </motion.button>
          {depth===0 && (
            <motion.button onClick={()=>setReplying(r=>!r)}
              style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", borderRadius:8, border:"none", background:"transparent", color:MUTED, fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}
              whileHover={{ color:A, background:"rgba(108,92,231,.06)" }} whileTap={{ scale:0.9 }}>
              💬 Reply
            </motion.button>
          )}
          <motion.button style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", borderRadius:8, border:"none", background:"transparent", color:MUTED, fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}
            whileHover={{ color:A2, background:"rgba(232,67,147,.06)" }}>🚩</motion.button>
        </div>

        <AnimatePresence>
          {replying && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} style={{ overflow:"hidden", marginTop:10 }}>
              <div style={{ display:"flex", gap:8 }}>
                <Avatar size={24} />
                <div style={{ flex:1 }}>
                  <input value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Reply anonymously..."
                    style={{ width:"100%", padding:"7px 11px", borderRadius:9, border:`1.5px solid ${BORDER}`, background:SURFACE, fontSize:12, color:TEXT, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
                    onFocus={e=>e.target.style.borderColor=A} onBlur={e=>e.target.style.borderColor=BORDER} />
                  <div style={{ display:"flex", gap:6, marginTop:5 }}>
                    <motion.button onClick={()=>setReplying(false)} style={{ padding:"4px 11px", borderRadius:7, border:`1px solid ${BORDER}`, background:"transparent", color:MUTED, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }} whileHover={{ borderColor:A, color:A }}>Cancel</motion.button>
                    <motion.button style={{ padding:"4px 11px", borderRadius:7, border:"none", background:replyText.trim()?gradBg:SURFACE2, color:replyText.trim()?"#fff":MUTED, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }} whileTap={{ scale:0.95 }}>Reply →</motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {c.replies?.map((r:any,i:number) => <Comment key={r.id} c={r} depth={depth+1} index={i} />)}
    </motion.div>
  );
}

// ── Sticky Engagement Bar ─────────────────────────────────────────────────────
function StickyBar({ hearts, hearted, onHeart, voted }:{ hearts:number; hearted:boolean; onHeart:()=>void; voted:boolean }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [200,300], [0,1]);
  const y = useTransform(scrollY, [200,300], [20,0]);
  return (
    <motion.div style={{ position:"fixed", bottom:24, left:"50%", x:"-50%", opacity, y, zIndex:150 }}>
      <div style={{ ...glass(), borderRadius:999, padding:"10px 20px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 8px 32px rgba(108,92,231,.2), 0 2px 8px rgba(0,0,0,.08)", border:"1px solid rgba(108,92,231,.2)" }}>
        <motion.button onClick={onHeart}
          style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:999, border:"none", background:hearted?"rgba(232,67,147,.1)":"transparent", color:hearted?A2:MUTED, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
          whileTap={{ scale:0.85 }}>
          <motion.span animate={hearted?{ scale:[1,1.5,1] }:{ scale:1 }} transition={{ duration:0.3 }}>{hearted?"❤️":"🤍"}</motion.span> {hearts}
        </motion.button>
        <div style={{ width:1, height:20, background:BORDER }} />
        <motion.button style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:999, border:"none", background:"transparent", color:MUTED, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
          whileHover={{ color:A }}>💬 {POST.comments}</motion.button>
        <div style={{ width:1, height:20, background:BORDER }} />
        <motion.button style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:999, border:"none", background:gradBg, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 3px 12px rgba(108,92,231,.3)" }}
          whileHover={{ boxShadow:"0 5px 18px rgba(108,92,231,.45)" }} whileTap={{ scale:0.93 }}>
          {voted ? "✓ Voted" : "🔮 Vote"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Glass Widget ──────────────────────────────────────────────────────────────
function GlassWidget({ children, delay=0, glowColor=A }:{ children:React.ReactNode; delay?:number; glowColor?:string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-30px" });
  const [hov, setHov] = useState(false);
  return (
    <motion.div ref={ref} initial={{ opacity:0, x:16 }} animate={inView?{ opacity:1, x:0 }:{}} transition={{ duration:0.4, delay }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <motion.div
        animate={{ y:hov?-3:0, boxShadow:hov?`0 12px 36px ${glowColor}22, 0 4px 24px rgba(108,92,231,.08)`:glass().boxShadow, borderColor:hov?`${glowColor}44`:"rgba(255,255,255,.92)" }}
        transition={{ duration:0.22 }}
        style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem", marginBottom:12 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PostDetailPage() {
  const [voted, setVoted]       = useState<number|null>(null);
  const [hearts, setHearts]     = useState(POST.hearts);
  const [hearted, setHearted]   = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [opts, setOpts]         = useState(POST.options);
  const [total, setTotal]       = useState(POST.totalVotes);
  const [comment, setComment]   = useState("");
  const [sortBy, setSortBy]     = useState("Top");
  const [shareToast, setShareToast] = useState(false);

  const handleVote = (i:number) => {
    if (voted!==null) return;
    setVoted(i);
    setOpts(o=>o.map((x,idx)=>idx===i?{...x,votes:x.votes+1}:x));
    setTotal(t=>t+1);
  };
  const handleHeart = () => { setHearted(h=>!h); setHearts(h=>hearted?h-1:h+1); };
  const handleShare = () => { setShareToast(true); setTimeout(()=>setShareToast(false),2500); };

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif", color:TEXT }}>
      <FloatingBlobs />

      {/* share toast */}
      <AnimatePresence>
        {shareToast && (
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
            style={{ position:"fixed", top:80, left:"50%", transform:"translateX(-50%)", background:TEXT, color:"#fff", padding:"10px 22px", borderRadius:999, fontSize:13, fontWeight:600, zIndex:999, whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(0,0,0,.2)" }}>
            🔗 Link copied!
          </motion.div>
        )}
      </AnimatePresence>

      <StickyBar hearts={hearts} hearted={hearted} onHeart={handleHeart} voted={voted!==null} />

      <div style={{ position:"relative", zIndex:1 }}>
        <Navbar />
        <div style={{ maxWidth:980, margin:"0 auto", padding:"1.8rem 1.5rem", display:"grid", gridTemplateColumns:"1fr 288px", gap:"1.6rem", alignItems:"start" }}>

          {/* ── LEFT ── */}
          <div>
            {/* main post */}
            <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:"easeOut" }}>
              <motion.div style={{ ...glass(), borderRadius:22, padding:"1.4rem 1.6rem", marginBottom:14, position:"relative", overflow:"hidden" }}
                whileHover={{ boxShadow:"0 16px 48px rgba(108,92,231,.14), inset 0 1px 0 rgba(255,255,255,.7)" }} transition={{ duration:0.25 }}>
                {/* gradient top border */}
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:gradBg, borderRadius:"22px 22px 0 0" }} />

                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingTop:4 }}>
                  <Avatar size={44} user={POST.user} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                      <span style={{ fontSize:14, fontWeight:700 }}>{POST.user}</span>
                      <span style={{ fontSize:10, background:"rgba(108,92,231,.1)", color:A, padding:"1px 8px", borderRadius:999, fontWeight:700 }}>anon</span>
                      <span style={{ fontSize:10, background:"rgba(232,67,147,.1)", color:A2, padding:"1px 8px", borderRadius:999, fontWeight:700 }}>prediction</span>
                      <span style={{ fontSize:12 }}>{POST.mood}</span>
                    </div>
                    <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>{POST.time} · Rep: {POST.rep.toLocaleString()} · {POST.anonLevel}</div>
                  </div>
                </div>

                <p style={{ fontSize:15, lineHeight:1.75, color:TEXT, marginBottom:14 }}>{POST.text}</p>
                <OutcomeBanner revealed={revealed} onReveal={()=>setRevealed(true)} />

                {/* poll bars */}
                <div style={{ marginBottom:10 }}>
                  {opts.map((o,i)=>(
                    <PollBar key={i} label={o.label} votes={o.votes} total={total} voted={voted===i} onVote={()=>handleVote(i)} index={i} revealed={revealed} />
                  ))}
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:12, color:MUTED }}><AnimCounter to={total} /> votes · {voted!==null?"✓ You voted":"Tap to vote"}</span>
                    <span style={{ fontSize:12, color:MUTED }}>⏰ {POST.deadline}</span>
                  </div>
                </div>

                {/* accuracy bar */}
                <div style={{ background:SURFACE2, borderRadius:12, padding:"10px 13px", marginBottom:14, border:`1px solid ${BORDER}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:11, color:MUTED, fontWeight:600 }}>Poster accuracy rate</span>
                    <span style={{ fontSize:11, fontWeight:800, color:A }}>{POST.accuracy}%</span>
                  </div>
                  <div style={{ height:5, background:BORDER, borderRadius:999, overflow:"hidden" }}>
                    <motion.div style={{ height:"100%", background:gradBg, borderRadius:999 }} initial={{ width:0 }} animate={{ width:`${POST.accuracy}%` }} transition={{ duration:1.1, delay:0.5, ease:"easeOut" }} />
                  </div>
                  <div style={{ fontSize:10, color:MUTED, marginTop:4 }}>High reliability predictor · {POST.rep.toLocaleString()} rep</div>
                </div>

                {/* tags */}
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
                  {POST.tags.map(t=>(
                    <motion.span key={t} style={{ fontSize:12, color:A, fontWeight:600, padding:"3px 10px", borderRadius:999, background:"rgba(108,92,231,.08)", cursor:"pointer" }}
                      whileHover={{ background:"rgba(108,92,231,.16)", boxShadow:`0 0 0 2px rgba(108,92,231,.15)` }}>{t}</motion.span>
                  ))}
                </div>

                <GradDivider />

                {/* actions */}
                <div style={{ display:"flex", alignItems:"center", gap:3, paddingTop:8 }}>
                  {[
                    { icon:hearted?"❤️":"🤍", label:String(hearts), onClick:handleHeart, active:hearted, activeColor:A2, activeBg:"rgba(232,67,147,.08)" },
                    { icon:"💬", label:String(POST.comments), onClick:()=>{}, active:false, activeColor:A, activeBg:"" },
                    { icon:"🔗", label:"Share", onClick:handleShare, active:false, activeColor:A, activeBg:"" },
                  ].map((btn,i)=>(
                    <motion.button key={i} onClick={btn.onClick}
                      style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 13px", borderRadius:10, border:"none", background:btn.active?btn.activeBg:"transparent", color:btn.active?btn.activeColor:MUTED, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}
                      whileHover={{ background:btn.activeBg||"rgba(108,92,231,.06)", color:btn.activeColor }}
                      whileTap={{ scale:0.88 }}>
                      <motion.span animate={btn.active&&i===0?{ scale:[1,1.4,1] }:{ scale:1 }} transition={{ duration:0.3 }}>{btn.icon}</motion.span>
                      {btn.label}
                    </motion.button>
                  ))}
                  <motion.button style={{ marginLeft:"auto", padding:"7px 14px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:"transparent", color:MUTED, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                    whileHover={{ borderColor:A2, color:A2, background:"rgba(232,67,147,.06)" }}>🚩 Report</motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* comment input */}
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.3rem", marginBottom:14 }}>
              <div style={{ display:"flex", gap:10 }}>
                <Avatar size={32} />
                <div style={{ flex:1 }}>
                  <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add to the conversation... anonymously 🔒"
                    style={{ width:"100%", minHeight:68, padding:"6px 0", background:"transparent", border:"none", outline:"none", resize:"none", fontSize:13, color:TEXT, fontFamily:"'DM Sans',system-ui,sans-serif", lineHeight:1.6 }} />
                  <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:8, borderTop:`1px solid ${BORDER}` }}>
                    <motion.button
                      style={{ padding:"7px 18px", borderRadius:10, background:comment.trim()?gradBg:SURFACE2, border:"none", color:comment.trim()?"#fff":MUTED, fontSize:13, fontWeight:600, cursor:comment.trim()?"pointer":"default", fontFamily:"inherit", boxShadow:comment.trim()?"0 4px 14px rgba(108,92,231,.28)":"none" }}
                      whileHover={comment.trim()?{ y:-1, boxShadow:"0 6px 20px rgba(108,92,231,.4)" }:{}}
                      whileTap={comment.trim()?{ scale:0.97 }:{}}>
                      Comment anonymously →
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* comments header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800 }}>💬 <AnimCounter to={POST.comments} /> Comments</div>
              <div style={{ display:"flex", gap:5 }}>
                {["Top","New","Controversial"].map(s=>(
                  <motion.button key={s} onClick={()=>setSortBy(s)}
                    style={{ padding:"5px 12px", borderRadius:8, border:`1.5px solid ${sortBy===s?A:BORDER}`, background:sortBy===s?"rgba(108,92,231,.08)":"transparent", color:sortBy===s?A:MUTED, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                    whileHover={{ borderColor:A, color:A }} whileTap={{ scale:0.94 }}>
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            {COMMENTS.map((c,i)=><Comment key={c.id} c={c} index={i} />)}

            <motion.button style={{ width:"100%", padding:"11px", borderRadius:12, border:`1.5px solid ${BORDER}`, background:"transparent", fontSize:13, color:A, fontWeight:600, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}
              whileHover={{ background:SURFACE2, borderColor:A }} whileTap={{ scale:0.98 }}>
              Load more ↓
            </motion.button>
          </div>

          {/* ── RIGHT ── */}
          <div style={{ position:"sticky", top:72 }}>

            {/* stats */}
            <GlassWidget delay={0.1}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>📊 Post stats</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  { val:total, label:"Votes",   animated:true  },
                  { val:POST.comments, label:"Comments", animated:true  },
                  { val:hearts, label:"Reactions",animated:true  },
                  { val:POST.deadline, label:"Closes",   animated:false },
                ].map(s=>(
                  <div key={s.label} style={{ background:SURFACE2, borderRadius:11, padding:"8px 10px", border:`1px solid ${BORDER}` }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:A }}>
                      {s.animated&&typeof s.val==="number" ? <AnimCounter to={s.val} /> : s.val}
                    </div>
                    <div style={{ fontSize:11, color:MUTED }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </GlassWidget>

            {/* vote breakdown — glowing border */}
            <GlassWidget delay={0.14} glowColor={A}>
              <div style={{ position:"absolute", inset:0, borderRadius:18, background:"linear-gradient(135deg,rgba(108,92,231,.06),rgba(232,67,147,.04))", pointerEvents:"none" }} />
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10, position:"relative" }}>🗳️ Vote breakdown</div>
              {opts.map((o,i)=>{
                const pct = Math.round((o.votes/total)*100);
                const colors = [A,A2,"#0f6e56"];
                return (
                  <div key={i} style={{ marginBottom:9, position:"relative" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
                      <span style={{ color:TEXT, fontWeight:500 }}>{o.label}</span>
                      <span style={{ fontWeight:700, color:colors[i%colors.length] }}>{pct}%</span>
                    </div>
                    <div style={{ height:6, background:BORDER, borderRadius:999, overflow:"hidden" }}>
                      <motion.div style={{ height:"100%", background:colors[i%colors.length], borderRadius:999, opacity:0.85 }}
                        initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.9, delay:0.25+i*0.12 }} />
                    </div>
                  </div>
                );
              })}
            </GlassWidget>

            {/* poster */}
            <GlassWidget delay={0.18} glowColor={A2}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>👤 About poster</div>
              <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
                <Avatar size={36} user={POST.user} />
                <div>
                  <div style={{ fontSize:13, fontWeight:700 }}>{POST.user}</div>
                  <div style={{ fontSize:11, color:MUTED }}>Rep: {POST.rep.toLocaleString()}</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:10 }}>
                {[["73%","Accuracy"],["48","Posts"],["#12","Rank"]].map(([v,l])=>(
                  <div key={l} style={{ background:SURFACE2, borderRadius:9, padding:"6px 4px", textAlign:"center", border:`1px solid ${BORDER}` }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:A }}>{v}</div>
                    <div style={{ fontSize:9, color:MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
              <motion.a href={`/profile/shadow_oracle`} style={{ display:"block", textAlign:"center", padding:"7px", borderRadius:10, border:`1.5px solid ${BORDER}`, color:A, fontSize:12, fontWeight:600, cursor:"pointer", textDecoration:"none" }}
                whileHover={{ background:SURFACE2, borderColor:A }}>View profile →</motion.a>
            </GlassWidget>

            {/* related */}
            <GlassWidget delay={0.22}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>🔗 Related</div>
              {[
                { text:"Will GPT-5 make junior devs obsolete?", votes:"3.2k", tag:"#AI" },
                { text:"My company replaced 5 devs with AI last week", votes:"1.8k", tag:"#Tech" },
                { text:"Is learning to code worth it in 2025?", votes:"4.1k", tag:"#Career" },
              ].map((p,i)=>(
                <motion.div key={i} style={{ padding:"7px 0", borderBottom:i<2?`1px solid ${BORDER}`:"none", cursor:"pointer" }}
                  whileHover={{ x:3 }} transition={{ duration:0.13 }}>
                  <div style={{ fontSize:12, color:TEXT, lineHeight:1.45, marginBottom:2, fontWeight:500 }}>{p.text}</div>
                  <div style={{ display:"flex", gap:6 }}>
                    <span style={{ fontSize:10, color:A, fontWeight:600 }}>{p.tag}</span>
                    <span style={{ fontSize:10, color:MUTED }}>🗳️ {p.votes}</span>
                  </div>
                </motion.div>
              ))}
            </GlassWidget>
          </div>
        </div>
      </div>
    </div>
  );
}
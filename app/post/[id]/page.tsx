"use client";
import { useState, useRef, useEffect, use } from "react";
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
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 4px 24px rgba(108,92,231,0.08)",
  ...extra,
});

function Navbar() {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.85rem 2rem", background:"rgba(255,255,255,0.82)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${BORDER}` }}>
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

function PollOption({ label, votes, total, voted, onVote, index, isWinner, revealed }:{
  label:string; votes:number; total:number; voted:boolean; onVote:()=>void; index:number; isWinner:boolean; revealed:boolean;
}) {
  const pct = total>0 ? Math.round((votes/total)*100) : 0;
  const fills = ["rgba(108,92,231,.2)","rgba(232,67,147,.18)","rgba(29,158,117,.18)","rgba(239,159,39,.18)"];
  return (
    <motion.div onClick={!voted&&!revealed?onVote:undefined}
      style={{ borderRadius:13, height:48, display:"flex", alignItems:"center", position:"relative", overflow:"hidden",
        cursor: voted||revealed?"default":"pointer",
        border:`1.5px solid ${isWinner?"#0f6e56":voted?A:BORDER}`, marginBottom:8, background:SURFACE }}
      whileHover={!voted&&!revealed?{ borderColor:A, boxShadow:`0 0 0 3px rgba(108,92,231,.08)` }:{}}
      whileTap={!voted&&!revealed?{ scale:0.985 }:{}} transition={{ duration:0.15 }}>
      <motion.div style={{ position:"absolute", left:0, top:0, height:"100%", background:isWinner?"rgba(29,158,117,.25)":fills[index%fills.length], borderRadius:13 }}
        initial={{ width:0 }} animate={{ width:voted||revealed?`${pct}%`:0 }} transition={{ duration:0.8, ease:"easeOut" }} />
      <span style={{ position:"relative", zIndex:1, padding:"0 16px", fontSize:14, fontWeight:500, flex:1, color:TEXT }}>
        {isWinner && "✓ "}{label}
        {isWinner && <span style={{ fontSize:11, color:"#0f6e56", fontWeight:700, marginLeft:8 }}>leading</span>}
      </span>
      {(voted||revealed) && <span style={{ position:"relative", zIndex:1, padding:"0 16px", fontSize:13, fontWeight:700, color:isWinner?"#0f6e56":MUTED }}>{pct}%</span>}
    </motion.div>
  );
}

function CommentCard({ comment, index, currentUser, postId, onReply }:{
  comment:any; index:number; currentUser:User|null; postId:string; onReply:(parentId:string,text:string)=>void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-20px" });
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.totalHearts||0);
  const [showReplies, setShowReplies] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()||!currentUser) return;
    setSubmitting(true);
    await onReply(comment.id, replyText);
    setReplyText(""); setShowReply(false); setSubmitting(false);
  };

  return (
    <motion.div ref={ref} initial={{ opacity:0, y:14 }} animate={inView?{ opacity:1, y:0 }:{}}
      transition={{ duration:0.3, delay:index*0.05 }} style={{ marginBottom:12 }}>
      <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(108,92,231,.12)", color:A, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0 }}>?</div>
        <div style={{ flex:1 }}>
          <div style={{ ...glass(), borderRadius:14, padding:"0.75rem 1rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
              <span style={{ fontSize:12, fontWeight:700, color:TEXT }}>{comment.author?.anonName||"@anonymous"}</span>
              <span style={{ fontSize:10, background:"rgba(108,92,231,.1)", color:A, padding:"1px 7px", borderRadius:999, fontWeight:700 }}>anon</span>
              <span style={{ fontSize:11, color:MUTED, marginLeft:"auto" }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <p style={{ fontSize:13, lineHeight:1.65, color:TEXT }}>{comment.text}</p>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:5, paddingLeft:4 }}>
            <motion.button onClick={()=>{ setLiked(l=>!l); setLikes((l:number)=>liked?l-1:l+1); }}
              style={{ fontSize:12, color:liked?A2:MUTED, cursor:"pointer", background:"transparent", border:"none", fontFamily:"inherit" }}
              whileHover={{ color:A2 }} whileTap={{ scale:0.88 }}>{liked?"❤️":"🤍"} {likes}</motion.button>
            <motion.button onClick={()=>setShowReply(r=>!r)}
              style={{ fontSize:12, color:MUTED, cursor:"pointer", background:"transparent", border:"none", fontFamily:"inherit" }}
              whileHover={{ color:A }}>Reply</motion.button>
            {comment.replies?.length>0 && (
              <motion.button onClick={()=>setShowReplies(r=>!r)}
                style={{ fontSize:12, color:A, cursor:"pointer", background:"transparent", border:"none", fontFamily:"inherit", fontWeight:600 }}
                whileHover={{ opacity:0.8 }}>
                {showReplies?"Hide":"Show"} {comment.replies.length} {comment.replies.length===1?"reply":"replies"}
              </motion.button>
            )}
          </div>
          <AnimatePresence>
            {showReply && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                transition={{ duration:0.2 }} style={{ overflow:"hidden", marginTop:8 }}>
                <div style={{ display:"flex", gap:8 }}>
                  <input value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Write a reply..."
                    style={{ flex:1, padding:"8px 12px", borderRadius:10, border:`1.5px solid ${BORDER}`, background:SURFACE, fontSize:13, color:TEXT, outline:"none", fontFamily:"inherit" }}
                    onFocus={e=>e.target.style.borderColor=A} onBlur={e=>e.target.style.borderColor=BORDER} />
                  <motion.button onClick={handleReply} disabled={!replyText.trim()||submitting}
                    style={{ padding:"8px 14px", borderRadius:10, background:replyText.trim()?gradBg:SURFACE2, border:"none", color:replyText.trim()?"#fff":MUTED, fontSize:12, fontWeight:600, cursor:replyText.trim()?"pointer":"default", fontFamily:"inherit" }}
                    whileHover={replyText.trim()?{ y:-1 }:{}} whileTap={replyText.trim()?{ scale:0.95 }:{}}>
                    {submitting?"...":"Reply"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showReplies && comment.replies?.length>0 && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{ marginTop:8, paddingLeft:14, borderLeft:`2px solid ${BORDER}` }}>
                {comment.replies.map((r:any)=>(
                  <div key={r.id} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                    <div style={{ width:26, height:26, borderRadius:"50%", background:SURFACE2, color:MUTED, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>?</div>
                    <div style={{ flex:1 }}>
                      <div style={{ ...glass(), borderRadius:12, padding:"0.6rem 0.85rem" }}>
                        <div style={{ fontSize:11, fontWeight:700, color:TEXT, marginBottom:3 }}>{r.author?.anonName||"@anonymous"}</div>
                        <p style={{ fontSize:12, color:TEXT, lineHeight:1.6 }}>{r.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function Skeleton() {
  return (
    <div style={{ ...glass(), borderRadius:18, padding:"1.4rem" }}>
      {[100,80,60,90,50].map((w,i)=>(
        <motion.div key={i} animate={{ opacity:[0.4,0.7,0.4] }} transition={{ duration:1.5, repeat:Infinity, delay:i*0.1 }}
          style={{ height:14, borderRadius:999, background:SURFACE2, width:`${w}%`, marginBottom:12 }} />
      ))}
    </div>
  );
}

export default function PostDetailPage({ params: paramsPromise }:{ params: Promise<{ id:string }> }) {
  const params = use(paramsPromise);
  const [post, setPost]         = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [currentUser, setCurrentUser] = useState<User|null>(null);
  const [voted, setVoted]       = useState<number|null>(null);
  const [opts, setOpts]         = useState<any[]>([]);
  const [total, setTotal]       = useState(0);
  const [hearted, setHearted]   = useState(false);
  const [hearts, setHearts]     = useState(0);
  const [comment, setComment]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      if (!user) window.location.href = "/";
    });
    return ()=>unsub();
  },[]);

  useEffect(()=>{
    fetch(`/api/posts/${params.id}`)
      .then(r=>r.json())
      .then(d=>{
        setPost(d.post);
        setOpts(d.post?.options||[]);
        setTotal(d.post?.totalVotes||0);
        setHearts(d.post?.totalHearts||0);
        setComments(d.post?.comments||[]);
        setLoading(false);
      })
      .catch(()=>setLoading(false));
  },[params.id]);

  const handleVote = async (i:number) => {
    if (voted!==null||!currentUser||!post) return;
    setVoted(i);
    setOpts((o:any[])=>o.map((x:any,idx:number)=>idx===i?{...x,votes:(x.votes||0)+1}:x));
    setTotal(t=>t+1);
    await fetch(`/api/posts/${params.id}/vote`, {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ firebaseUid:currentUser.uid, optionIndex:i }),
    });
  };

  const handleHeart = async () => {
    if (!currentUser) return;
    setHearted(h=>!h);
    setHearts(h=>hearted?h-1:h+1);
    await fetch(`/api/posts/${params.id}/heart`, {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ firebaseUid:currentUser.uid }),
    });
  };

  const handleComment = async () => {
    if (!comment.trim()||!currentUser) return;
    setSubmitting(true);
    const res = await fetch(`/api/posts/${params.id}/comment`, {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ firebaseUid:currentUser.uid, text:comment }),
    });
    if (res.ok) {
      const data = await res.json();
      setComments(c=>[data.comment,...c]);
      setComment("");
    }
    setSubmitting(false);
  };

  const handleReply = async (parentId:string, text:string) => {
    if (!currentUser) return;
    const res = await fetch(`/api/posts/${params.id}/comment`, {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ firebaseUid:currentUser.uid, text, parentId }),
    });
    if (res.ok) {
      const data = await res.json();
      setComments(prev=>prev.map((c:any)=>c.id===parentId?{...c,replies:[...(c.replies||[]),data.comment]}:c));
    }
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth:900, margin:"0 auto", padding:"2rem 1.5rem" }}><Skeleton /></div>
    </div>
  );

  if (!post) return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <Navbar />
      <div style={{ textAlign:"center", padding:"5rem", color:MUTED }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🔮</div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800 }}>Post not found</div>
      </div>
    </div>
  );

  const isPoll = post.isPoll || post.type==="prediction";
  const deadline = post.deadline ? new Date(post.deadline) : null;
  const daysLeft = deadline ? Math.max(0,Math.ceil((deadline.getTime()-Date.now())/(1000*60*60*24))) : null;

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'DM Sans',system-ui,sans-serif", color:TEXT }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse at 10% 10%, rgba(108,92,231,.07) 0%, transparent 55%)" }} />
      <div style={{ position:"relative", zIndex:1 }}>
        <Navbar />
        <div style={{ maxWidth:980, margin:"0 auto", padding:"1.8rem 1.5rem 4rem", display:"grid", gridTemplateColumns:"1fr 300px", gap:"1.6rem" }}>

          {/* LEFT */}
          <div>
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
              style={{ ...glass(), borderRadius:20, padding:"1.4rem 1.6rem", marginBottom:14 }}>

              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:42, height:42, borderRadius:"50%", background:gradBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"#fff", flexShrink:0 }}>?</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:TEXT }}>{post.author?.anonName||"@anonymous"}</span>
                    <span style={{ fontSize:10, background:"rgba(108,92,231,.1)", color:A, padding:"1px 8px", borderRadius:999, fontWeight:700 }}>anon</span>
                    <span style={{ fontSize:10, background:isPoll?"rgba(232,67,147,.1)":"rgba(239,159,39,.12)", color:isPoll?A2:"#7a4a08", padding:"1px 8px", borderRadius:999, fontWeight:700 }}>{post.type}</span>
                    {post.isTrending && <span style={{ fontSize:10, background:"rgba(230,126,34,.1)", color:"#e67e22", padding:"1px 8px", borderRadius:999, fontWeight:700 }}>🔥 Trending</span>}
                  </div>
                  <div style={{ fontSize:12, color:MUTED, marginTop:3 }}>
                    {new Date(post.createdAt).toLocaleDateString("en",{month:"long",day:"numeric",year:"numeric"})} · Rep: {post.author?.rep?.toLocaleString()||0}
                  </div>
                </div>
              </div>

              <p style={{ fontSize:15, lineHeight:1.75, color:TEXT, marginBottom:isPoll?14:10 }}>{post.text}</p>

              {post.mediaUrl && (
                <img src={post.mediaUrl} alt="" style={{ width:"100%", maxHeight:320, objectFit:"cover", borderRadius:14, marginBottom:14, display:"block" }} />
              )}

              {post.revealed && (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderRadius:14, background:"rgba(29,158,117,.1)", border:"1.5px solid rgba(29,158,117,.25)", marginBottom:12 }}>
                  <span style={{ fontSize:22 }}>✅</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#0f6e56" }}>
                      Outcome revealed — "{opts[post.winningOption]?.label}" was leading!
                    </div>
                    <div style={{ fontSize:11, color:"#0f6e56" }}>Predictors who got this right earned +12 rep each</div>
                  </div>
                </motion.div>
              )}

              {isPoll && opts.length>0 && (
                <div style={{ marginBottom:10 }}>
                  {opts.map((o:any,i:number)=>(
                    <PollOption key={i} label={o.label} votes={o.votes||0} total={total} voted={voted===i}
                      onVote={()=>handleVote(i)} index={i} isWinner={post.revealed&&post.winningOption===i} revealed={post.revealed} />
                  ))}
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:MUTED, marginTop:4 }}>
                    <span>{total.toLocaleString()} votes · {voted!==null?"✓ You voted":post.revealed?"Voting closed":"Tap to vote"}</span>
                    {daysLeft!==null && <span>⏰ {daysLeft>0?`${daysLeft} days left`:"Closed"}</span>}
                  </div>
                </div>
              )}

              {post.tags?.length>0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                  {post.tags.map((t:string)=>(
                    <span key={t} style={{ fontSize:12, color:A, fontWeight:600, padding:"3px 10px", borderRadius:999, background:"rgba(108,92,231,.08)" }}>{t}</span>
                  ))}
                </div>
              )}

              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 0", borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}`, marginBottom:12 }}>
                <span style={{ fontSize:12, color:MUTED }}>Poster accuracy</span>
                <div style={{ flex:1, height:5, background:BORDER, borderRadius:999, overflow:"hidden" }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${post.author?.accuracy||0}%` }} transition={{ duration:0.8 }}
                    style={{ height:"100%", background:gradBg, borderRadius:999 }} />
                </div>
                <span style={{ fontSize:12, fontWeight:700, color:A }}>{post.author?.accuracy||0}%</span>
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <motion.button onClick={handleHeart}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, border:"none", background:hearted?"rgba(232,67,147,.08)":"transparent", color:hearted?A2:MUTED, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}
                  whileHover={{ background:"rgba(108,92,231,.07)" }} whileTap={{ scale:0.88 }}>
                  <motion.span animate={hearted?{ scale:[1,1.4,1] }:{ scale:1 }} transition={{ duration:0.3 }}>{hearted?"❤️":"🤍"}</motion.span> {hearts}
                </motion.button>
                <motion.button style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, border:"none", background:"transparent", color:MUTED, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}
                  whileHover={{ color:A }}>💬 {post.totalComments||0}</motion.button>
                <motion.button onClick={()=>navigator.clipboard?.writeText(window.location.href)}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, border:"none", background:"transparent", color:MUTED, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}
                  whileHover={{ color:A }} whileTap={{ scale:0.93 }}>🔗 Share</motion.button>
              </div>
            </motion.div>

            {/* comment box */}
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.3rem", marginBottom:14 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>💬 Join the conversation</div>
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(108,92,231,.12)", color:A, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0 }}>?</div>
                <div style={{ flex:1 }}>
                  <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Share your thoughts anonymously..."
                    style={{ width:"100%", minHeight:70, padding:"8px 0", background:"transparent", border:"none", outline:"none", resize:"none", fontSize:13, color:TEXT, fontFamily:"'DM Sans',system-ui,sans-serif", lineHeight:1.6, boxSizing:"border-box" }} />
                  <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:8, borderTop:`1px solid ${BORDER}` }}>
                    <motion.button onClick={handleComment} disabled={!comment.trim()||submitting}
                      style={{ padding:"8px 18px", borderRadius:10, background:comment.trim()&&!submitting?gradBg:SURFACE2, border:"none", color:comment.trim()&&!submitting?"#fff":MUTED, fontSize:13, fontWeight:600, cursor:comment.trim()&&!submitting?"pointer":"default", fontFamily:"inherit" }}
                      whileHover={comment.trim()?{ y:-1 }:{}} whileTap={comment.trim()?{ scale:0.96 }:{}}>
                      {submitting?"Posting...":"Post anonymously →"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
              Comments ({comments.length})
              <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${BORDER},transparent)` }} />
            </div>

            <AnimatePresence mode="popLayout">
              {comments.length>0 ? comments.map((c:any,i:number)=>(
                <CommentCard key={c.id} comment={c} index={i} currentUser={currentUser} postId={params.id} onReply={handleReply} />
              )) : (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:"center", padding:"2.5rem", color:MUTED }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>💬</div>
                  <div style={{ fontSize:13, fontWeight:500 }}>No comments yet — be the first!</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT */}
          <div style={{ position:"sticky", top:72, display:"flex", flexDirection:"column", gap:12, alignSelf:"start" }}>
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>📊 Post stats</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  { val:total.toLocaleString(), label:"Votes",    color:A  },
                  { val:post.totalComments||0,  label:"Comments", color:A2 },
                  { val:hearts,                 label:"Reactions",color:"#e67e22" },
                  { val:daysLeft!==null?`${daysLeft}d left`:"—", label:"Closes", color:MUTED },
                ].map(s=>(
                  <div key={s.label} style={{ background:SURFACE2, borderRadius:11, padding:"9px 11px", border:`1px solid ${BORDER}` }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {isPoll && opts.length>0 && (voted!==null||post.revealed) && (
              <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.14 }}
                style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>🗳️ Vote breakdown</div>
                {opts.map((o:any,i:number)=>{
                  const pct = total>0?Math.round(((o.votes||0)/total)*100):0;
                  return (
                    <div key={i} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                        <span style={{ color:TEXT, fontWeight:500 }}>{o.label}</span>
                        <span style={{ fontWeight:700, color:post.revealed&&post.winningOption===i?"#0f6e56":A }}>{pct}%</span>
                      </div>
                      <div style={{ height:5, background:BORDER, borderRadius:999, overflow:"hidden" }}>
                        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.8, delay:i*0.1 }}
                          style={{ height:"100%", background:post.revealed&&post.winningOption===i?"#0f6e56":gradBg, borderRadius:999 }} />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.18 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>👤 About poster</div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:gradBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff", flexShrink:0 }}>?</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:TEXT }}>{post.author?.anonName||"@anonymous"}</div>
                  <div style={{ fontSize:11, color:MUTED }}>Rep: {post.author?.rep?.toLocaleString()||0}</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
                {[
                  { val:`${Math.round(post.author?.accuracy||0)}%`, label:"Accuracy" },
                  { val:post.author?.totalPredictions||0,           label:"Predictions" },
                  { val:`#${post.author?.rank||"—"}`,               label:"Rank" },
                ].map(s=>(
                  <div key={s.label} style={{ background:SURFACE2, borderRadius:10, padding:"7px 8px", textAlign:"center", border:`1px solid ${BORDER}` }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:A }}>{s.val}</div>
                    <div style={{ fontSize:10, color:MUTED }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.22 }}
              style={{ ...glass(), borderRadius:18, padding:"1.1rem 1.2rem" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, marginBottom:10 }}>🔮 More predictions</div>
              <motion.a href="/feed" style={{ display:"block", width:"100%", padding:"9px", borderRadius:10, border:`1.5px solid ${BORDER}`, color:A, fontSize:12, fontWeight:600, cursor:"pointer", textDecoration:"none", textAlign:"center" }}
                whileHover={{ background:SURFACE2, borderColor:A }}>Browse feed →</motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
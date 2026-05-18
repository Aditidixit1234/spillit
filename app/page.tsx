"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const A = "#6c5ce7";
const A2 = "#e84393";
const BG = "#f3f1ff";
const MUTED = "#7b72a8";
const TEXT = "#1a1730";
const BORDER = "#ddd8f5";
const SURFACE2 = "#ede9ff";

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1.5px solid rgba(255,255,255,0.85)",
};
const gradBg = "linear-gradient(135deg,#6c5ce7,#e84393)";

function RevealSection({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }} style={style}>
      {children}
    </motion.div>
  );
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let c = 0; const step = Math.ceil(target / 40);
    const t = setInterval(() => { c = Math.min(c + step, target); setN(c); if (c >= target) clearInterval(t); }, 35);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref} style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: A }}>{n}{suffix}</span>;
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function Navbar({ setScreen }: { setScreen: (s: string) => void }) {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2.5rem", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: `1px solid ${BORDER}` }}>
      <div onClick={() => setScreen("landing")} style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: A, cursor: "pointer", letterSpacing: "-0.04em" }}>
        splitt<span style={{ color: A2 }}>.</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <motion.button onClick={() => setScreen("login")}
          style={{ padding: "9px 22px", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", border: `2px solid ${A}`, color: A, background: "transparent", fontFamily: "inherit" }}
          whileHover={{ background: A, color: "#fff" }} whileTap={{ scale: 0.97 }}>
          Log in
        </motion.button>
        <motion.button onClick={() => setScreen("signup")}
          style={{ padding: "9px 22px", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", background: gradBg, border: "none", color: "#fff", fontFamily: "inherit", boxShadow: "0 4px 15px rgba(108,92,231,.35)" }}
          whileHover={{ y: -2, boxShadow: "0 6px 22px rgba(108,92,231,.45)" }} whileTap={{ scale: 0.97 }}>
          Get started →
        </motion.button>
      </div>
    </nav>
  );
}

function FloatCard({ style, children }: { style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div style={{ ...glass, borderRadius: 20, padding: "1rem 1.1rem", boxShadow: "0 8px 32px rgba(108,92,231,0.12)", position: "absolute", ...style }}>
      {children}
    </div>
  );
}

function AnonTag() {
  return <span style={{ fontSize: 10, background: "rgba(108,92,231,.12)", color: A, padding: "1px 7px", borderRadius: 999, fontWeight: 700 }}>anon</span>;
}

function Avatar({ bg, color }: { bg: string; color: string }) {
  return <div style={{ width: 30, height: 30, borderRadius: "50%", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>?</div>;
}

function PollBar({ label, pct, fill }: { label: string; pct: string; fill: string }) {
  return (
    <div style={{ background: "rgba(108,92,231,.08)", borderRadius: 999, height: 26, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: pct, background: fill, borderRadius: 999 }} />
      <span style={{ position: "relative", zIndex: 1, padding: "0 9px", fontSize: 12, fontWeight: 500 }}>{label}</span>
      <span style={{ position: "absolute", right: 9, fontSize: 11, fontWeight: 700, color: MUTED, zIndex: 1 }}>{pct}</span>
    </div>
  );
}

const FEAT_THEMES: Record<string, { shadow: string; border: string; orb: string; iconBg: string }> = {
  purple: { shadow: "0 12px 40px rgba(108,92,231,.22)", border: "rgba(108,92,231,.35)", orb: "rgba(108,92,231,.25)", iconBg: "rgba(108,92,231,.12)" },
  pink:   { shadow: "0 12px 40px rgba(232,67,147,.2)",  border: "rgba(232,67,147,.3)",  orb: "rgba(232,67,147,.25)", iconBg: "rgba(232,67,147,.12)" },
  teal:   { shadow: "0 12px 40px rgba(29,158,117,.18)", border: "rgba(29,158,117,.3)",  orb: "rgba(29,158,117,.2)",  iconBg: "rgba(29,158,117,.12)" },
  amber:  { shadow: "0 12px 40px rgba(239,159,39,.2)",  border: "rgba(239,159,39,.35)", orb: "rgba(239,159,39,.25)", iconBg: "rgba(239,159,39,.12)" },
  blue:   { shadow: "0 12px 40px rgba(55,138,221,.18)", border: "rgba(55,138,221,.3)",  orb: "rgba(55,138,221,.2)",  iconBg: "rgba(55,138,221,.12)" },
};

function FeatCard({ theme = "purple", icon, pill, pillBg, pillColor, title, desc, wide = false, children }: {
  theme?: string; icon?: string; pill?: string; pillBg?: string; pillColor?: string;
  title?: string; desc?: string; wide?: boolean; children?: React.ReactNode;
}) {
  const t = FEAT_THEMES[theme];
  return (
    <motion.div style={{ ...glass, borderRadius: 20, padding: "1.5rem", position: "relative", overflow: "hidden", cursor: "pointer", gridColumn: wide ? "span 2" : undefined }}
      whileHover={{ y: -5, boxShadow: t.shadow, borderColor: t.border }} transition={{ duration: 0.25 }}>
      <motion.div style={{ position: "absolute", bottom: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: t.orb, filter: "blur(28px)", pointerEvents: "none" }}
        initial={{ opacity: 0 }} whileHover={{ opacity: 0.55 }} transition={{ duration: 0.35 }} />
      <motion.div style={{ position: "absolute", top: 16, right: 16, width: 28, height: 28, borderRadius: "50%", background: t.orb, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, zIndex: 2 }}
        initial={{ opacity: 0, x: -6 }} whileHover={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>↗</motion.div>
      {wide ? children : (
        <>
          <motion.div style={{ width: 48, height: 48, borderRadius: 14, background: t.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}
            whileHover={{ scale: 1.12, rotate: -4 }} transition={{ duration: 0.3 }}>{icon}</motion.div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999, display: "inline-block", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em", background: pillBg, color: pillColor }}>{pill}</span>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{title}</h3>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65 }}>{desc}</p>
        </>
      )}
    </motion.div>
  );
}

function AuthScreen({ mode, setScreen }: { mode: string; setScreen: (s: string) => void }) {
  const isLogin = mode === "login";
  const [email, setEmail] = useState(""); const [pass, setPass] = useState(""); const [user, setUser] = useState(""); const [err, setErr] = useState(false);
  const submit = () => {
    if (!email.includes("@") || pass.length < (isLogin ? 1 : 8) || (!isLogin && !user)) { setErr(true); return; }
    setErr(false); alert(isLogin ? `Firebase login fires here.\nEmail: ${email}` : `Firebase signup fires here.\nUsername: ${user}\nEmail: ${email}`);
  };
  const inp: React.CSSProperties = { width: "100%", padding: "11px 13px", background: "rgba(255,255,255,.85)", border: `1.5px solid ${BORDER}`, borderRadius: 10, color: TEXT, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <Navbar setScreen={setScreen} />
      <div style={{ minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <motion.div style={{ ...glass, borderRadius: 24, padding: "2.3rem", width: "100%", maxWidth: 420, boxShadow: "0 8px 40px rgba(108,92,231,.12)" }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: A, marginBottom: 4 }}>splitt<span style={{ color: A2 }}>.</span></div>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 22 }}>{isLogin ? "Welcome back. The crowd missed you." : "Join the prediction underground."}</div>
          <div style={{ display: "flex", background: SURFACE2, borderRadius: 12, padding: 4, marginBottom: 20 }}>
            {["login","signup"].map(t => (
              <button key={t} onClick={() => setScreen(t)} style={{ flex: 1, padding: "9px", borderRadius: 9, border: mode === t ? `1.5px solid ${BORDER}` : "none", background: mode === t ? "#fff" : "transparent", fontSize: 13, color: mode === t ? A : MUTED, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                {t === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 13px", borderRadius: 10, background: "rgba(108,92,231,.08)", border: "1.5px solid rgba(108,92,231,.2)", fontSize: 12, color: A, marginBottom: 16, fontWeight: 500 }}>🔒 Your identity stays hidden to other users</div>
          {err && <div style={{ padding: "9px 13px", borderRadius: 8, background: "#fbeaf0", border: "1.5px solid #f4c0d1", color: "#993556", fontSize: 12, marginBottom: 12 }}>{isLogin ? "Invalid email or password." : "Please fill in all fields correctly."}</div>}
          {!isLogin && <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 12, color: MUTED, fontWeight: 500, marginBottom: 5 }}>Username (shown publicly)</label><input style={inp} placeholder="@mystery_oracle" value={user} onChange={e => setUser(e.target.value)} /></div>}
          <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 12, color: MUTED, fontWeight: 500, marginBottom: 5 }}>Email</label><input style={inp} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 12, color: MUTED, fontWeight: 500, marginBottom: 5 }}>Password</label><input style={inp} type="password" placeholder={isLogin ? "••••••••" : "min. 8 characters"} value={pass} onChange={e => setPass(e.target.value)} /></div>
          <motion.button onClick={submit} style={{ width: "100%", padding: 13, background: gradBg, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 18px rgba(108,92,231,.3)" }}
            whileHover={{ y: -1, boxShadow: "0 6px 24px rgba(108,92,231,.4)" }} whileTap={{ scale: 0.98 }}>
            {isLogin ? "Log in to Splitt" : "Create my account →"}
          </motion.button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0", color: MUTED, fontSize: 12 }}>
            <span style={{ flex: 1, height: 1, background: BORDER }} />or<span style={{ flex: 1, height: 1, background: BORDER }} />
          </div>
          <button onClick={() => alert("Firebase Google OAuth fires here.")} style={{ width: "100%", padding: 11, borderRadius: 10, background: "rgba(255,255,255,.85)", border: `1.5px solid ${BORDER}`, color: TEXT, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, fontFamily: "inherit", fontWeight: 500 }}>
            <GoogleIcon /> Continue with Google
          </button>
          <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: MUTED }}>
            {isLogin ? <span>No account? <span style={{ color: A, fontWeight: 600, cursor: "pointer" }} onClick={() => setScreen("signup")}>Sign up free</span></span>
              : <span>Already have an account? <span style={{ color: A, fontWeight: 600, cursor: "pointer" }} onClick={() => setScreen("login")}>Log in</span></span>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [screen, setScreen] = useState("landing");

  useEffect(() => {
    const id = "splitt-kf";
    if (document.getElementById(id)) return;
    const s = document.createElement("style"); s.id = id;
    s.textContent = `
      @keyframes float1{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      @keyframes float3{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
      @keyframes pdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
      .f1{animation:float1 4s ease-in-out infinite}
      .f2{animation:float2 4.5s ease-in-out infinite}
      .f3{animation:float3 3.8s ease-in-out infinite}
      .pdot{animation:pdot 1.8s ease-in-out infinite}
    `;
    document.head.appendChild(s);
  }, []);

  if (screen === "login" || screen === "signup") return <AuthScreen mode={screen} setScreen={setScreen} />;

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans',system-ui,sans-serif", color: TEXT }}>
      <Navbar setScreen={setScreen} />

      {/* HERO */}
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "5rem 2rem 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 999, border: "1.5px solid #c4bee8", background: "#eeedfe", fontSize: 11, color: A, marginBottom: 22, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <span className="pdot" style={{ width: 7, height: 7, borderRadius: "50%", background: A, display: "inline-block" }} />
            Now in public beta
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(2.4rem,5vw,3.6rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.04em", marginBottom: 16 }}>
            Predict.<br />
            <span style={{ background: gradBg, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Anonymously.</span><br />
            <span style={{ color: A2 }}>Win.</span>
          </h1>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.75, marginBottom: 28, maxWidth: 430 }}>
            Post confessions, make bold social predictions, and vote on outcomes — all without revealing who you are. The crowd decides what's real.
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
            <motion.button onClick={() => setScreen("signup")} style={{ padding: "13px 30px", borderRadius: 999, background: gradBg, border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 18px rgba(108,92,231,.35)" }}
              whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(108,92,231,.45)" }} whileTap={{ scale: 0.97 }}>Start predicting →</motion.button>
            <motion.button onClick={() => setScreen("login")} style={{ padding: "13px 28px", borderRadius: 999, background: "transparent", border: "2px solid #b8b0e8", color: TEXT, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              whileHover={{ background: SURFACE2, borderColor: A }} whileTap={{ scale: 0.97 }}>Log in</motion.button>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {[{ t: 10, s: "K+", l: "daily predictions" }, { t: 1, s: "K+", l: "submissions today" }, { t: 98, s: "%", l: "stay anonymous" }].map(x => (
              <div key={x.l} style={{ display: "flex", flexDirection: "column" }}>
                <Counter target={x.t} suffix={x.s} />
                <span style={{ fontSize: 11, color: MUTED }}>{x.l}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Floating Cards */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          style={{ position: "relative", height: 420 }}>
          <FloatCard style={{ top: 0, right: 0, width: 300 }}>
            <div className="f1">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Avatar bg="rgba(108,92,231,.15)" color={A} />
                <div><div style={{ fontSize: 12, fontWeight: 600 }}>@shadow_oracle <AnonTag /></div><div style={{ fontSize: 10, color: MUTED }}>2 mins ago</div></div>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.55, marginBottom: 10 }}>Will AI replace software engineers by 2027? I'm betting yes — my whole team got notices last week.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
                <PollBar label="Yes, definitely" pct="68%" fill="rgba(108,92,231,.18)" />
                <PollBar label="No, never" pct="32%" fill="rgba(232,67,147,.15)" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 8, borderTop: "1px solid rgba(108,92,231,.1)" }}>
                <span style={{ fontSize: 11, color: MUTED }}>🔮 1.2k</span><span style={{ fontSize: 11, color: MUTED }}>💬 84</span>
                <span style={{ marginLeft: "auto", fontSize: 10, background: "rgba(29,158,117,.12)", color: "#0f6e56", padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>+12 rep</span>
              </div>
            </div>
          </FloatCard>

          <FloatCard style={{ bottom: 20, left: 0, width: 270 }}>
            <div className="f2">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Avatar bg="rgba(232,67,147,.15)" color={A2} />
                <div><div style={{ fontSize: 12, fontWeight: 600 }}>@ghost_9182 <AnonTag /></div><div style={{ fontSize: 10, color: MUTED }}>14 mins ago</div></div>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.55, marginBottom: 10 }}>My startup is about to run out of runway. Confession: I haven't told the team yet.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: MUTED }}>❤️ 342</span><span style={{ fontSize: 11, color: MUTED }}>💬 56</span>
                <span style={{ marginLeft: "auto", fontSize: 10, background: "rgba(232,67,147,.12)", color: A2, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>trending</span>
              </div>
            </div>
          </FloatCard>

          <FloatCard style={{ top: 165, right: 10, width: 185 }}>
            <div className="f3">
              <div style={{ fontSize: 10, fontWeight: 700, color: A, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>🔥 Hot topics</div>
              {[["#AITakeover","2.1k"],["#StartupFail","891"],["#CryptoAgain","654"]].map(([tag,count],i) => (
                <div key={tag} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "4px 0", borderBottom: i < 2 ? "1px solid rgba(108,92,231,.1)" : "none" }}>
                  <span>{tag}</span><span style={{ color: MUTED, fontSize: 10 }}>{count}</span>
                </div>
              ))}
            </div>
          </FloatCard>
        </motion.div>
      </div>

      {/* TRUST BAR */}
      <RevealSection>
        <div style={{ background: "rgba(255,255,255,.6)", backdropFilter: "blur(12px)", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "1.1rem 2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap" }}>
          {["🔒 End-to-end anonymous","⚡ Real-time outcomes","🎯 AI-powered feed","🛡️ Content moderation","📱 All devices"].map(t => (
            <span key={t} style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </RevealSection>

      {/* HOW IT WORKS */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "5rem 2rem" }}>
        <RevealSection style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: A, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>How it works</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 10 }}>Four steps to the truth</h2>
          <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, maxWidth: 460, margin: "0 auto" }}>Anyone can post, anyone can vote. No names, no judgment. Just raw predictions and real outcomes.</p>
        </RevealSection>
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ position: "absolute", left: 35, top: 40, bottom: 40, width: 2, background: gradBg, opacity: 0.2, borderRadius: 2 }} />
          {[
            { n:"step 1", e:"✍️", tag:"Identity-free", tb:"#eeedfe", tc:"#534ab7", title:"Post anonymously", desc:"Share a confession or bold prediction. Your real identity is never revealed — not even to us." },
            { n:"step 2", e:"🗳️", tag:"Crowdsourced",  tb:"#fbeaf0", tc:"#993556", title:"The crowd votes",  desc:"Other users vote on your prediction. Watch live percentages shift in real time as opinions pour in." },
            { n:"step 3", e:"🏆", tag:"Gamified",      tb:"#e1f5ee", tc:"#0f6e56", title:"Outcomes reveal", desc:"When the time comes the outcome is revealed. Accurate predictors earn rep and climb the leaderboard." },
            { n:"step 4", e:"📈", tag:"Reputation",    tb:"#faeeda", tc:"#854f0b", title:"Build your clout",desc:"Your prediction accuracy is your currency. The better you predict, the more influence your votes carry." },
          ].map((s, i) => (
            <RevealSection key={i} delay={i * 0.1} style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 28 }}>
              <motion.div style={{ width: 70, height: 70, borderRadius: "50%", ...glass, border: "2px solid rgba(108,92,231,.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1, boxShadow: "0 4px 16px rgba(108,92,231,.12)", cursor: "pointer" }}
                whileHover={{ scale: 1.08, borderColor: A }} transition={{ duration: 0.2 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: A, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.n}</span>
                <span style={{ fontSize: 20 }}>{s.e}</span>
              </motion.div>
              <motion.div style={{ flex: 1, ...glass, borderRadius: 16, padding: "1.1rem 1.3rem", boxShadow: "0 4px 20px rgba(108,92,231,.08)", marginTop: 6, cursor: "pointer" }}
                whileHover={{ x: 4, boxShadow: "0 6px 28px rgba(108,92,231,.15)" }} transition={{ duration: 0.2 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 999, display: "inline-block", marginBottom: 6, background: s.tb, color: s.tc, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.tag}</span>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, marginBottom: 5 }}>{s.title}</h3>
                <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.65 }}>{s.desc}</p>
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem 5rem" }}>
        <RevealSection>
          <div style={{ fontSize: 11, fontWeight: 700, color: A, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Features</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>Built for the bold</h2>
          <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, maxWidth: 480, marginBottom: 28 }}>Everything you need to predict, confess, and engage — without ever showing who you are.</p>
        </RevealSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <RevealSection style={{ gridColumn: "span 2" }}>
            <FeatCard theme="purple" wide>
              <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <motion.div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(108,92,231,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 12 }} whileHover={{ scale: 1.12, rotate: -4 }}>📈</motion.div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999, display: "inline-block", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em", background: "#eeedfe", color: "#534ab7" }}>Core</span>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, marginBottom: 8 }}>Personalized trending feed</h3>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65 }}>Our feed-ranking algorithm surfaces the most relevant predictions for you — based on vote history, rep score, and engagement patterns. No two feeds look the same. Under 100ms for 10,000+ daily requests.</p>
                </div>
                <div style={{ flexShrink: 0, width: 170, background: "rgba(108,92,231,.06)", border: "1.5px solid rgba(108,92,231,.15)", borderRadius: 14, padding: "1rem" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: A, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Feed signals</div>
                  {[["Relevance",92],["Engagement",78],["Rep score",65],["Recency",55]].map(([lbl,w]) => (
                    <div key={lbl} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: MUTED, marginBottom: 3 }}><span>{lbl}</span><span>{w}%</span></div>
                      <div style={{ height: 6, borderRadius: 999, background: "rgba(108,92,231,.1)", overflow: "hidden" }}>
                        <motion.div style={{ height: "100%", borderRadius: 999, background: gradBg }} initial={{ width: 0 }} whileInView={{ width: `${w}%` }} transition={{ duration: 1, delay: 0.2 }} viewport={{ once: true }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FeatCard>
          </RevealSection>
          {[
            { theme:"pink",  icon:"🔮", pill:"Gamification", pb:"#fbeaf0", pc:"#993556", title:"Prediction polls & reveals", desc:"Vote before deadline, watch live percentages, get notified on reveals. Every correct call adds to your rep.", delay:0.05 },
            { theme:"teal",  icon:"🛡️", pill:"Trust & Safety", pb:"#e1f5ee", pc:"#0f6e56", title:"Moderation pipeline", desc:"Automated content filtering catches harmful posts before the feed. Community flagging and human review built in.", delay:0.1 },
            { theme:"amber", icon:"🎬", pill:"Media", pb:"#faeeda", pc:"#854f0b", title:"Rich media posts", desc:"Upload images and videos with your predictions. Cloudinary handles compression and global CDN delivery.", delay:0.15 },
            { theme:"blue",  icon:"⚡", pill:"Identity", pb:"#e6f1fb", pc:"#185fa5", title:"Reputation system", desc:"Your anonymous identity still builds credibility. Accuracy streaks and leaderboard rankings tracked invisibly.", delay:0.2 },
          ].map(f => (
            <RevealSection key={f.title} delay={f.delay}>
              <FeatCard theme={f.theme} icon={f.icon} pill={f.pill} pillBg={f.pb} pillColor={f.pc} title={f.title} desc={f.desc} />
            </RevealSection>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem 5rem" }}>
        <RevealSection>
          <div style={{ fontSize: 11, fontWeight: 700, color: A, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Community</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 24 }}>What predictors say</h2>
        </RevealSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[
            { ab:"rgba(108,92,231,.15)", ac:A,  name:"@silent_prophet", rep:"Rep: 4,820", stars:"★★★★★", text:'"I\'ve been right about 73% of my predictions this month. The rep system makes me think harder before voting."', delay:0 },
            { ab:"rgba(232,67,147,.15)", ac:A2, name:"@nobody_knows_me", rep:"Rep: 2,140", stars:"★★★★★", text:'"Finally a place to say what I actually think without my boss finding out. The feed is weirdly addictive."', delay:0.1 },
            { ab:"rgba(29,158,117,.15)", ac:"#0f6e56", name:"@oracle_zero", rep:"Rep: 9,310", stars:"★★★★☆", text:'"Called 3 startup failures before they happened. The community is smarter than most VC circles I\'ve been in."', delay:0.2 },
          ].map(t => (
            <RevealSection key={t.name} delay={t.delay}>
              <motion.div style={{ ...glass, borderRadius: 18, padding: "1.2rem", boxShadow: "0 4px 18px rgba(108,92,231,.07)", cursor: "pointer" }}
                whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(108,92,231,.14)" }} transition={{ duration: 0.25 }}>
                <div style={{ color: "#f59e0b", fontSize: 12, letterSpacing: 1, marginBottom: 8 }}>{t.stars}</div>
                <p style={{ fontSize: 13, lineHeight: 1.65, marginBottom: 12 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar bg={t.ab} color={t.ac} />
                  <div><div style={{ fontSize: 12, fontWeight: 600 }}>{t.name}</div><div style={{ fontSize: 11, color: MUTED }}>{t.rep}</div></div>
                </div>
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </div>

      {/* CTA BANNER */}
      <RevealSection style={{ maxWidth: 1000, margin: "0 auto 5rem", padding: "0 2rem" }}>
        <div style={{ background: gradBg, borderRadius: 24, padding: "4rem 2.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,.07)", top: -80, left: -80 }} />
          <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", background: "rgba(255,255,255,.05)", bottom: -60, right: -60 }} />
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.6rem,3vw,2.3rem)", fontWeight: 800, color: "#fff", marginBottom: 10, position: "relative", zIndex: 1 }}>Ready to make your first prediction?</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.75)", marginBottom: 28, position: "relative", zIndex: 1 }}>Join thousands of anonymous predictors already shaping the conversation.</p>
          <motion.button onClick={() => setScreen("signup")} style={{ padding: "13px 32px", borderRadius: 999, background: "#fff", border: "none", color: A, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(0,0,0,.15)", position: "relative", zIndex: 1 }}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,.2)" }} whileTap={{ scale: 0.97 }}>
            Get started — it's free →
          </motion.button>
        </div>
      </RevealSection>

      {/* FOOTER */}
      <footer style={{ background: "rgba(255,255,255,.75)", backdropFilter: "blur(12px)", borderTop: `1px solid ${BORDER}`, padding: "1.8rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: A }}>splitt<span style={{ color: A2 }}>.</span></div>
        <div style={{ display: "flex", gap: 20 }}>
          {["About","Privacy","Terms","Contact"].map(l => <span key={l} style={{ fontSize: 12, color: MUTED, cursor: "pointer" }}>{l}</span>)}
        </div>
        <div style={{ fontSize: 12, color: MUTED }}>© 2025 Splitt. All rights reserved.</div>
      </footer>
    </div>
  );
}
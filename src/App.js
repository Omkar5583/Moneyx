import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// ─── FONTS & GLOBAL STYLES ───────────────────────────────────────────────────
const GlobalStyles = () => (
  <>
    <link href="https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --bg: #060608;
        --surface: #0e0e14;
        --surface2: #14141e;
        --border: #1c1c2e;
        --border2: #252538;
        --text: #e8e8f0;
        --muted: #52526e;
        --accent: #6ee7b7;
        --accent2: #f472b6;
        --warn: #fb923c;
        --danger: #f87171;
        --invest: #60a5fa;
        --food: #fbbf24;
        --shop: #a78bfa;
        --sub: #34d399;
      }
      body { background: var(--bg); color: var(--text); font-family: 'Cabinet Grotesk', sans-serif; }
      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: var(--surface); }
      ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

      @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      @keyframes live-ping { 0% { transform: scale(1); opacity:1; } 100% { transform: scale(2.5); opacity:0; } }
      @keyframes count-up { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }

      .fade-up { animation: fadeUp 0.5s ease forwards; }
      .fade-up-1 { animation: fadeUp 0.5s 0.1s ease both; }
      .fade-up-2 { animation: fadeUp 0.5s 0.2s ease both; }
      .fade-up-3 { animation: fadeUp 0.5s 0.3s ease both; }
      .fade-up-4 { animation: fadeUp 0.5s 0.4s ease both; }

      .card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: border-color 0.2s; }
      .card:hover { border-color: var(--border2); }
      .card-lg { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 24px; }

      .btn { font-family: 'Cabinet Grotesk', sans-serif; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 8px; }
      .btn-primary { background: var(--accent); color: #051a10; padding: 12px 24px; font-size: 15px; }
      .btn-primary:hover { background: #4ade80; transform: translateY(-1px); box-shadow: 0 8px 24px #6ee7b730; }
      .btn-ghost { background: transparent; border: 1px solid var(--border2); color: var(--muted); padding: 10px 18px; font-size: 13px; }
      .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
      .btn-danger { background: #1a0808; border: 1px solid #3d1111; color: var(--danger); padding: 10px 18px; font-size: 13px; }

      .tab-btn { font-family: 'Cabinet Grotesk', sans-serif; font-weight: 600; background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 8px 16px; border-radius: 100px; cursor: pointer; font-size: 13px; transition: all 0.15s; white-space: nowrap; }
      .tab-btn.active { background: var(--accent); border-color: var(--accent); color: #051a10; }
      .tab-btn:hover:not(.active) { border-color: var(--accent); color: var(--accent); }

      .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
      .badge-up { background: #1a0808; color: #f87171; border: 1px solid #3d1111; }
      .badge-down-good { background: #051a10; color: #6ee7b7; border: 1px solid #0d3320; }
      .badge-down-bad { background: #1a0808; color: #f87171; border: 1px solid #3d1111; }
      .badge-neutral { background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }

      .live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); position: relative; display: inline-block; }
      .live-dot::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: var(--accent); animation: live-ping 1.5s ease-out infinite; }

      .progress-bar { background: var(--border); border-radius: 100px; overflow: hidden; }
      .progress-fill { height: 100%; border-radius: 100px; transition: width 1s ease; }

      .insight-danger { background: #0d0505; border: 1px solid #3d1111; border-radius: 14px; padding: 16px; }
      .insight-warning { background: #0d0900; border: 1px solid #3d2200; border-radius: 14px; padding: 16px; }
      .insight-info { background: #040d1a; border: 1px solid #0d2240; border-radius: 14px; padding: 16px; }
      .insight-success { background: #040d08; border: 1px solid #0d2a14; border-radius: 14px; padding: 16px; }

      input, select, textarea {
        background: var(--surface2); border: 1px solid var(--border2); color: var(--text);
        border-radius: 10px; padding: 10px 14px; font-family: 'Cabinet Grotesk', sans-serif;
        font-size: 14px; outline: none; transition: border-color 0.15s; width: 100%;
      }
      input:focus, select:focus, textarea:focus { border-color: var(--accent); }
      input::placeholder { color: var(--muted); }

      .toggle { width: 44px; height: 24px; background: var(--border2); border-radius: 100px; position: relative; cursor: pointer; transition: background 0.2s; border: none; }
      .toggle.on { background: var(--accent); }
      .toggle::after { content: ''; position: absolute; width: 18px; height: 18px; background: white; border-radius: 50%; top: 3px; left: 3px; transition: transform 0.2s; }
      .toggle.on::after { transform: translateX(20px); }

      .category-chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; }

      .tooltip-custom { background: #0e0e14 !important; border: 1px solid #252538 !important; border-radius: 10px !important; font-family: 'Cabinet Grotesk', sans-serif !important; }

      .nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 16px; cursor: pointer; border-radius: 12px; transition: all 0.15s; color: var(--muted); font-size: 11px; font-weight: 600; border: none; background: transparent; font-family: 'Cabinet Grotesk', sans-serif; }
      .nav-item.active { color: var(--accent); background: #051a10; }
      .nav-item:hover:not(.active) { color: var(--text); }

      .shimmer { background: linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }

      @media (max-width: 640px) {
        .hide-mobile { display: none !important; }
        .card-lg { padding: 16px; }
      }
    `}</style>
  </>
);

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CAT_META = {
  "Food Delivery":  { color: "#fbbf24", bg: "#1a1000", icon: "🍔" },
  "Shopping":       { color: "#a78bfa", bg: "#0e0a1a", icon: "🛍️" },
  "Subscriptions":  { color: "#34d399", bg: "#04120c", icon: "🔄" },
  "Groceries":      { color: "#4ade80", bg: "#05130a", icon: "🛒" },
  "Investments":    { color: "#60a5fa", bg: "#04101a", icon: "📈" },
  "Transport":      { color: "#fb923c", bg: "#150800", icon: "🚗" },
  "Others":         { color: "#94a3b8", bg: "#0e0e14", icon: "📦" },
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
// eslint-disable-next-line
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
const SEED_TRANSACTIONS = [
  // January
  { id:1,  date:"12-Jan", merchant:"Swiggy",   amount:450,  category:"Food Delivery",  month:"Jan" },
  { id:2,  date:"13-Jan", merchant:"Amazon",   amount:1200, category:"Shopping",       month:"Jan" },
  { id:3,  date:"14-Jan", merchant:"Netflix",  amount:299,  category:"Subscriptions",  month:"Jan" },
  { id:4,  date:"15-Jan", merchant:"Zomato",   amount:2400, category:"Food Delivery",  month:"Jan" },
  { id:5,  date:"15-Jan", merchant:"Spotify",  amount:150,  category:"Subscriptions",  month:"Jan" },
  { id:6,  date:"16-Jan", merchant:"MF SIP",   amount:5000, category:"Investments",    month:"Jan" },
  { id:7,  date:"18-Jan", merchant:"Swiggy",   amount:320,  category:"Food Delivery",  month:"Jan" },
  { id:8,  date:"20-Jan", merchant:"Myntra",   amount:3200, category:"Shopping",       month:"Jan" },
  { id:9,  date:"21-Jan", merchant:"Blinkit",  amount:180,  category:"Groceries",      month:"Jan" },
  { id:10, date:"22-Jan", merchant:"Swiggy",   amount:450,  category:"Food Delivery",  month:"Jan" },
  { id:11, date:"22-Jan", merchant:"Hotstar",  amount:99,   category:"Subscriptions",  month:"Jan" },
  { id:12, date:"25-Jan", merchant:"Zomato",   amount:760,  category:"Food Delivery",  month:"Jan" },
  // February
  { id:13, date:"03-Feb", merchant:"Swiggy",   amount:680,  category:"Food Delivery",  month:"Feb" },
  { id:14, date:"07-Feb", merchant:"Zomato",   amount:920,  category:"Food Delivery",  month:"Feb" },
  { id:15, date:"10-Feb", merchant:"Myntra",   amount:4500, category:"Shopping",       month:"Feb" },
  { id:16, date:"14-Feb", merchant:"Netflix",  amount:299,  category:"Subscriptions",  month:"Feb" },
  { id:17, date:"15-Feb", merchant:"Spotify",  amount:150,  category:"Subscriptions",  month:"Feb" },
  { id:18, date:"16-Feb", merchant:"MF SIP",   amount:5000, category:"Investments",    month:"Feb" },
  { id:19, date:"18-Feb", merchant:"Swiggy",   amount:1100, category:"Food Delivery",  month:"Feb" },
  { id:20, date:"19-Feb", merchant:"Blinkit",  amount:240,  category:"Groceries",      month:"Feb" },
  { id:21, date:"22-Feb", merchant:"Zomato",   amount:850,  category:"Food Delivery",  month:"Feb" },
  { id:22, date:"22-Feb", merchant:"Hotstar",  amount:99,   category:"Subscriptions",  month:"Feb" },
  { id:23, date:"25-Feb", merchant:"Amazon",   amount:2800, category:"Shopping",       month:"Feb" },
  // March
  { id:24, date:"04-Mar", merchant:"Swiggy",   amount:1200, category:"Food Delivery",  month:"Mar" },
  { id:25, date:"09-Mar", merchant:"Zomato",   amount:1450, category:"Food Delivery",  month:"Mar" },
  { id:26, date:"12-Mar", merchant:"Flipkart", amount:6200, category:"Shopping",       month:"Mar" },
  { id:27, date:"14-Mar", merchant:"Netflix",  amount:299,  category:"Subscriptions",  month:"Mar" },
  { id:28, date:"15-Mar", merchant:"Spotify",  amount:150,  category:"Subscriptions",  month:"Mar" },
  { id:29, date:"16-Mar", merchant:"MF SIP",   amount:3800, category:"Investments",    month:"Mar" },
  { id:30, date:"19-Mar", merchant:"Swiggy",   amount:1800, category:"Food Delivery",  month:"Mar" },
  { id:31, date:"20-Mar", merchant:"Blinkit",  amount:420,  category:"Groceries",      month:"Mar" },
  { id:32, date:"23-Mar", merchant:"Zomato",   amount:980,  category:"Food Delivery",  month:"Mar" },
  { id:33, date:"23-Mar", merchant:"Hotstar",  amount:99,   category:"Subscriptions",  month:"Mar" },
  { id:34, date:"25-Mar", merchant:"Ola",      amount:340,  category:"Transport",      month:"Mar" },
  { id:35, date:"27-Mar", merchant:"Zepto",    amount:580,  category:"Groceries",      month:"Mar" },
];

const SEED_INSIGHTS = [
  { type:"danger",  icon:"🚨", title:"Food Delivery Up 62%",       desc:"₹4,380 in Jan → ₹5,430 in Mar. Swiggy alone accounts for ₹3,550/month." },
  { type:"danger",  icon:"💸", title:"Shopping Surged 81%",         desc:"₹4,400 → ₹6,200 in 3 months. Lifestyle inflation adding ₹1,800 drift/month." },
  { type:"warning", icon:"📉", title:"SIP Dropped ₹1,200",          desc:"Investment fell ₹5,000 → ₹3,800. You're redirecting savings to delivery apps." },
  { type:"warning", icon:"🔄", title:"4 Hidden Subscriptions",       desc:"Netflix+Spotify+Hotstar = ₹548/mo = ₹6,576/yr. Review which you actually use." },
  { type:"info",    icon:"🧾", title:"Micro Leaks: ₹1,420/month",   desc:"Blinkit+Zepto orders under ₹500 each. Invisible individually, massive together." },
  { type:"success", icon:"✅", title:"Groceries Under Control",      desc:"Only +14% increase. Smart spending in this category — keep it up." },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const pct = (a, b) => b ? Math.round(((a - b) / b) * 100) : 0;

function computeStats(txns) {
  const byMonth = {};
  txns.forEach(t => {
    if (!byMonth[t.month]) byMonth[t.month] = {};
    byMonth[t.month][t.category] = (byMonth[t.month][t.category] || 0) + t.amount;
  });
  const monthList = Object.keys(byMonth).sort((a,b) => MONTHS.indexOf(a) - MONTHS.indexOf(b));
  const monthlyTotals = monthList.map(m => ({ month: m, ...byMonth[m], total: Object.values(byMonth[m]).reduce((s,v)=>s+v,0) }));

  const catTotals = {};
  txns.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });

  const totalSpent = txns.filter(t=>t.category!=="Investments").reduce((s,t)=>s+t.amount,0);
  const totalInvested = txns.filter(t=>t.category==="Investments").reduce((s,t)=>s+t.amount,0);
  const pieData = Object.entries(catTotals).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);

  // weekly (simulate last 4 weeks from Mar)
  const weekly = [
    { week:"W1 Mar", spend:3200, target:4000 },
    { week:"W2 Mar", spend:4800, target:4000 },
    { week:"W3 Mar", spend:5200, target:4000 },
    { week:"W4 Mar", spend:6100, target:4000 },
  ];

  return { byMonth, monthList, monthlyTotals, catTotals, totalSpent, totalInvested, pieData, weekly };
}

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-custom" style={{ padding: "10px 14px", minWidth: 120 }}>
      <div style={{ fontSize: 11, color: "var(--muted)", fontFamily:"'JetBrains Mono',monospace", marginBottom: 6 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, fontWeight:700, padding:"2px 0" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background: p.color || p.fill }} />
          <span style={{ color: "var(--muted)", fontWeight:400, fontSize:11 }}>{p.name}:</span>
          <span style={{ color:"var(--text)" }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── LANDING ─────────────────────────────────────────────────────────────────
function Landing({ onStart, onDemo }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", position:"relative", overflow:"hidden" }}>
      {/* Background grid */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize:"60px 60px", opacity:0.3 }} />
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:600, height:600, background:"radial-gradient(circle, #6ee7b710 0%, transparent 70%)", pointerEvents:"none" }} />

      <div style={{ position:"relative", maxWidth:680, textAlign:"center" }}>
        <div className="fade-up" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--surface)", border:"1px solid var(--border2)", borderRadius:100, padding:"6px 16px", fontSize:12, color:"var(--accent)", fontFamily:"'JetBrains Mono',monospace", marginBottom:28 }}>
          <span className="live-dot" />
          REAL-TIME MONEY INTELLIGENCE
        </div>

        <h1 className="fade-up-1" style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(40px,8vw,76px)", fontWeight:700, lineHeight:1.05, letterSpacing:"-2px", marginBottom:20 }}>
          Stop tracking.<br />
          <span style={{ color:"var(--accent)" }}>Start understanding.</span>
        </h1>

        <p className="fade-up-2" style={{ fontSize:18, color:"var(--muted)", lineHeight:1.7, maxWidth:480, margin:"0 auto 40px" }}>
          Connects to your bank SMS, UPI & cards automatically. Tells you exactly where your money leaks — and why savings never grow.
        </p>

        <div className="fade-up-3" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:48 }}>
          <button className="btn btn-primary" onClick={onStart} style={{ fontSize:16, padding:"14px 32px" }}>
            Connect My Account →
          </button>
          <button className="btn btn-ghost" onClick={onDemo} style={{ padding:"14px 28px", fontSize:15 }}>
            ▶ View Demo
          </button>
        </div>

        {/* Feature pills */}
        <div className="fade-up-4" style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          {["Auto SMS capture","UPI sync","Weekly WhatsApp alerts","Budget targets","Leak detection","Zero manual entry"].map(f => (
            <div key={f} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:100, padding:"6px 14px", fontSize:12, color:"var(--muted)" }}>
              ✓ {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SETUP WIZARD ─────────────────────────────────────────────────────────────
function SetupWizard({ onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [wa, setWa] = useState("");
  const [budgets, setBudgets] = useState({ "Food Delivery":4000, Shopping:5000, Subscriptions:600 });
  const [alertDay, setAlertDay] = useState("Monday");
  const [alertTime, setAlertTime] = useState("09:00");

  const steps = [
    {
      title: "Connect Data Sources",
      sub: "Choose how your transactions auto-sync",
      content: (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[
            { icon:"📱", title:"Android SMS Listener", desc:"Auto-reads bank SMS in background. One-time permission.", badge:"Recommended", color:"var(--accent)" },
            { icon:"📧", title:"Email Forwarding", desc:"Forward bank alerts to your@moneyapp.in — auto-parsed instantly.", badge:"Universal", color:"var(--invest)" },
            { icon:"🔗", title:"UPI App Webhooks", desc:"GPay / PhonePe / Paytm native integration (beta)", badge:"Beta", color:"var(--warn)" },
          ].map(s => (
            <div key={s.title} className="card" style={{ cursor:"pointer", display:"flex", gap:16, alignItems:"flex-start" }}>
              <div style={{ fontSize:28 }}>{s.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontWeight:700, fontSize:15 }}>{s.title}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:s.color, background:`${s.color}20`, padding:"2px 8px", borderRadius:100 }}>{s.badge}</span>
                </div>
                <div style={{ fontSize:13, color:"var(--muted)" }}>{s.desc}</div>
              </div>
              <div style={{ width:20, height:20, borderRadius:"50%", border:"2px solid var(--accent)", background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#051a10" }} />
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Set Weekly Budget Targets",
      sub: "We'll alert you when you're about to breach these",
      content: (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {Object.entries(budgets).map(([cat, val]) => (
            <div key={cat} className="card">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span>{CAT_META[cat]?.icon}</span>
                  <span style={{ fontWeight:700 }}>{cat}</span>
                </div>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:15, color:"var(--accent)", fontWeight:700 }}>{fmt(val)}/mo</span>
              </div>
              <input type="range" min="500" max="15000" step="500" value={val}
                onChange={e => setBudgets(b => ({...b, [cat]:+e.target.value}))}
                style={{ width:"100%", accentColor:"var(--accent)", background:"transparent", border:"none", padding:0, cursor:"pointer" }} />
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--muted)", marginTop:4 }}>
                <span>₹500</span><span>₹15,000</span>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Configure WhatsApp Alerts",
      sub: "Get weekly money digest on WhatsApp — zero effort",
      content: (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="card" style={{ background:"#04120a", borderColor:"#0d2a14" }}>
            <div style={{ fontSize:13, color:"var(--accent)", fontFamily:"'JetBrains Mono',monospace", marginBottom:10 }}>📱 WHATSAPP NUMBER</div>
            <input value={wa} onChange={e=>setWa(e.target.value)} placeholder="+91 98765 43210" style={{ marginBottom:0 }} />
            <div style={{ fontSize:12, color:"var(--muted)", marginTop:8 }}>We'll send you a weekly summary every {alertDay} at {alertTime}</div>
          </div>
          <div className="card">
            <div style={{ fontSize:13, color:"var(--muted)", fontFamily:"'JetBrains Mono',monospace", marginBottom:12 }}>ALERT SCHEDULE</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:6 }}>Day</div>
                <select value={alertDay} onChange={e=>setAlertDay(e.target.value)}>
                  {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:6 }}>Time</div>
                <input type="time" value={alertTime} onChange={e=>setAlertTime(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="card" style={{ background:"#04120a", borderColor:"#0d2a14" }}>
            <div style={{ fontSize:13, color:"var(--muted)", fontFamily:"'JetBrains Mono',monospace", marginBottom:10 }}>SAMPLE ALERT PREVIEW</div>
            <div style={{ background:"#fff", borderRadius:12, padding:"12px 16px", color:"#111", fontSize:13, lineHeight:1.6, fontFamily:"system-ui" }}>
              <div style={{ fontWeight:700, color:"#075e54", marginBottom:6 }}>💸 Money Digest — Week 3 Mar</div>
              <div>You spent <b>₹6,100</b> this week — <span style={{color:"red"}}>53% above</span> your ₹4,000 target.</div>
              <div style={{ marginTop:6 }}>🍔 Food delivery: <b>₹2,430</b> (↑38%)</div>
              <div>🛍️ Shopping: <b>₹2,800</b> (new)</div>
              <div style={{ marginTop:8, color:"#075e54", fontWeight:700 }}>💡 Skip 3 Swiggy orders = save ₹1,200</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const isLast = step === steps.length - 1;

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 24px" }}>
      <div style={{ maxWidth:540, width:"100%" }}>
        {/* Progress */}
        <div style={{ display:"flex", gap:8, marginBottom:32 }}>
          {steps.map((_,i) => (
            <div key={i} style={{ flex:1, height:3, borderRadius:100, background: i <= step ? "var(--accent)" : "var(--border2)", transition:"background 0.3s" }} />
          ))}
        </div>

        <div style={{ marginBottom:6, fontSize:12, color:"var(--muted)", fontFamily:"'JetBrains Mono',monospace" }}>STEP {step+1} OF {steps.length}</div>
        <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:28, fontWeight:700, marginBottom:6 }}>{steps[step].title}</h2>
        <p style={{ color:"var(--muted)", marginBottom:24, fontSize:15 }}>{steps[step].sub}</p>

        {steps[step].content}

        <div style={{ display:"flex", gap:10, marginTop:24 }}>
          <button className="btn btn-ghost" onClick={step===0 ? onBack : ()=>setStep(s=>s-1)}>
            ← {step===0?"Back":"Previous"}
          </button>
          <button className="btn btn-primary" style={{ flex:1, justifyContent:"center" }}
            onClick={isLast ? ()=>onComplete({budgets, alertDay, alertTime, wa}) : ()=>setStep(s=>s+1)}>
            {isLast ? "🚀 Launch Dashboard" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LOADING ──────────────────────────────────────────────────────────────────
function Loading() {
  const [msgIdx, setMsgIdx] = useState(0);
  const msgs = ["Connecting to SMS stream…","Parsing 35 transactions…","Detecting spending patterns…","Finding money leaks…","Generating weekly insights…","Building your dashboard…"];
  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => Math.min(i+1, msgs.length-1)), 600);
    return () => clearInterval(t);
 }, [msgs.length]);
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:28 }}>
      <div style={{ position:"relative", width:72, height:72 }}>
        <div style={{ position:"absolute", inset:0, border:"2px solid var(--border)", borderTop:"2px solid var(--accent)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
        <div style={{ position:"absolute", inset:10, border:"2px solid var(--border)", borderBottom:"2px solid var(--accent2)", borderRadius:"50%", animation:"spin 1.2s linear infinite reverse" }} />
        <div style={{ position:"absolute", inset:"50%", transform:"translate(-50%,-50%)", fontSize:18 }}>💸</div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700, marginBottom:16 }}>Analyzing your money</div>
        {msgs.map((m,i) => (
          <div key={m} style={{ fontSize:13, fontFamily:"'JetBrains Mono',monospace", padding:"3px 0", color: i <= msgIdx ? (i===msgIdx?"var(--accent)":"var(--muted)") : "var(--border2)", transition:"color 0.4s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <span>{i < msgIdx ? "✓" : i===msgIdx ? "→" : "·"}</span>{m}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
function Dashboard({ txns, insights, settings, onReset }) {
  const [nav, setNav] = useState("overview");
  const [filterMonth, setFilterMonth] = useState("All");
  const [newTxn, setNewTxn] = useState({ merchant:"", amount:"", category:"Food Delivery", date:"25-Mar", month:"Mar" });
  const [transactions, setTransactions] = useState(txns);
  const [alertsConfig, setAlertsConfig] = useState({ enabled:true, food:true, shopping:true, invest:true });
  const [liveCount, setLiveCount] = useState(0);

  const stats = computeStats(transactions);
  const filtered = filterMonth === "All" ? transactions : transactions.filter(t=>t.month===filterMonth);

  // Simulate live incoming transaction
  useEffect(() => {
    const t = setTimeout(() => {
      setTransactions(prev => [{
        id: Date.now(), date:"26-Mar", merchant:"Swiggy (LIVE)", amount:380, category:"Food Delivery", month:"Mar"
      }, ...prev]);
      setLiveCount(c=>c+1);
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  const addManualTxn = () => {
    if (!newTxn.merchant || !newTxn.amount) return;
    setTransactions(prev => [{ id:Date.now(), ...newTxn, amount:+newTxn.amount }, ...prev]);
    setNewTxn({ merchant:"", amount:"", category:"Food Delivery", date:"25-Mar", month:"Mar" });
  };

  const navItems = [
    { id:"overview",     icon:"◈", label:"Overview" },
    { id:"trends",       icon:"↗", label:"Trends" },
    { id:"leaks",        icon:"💧", label:"Leaks" },
    { id:"budget",       icon:"🎯", label:"Budget" },
    { id:"transactions", icon:"☰", label:"History" },
    { id:"alerts",       icon:"🔔", label:"Alerts" },
    { id:"compare",      icon:"⇄", label:"Compare" },
    { id:"setup",        icon:"⚙", label:"Setup" },
  ];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {/* TOP BAR */}
      <div style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:18, fontWeight:700, color:"var(--accent)" }}>MoneyX</div>
          {liveCount > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"#051a10", border:"1px solid var(--accent)", borderRadius:100, padding:"3px 10px", fontSize:11, color:"var(--accent)", fontFamily:"'JetBrains Mono',monospace", animation:"fadeIn 0.5s ease" }}>
              <span className="live-dot" style={{ width:6, height:6 }} />
              {liveCount} new
            </div>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{ padding:"6px 12px", fontSize:13, width:"auto" }}>
            <option value="All">All Months</option>
            {stats.monthList.map(m=><option key={m}>{m}</option>)}
          </select>
          <button className="btn btn-ghost" style={{ padding:"8px 12px", fontSize:12 }} onClick={onReset}>↩ Reset</button>
        </div>
      </div>

      {/* NAV */}
      <div style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)", padding:"0 16px", overflowX:"auto" }}>
        <div style={{ display:"flex", gap:2, minWidth:"max-content" }}>
          {navItems.map(n => (
            <button key={n.id} className={`nav-item ${nav===n.id?"active":""}`} onClick={()=>setNav(n.id)}>
              <span style={{ fontSize:16 }}>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex:1, padding:"20px 16px", maxWidth:1100, margin:"0 auto", width:"100%" }}>

        {/* ── OVERVIEW ── */}
        {nav === "overview" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* KPI row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }} className="fade-up">
              {[
                { label:"Total Spent",       value:fmt(stats.totalSpent),     sub:"all categories",          color:"var(--warn)" },
                { label:"Invested",          value:fmt(stats.totalInvested),  sub:"MF + SIP",                color:"var(--invest)" },
                { label:"Leak Score",        value:"HIGH",                    sub:"vs last month",           color:"var(--danger)" },
                { label:"Transactions",      value:transactions.length,       sub:filterMonth==="All"?"total":"this month", color:"var(--accent)" },
              ].map(k => (
                <div key={k.label} className="card" style={{ animation:"count-up 0.5s ease" }}>
                  <div style={{ fontSize:11, color:"var(--muted)", fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>{k.label.toUpperCase()}</div>
                  <div style={{ fontSize:26, fontWeight:800, color:k.color, fontFamily:"'Clash Display',sans-serif" }}>{k.value}</div>
                  <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Spend vs Invest chart */}
            <div className="card-lg fade-up-1">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <div>
                  <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:18, fontWeight:700 }}>Monthly Flow</div>
                  <div style={{ fontSize:13, color:"var(--muted)" }}>Spending vs Investment trend</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={stats.monthlyTotals} margin={{top:5,right:0,left:0,bottom:0}}>
                  <defs>
                    <linearGradient id="gSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.3}/>
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gInvest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.3}/>
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="var(--border2)" tick={{fill:"var(--muted)",fontSize:12}} />
                  <YAxis stroke="var(--border2)" tick={{fill:"var(--muted)",fontSize:11}} tickFormatter={v=>"₹"+(v/1000).toFixed(0)+"k"} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" name="Total Spend" stroke="#fbbf24" strokeWidth={2} fill="url(#gSpend)" />
                  <Area type="monotone" dataKey="Investments" name="Invested" stroke="#60a5fa" strokeWidth={2} fill="url(#gInvest)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Categories + pie */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }} className="fade-up-2">
              <div className="card-lg">
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:16, fontWeight:700, marginBottom:16 }}>Category Breakdown</div>
                {Object.entries(stats.catTotals).sort((a,b)=>b[1]-a[1]).map(([cat,amt]) => {
                  const meta = CAT_META[cat] || CAT_META.Others;
                  const w = Math.round((amt/stats.totalSpent)*100);
                  return (
                    <div key={cat} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"center" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13 }}>
                          <span>{meta.icon}</span><span style={{color:"var(--text)"}}>{cat}</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:meta.color, fontWeight:700 }}>{fmt(amt)}</span>
                          <span style={{ fontSize:10, color:"var(--muted)" }}>{w}%</span>
                        </div>
                      </div>
                      <div className="progress-bar" style={{ height:6 }}>
                        <div className="progress-fill" style={{ width:`${w}%`, background:meta.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="card-lg" style={{ display:"flex", flexDirection:"column" }}>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:16, fontWeight:700, marginBottom:8 }}>Distribution</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={stats.pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                      {stats.pieData.map((e,i) => <Cell key={i} fill={(CAT_META[e.name]||CAT_META.Others).color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"5px 14px", justifyContent:"center" }}>
                  {stats.pieData.map(d => (
                    <div key={d.name} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"var(--muted)" }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:(CAT_META[d.name]||CAT_META.Others).color }} />
                      {d.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TRENDS ── */}
        {nav === "trends" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700 }}>Spending Trends</div>
            {["Food Delivery","Shopping","Investments"].map(cat => {
              const meta = CAT_META[cat];
              const data = stats.monthlyTotals.map(m=>({ month:m.month, amount:m[cat]||0 }));
              const first = data[0]?.amount||0, last = data[data.length-1]?.amount||0;
              const change = pct(last, first);
              const isBad = cat==="Investments" ? change<0 : change>0;
              return (
                <div key={cat} className="card-lg fade-up">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, flexWrap:"wrap", gap:8 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:20 }}>{meta.icon}</span>
                        <span style={{ fontFamily:"'Clash Display',sans-serif", fontSize:18, fontWeight:700 }}>{cat}</span>
                      </div>
                      <div style={{ fontSize:13, color:"var(--muted)", fontFamily:"'JetBrains Mono',monospace" }}>
                        {fmt(first)} → {fmt(last)}
                      </div>
                    </div>
                    <span className={`badge ${isBad?"badge-up":"badge-down-good"}`}>
                      {change>0?"↑":"↓"} {Math.abs(change)}%
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={130}>
                    <BarChart data={data} barSize={32}>
                      <XAxis dataKey="month" stroke="var(--border2)" tick={{fill:"var(--muted)",fontSize:12}} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" name={cat} fill={meta.color} radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        )}

        {/* ── LEAKS ── */}
        {nav === "leaks" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700, marginBottom:4 }}>Money Leaks 💧</div>

            <div style={{ background:"#0d0505", border:"1px solid #3d1111", borderRadius:14, padding:"14px 18px" }}>
              <div style={{ fontSize:13, color:"#f87171", fontFamily:"'JetBrains Mono',monospace", marginBottom:4 }}>🔥 ESTIMATED MONTHLY LEAK</div>
              <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:32, fontWeight:700, color:"var(--danger)" }}>
                {fmt(Math.round(stats.totalSpent * 0.25))}
              </div>
              <div style={{ fontSize:13, color:"var(--muted)", marginTop:4 }}>25% of your spending is avoidable with small habit changes</div>
            </div>

            {insights.map((ins,i) => (
              <div key={i} className={`insight-${ins.type} fade-up`} style={{ animationDelay:`${i*0.08}s` }}>
                <div style={{ display:"flex", gap:12 }}>
                  <span style={{ fontSize:24, flexShrink:0 }}>{ins.icon}</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, marginBottom:5 }}>{ins.title}</div>
                    <div style={{ color:"var(--muted)", fontSize:13, lineHeight:1.7 }}>{ins.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── BUDGET ── */}
        {nav === "budget" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700 }}>Budget Targets 🎯</div>

            {/* Weekly chart */}
            <div className="card-lg fade-up">
              <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:16, fontWeight:700, marginBottom:16 }}>Weekly Spend vs Target</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.weekly} barGap={4}>
                  <XAxis dataKey="week" stroke="var(--border2)" tick={{fill:"var(--muted)",fontSize:12}} />
                  <YAxis stroke="var(--border2)" tick={{fill:"var(--muted)",fontSize:11}} tickFormatter={v=>"₹"+(v/1000).toFixed(0)+"k"} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="spend" name="Actual" fill="var(--warn)" radius={[6,6,0,0]} />
                  <Bar dataKey="target" name="Target" fill="var(--border2)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Budget cards */}
            {Object.entries(settings?.budgets||{}).map(([cat,budget]) => {
              const spent = stats.catTotals[cat]||0;
              const ratio = Math.min((spent/budget)*100, 100);
              const over = spent > budget;
              const meta = CAT_META[cat]||CAT_META.Others;
              return (
                <div key={cat} className="card fade-up-1">
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:20 }}>{meta.icon}</span>
                      <div>
                        <div style={{ fontWeight:700 }}>{cat}</div>
                        <div style={{ fontSize:12, color:"var(--muted)" }}>Budget: {fmt(budget)}/mo</div>
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:700, color:over?"var(--danger)":meta.color }}>{fmt(spent)}</div>
                      {over && <div style={{ fontSize:11, color:"var(--danger)" }}>+{fmt(spent-budget)} over budget</div>}
                    </div>
                  </div>
                  <div className="progress-bar" style={{ height:8 }}>
                    <div className="progress-fill" style={{ width:`${ratio}%`, background:over?"var(--danger)":meta.color }} />
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--muted)", marginTop:5 }}>
                    <span>{Math.round(ratio)}% used</span>
                    <span>{fmt(Math.max(budget-spent,0))} remaining</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TRANSACTIONS ── */}
        {nav === "transactions" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
              <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700 }}>Transaction History</div>
              <div style={{ fontSize:12, color:"var(--muted)", fontFamily:"'JetBrains Mono',monospace" }}>{filtered.length} records</div>
            </div>

            {/* Add manual */}
            <div className="card fade-up">
              <div style={{ fontSize:13, color:"var(--accent)", fontFamily:"'JetBrains Mono',monospace", marginBottom:12 }}>+ ADD MANUAL TRANSACTION</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:10 }}>
                <input placeholder="Merchant" value={newTxn.merchant} onChange={e=>setNewTxn(p=>({...p,merchant:e.target.value}))} />
                <input placeholder="Amount (₹)" type="number" value={newTxn.amount} onChange={e=>setNewTxn(p=>({...p,amount:e.target.value}))} />
                <select value={newTxn.category} onChange={e=>setNewTxn(p=>({...p,category:e.target.value}))}>
                  {Object.keys(CAT_META).map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <button className="btn btn-primary" onClick={addManualTxn} style={{ fontSize:13, padding:"10px 20px" }}>Add Transaction</button>
            </div>

            <div className="card-lg fade-up-1" style={{ padding:0, overflow:"hidden" }}>
              <div style={{ maxHeight:500, overflowY:"auto" }}>
                {filtered.map((t,i) => {
                  const meta = CAT_META[t.category]||CAT_META.Others;
                  const isNew = t.merchant.includes("LIVE");
                  return (
                    <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 18px", borderBottom:"1px solid var(--border)", background: isNew ? "#04120a" : "transparent", transition:"background 0.5s", animation: isNew ? "fadeIn 0.5s ease" : "none" }}>
                      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                        <div style={{ width:38, height:38, borderRadius:10, background:meta.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                          {meta.icon}
                        </div>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                            {t.merchant}
                            {isNew && <span style={{ fontSize:10, color:"var(--accent)", fontFamily:"'JetBrains Mono',monospace", background:"#051a10", border:"1px solid var(--accent)", borderRadius:100, padding:"1px 6px" }}>LIVE</span>}
                          </div>
                          <div style={{ fontSize:12, color:"var(--muted)", display:"flex", alignItems:"center", gap:6 }}>
                            <span>{t.date}</span>
                            <span>·</span>
                            <span style={{ color:meta.color }}>{t.category}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:t.category==="Investments"?"var(--invest)":"var(--text)" }}>
                        {t.category==="Investments"?"":"-"}{fmt(t.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── ALERTS ── */}
        {nav === "alerts" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700 }}>Alert Settings 🔔</div>

            {/* WhatsApp config */}
            <div className="card-lg fade-up" style={{ background:"#04120a", borderColor:"#0d2a14" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:16, display:"flex", alignItems:"center", gap:8 }}>
                    <span>📱</span> WhatsApp Weekly Digest
                  </div>
                  <div style={{ fontSize:13, color:"var(--muted)", marginTop:2 }}>Every {settings?.alertDay||"Monday"} at {settings?.alertTime||"09:00"}</div>
                </div>
                <button className={`toggle ${alertsConfig.enabled?"on":""}`} onClick={()=>setAlertsConfig(c=>({...c,enabled:!c.enabled}))} />
              </div>
              {settings?.wa && (
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"var(--accent)", background:"#051a10", padding:"8px 12px", borderRadius:8 }}>
                  → {settings.wa}
                </div>
              )}
            </div>

            {/* Alert types */}
            {[
              { key:"food",     icon:"🍔", title:"Food Delivery Spike",     desc:"Alert when food spend exceeds ₹3,000/week" },
              { key:"shopping", icon:"🛍️", title:"Shopping Budget Breach",  desc:"Alert when shopping crosses monthly target" },
              { key:"invest",   icon:"📉", title:"Investment Drop",          desc:"Alert if SIP/MF contribution drops vs last month" },
            ].map(a => (
              <div key={a.key} className="card fade-up-1" style={{ display:"flex", gap:14, alignItems:"center" }}>
                <span style={{ fontSize:24 }}>{a.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15 }}>{a.title}</div>
                  <div style={{ fontSize:13, color:"var(--muted)" }}>{a.desc}</div>
                </div>
                <button className={`toggle ${alertsConfig[a.key]?"on":""}`} onClick={()=>setAlertsConfig(c=>({...c,[a.key]:!c[a.key]}))} />
              </div>
            ))}

            {/* Sample digest */}
            <div className="card fade-up-2">
              <div style={{ fontSize:13, color:"var(--muted)", fontFamily:"'JetBrains Mono',monospace", marginBottom:12 }}>NEXT DIGEST PREVIEW</div>
              <div style={{ background:"#fff", borderRadius:14, padding:"16px 18px", color:"#111", fontSize:13, lineHeight:1.8, fontFamily:"system-ui", boxShadow:"0 4px 20px #0008" }}>
                <div style={{ fontWeight:800, color:"#075e54", fontSize:15, marginBottom:8 }}>💸 MoneyX Weekly Digest</div>
                <div style={{ color:"#333" }}>Week of 17–23 Mar 2025</div>
                <hr style={{ border:"none", borderTop:"1px solid #eee", margin:"10px 0" }} />
                <div>Total spent: <b>₹{(6100).toLocaleString("en-IN")}</b></div>
                <div style={{ color:"#dc2626" }}>⚠️ 53% above your ₹4,000 target</div>
                <div style={{ marginTop:8 }}>🍔 Food delivery: <b>₹2,430</b> (↑38%)</div>
                <div>🛍️ Shopping: <b>₹2,800</b></div>
                <div>🔄 Subscriptions: <b>₹547</b></div>
                <hr style={{ border:"none", borderTop:"1px solid #eee", margin:"10px 0" }} />
                <div style={{ fontWeight:700, color:"#075e54" }}>💡 If you'd skipped 3 Swiggy orders → saved ₹1,140</div>
                <div style={{ marginTop:6, fontSize:12, color:"#999" }}>Reply STOP to unsubscribe</div>
              </div>
            </div>
          </div>
        )}

        {/* ── COMPARE ── */}
        {nav === "compare" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700 }}>Month Comparison ⇄</div>
            {stats.monthList.length >= 2 && (() => {
              const m1 = stats.monthList[0], m2 = stats.monthList[stats.monthList.length-1];
              const d1 = stats.byMonth[m1]||{}, d2 = stats.byMonth[m2]||{};
              const cats = [...new Set([...Object.keys(d1),...Object.keys(d2)])];
              return (
                <>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }} className="fade-up">
                    {[{month:m1,data:d1},{month:m2,data:d2}].map(({month,data}) => {
                      const total = Object.values(data).reduce((s,v)=>s+v,0);
                      return (
                        <div key={month} className="card-lg">
                          <div style={{ fontSize:12, color:"var(--muted)", fontFamily:"'JetBrains Mono',monospace", marginBottom:6 }}>{month.toUpperCase()}</div>
                          <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:28, fontWeight:700, marginBottom:14 }}>{fmt(total)}</div>
                          {cats.map(cat=>{
                            const meta=CAT_META[cat]||CAT_META.Others;
                            return (
                              <div key={cat} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"5px 0", borderBottom:"1px solid var(--border)" }}>
                                <span style={{ color:"var(--muted)" }}>{meta.icon} {cat}</span>
                                <span style={{ color:meta.color, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{data[cat]?fmt(data[cat]):"—"}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  <div className="card-lg fade-up-1">
                    <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:16, fontWeight:700, marginBottom:16 }}>Δ Change: {m1} → {m2}</div>
                    {cats.map(cat => {
                      const v1=d1[cat]||0, v2=d2[cat]||0, diff=v2-v1;
                      const meta=CAT_META[cat]||CAT_META.Others;
                      const isInvest=cat==="Investments";
                      const isBad=isInvest?diff<0:diff>0;
                      if (!v1 && !v2) return null;
                      return (
                        <div key={cat} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14 }}>
                            <span>{meta.icon}</span><span>{cat}</span>
                          </div>
                          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                            <span style={{ fontSize:13, color:"var(--muted)", fontFamily:"'JetBrains Mono',monospace" }}>{diff>0?"+":""}{fmt(diff)}</span>
                            <span className={`badge ${diff===0?"badge-neutral":isBad?"badge-up":"badge-down-good"}`}>
                              {diff===0?"–":diff>0?"↑":"↓"} {v1?Math.abs(pct(v2,v1)):100}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* ── SETUP ── */}
        {nav === "setup" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:22, fontWeight:700 }}>Integration Setup ⚙</div>

            {[
              {
                icon:"📱", title:"Android SMS Listener", status:"Active",
                desc:"Background service is running. Auto-reads all bank SMS.",
                steps:["Install MoneyX APK", "Grant READ_SMS permission when prompted", "Background service starts automatically", "All bank SMS auto-parsed via Claude AI"],
                color:"var(--accent)"
              },
              {
                icon:"📧", title:"Email Forwarding", status:"Setup Required",
                desc:"Forward bank emails to auto@moneyapp.in",
                steps:["Set up Gmail filter: from:(noreply@sbi.co.in OR alerts@hdfcbank.com)", "Forward matching emails to auto@moneyapp.in", "Webhook parses email body via Claude AI", "Transactions appear in dashboard instantly"],
                color:"var(--invest)"
              },
              {
                icon:"🔗", title:"UPI Webhooks (GPay/PhonePe)", status:"Beta",
                desc:"Native UPI app integration via notification listener",
                steps:["Enable Notification Access in Android settings", "Select GPay / PhonePe / Paytm", "App reads payment confirmations automatically", "Zero manual steps after one-time setup"],
                color:"var(--warn)"
              },
            ].map(s => (
              <div key={s.title} className="card-lg fade-up">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <span style={{ fontSize:24 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15 }}>{s.title}</div>
                      <div style={{ fontSize:13, color:"var(--muted)" }}>{s.desc}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, color:s.color, background:`${s.color}20`, padding:"3px 10px", borderRadius:100, whiteSpace:"nowrap", fontFamily:"'JetBrains Mono',monospace" }}>
                    {s.status}
                  </span>
                </div>
                <div style={{ borderTop:"1px solid var(--border)", paddingTop:12, display:"flex", flexDirection:"column", gap:6 }}>
                  {s.steps.map((step,i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", fontSize:13 }}>
                      <div style={{ width:20, height:20, borderRadius:"50%", background:`${s.color}20`, border:`1px solid ${s.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:s.color, flexShrink:0, marginTop:1 }}>{i+1}</div>
                      <span style={{ color:"var(--muted)", lineHeight:1.5 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Backend code snippet */}
            <div className="card-lg fade-up-2">
              <div style={{ fontSize:13, color:"var(--muted)", fontFamily:"'JetBrains Mono',monospace", marginBottom:12 }}>BACKEND ENDPOINT (Node.js)</div>
              <pre style={{ background:"var(--bg)", border:"1px solid var(--border)", borderRadius:10, padding:"14px 16px", fontSize:12, color:"var(--accent)", fontFamily:"'JetBrains Mono',monospace", overflowX:"auto", lineHeight:1.6 }}>{`POST /api/sms
{
  "body": "SBI: Rs.450 debited to Swiggy",
  "timestamp": "2025-03-26T10:30:00Z"
}

→ Claude parses → categorizes
→ stored in DB → dashboard updates
→ WhatsApp alert if budget breached`}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [settings, setSettings] = useState(null);

  const handleSetupComplete = (s) => {
    setSettings(s);
    setScreen("loading");
    setTimeout(() => setScreen("dashboard"), 4200);
  };

  return (
    <>
      <GlobalStyles />
      {screen === "landing"   && <Landing onStart={()=>setScreen("setup")} onDemo={()=>{ setSettings({ budgets:{"Food Delivery":4000,Shopping:5000,Subscriptions:600}, alertDay:"Monday", alertTime:"09:00", wa:"+91 98765 43210" }); setScreen("loading"); setTimeout(()=>setScreen("dashboard"),4200); }} />}
      {screen === "setup"     && <SetupWizard onComplete={handleSetupComplete} onBack={()=>setScreen("landing")} />}
      {screen === "loading"   && <Loading />}
      {screen === "dashboard" && <Dashboard txns={SEED_TRANSACTIONS} insights={SEED_INSIGHTS} settings={settings} onReset={()=>setScreen("landing")} />}
    </>
  );
}

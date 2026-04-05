import { useState, useMemo, useEffect, useRef } from "react";

// ── MOCK DATA ──────────────────────────────────────────────────────────────────
const CATEGORIES = ["Food & Dining", "Transport", "Shopping", "Health", "Entertainment", "Utilities", "Salary", "Freelance", "Investment", "Rent"];
const CAT_COLORS = {
  "Food & Dining":  "#f97316",
  "Transport":      "#3b82f6",
  "Shopping":       "#ec4899",
  "Health":         "#10b981",
  "Entertainment":  "#8b5cf6",
  "Utilities":      "#f59e0b",
  "Salary":         "#22c55e",
  "Freelance":      "#06b6d4",
  "Investment":     "#a78bfa",
  "Rent":           "#fb7185",
};

const SEED_TRANSACTIONS = [
  { id: 1,  date: "2025-01-05", description: "Monthly Salary",         category: "Salary",         amount: 85000, type: "income"  },
  { id: 2,  date: "2025-01-07", description: "Zomato",                 category: "Food & Dining",  amount: 1240,  type: "expense" },
  { id: 3,  date: "2025-01-09", description: "Ola Cabs",               category: "Transport",      amount: 380,   type: "expense" },
  { id: 4,  date: "2025-01-11", description: "Amazon Order",           category: "Shopping",       amount: 3200,  type: "expense" },
  { id: 5,  date: "2025-01-14", description: "Gym Membership",         category: "Health",         amount: 1800,  type: "expense" },
  { id: 6,  date: "2025-01-17", description: "Netflix + Hotstar",      category: "Entertainment",  amount: 649,   type: "expense" },
  { id: 7,  date: "2025-01-20", description: "Electricity Bill",       category: "Utilities",      amount: 2100,  type: "expense" },
  { id: 8,  date: "2025-01-22", description: "Freelance Project",      category: "Freelance",      amount: 18000, type: "income"  },
  { id: 9,  date: "2025-01-25", description: "SIP Investment",         category: "Investment",     amount: 10000, type: "expense" },
  { id: 10, date: "2025-01-28", description: "Rent",                   category: "Rent",           amount: 15000, type: "expense" },
  { id: 11, date: "2025-02-05", description: "Monthly Salary",         category: "Salary",         amount: 85000, type: "income"  },
  { id: 12, date: "2025-02-08", description: "Swiggy",                 category: "Food & Dining",  amount: 980,   type: "expense" },
  { id: 13, date: "2025-02-10", description: "Metro Card",             category: "Transport",      amount: 500,   type: "expense" },
  { id: 14, date: "2025-02-13", description: "Flipkart Sale",          category: "Shopping",       amount: 4700,  type: "expense" },
  { id: 15, date: "2025-02-16", description: "Doctor Visit",           category: "Health",         amount: 800,   type: "expense" },
  { id: 16, date: "2025-02-19", description: "Movie Tickets",          category: "Entertainment",  amount: 600,   type: "expense" },
  { id: 17, date: "2025-02-22", description: "Internet Bill",          category: "Utilities",      amount: 999,   type: "expense" },
  { id: 18, date: "2025-02-24", description: "Freelance Design",       category: "Freelance",      amount: 22000, type: "income"  },
  { id: 19, date: "2025-02-27", description: "Mutual Fund",            category: "Investment",     amount: 10000, type: "expense" },
  { id: 20, date: "2025-02-28", description: "Rent",                   category: "Rent",           amount: 15000, type: "expense" },
  { id: 21, date: "2025-03-05", description: "Monthly Salary",         category: "Salary",         amount: 85000, type: "income"  },
  { id: 22, date: "2025-03-07", description: "Restaurant Dinner",      category: "Food & Dining",  amount: 2400,  type: "expense" },
  { id: 23, date: "2025-03-09", description: "Rapido",                 category: "Transport",      amount: 260,   type: "expense" },
  { id: 24, date: "2025-03-12", description: "Myntra",                 category: "Shopping",       amount: 2800,  type: "expense" },
  { id: 25, date: "2025-03-15", description: "Pharmacy",               category: "Health",         amount: 450,   type: "expense" },
  { id: 26, date: "2025-03-18", description: "Gaming Subscription",    category: "Entertainment",  amount: 499,   type: "expense" },
  { id: 27, date: "2025-03-21", description: "Gas Bill",               category: "Utilities",      amount: 1350,  type: "expense" },
  { id: 28, date: "2025-03-24", description: "Client Payment",         category: "Freelance",      amount: 30000, type: "income"  },
  { id: 29, date: "2025-03-26", description: "Stock Purchase",         category: "Investment",     amount: 15000, type: "expense" },
  { id: 30, date: "2025-03-28", description: "Rent",                   category: "Rent",           amount: 15000, type: "expense" },
];

const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// ── ICONS (inline SVG) ─────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    home:       <><rect x="3" y="9" width="18" height="13" rx="1"/><polyline points="1 10 12 2 23 10"/></>,
    list:       <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    insight:    <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    up:         <><polyline points="18 15 12 9 6 15"/></>,
    down:       <><polyline points="6 9 12 15 18 9"/></>,
    plus:       <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit:       <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:      <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></>,
    search:     <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    filter:     <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    close:      <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    moon:       <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
    sun:        <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    download:   <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    menu:       <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    wallet:     <><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></>,
    trend:      <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    shield:     <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ── SIMPLE BAR CHART ───────────────────────────────────────────────────────────
const BarChart = ({ data, dark }) => {
  const max = Math.max(...data.map(d => Math.max(d.income, d.expense)));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 120 }}>
            <div title={`Income: ${fmt(d.income)}`} style={{
              flex: 1, height: `${(d.income / max) * 100}%`, minHeight: 4,
              background: "linear-gradient(180deg, #4ade80, #16a34a)",
              borderRadius: "3px 3px 0 0", transition: "height 0.6s ease",
            }} />
            <div title={`Expense: ${fmt(d.expense)}`} style={{
              flex: 1, height: `${(d.expense / max) * 100}%`, minHeight: 4,
              background: "linear-gradient(180deg, #f87171, #dc2626)",
              borderRadius: "3px 3px 0 0", transition: "height 0.6s ease",
            }} />
          </div>
          <span style={{ fontSize: 10, color: dark ? "#9ca3af" : "#6b7280", whiteSpace: "nowrap" }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
};

// ── DONUT CHART ────────────────────────────────────────────────────────────────
const DonutChart = ({ data, dark }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const cx = 80, cy = 80, r = 60, strokeW = 22;
  const circumference = 2 * Math.PI * r;
  const segments = data.map((d, i) => {
    const pct = d.value / total;
    const offset = circumference * (1 - cumulative);
    const dash = circumference * pct;
    cumulative += pct;
    return { ...d, dash, offset, i };
  });

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
      <svg width={160} height={160} style={{ flexShrink: 0 }}>
        {segments.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={CAT_COLORS[s.label] || "#94a3b8"}
            strokeWidth={strokeW}
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={s.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={11} fill={dark ? "#9ca3af" : "#6b7280"}>Total</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={12} fontWeight="700" fill={dark ? "#f1f5f9" : "#1e293b"}>
          {fmt(total)}
        </text>
      </svg>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, minWidth: 120 }}>
        {data.slice(0, 6).map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: CAT_COLORS[d.label] || "#94a3b8", flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: dark ? "#cbd5e1" : "#475569", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: dark ? "#f1f5f9" : "#1e293b" }}>{Math.round(d.value / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── TREND LINE ─────────────────────────────────────────────────────────────────
const SparkLine = ({ data, color = "#6366f1", dark }) => {
  const max = Math.max(...data.map(d => d.balance));
  const min = Math.min(...data.map(d => d.balance));
  const W = 300, H = 80;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((d.balance - min) / (max - min || 1)) * (H - 10) - 5;
    return `${x},${y}`;
  });
  const areaPath = `M0,${H} L${pts.join(" L")} L${W},${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H, display: "block" }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkGrad)" />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <circle key={i} cx={(i / (data.length - 1)) * W} cy={H - ((d.balance - min) / (max - min || 1)) * (H - 10) - 5} r={3} fill={color} />
      ))}
    </svg>
  );
};

// ── MODAL ──────────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children, dark }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: dark ? "#1e293b" : "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 460,
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)", animation: "modalIn 0.2s ease",
        border: dark ? "1px solid #334155" : "1px solid #e2e8f0",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: dark ? "#f1f5f9" : "#1e293b" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#94a3b8" : "#64748b", padding: 4 }}>
            <Icon name="close" size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ── MAIN APP ───────────────────────────────────────────────────────────────────
export default function FinanceDashboard() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [role, setRole] = useState("admin");
  const [transactions, setTransactions] = useState(() => {
    try { const s = localStorage.getItem("fin_txns"); return s ? JSON.parse(s) : SEED_TRANSACTIONS; } catch { return SEED_TRANSACTIONS; }
  });
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTxn, setEditTxn] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({ date: "", description: "", category: "Food & Dining", amount: "", type: "expense" });

  useEffect(() => {
    try { localStorage.setItem("fin_txns", JSON.stringify(transactions)); } catch {}
  }, [transactions]);

  // ── Derived data ──
  const totalIncome  = useMemo(() => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const balance      = totalIncome - totalExpense;

  const monthlyData = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const key = t.date.slice(0, 7);
      if (!map[key]) map[key] = { income: 0, expense: 0 };
      map[key][t.type] += t.amount;
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => ({
      month: new Date(k + "-01").toLocaleDateString("en-IN", { month: "short" }),
      ...v,
    }));
  }, [transactions]);

  const balanceTrend = useMemo(() => {
    let running = 0;
    return [...transactions].sort((a, b) => a.date.localeCompare(b.date)).map(t => {
      running += t.type === "income" ? t.amount : -t.amount;
      return { date: t.date, balance: running };
    });
  }, [transactions]);

  const catBreakdown = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).sort(([, a], [, b]) => b - a).map(([label, value]) => ({ label, value }));
  }, [transactions]);

  const topCat    = catBreakdown[0];
  const lastMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];

  const filteredTxns = useMemo(() => {
    let list = [...transactions];
    if (search)       list = list.filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (filterCat !== "All")  list = list.filter(t => t.category === filterCat);
    if (filterType !== "All") list = list.filter(t => t.type === filterType);
    const [field, dir] = sortBy.split("-");
    list.sort((a, b) => {
      let va = field === "amount" ? a.amount : a[field];
      let vb = field === "amount" ? b.amount : b[field];
      if (typeof va === "string") return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return dir === "asc" ? va - vb : vb - va;
    });
    return list;
  }, [transactions, search, filterCat, filterType, sortBy]);

  const handleSave = () => {
    if (!form.date || !form.description || !form.amount) return;
    if (editTxn) {
      setTransactions(ts => ts.map(t => t.id === editTxn.id ? { ...form, id: editTxn.id, amount: Number(form.amount) } : t));
      setEditTxn(null);
    } else {
      setTransactions(ts => [{ ...form, id: Date.now(), amount: Number(form.amount) }, ...ts]);
    }
    setForm({ date: "", description: "", category: "Food & Dining", amount: "", type: "expense" });
    setShowAddModal(false);
  };

  const openEdit = (t) => {
    setEditTxn(t);
    setForm({ date: t.date, description: t.description, category: t.category, amount: String(t.amount), type: t.type });
    setShowAddModal(true);
  };

  const exportCSV = () => {
    const rows = [["Date","Description","Category","Type","Amount"],...filteredTxns.map(t=>[t.date,t.description,t.category,t.type,t.amount])];
    const csv = rows.map(r=>r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv])); a.download = "transactions.csv"; a.click();
  };

  // ── Styles ──
  const c = {
    bg:       dark ? "#0f172a" : "#f8fafc",
    surface:  dark ? "#1e293b" : "#ffffff",
    surface2: dark ? "#243044" : "#f1f5f9",
    border:   dark ? "#334155" : "#e2e8f0",
    text:     dark ? "#f1f5f9" : "#1e293b",
    muted:    dark ? "#94a3b8" : "#64748b",
    accent:   "#6366f1",
  };

  const card = (extra = {}) => ({
    background: c.surface, borderRadius: 16, padding: 20,
    border: `1px solid ${c.border}`, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.06)",
    ...extra,
  });

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14,
    background: dark ? "#0f172a" : "#f8fafc", color: c.text,
    border: `1px solid ${c.border}`, outline: "none", boxSizing: "border-box",
  };

  const navItems = [
    { id: "dashboard", icon: "home",    label: "Dashboard"    },
    { id: "txn",       icon: "list",    label: "Transactions" },
    { id: "insights",  icon: "insight", label: "Insights"     },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: c.bg, minHeight: "100vh", color: c.text, display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${dark ? "#334155" : "#cbd5e1"}; border-radius: 3px; }
        button { font-family: inherit; }
        input, select { font-family: inherit; }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .nav-item:hover { background: ${dark ? "#1e293b" : "#f1f5f9"} !important; }
        .txn-row:hover { background: ${dark ? "#243044" : "#f8fafc"} !important; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-ghost:hover { background: ${dark ? "#243044" : "#f1f5f9"} !important; }
        .sidebar-overlay { display:none; }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); transition: transform 0.25s ease !important; }
          .sidebar.open { transform: translateX(0) !important; }
          .sidebar-overlay.open { display:block !important; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:98; }
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`} style={{
        width: 220, flexShrink: 0, background: c.surface, borderRight: `1px solid ${c.border}`,
        display: "flex", flexDirection: "column", padding: "24px 12px", gap: 4,
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
        zIndex: 99, transition: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 20px" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="wallet" size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px" }}>FinTrack</div>
            <div style={{ fontSize: 10, color: c.muted, fontWeight: 500 }}>Personal Finance</div>
          </div>
        </div>

        {navItems.map(n => (
          <button key={n.id} className="nav-item" onClick={() => { setTab(n.id); setSidebarOpen(false); }} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
            background: tab === n.id ? (dark ? "#2d3a4e" : "#eef2ff") : "transparent",
            color: tab === n.id ? c.accent : c.muted, border: "none", cursor: "pointer",
            fontWeight: tab === n.id ? 600 : 400, fontSize: 14, textAlign: "left", transition: "all 0.15s",
          }}>
            <Icon name={n.icon} size={18} color={tab === n.id ? c.accent : c.muted} />
            {n.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        {/* Role Switcher */}
        <div style={{ padding: "12px 8px", borderTop: `1px solid ${c.border}` }}>
          <div style={{ fontSize: 11, color: c.muted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Role</div>
          <div style={{ display: "flex", background: c.surface2, borderRadius: 8, padding: 3, gap: 2 }}>
            {["admin", "viewer"].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                flex: 1, padding: "6px 0", border: "none", cursor: "pointer", borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: role === r ? (r === "admin" ? "#6366f1" : "#0ea5e9") : "transparent",
                color: role === r ? "#fff" : c.muted, transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              }}>
                <Icon name="shield" size={12} color={role === r ? "#fff" : c.muted} />
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Dark mode */}
        <button className="btn-ghost" onClick={() => setDark(d => !d)} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10,
          border: "none", background: "transparent", cursor: "pointer", color: c.muted, fontSize: 13, fontWeight: 500,
        }}>
          <Icon name={dark ? "sun" : "moon"} size={16} /> {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

      {/* ── MAIN ── */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn-ghost" onClick={() => setSidebarOpen(s => !s)} style={{
              display: "none", padding: 8, border: "none", background: "transparent", cursor: "pointer", color: c.text,
            }} id="menu-btn">
              <Icon name="menu" size={22} />
            </button>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
                {tab === "dashboard" ? "Overview" : tab === "txn" ? "Transactions" : "Insights"}
              </h1>
              <p style={{ fontSize: 13, color: c.muted, marginTop: 2 }}>
                {role === "admin" ? "Admin — full access" : "Viewer — read only"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {role === "admin" && tab === "txn" && (
              <>
                <button className="btn-primary" onClick={exportCSV} style={{
                  padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: dark ? "#243044" : "#f1f5f9", color: c.text, fontWeight: 600, fontSize: 13,
                  display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
                }}>
                  <Icon name="download" size={14} /> Export
                </button>
                <button className="btn-primary" onClick={() => { setEditTxn(null); setForm({ date: "", description: "", category: "Food & Dining", amount: "", type: "expense" }); setShowAddModal(true); }} style={{
                  padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontWeight: 600, fontSize: 13,
                  display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
                }}>
                  <Icon name="plus" size={14} color="#fff" /> Add
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeIn 0.3s ease" }}>
            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
              {[
                { label: "Total Balance",  value: balance,      icon: "wallet", grad: "135deg,#6366f1,#8b5cf6", pos: balance >= 0 },
                { label: "Total Income",   value: totalIncome,  icon: "up",     grad: "135deg,#10b981,#059669", pos: true },
                { label: "Total Expenses", value: totalExpense, icon: "down",   grad: "135deg,#f97316,#ea580c", pos: false },
              ].map((c2, i) => (
                <div key={i} style={card()}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: 12, color: c.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c2.label}</p>
                      <p style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginTop: 6, fontFamily: "'DM Mono', monospace" }}>
                        {fmt(c2.value)}
                      </p>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(${c2.grad})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={c2.icon} size={18} color="#fff" />
                    </div>
                  </div>
                  <div style={{ marginTop: 12, height: 4, borderRadius: 2, background: dark ? "#334155" : "#f1f5f9", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      width: `${Math.min((c2.value / (totalIncome + totalExpense || 1)) * 100, 100)}%`,
                      background: `linear-gradient(${c2.grad})`,
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
              <div style={card()}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Balance Trend</h3>
                <p style={{ fontSize: 12, color: c.muted, marginBottom: 16 }}>Running balance over time</p>
                <SparkLine data={balanceTrend} color="#6366f1" dark={dark} />
              </div>
              <div style={card()}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Monthly Overview</h3>
                <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  {[{ c: "#16a34a", l: "Income" }, { c: "#dc2626", l: "Expenses" }].map(l => (
                    <div key={l.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: l.c }} />
                      <span style={{ fontSize: 11, color: c.muted }}>{l.l}</span>
                    </div>
                  ))}
                </div>
                <BarChart data={monthlyData} dark={dark} />
              </div>
            </div>

            {/* Spending Breakdown */}
            <div style={card()}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Spending Breakdown</h3>
              <p style={{ fontSize: 12, color: c.muted, marginBottom: 16 }}>By category — all time</p>
              <DonutChart data={catBreakdown} dark={dark} />
            </div>

            {/* Recent Transactions */}
            <div style={card()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>Recent Transactions</h3>
                <button onClick={() => setTab("txn")} style={{ fontSize: 12, color: c.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                  View all →
                </button>
              </div>
              {transactions.slice(0, 5).map(t => (
                <div key={t.id} className="txn-row" style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 10, transition: "background 0.15s",
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: CAT_COLORS[t.category] + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: CAT_COLORS[t.category] }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.description}</p>
                    <p style={{ fontSize: 11, color: c.muted }}>{t.category} · {fmtDate(t.date)}</p>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: t.type === "income" ? "#10b981" : "#ef4444", flexShrink: 0 }}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TRANSACTIONS TAB ── */}
        {tab === "txn" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn 0.3s ease" }}>
            {/* Filters */}
            <div style={card({ padding: 16 })}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                <div style={{ flex: "1 1 180px", position: "relative" }}>
                  <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: c.muted }}>
                    <Icon name="search" size={15} />
                  </div>
                  <input placeholder="Search transactions…" value={search} onChange={e => setSearch(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 32 }} />
                </div>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inputStyle, flex: "0 1 160px" }}>
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...inputStyle, flex: "0 1 130px" }}>
                  <option value="All">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inputStyle, flex: "0 1 160px" }}>
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc">Lowest Amount</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div style={card({ padding: 0, overflow: "hidden" })}>
              {filteredTxns.length === 0 ? (
                <div style={{ padding: 48, textAlign: "center", color: c.muted }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                  <p style={{ fontWeight: 600 }}>No transactions found</p>
                  <p style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your filters</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: dark ? "#1a2537" : "#f8fafc", borderBottom: `1px solid ${c.border}` }}>
                        {["Date", "Description", "Category", "Type", "Amount", ...(role === "admin" ? [""] : [])].map(h => (
                          <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: c.muted, textAlign: h === "Amount" ? "right" : "left", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTxns.map(t => (
                        <tr key={t.id} className="txn-row" style={{ borderBottom: `1px solid ${c.border}`, transition: "background 0.15s" }}>
                          <td style={{ padding: "12px 16px", fontSize: 13, color: c.muted, whiteSpace: "nowrap" }}>{fmtDate(t.date)}</td>
                          <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{t.description}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: CAT_COLORS[t.category] + "22", color: CAT_COLORS[t.category] }}>
                              {t.category}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
                              background: t.type === "income" ? "#dcfce7" : "#fee2e2",
                              color: t.type === "income" ? "#16a34a" : "#dc2626",
                            }}>
                              {t.type === "income" ? "↑ Income" : "↓ Expense"}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700, color: t.type === "income" ? "#10b981" : "#ef4444" }}>
                            {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                          </td>
                          {role === "admin" && (
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", gap: 4 }}>
                                <button onClick={() => openEdit(t)} style={{ padding: 6, border: "none", background: "none", cursor: "pointer", color: c.muted, borderRadius: 6 }} title="Edit">
                                  <Icon name="edit" size={14} />
                                </button>
                                <button onClick={() => setTransactions(ts => ts.filter(x => x.id !== t.id))} style={{ padding: 6, border: "none", background: "none", cursor: "pointer", color: "#ef4444", borderRadius: 6 }} title="Delete">
                                  <Icon name="trash" size={14} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div style={{ padding: "10px 16px", borderTop: `1px solid ${c.border}`, fontSize: 12, color: c.muted }}>
                Showing {filteredTxns.length} of {transactions.length} transactions
              </div>
            </div>
          </div>
        )}

        {/* ── INSIGHTS TAB ── */}
        {tab === "insights" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn 0.3s ease" }}>
            {/* Insight Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
              {[
                {
                  title: "🔥 Highest Spending Category",
                  value: topCat ? topCat.label : "—",
                  sub: topCat ? `${fmt(topCat.value)} total` : "No expenses",
                  accent: "#f97316",
                },
                {
                  title: "📊 Savings Rate",
                  value: totalIncome > 0 ? `${Math.round(((totalIncome - totalExpense) / totalIncome) * 100)}%` : "—",
                  sub: "Of total income saved",
                  accent: "#6366f1",
                },
                {
                  title: "📅 Last Month Spend",
                  value: lastMonth ? fmt(lastMonth.expense) : "—",
                  sub: prevMonth ? `vs ${fmt(prevMonth.expense)} prev month` : "No comparison data",
                  accent: "#ec4899",
                },
                {
                  title: "💸 Avg Transaction",
                  value: transactions.length > 0 ? fmt(Math.round(transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0) / (transactions.filter(t => t.type === "expense").length || 1))) : "—",
                  sub: "Per expense transaction",
                  accent: "#10b981",
                },
              ].map((ins, i) => (
                <div key={i} style={{ ...card(), borderLeft: `4px solid ${ins.accent}` }}>
                  <p style={{ fontSize: 12, color: c.muted, fontWeight: 600, marginBottom: 8 }}>{ins.title}</p>
                  <p style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>{ins.value}</p>
                  <p style={{ fontSize: 12, color: c.muted }}>{ins.sub}</p>
                </div>
              ))}
            </div>

            {/* Monthly Comparison Table */}
            <div style={card()}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Monthly Comparison</h3>
              <p style={{ fontSize: 12, color: c.muted, marginBottom: 16 }}>Income vs expenses month by month</p>
              {monthlyData.length === 0 ? (
                <p style={{ color: c.muted, textAlign: "center", padding: 24 }}>No data available</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                        {["Month", "Income", "Expenses", "Net", "Status"].map(h => (
                          <th key={h} style={{ padding: "10px 12px", fontSize: 11, fontWeight: 700, color: c.muted, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((m, i) => {
                        const net = m.income - m.expense;
                        return (
                          <tr key={i} className="txn-row" style={{ borderBottom: `1px solid ${c.border}`, transition: "background 0.15s" }}>
                            <td style={{ padding: "10px 12px", fontWeight: 700 }}>{m.month}</td>
                            <td style={{ padding: "10px 12px", color: "#10b981", fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{fmt(m.income)}</td>
                            <td style={{ padding: "10px 12px", color: "#ef4444", fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{fmt(m.expense)}</td>
                            <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontWeight: 700, color: net >= 0 ? "#10b981" : "#ef4444" }}>
                              {net >= 0 ? "+" : ""}{fmt(net)}
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: net >= 0 ? "#dcfce7" : "#fee2e2", color: net >= 0 ? "#16a34a" : "#dc2626" }}>
                                {net >= 0 ? "Surplus" : "Deficit"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Category Breakdown */}
            <div style={card()}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Category Breakdown</h3>
              <p style={{ fontSize: 12, color: c.muted, marginBottom: 16 }}>All-time expense distribution</p>
              {catBreakdown.length === 0 ? (
                <p style={{ color: c.muted, textAlign: "center", padding: 24 }}>No expense data</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {catBreakdown.map((cat, i) => {
                    const pct = Math.round((cat.value / totalExpense) * 100);
                    return (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: 2, background: CAT_COLORS[cat.label] }} />
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{cat.label}</span>
                          </div>
                          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <span style={{ fontSize: 12, color: c.muted }}>{pct}%</span>
                            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{fmt(cat.value)}</span>
                          </div>
                        </div>
                        <div style={{ height: 6, background: dark ? "#334155" : "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: CAT_COLORS[cat.label], borderRadius: 3, transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── ADD/EDIT MODAL ── */}
      <Modal open={showAddModal} onClose={() => { setShowAddModal(false); setEditTxn(null); }} title={editTxn ? "Edit Transaction" : "Add Transaction"} dark={dark}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Date", key: "date", type: "date" },
            { label: "Description", key: "description", type: "text", placeholder: "e.g. Monthly Salary" },
            { label: "Amount (₹)", key: "amount", type: "number", placeholder: "0" },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 12, fontWeight: 600, color: c.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(fm => ({ ...fm, [f.key]: e.target.value }))} style={inputStyle} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: c.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Category</label>
            <select value={form.category} onChange={e => setForm(fm => ({ ...fm, category: e.target.value }))} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: c.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Type</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["income", "expense"].map(t => (
                <button key={t} onClick={() => setForm(fm => ({ ...fm, type: t }))} style={{
                  flex: 1, padding: "9px 0", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13, transition: "all 0.15s",
                  background: form.type === t ? (t === "income" ? "#10b981" : "#ef4444") : (dark ? "#243044" : "#f1f5f9"),
                  color: form.type === t ? "#fff" : c.muted, border: "none",
                }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleSave} style={{
            width: "100%", padding: "12px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontWeight: 700, fontSize: 15, marginTop: 4,
          }}>
            {editTxn ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </Modal>

      <style>{`
        @media (max-width: 768px) {
          #menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
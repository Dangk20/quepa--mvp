// Quepa B2B shared UI primitives
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---- Toast system ----
const ToastCtx = React.createContext({ push: () => {} });

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((arr) => [...arr, { id, ...t }]);
    setTimeout(() => setToasts((arr) => arr.filter((x) => x.id !== id)), t.duration || 5500);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="toasts">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <div className="ic">{t.icon || <Icon name="whatsapp" size={16} />}</div>
            <div style={{ flex: 1 }}>
              <div className="ttl">{t.title}</div>
              {t.body && <div className="sub">{t.body}</div>}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => React.useContext(ToastCtx);

// ---- Quepa star (logo asterisk) ----
const QStar = ({ size = 14, fill = "currentColor" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} fill={fill} aria-hidden="true">
    <g>
      <rect x="44" y="4" width="12" height="92" rx="6"/>
      <rect x="44" y="4" width="12" height="92" rx="6" transform="rotate(45 50 50)"/>
      <rect x="44" y="4" width="12" height="92" rx="6" transform="rotate(90 50 50)"/>
      <rect x="44" y="4" width="12" height="92" rx="6" transform="rotate(135 50 50)"/>
    </g>
  </svg>
);

// ---- Avatar ----
const Avatar = ({ name = "?", size = 32, tone = "ink" }) => {
  const initial = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const bg = tone === "yg" ? "#D4F542" : tone === "green" ? "#25D366" : "#0A0A0A";
  const fg = tone === "yg" ? "#0A0A0A" : "#fff";
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, background: bg, color: fg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontWeight: 700, flexShrink: 0, letterSpacing: "-0.02em",
    }}>{initial}</div>
  );
};

// ---- Badge ----
const Badge = ({ variant = "default", children, dot = false }) => (
  <span className={`badge ${variant}`}>{dot && <span className="dot" />}{children}</span>
);

const OriginBadge = ({ origin }) => (
  origin === "quepa"
    ? <span className="badge quepa"><Icon name="whatsapp" size={11} /> Quepa</span>
    : <span className="badge manual">Manual</span>
);

const EstadoBadge = ({ estado }) => {
  const map = {
    Pendiente: "amber",
    Confirmada: "sky",
    Pagada: "leaf",
    "Check-in": "night",
    Ocupada: "night",
    Cumplida: "leaf",
    "No-show": "rose",
    Cancelada: "rose",
    Libre: "yg",
    Bloqueada: "default",
  };
  return <span className={`badge ${map[estado] || "default"}`}>{estado}</span>;
};

// ---- Format helpers ----
const fmtCOP = (n) => "$ " + Math.round(n).toLocaleString("es-CO");
const fmtPct = (n) => `${Math.round(n)}%`;
const fmtPhone = (s) => s; // already formatted in seed

// ---- Sparkline (inline svg) ----
const Spark = ({ data, color = "#0A0A0A", h = 28, w = 96, fill = false }) => {
  if (!data || !data.length) return null;
  const max = Math.max(...data) || 1, min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return [x, y];
  });
  const line = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="spark-line">
      {fill && <path d={area} fill={color} fillOpacity="0.12" />}
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};

const MiniBars = ({ data, peakIdx, h = 32 }) => {
  const max = Math.max(...data) || 1;
  return (
    <div className="h-mini-bars" style={{ height: h }}>
      {data.map((v, i) => (
        <i key={i} className={i === peakIdx ? "peak" : ""} style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
};

// ---- KPI card ----
const KPI = ({ label, value, hint, delta, dark = false, children }) => (
  <div className={`kpi ${dark ? "dark" : ""}`}>
    <div className="lbl">{label}</div>
    <div className="row between" style={{ alignItems: "flex-end" }}>
      <div className="val">{value}</div>
      {delta != null && (
        <span className={`delta ${delta >= 0 ? "up" : "down"}`}>
          <Icon name={delta >= 0 ? "trending-up" : "trending-down"} size={12} />
          {delta >= 0 ? "+" : ""}{delta}%
        </span>
      )}
    </div>
    {children}
    {hint && <div className="hint">{hint}</div>}
  </div>
);

// ---- Drawer / Modal ----
const Drawer = ({ open, onClose, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <React.Fragment>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true">{children}</aside>
    </React.Fragment>
  );
};

const Modal = ({ open, onClose, title, children, footer, className = "" }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${className}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.015em" }}>{title}</div>
          </div>
          <button className="btn icon ghost" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
};

// ---- Empty / Error / Loading ----
const EmptyState = ({ icon = "calendar", title, body, action }) => (
  <div style={{ padding: "48px 24px", textAlign: "center" }}>
    <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--paper)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-50)" }}>
      <Icon name={icon} size={28} />
    </div>
    <div style={{ fontSize: 17, fontWeight: 700, marginTop: 14 }}>{title}</div>
    {body && <div className="muted" style={{ fontSize: 13, marginTop: 6, maxWidth: 360, marginInline: "auto" }}>{body}</div>}
    {action && <div style={{ marginTop: 16 }}>{action}</div>}
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="card" style={{ textAlign: "center", padding: "32px" }}>
    <div style={{ display: "inline-flex", width: 44, height: 44, borderRadius: 12, background: "var(--rose-soft)", color: "var(--rose)", alignItems: "center", justifyContent: "center" }}>
      <Icon name="alert" size={22} />
    </div>
    <div style={{ fontSize: 15, fontWeight: 700, marginTop: 10 }}>Algo se cayó por aquí.</div>
    <div className="muted text-sm" style={{ marginTop: 4 }}>Intenta de nuevo. Si sigue, te avisamos por WhatsApp.</div>
    <button className="btn primary sm" style={{ marginTop: 14 }} onClick={onRetry}>
      <Icon name="refresh" size={14} /> Reintentar
    </button>
  </div>
);

const SkeletonRow = ({ h = 14, w = "100%" }) => <div className="skel" style={{ height: h, width: w }} />;

// ---- Tooltip-ish helper ----
const Pill = ({ children, tone = "default" }) => (
  <span className={`badge ${tone}`}>{children}</span>
);

Object.assign(window, {
  ToastProvider, useToast, QStar, Avatar, Badge, OriginBadge, EstadoBadge,
  fmtCOP, fmtPct, fmtPhone, Spark, MiniBars, KPI, Drawer, Modal,
  EmptyState, ErrorState, SkeletonRow, Pill,
});

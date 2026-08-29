// Quepa B2B · Shell (sidebar + header)
const { useState: _uS_shell } = React;

function Sidebar({ current, onNav, role, estab, collapsed, onToggleCollapse }) {
  const items = [
    { id: "reservas",    label: "Reservas",        icon: "calendar", adminOnly: false },
    { id: "ventas",      label: "Ventas",          icon: "trending-up", adminOnly: true },
    { id: "clientes",    label: "Clientes",        icon: "users",    adminOnly: false },
    { id: "minegocio",   label: "Mi negocio",      icon: "store",    adminOnly: true },
    { id: "conexiones",  label: "Conexiones",      icon: "link",     adminOnly: true },
    { id: "impulsa",     label: "Impulsa tu negocio", icon: "rocket", adminOnly: true },
    { id: "suscripcion", label: "Mi suscripción",  icon: "credit-card", adminOnly: true },
  ];
  const visible = items.filter((i) => role === "Administrador" || !i.adminOnly);
  return (
    <aside className={`sb ${collapsed ? "collapsed" : ""}`}>
      <button
        onClick={onToggleCollapse}
        className="sb-collapse"
        title={collapsed ? "Expandir menú" : "Ocultar menú"}
        aria-label={collapsed ? "Expandir menú" : "Ocultar menú"}
      >
        <Icon name={collapsed ? "chevron-right" : "chevron-left"} size={12} />
      </button>

      <div className="sb-brand">
        <QStar size={28} fill="#D4F542" />
        {!collapsed && (
          <div>
            <div className="name">Quepa</div>
            <div className="tag">Panel del negocio</div>
          </div>
        )}
      </div>

      {!collapsed && <div className="sb-section">Operación</div>}
      {visible.map((i) => (
        <button
          key={i.id}
          className={`sb-link ${current === i.id ? "active" : ""}`}
          onClick={() => onNav(i.id)}
          title={collapsed ? i.label : undefined}
        >
          <Icon name={i.icon} size={18} />
          {!collapsed && <span>{i.label}</span>}
          {!collapsed && i.id === "reservas" && current !== "reservas" && <span className="badge">3</span>}
        </button>
      ))}

      <div className="sb-spacer" />

      <div className="sb-foot">
        <div className="sb-account" title={collapsed ? (role === "Administrador" ? "Marta Restrepo" : "Andrea (Op.)") : undefined}>
          <div className="av">{role === "Administrador" ? "MR" : "OP"}</div>
          {!collapsed && (
            <React.Fragment>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="name">{role === "Administrador" ? "Marta Restrepo" : "Andrea (Op.)"}</div>
                <div className="role">{role}</div>
              </div>
              <Icon name="logout" size={16} />
            </React.Fragment>
          )}
        </div>
      </div>
    </aside>
  );
}

function Header({ estab, role, onRoleChange, onEstabChange, onNav, demo = true, estabs = ESTABS }) {
  const [openSwitcher, setOpenSwitcher] = _uS_shell(false);
  const [openNotif, setOpenNotif] = _uS_shell(false);
  const salud = MI_NEGOCIO[estab.id]?.salud;
  const showPerfilBadge = role === "Administrador" && salud && salud.completo < 100;

  return (
    <header className="hdr">
      <div className="hdr-biz" style={{ position: "relative" }}>
        <button
          className="hdr-biz row gap-3"
          onClick={() => setOpenSwitcher((v) => !v)}
          style={{ padding: "4px 8px 4px 4px", borderRadius: 12 }}
        >
          <div className="ico">{estab.short}</div>
          <div style={{ textAlign: "left" }}>
            <div className="nm row gap-2">{estab.name} <Icon name="chevron-down" size={14} /></div>
            <div className="meta">{estab.city} · {VERTICAL_LABEL[estab.vertical]}</div>
          </div>
        </button>
        {openSwitcher && (
          <div
            className="card"
            style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0,
              zIndex: 90, minWidth: 320, padding: 8, boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="eyebrow" style={{ padding: "8px 8px 4px" }}>Cambiar negocio (demo)</div>
            {estabs.map((e) => (
              <button
                key={e.id}
                onClick={() => { onEstabChange(e); setOpenSwitcher(false); }}
                className="row gap-3"
                style={{
                  width: "100%", padding: "10px 8px", borderRadius: 8,
                  background: e.id === estab.id ? "var(--paper)" : "transparent",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: e.nuevo ? "var(--yg)" : "var(--night)",
                  color: e.nuevo ? "var(--night)" : "var(--yg)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 12,
                }}>{e.short}</div>
                <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                  <div className="row gap-2" style={{ alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.1 }}>{e.name}</span>
                    {e.nuevo && <span className="badge yg" style={{ fontSize: 8 }}>NUEVO · 0%</span>}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-50)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
                    {e.city} · {VERTICAL_LABEL[e.vertical]}
                  </div>
                </div>
                {e.id === estab.id && <Icon name="check" size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hdr-search">
        <Icon name="search" size={14} />
        <input placeholder="Busca reserva, cliente, mesa..." />
        <span className="kbd">⌘K</span>
      </div>

      {showPerfilBadge && (
        <button
          onClick={() => onNav("minegocio")}
          className="row gap-2"
          style={{
            background: salud.completo === 0 ? "var(--yg)" : "var(--paper)",
            color: "var(--ink)",
            padding: "5px 10px 5px 8px",
            borderRadius: 999,
            fontSize: 11.5, fontWeight: 600,
            border: salud.completo === 0 ? "0" : "1px solid var(--line)",
          }}
          title="Configura tu perfil para que Quepa te recomiende"
        >
          <div style={{
            width: 18, height: 18, borderRadius: 999,
            background: "var(--ink)", color: "var(--yg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
            flexShrink: 0,
          }}>{salud.completo}</div>
          <span>{salud.completo === 0 ? "Configura tu perfil" : "Perfil incompleto"}</span>
        </button>
      )}

      <div className="role-switch" title="Switcher de rol (demo)">
        <button className={role === "Administrador" ? "on" : ""} onClick={() => onRoleChange("Administrador")}>Administrador</button>
        <button className={role === "Operativo" ? "on" : ""} onClick={() => onRoleChange("Operativo")}>Operativo</button>
      </div>

      <div style={{ position: "relative" }}>
        <button className="hdr-icon" title="Notificaciones" onClick={() => setOpenNotif((v) => !v)}>
          <Icon name="bell" size={18} />
          <span className="dot" />
        </button>
        {openNotif && (
          <NotifPanel onClose={() => setOpenNotif(false)} onNav={(t) => { setOpenNotif(false); onNav(t); }} />
        )}
      </div>
      <button className="hdr-icon" onClick={() => onNav("conexiones")} title="Ajustes">
        <Icon name="settings" size={18} />
      </button>
    </header>
  );
}

const VERTICAL_LABEL = {
  mesas: "Restaurante / Bar",
  habitaciones: "Hotel / Hostal",
  canchas: "Canchas / Espacios",
  agenda: "Servicios / Citas",
};

// ============================================================
// Panel de notificaciones (dropdown del icono campana)
// ============================================================
function NotifPanel({ onClose, onNav }) {
  const notifs = [
    {
      id: "n1", tipo: "quepa", title: "Nueva reserva por Quepa",
      body: "Sandra Vélez · T6 · 20:30 · 4 personas",
      time: "hace 2 min", nav: "reservas",
    },
    {
      id: "n2", tipo: "quepa", title: "Nueva reserva por Quepa",
      body: "Daniel Páez · T4 · cena de cumpleaños · 6 personas",
      time: "hace 18 min", nav: "reservas",
    },
    {
      id: "n3", tipo: "pago", title: "Pago confirmado",
      body: "Luis Felipe Castro · $ 215.000 · Wompi",
      time: "hace 1 h", nav: "ventas",
    },
    {
      id: "n4", tipo: "perfil", title: "Perfil al 75% — completa lo que falta",
      body: "Te falta agregar 3 fotos y marcar pet-friendly.",
      time: "hace 3 h", nav: "minegocio",
    },
    {
      id: "n5", tipo: "stars", title: "★ Subiste a Quepa Stars · 2 estrellas",
      body: "Tu ocupación + reseñas te llevaron al siguiente nivel.",
      time: "ayer", nav: "minegocio",
    },
    {
      id: "n6", tipo: "alert", title: "Cobro pendiente",
      body: "3 reservas confirmadas siguen sin pagar — $ 720.000",
      time: "ayer", nav: "ventas",
    },
  ];

  const icoFor = (t) => ({
    quepa:  { name: "whatsapp", bg: "var(--green)", color: "#fff" },
    pago:   { name: "credit-card", bg: "var(--yg)", color: "var(--ink)" },
    perfil: { name: "store", bg: "var(--paper)", color: "var(--ink)" },
    stars:  { name: "spark", bg: "var(--night)", color: "var(--yg)" },
    alert:  { name: "alert", bg: "var(--rose-soft)", color: "var(--rose)" },
  })[t] || { name: "bell", bg: "var(--paper)", color: "var(--ink)" };

  return (
    <React.Fragment>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 80 }}
      />
      <div
        className="card"
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          width: 380,
          maxWidth: "calc(100vw - 24px)",
          padding: 0,
          zIndex: 90,
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
        }}
      >
        <div className="row between" style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)" }}>
          <div className="row gap-2">
            <Icon name="bell" size={14} />
            <div style={{ fontSize: 14, fontWeight: 700 }}>Notificaciones</div>
            <span className="badge yg" style={{ fontSize: 9 }}>{notifs.filter((n) => ["quepa", "alert"].includes(n.tipo)).length} nuevas</span>
          </div>
          <button className="btn ghost sm" style={{ padding: "3px 8px" }}>Marcar leídas</button>
        </div>

        <div style={{ maxHeight: 440, overflowY: "auto" }}>
          {notifs.map((n, i) => {
            const ic = icoFor(n.tipo);
            const isNew = i < 2;
            return (
              <button
                key={n.id}
                onClick={() => onNav(n.nav)}
                style={{
                  width: "100%",
                  display: "flex",
                  gap: 12,
                  padding: "12px 16px",
                  textAlign: "left",
                  background: isNew ? "rgba(212,245,66,.08)" : "transparent",
                  borderBottom: "1px solid var(--line)",
                  border: 0,
                  borderBottom: "1px solid var(--line)",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {isNew && (
                  <div style={{
                    position: "absolute", left: 6, top: "50%",
                    transform: "translateY(-50%)",
                    width: 4, height: 4, borderRadius: 999,
                    background: "var(--green)",
                  }} />
                )}
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: ic.bg, color: ic.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon name={ic.name} size={15} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{n.title}</div>
                  <div className="text-sm muted" style={{ marginTop: 2, lineHeight: 1.3 }}>{n.body}</div>
                  <div className="mono text-xs dim" style={{ marginTop: 4, letterSpacing: "0.04em" }}>{n.time}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="row between" style={{ padding: "10px 16px", background: "var(--paper)", borderTop: "1px solid var(--line)" }}>
          <span className="mono text-xs dim">También llegan a tu WhatsApp</span>
          <button className="btn ghost sm" style={{ padding: "3px 8px" }} onClick={() => onNav("conexiones")}>
            Ajustes <Icon name="chevron-right" size={11} />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { Sidebar, Header, VERTICAL_LABEL });

// Quepa B2B · Drawer de detalle de reserva (común a las 4 verticales)
const { useState: _uS_drw } = React;

function DrawerReserva({ open, onClose, reserva, cliente, recurso, vertical, onUpdateEstado, onAttrib }) {
  const [atribuida, setAtribuida] = _uS_drw(reserva?.atribuida);
  if (!reserva || !cliente) return null;

  const acciones = (() => {
    switch (reserva.estado) {
      case "Pendiente":   return [{ to: "Confirmada", label: "Confirmar", primary: true }, { to: "Cancelada",  label: "Rechazar",  danger: true }];
      case "Confirmada":  return [{ to: "Check-in",   label: "Check-in",  primary: true }, { to: "Cancelada",  label: "Cancelar",  danger: true }];
      case "Ocupada":     return [{ to: "Cumplida",   label: "Cerrar y marcar cumplida", primary: true }];
      case "Check-in":    return [{ to: "Cumplida",   label: "Marcar cumplida",    primary: true }, { to: "No-show", label: "No-show", danger: true }];
      case "Pagada":      return [{ to: "Cumplida",   label: "Marcar cumplida",    primary: true }];
      default: return [];
    }
  })();

  const wam = `https://wa.me/${cliente.wa.replace(/\D/g, "")}?text=${encodeURIComponent("¡Hola " + cliente.nombre.split(" ")[0] + "! Te escribimos desde " + (window.__estabName || "tu negocio") + " — Reserva confirmada para " + (recurso || "") + ". Te esperamos. — Equipo · Quepa.")}`;

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="drawer-head">
        <Avatar name={cliente.nombre} size={42} tone="ink" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row gap-2" style={{ alignItems: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.015em" }}>{cliente.nombre}</div>
            {cliente.tipo === "Frecuente" && <Pill tone="yg">VIP</Pill>}
          </div>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-50)", marginTop: 2 }}>{cliente.wa}</div>
        </div>
        <button className="btn icon ghost" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>

      <div className="drawer-body">
        <a href={wam} target="_blank" rel="noreferrer" className="btn wa" style={{ width: "100%", justifyContent: "center" }}>
          <Icon name="whatsapp" size={14} /> Abrir conversación · WhatsApp
        </a>

        <div style={{ marginTop: 22 }}>
          <div className="eyebrow">Esta reserva</div>
          <div className="card" style={{ marginTop: 10, padding: 16 }}>
            <div className="col gap-3">
              <DRow k="Recurso"   v={recurso} />
              <DRow k="Fecha y hora" v={reserva.fechaTxt || reserva.hora} />
              <DRow k={vertical === "habitaciones" ? "Noches" : (vertical === "agenda" ? "Servicio" : "Personas")} v={reserva.detalleSecundario} />
              <DRow k="Valor"     v={reserva.valor ? fmtCOP(reserva.valor) : <span className="dim">Sin pago integrado</span>} />
              <DRow k="Origen"    v={<OriginBadge origin={reserva.origen} />} />
              <DRow k="Estado"    v={<EstadoBadge estado={reserva.estado} />} />
              {reserva.notas && <DRow k="Nota del cliente" v={<span style={{ fontStyle: "italic" }}>"{reserva.notas}"</span>} />}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <div className="row between" style={{ marginBottom: 8 }}>
            <div className="eyebrow row gap-2"><QStar size={10} fill="#0A0A0A" /> Quién es este cliente</div>
            <button className="btn ghost sm">Ver perfil completo <Icon name="chevron-right" size={12} /></button>
          </div>
          <div style={{ background: "var(--night)", color: "#fff", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Stat label="Reservas históricas" value={cliente.reservas} />
              <Stat label="Cumplidas" value={`${Math.round((cliente.cumplidas / Math.max(1, cliente.reservas)) * 100)}%`} />
              <Stat label="Ticket promedio" value={cliente.ticketProm ? fmtCOP(cliente.ticketProm) : "—"} />
              <Stat label="Día que más reserva" value={`${cliente.dia} · ${cliente.franja}`} small />
            </div>
            {cliente.tags?.length > 0 && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.1)" }}>
                <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Etiquetas observadas</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {cliente.tags.map((t, i) => (
                    <span key={i} style={{ background: "rgba(212,245,66,.12)", color: "var(--yg)", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <div className="eyebrow">Bitácora</div>
          <div className="col gap-2" style={{ marginTop: 10 }}>
            {(reserva.bitacora || []).slice().reverse().map((b, i) => (
              <div key={i} className="row gap-3" style={{ paddingLeft: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: 999, background: i === 0 ? "var(--yg)" : "var(--ink-30)", marginTop: 8, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{b.a}</div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-50)", letterSpacing: "0.06em", marginTop: 2 }}>{b.u} · {b.t === 0 ? "hoy" : `hace ${-b.t}d`} · {b.h}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {reserva.origen === "quepa" && (
          <div style={{ marginTop: 22, background: "var(--green-soft)", borderRadius: 12, padding: 14, border: "1px solid rgba(37,211,102,.2)" }}>
            <div className="row gap-2" style={{ marginBottom: 8 }}>
              <Icon name="whatsapp" size={14} color="#25D366" />
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>Atribución Quepa</div>
            </div>
            <div className="text-sm" style={{ color: "var(--ink-70)", marginBottom: 12 }}>
              ¿Habrías tenido esta reserva sin Quepa?
            </div>
            <div className="row gap-2">
              <button
                className="btn sm"
                onClick={() => { setAtribuida("no"); onAttrib?.("no"); }}
                style={{ background: atribuida === "no" ? "var(--night)" : "#fff", color: atribuida === "no" ? "var(--yg)" : "var(--ink)", flex: 1, justifyContent: "center" }}
              >
                No — gracias a Quepa
              </button>
              <button
                className="btn sm"
                onClick={() => { setAtribuida("si"); onAttrib?.("si"); }}
                style={{ background: atribuida === "si" ? "var(--ink-12)" : "#fff", color: "var(--ink)", flex: 1, justifyContent: "center" }}
              >
                Sí — la habría tenido
              </button>
            </div>
          </div>
        )}
      </div>

      {acciones.length > 0 && (
        <div className="drawer-foot">
          {acciones.map((a, i) => (
            <button
              key={i}
              className={`btn ${a.primary ? "primary" : a.danger ? "danger" : ""}`}
              onClick={() => { onUpdateEstado?.(a.to); }}
              style={{ flex: 1, justifyContent: "center" }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </Drawer>
  );
}

const DRow = ({ k, v }) => (
  <div className="row between" style={{ alignItems: "flex-start", gap: 12 }}>
    <div className="mono" style={{ fontSize: 10, color: "var(--ink-50)", letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0, paddingTop: 2 }}>{k}</div>
    <div style={{ fontSize: 13, fontWeight: 600, textAlign: "right" }}>{v}</div>
  </div>
);

const Stat = ({ label, value, small = false }) => (
  <div>
    <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,.5)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: small ? 14 : 22, fontWeight: 700, color: "var(--yg)", marginTop: 4, letterSpacing: "-0.015em" }}>{value}</div>
  </div>
);

Object.assign(window, { DrawerReserva });

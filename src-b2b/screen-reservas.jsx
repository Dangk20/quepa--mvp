// Quepa B2B · Screen Reservas (orquestador de las 4 verticales)
const { useState: _uS_res, useEffect: _uE_res, useMemo: _uM_res } = React;

function ScreenReservas({ estab, onEstabChange }) {
  const [vertical, setVertical] = _uS_res(estab.vertical);
  const [view, setView] = _uS_res("lienzo"); // lienzo | tabla
  const [drawerR, setDrawerR] = _uS_res(null);
  const [openNew, setOpenNew] = _uS_res(false);
  const [error, setError] = _uS_res(false);
  const [loading, setLoading] = _uS_res(true);
  const toast = useToast();

  // Switch sets estab + vertical (in production vertical comes from estab.vertical)
  const switchVertical = (v) => {
    setVertical(v);
    const target = ESTABS.find((e) => e.vertical === v);
    if (target) onEstabChange(target);
  };

  // Realtime simulated: cuando entra al módulo, dispara un toast
  _uE_res(() => {
    setLoading(true);
    const t1 = setTimeout(() => setLoading(false), 380);
    const t2 = setTimeout(() => {
      const cliente = NEW_QUEPA_RESERVATIONS[vertical];
      toast.push({
        title: "Nueva reserva por Quepa",
        body: cliente,
        icon: <Icon name="whatsapp" size={16} />,
      });
    }, 1400);
    const extras = NEW_QUEPA_EXTRAS[vertical] || [];
    const t3s = extras.map((extra, i) =>
      setTimeout(() => {
        toast.push({
          title: extra.title,
          body: extra.body,
          icon: <Icon name="whatsapp" size={16} />,
        });
      }, 2800 + i * 1400)
    );
    return () => { clearTimeout(t1); clearTimeout(t2); t3s.forEach(clearTimeout); };
  }, [vertical]);

  const verticalReservas = useReservasForVertical(vertical);
  const verticalClientes = CLIENTES[estab.id] || [];

  window.__estabName = estab.name;

  const verticalLabel = {
    mesas: "Restaurante / Bar — plano de mesas",
    habitaciones: "Hotel / Hostal — timeline",
    canchas: "Canchas / Espacios — slots por hora",
    agenda: "Servicios — agenda por profesional",
  }[vertical];

  return (
    <div className="page-pad">
      {/* Page header */}
      <div className="page-h">
        <div>
          <div className="eyebrow">Reservas · {VERTICAL_LABEL[vertical]}</div>
          <h1>Reservas</h1>
          <div className="sub">
            {verticalLabel}. La estructura cambia según tu tipo de negocio — siempre el mismo flujo.
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn" onClick={() => setView(view === "lienzo" ? "tabla" : "lienzo")}>
            <Icon name={view === "lienzo" ? "table" : "grid"} size={14} />
            Ver como {view === "lienzo" ? "tabla" : "lienzo"}
          </button>
          <button className="btn primary" onClick={() => setOpenNew(true)}>
            <Icon name="plus" size={14} /> Crear reserva
          </button>
        </div>
      </div>

      {/* Selector de vertical (demo) */}
      <div className="row between" style={{ marginBottom: 14 }}>
        <div className="seg">
          {Object.entries(VERTICAL_LABEL).map(([v, label]) => (
            <button key={v} className={vertical === v ? "on" : ""} onClick={() => switchVertical(v)}>
              <Icon name={{ mesas: "store", habitaciones: "bed", canchas: "court", agenda: "stethoscope" }[v]} size={13} /> {label}
            </button>
          ))}
        </div>
        <div className="mono text-xs dim row gap-2" style={{ background: "var(--yg)", color: "var(--night)", padding: "5px 10px", borderRadius: 6, fontWeight: 600 }}>
          <Icon name="alert" size={12} /> Demo · en producción el vertical lo fija el tipo de negocio
        </div>
      </div>

      {/* KPIs del vertical */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 18 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <SkeletonRow h={10} w="60%" />
              <div style={{ height: 8 }} />
              <SkeletonRow h={26} w="70%" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={() => setError(false)} />
      ) : (
        <React.Fragment>
          {vertical === "mesas" && <KPIsMesas />}
          {vertical === "habitaciones" && <KPIsHabitaciones />}
          {vertical === "canchas" && <KPIsCanchas />}
          {vertical === "agenda" && <KPIsAgenda />}
        </React.Fragment>
      )}

      {/* KPI transversal Quepa */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <QuepaShareKPI />
        <QuepaAttribKPI />
      </div>

      {/* Lienzo o tabla */}
      {view === "lienzo" ? (
        <React.Fragment>
          {vertical === "mesas"        && <LienzoMesas       reservas={verticalReservas} clientes={verticalClientes} onOpenReserva={(r) => setDrawerR({ r, vertical })} />}
          {vertical === "habitaciones" && <LienzoHabitaciones reservas={verticalReservas} clientes={verticalClientes} onOpenReserva={(r) => setDrawerR({ r, vertical })} />}
          {vertical === "canchas"      && <LienzoCanchas     reservas={verticalReservas} clientes={verticalClientes} onOpenReserva={(r) => setDrawerR({ r, vertical })} />}
          {vertical === "agenda"       && <LienzoAgenda      reservas={verticalReservas} clientes={verticalClientes} onOpenReserva={(r) => setDrawerR({ r, vertical })} />}
        </React.Fragment>
      ) : (
        <TablaReservas vertical={vertical} reservas={verticalReservas} clientes={verticalClientes} onOpen={(r) => setDrawerR({ r, vertical })} />
      )}

      {/* Drawer detalle */}
      {drawerR && (() => {
        const r = drawerR.r;
        const cli = verticalClientes.find((c) => c.id === r.clienteId);
        let recurso = "—";
        let detalle2 = "";
        if (vertical === "mesas")        { recurso = `Mesa ${r.mesa}`;     detalle2 = `${r.pax} personas`; }
        if (vertical === "habitaciones") { recurso = `Habitación ${r.hab}`; detalle2 = `${r.noches} noches`; }
        if (vertical === "canchas")      { const c = CANCHAS_LAYOUT.find((x) => x.code === r.cancha); recurso = c ? `${c.code} · ${c.nombre}` : r.cancha; detalle2 = `${r.duracion} hora${r.duracion > 1 ? "s" : ""}`; }
        if (vertical === "agenda")       { const p = PROFESIONALES.find((x) => x.id === r.pro); recurso = p ? p.nombre : "—"; detalle2 = r.servicio; }
        const ench = { ...r, detalleSecundario: detalle2, fechaTxt: fechaTxt(r) };
        return (
          <DrawerReserva
            open={true}
            onClose={() => setDrawerR(null)}
            reserva={ench}
            cliente={cli}
            recurso={recurso}
            vertical={vertical}
            onUpdateEstado={(newSt) => { r.estado = newSt; setDrawerR({ ...drawerR }); }}
          />
        );
      })()}

      <ModalCrearReserva open={openNew} onClose={() => setOpenNew(false)} vertical={vertical} clientes={verticalClientes} />
    </div>
  );
}

const NEW_QUEPA_RESERVATIONS = {
  mesas:        "Sandra Vélez · T6 · 20:30 · 4 personas",
  habitaciones: "Camilo Restrepo · Hab. 203 · 3 noches",
  canchas:      "Carlos Ramírez · C1 · 21:00 · Fútbol 5",
  agenda:       "Mónica Gaviria · Dra. Marín · 16:00 · Limpieza",
};

const NEW_QUEPA_EXTRAS = {
  mesas: [
    { title: "Nueva reserva por Quepa", body: "Felipe Andrade · T2 · 19:00 · 2 personas" },
    { title: "Pago confirmado · Wompi", body: "Daniel Páez · $ 215.000" },
  ],
  habitaciones: [
    { title: "Nueva reserva por Quepa", body: "Andrea Sepúlveda · Hab. 301 · 4 noches" },
    { title: "Cliente Quepa preguntó por ti", body: "Andrés · busca \"vista al río\" para el sábado" },
  ],
  canchas: [
    { title: "Nueva reserva por Quepa", body: "Luis Eduardo · C4 · 20:00 · Pádel" },
    { title: "Pago confirmado · Wompi", body: "Jorge Iván Henao · $ 190.000" },
  ],
  agenda: [
    { title: "Nueva reserva por Quepa", body: "Sofía Calderón · Dra. Marín · 10:30 · Limpieza" },
    { title: "Cliente preguntó por ti", body: "Diego Mendoza · busca brackets estéticos" },
  ],
};

function useReservasForVertical(v) {
  return _uM_res(() => {
    switch (v) {
      case "mesas":        return RESERVAS_MESAS;
      case "habitaciones": return RESERVAS_HABS;
      case "canchas":      return RESERVAS_CANCHAS;
      case "agenda":       return RESERVAS_AGENDA;
      default: return [];
    }
  }, [v]);
}

const fechaTxt = (r) => {
  const d = new Date(_today); d.setDate(d.getDate() + (r.fecha || 0));
  const fmt = d.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "short" });
  return `${fmt} · ${r.hora || ""}`;
};

function QuepaShareKPI() {
  const total = 110, viaQuepa = 71;
  const pct = Math.round((viaQuepa / total) * 100);
  return (
    <div className="kpi" style={{ position: "relative", overflow: "hidden" }}>
      <div className="row between">
        <div className="lbl row gap-2"><Icon name="whatsapp" size={11} color="#25D366" /> Reservas de origen Quepa · este mes</div>
        <span className="mono text-xs dim">{viaQuepa}/{total}</span>
      </div>
      <div style={{ display: "flex", gap: 0, height: 12, borderRadius: 999, overflow: "hidden", background: "var(--paper)", marginTop: 8 }}>
        <div style={{ width: `${pct}%`, background: "var(--green)" }} />
        <div style={{ width: `${100 - pct}%`, background: "var(--ink-12)" }} />
      </div>
      <div className="row between" style={{ marginTop: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{pct}%</span>
        <span className="text-xs muted">via Quepa · resto manual / repetición</span>
      </div>
    </div>
  );
}

function QuepaAttribKPI() {
  const atribuibles = 54;
  return (
    <div className="kpi dark">
      <div className="lbl row gap-2"><QStar size={10} fill="#D4F542" /> Reservas atribuibles a Quepa · este mes</div>
      <div className="row between" style={{ alignItems: "flex-end" }}>
        <div className="val">{atribuibles}</div>
        <span style={{ color: "var(--yg)", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-mono)" }}>+18 vs mes anterior</span>
      </div>
      <div className="hint">Sumadas a partir de "No la habría tenido sin Quepa". Es el valor por el que pagas.</div>
    </div>
  );
}

// ============================================================
// Tabla común
// ============================================================
function TablaReservas({ vertical, reservas, clientes, onOpen }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table className="tbl">
        <thead>
          <tr>
            <th>Fecha y hora</th>
            <th>Cliente</th>
            <th>{vertical === "habitaciones" ? "Habitación" : vertical === "canchas" ? "Cancha" : vertical === "agenda" ? "Profesional · servicio" : "Mesa"}</th>
            <th>{vertical === "habitaciones" ? "Noches" : "Personas"}</th>
            <th>Origen</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reservas.slice().sort((a, b) => a.fecha - b.fecha).map((r) => {
            const c = clientes.find((x) => x.id === r.clienteId);
            const recurso =
              vertical === "mesas" ? `Mesa ${r.mesa}` :
              vertical === "habitaciones" ? `Hab. ${r.hab}` :
              vertical === "canchas" ? r.cancha :
              vertical === "agenda" ? `${PROFESIONALES.find((p) => p.id === r.pro)?.nombre.split(" ").slice(0, 2).join(" ")} · ${r.servicio}` : "";
            const det = vertical === "habitaciones" ? `${r.noches}n` : (r.pax || (r.dur ? `${r.dur}h` : "—"));
            return (
              <tr key={r.id} onClick={() => onOpen(r)} style={{ cursor: "pointer" }}>
                <td className="mono text-sm">{fechaTxt(r)}</td>
                <td>
                  <div className="row gap-2">
                    <Avatar name={c?.nombre || "?"} size={26} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{c?.nombre}</div>
                      <div className="mono text-xs dim">{c?.wa}</div>
                    </div>
                  </div>
                </td>
                <td className="text-sm">{recurso}</td>
                <td className="mono text-sm">{det}</td>
                <td><OriginBadge origin={r.origen} /></td>
                <td><EstadoBadge estado={r.estado} /></td>
                <td className="row-action">
                  <button className="btn ghost sm">Ver <Icon name="chevron-right" size={12} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ModalCrearReserva({ open, onClose, vertical, clientes }) {
  const [form, setForm] = _uS_res({ nombre: "", wa: "+57 ", fecha: "", hora: "", recurso: "", num: 2, nota: "" });
  const recursoLabel = { mesas: "Mesa", habitaciones: "Habitación", canchas: "Cancha", agenda: "Profesional" }[vertical];
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={<div><div>Nueva reserva</div><div className="muted text-sm" style={{ fontWeight: 400, marginTop: 2 }}>Se crea con estado Confirmada · origen Manual</div></div>}
      footer={<React.Fragment>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
        <button className="btn primary" onClick={onClose}><Icon name="check" size={14} /> Crear reserva</button>
      </React.Fragment>}
    >
      <div className="col gap-3">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="field">
            <label>Nombre del cliente</label>
            <input className="input" placeholder="Ej. María Fernanda López" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div className="field">
            <label>WhatsApp</label>
            <input className="input" placeholder="+57 3xx xxx xxxx" value={form.wa} onChange={(e) => setForm({ ...form, wa: e.target.value })} />
            <span className="hint">Usamos el WA como identificador único del cliente.</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div className="field"><label>Fecha</label><input className="input" type="date" /></div>
          <div className="field"><label>Hora</label><input className="input" type="time" /></div>
          <div className="field"><label>{vertical === "habitaciones" ? "Noches" : (vertical === "agenda" ? "Duración" : "Personas")}</label><input className="input" type="number" defaultValue="2" /></div>
        </div>
        <div className="field"><label>{recursoLabel}</label><select className="select"><option>Asignar automáticamente</option></select></div>
        <div className="field"><label>Nota</label><textarea className="textarea" placeholder="Preferencias, alergias, ocasión…" /></div>
      </div>
    </Modal>
  );
}

Object.assign(window, { ScreenReservas, TablaReservas, ModalCrearReserva });

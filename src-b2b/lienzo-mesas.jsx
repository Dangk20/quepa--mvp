// Quepa B2B · Lienzo Mesas (Restaurantes / Bares)
// Vista top-down: mesas como cápsulas con sillas, estado por color/forma del borde
const { useState: _uS_mesas, useMemo: _uM_mesas } = React;

// Chair layout per pax count (sillas distribuidas alrededor)
function chairsFor(pax) {
  if (pax <= 1) return { top: 1, bot: 0, left: 0, right: 0 };
  if (pax === 2) return { top: 1, bot: 1, left: 0, right: 0 };
  if (pax === 3) return { top: 2, bot: 1, left: 0, right: 0 };
  if (pax === 4) return { top: 2, bot: 2, left: 0, right: 0 };
  if (pax === 5) return { top: 2, bot: 2, left: 1, right: 0 };
  if (pax === 6) return { top: 2, bot: 2, left: 1, right: 1 };
  if (pax === 7) return { top: 3, bot: 2, left: 1, right: 1 };
  if (pax === 8) return { top: 3, bot: 3, left: 1, right: 1 };
  if (pax === 9) return { top: 3, bot: 3, left: 2, right: 1 };
  if (pax === 10) return { top: 4, bot: 4, left: 1, right: 1 };
  if (pax === 11) return { top: 4, bot: 4, left: 2, right: 1 };
  if (pax === 12) return { top: 4, bot: 4, left: 2, right: 2 };
  if (pax <= 16) return { top: 5, bot: 5, left: Math.ceil((pax - 10) / 2), right: Math.floor((pax - 10) / 2) };
  // >16: cap visual
  return { top: 6, bot: 6, left: 2, right: 2 };
}

function MesaCard({ mesa, reserva, cliente, onClick }) {
  const bloqueada = mesa.bloqueada;
  let klass = "libre";
  let stateLabel = "Libre";
  if (bloqueada) { klass = "bloqueada"; stateLabel = "Bloqueada"; }
  else if (reserva?.estado === "Ocupada") { klass = "ocupada"; stateLabel = "Ocupada"; }
  else if (reserva?.estado === "Confirmada") { klass = "reservada"; stateLabel = "Reservada"; }
  else if (reserva?.estado === "Pendiente") { klass = "pendiente"; stateLabel = "Pendiente"; }

  const chairs = chairsFor(mesa.pax);

  // What's shown inside the pill
  let line1 = mesa.code;
  let line2 = null, line3 = null;
  if (bloqueada) {
    line2 = "Mantenimiento";
  } else if (reserva && cliente) {
    line2 = cliente.nombre;
    line3 = `${reserva.hora}${reserva.pax ? ` · ${reserva.pax}p` : ""}`;
  } else {
    line2 = "Libre";
  }

  return (
    <div
      className={`mesa-card ${klass}`}
      onClick={() => !bloqueada && onClick(reserva)}
      role="button"
    >
      {reserva?.origen === "quepa" && (
        <div className="mesa-quepa" title="Origen Quepa">
          <Icon name="whatsapp" size={11} />
        </div>
      )}

      {/* Top chairs */}
      {chairs.top > 0 && (
        <div className="mesa-chairs h">
          {Array.from({ length: chairs.top }).map((_, i) => <div key={i} className="mesa-chair" />)}
        </div>
      )}

      {/* Center: pill + side chairs */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "stretch" }}>
        {chairs.left > 0 && (
          <div className="mesa-chairs v left">
            {Array.from({ length: chairs.left }).map((_, i) => <div key={i} className="mesa-chair" />)}
          </div>
        )}
        <div className="mesa-pill">
          <span className="pax">{mesa.pax}p</span>
          <div className="code">{line1}</div>
          {line2 && <div className="who">{line2}</div>}
          {line3 && <div className="when">{line3}</div>}
        </div>
        {chairs.right > 0 && (
          <div className="mesa-chairs v right">
            {Array.from({ length: chairs.right }).map((_, i) => <div key={i} className="mesa-chair" />)}
          </div>
        )}
      </div>

      {/* Bottom chairs */}
      {chairs.bot > 0 && (
        <div className="mesa-chairs h">
          {Array.from({ length: chairs.bot }).map((_, i) => <div key={i} className="mesa-chair" />)}
        </div>
      )}

      {/* Zona tag */}
      <div className="mesa-zona">
        {bloqueada ? stateLabel : mesa.zona}
      </div>
    </div>
  );
}

function LienzoMesas({ reservas, clientes, onOpenReserva }) {
  const [zonaFilter, setZonaFilter] = _uS_mesas("todas");
  const [franjaFilter, setFranjaFilter] = _uS_mesas("todas"); // todas | mañana | mediodia | noche
  const [modalMesa, setModalMesa] = _uS_mesas(null);

  const zonas = Array.from(new Set(MESAS_LAYOUT.map((m) => m.zona)));

  // Map mesa -> reserva activa "ahora" (hoy)
  const reservasHoy = reservas.filter((r) => r.fecha === 0);
  const mesaState = {};
  MESAS_LAYOUT.forEach((m) => {
    const r = reservasHoy.find((x) => x.mesa === m.code && ["Ocupada", "Confirmada", "Pendiente"].includes(x.estado));
    mesaState[m.code] = r;
  });

  // Bloqueadas
  const bloqueadas = new Set(["T9"]);

  // Apply zone filter to displayed mesas
  const visibleMesas = MESAS_LAYOUT
    .map((m) => ({ ...m, bloqueada: bloqueadas.has(m.code) }))
    .filter((m) => zonaFilter === "todas" || m.zona === zonaFilter);

  const agendaHoy = reservasHoy
    .filter((r) => ["Confirmada", "Pendiente"].includes(r.estado))
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const almuerzo = agendaHoy.filter((r) => r.franja === "Almuerzo");
  const cena = agendaHoy.filter((r) => r.franja === "Cena");

  // Stats
  const ocupadas = MESAS_LAYOUT.filter((m) => mesaState[m.code]?.estado === "Ocupada").length;
  const reservadas = MESAS_LAYOUT.filter((m) => mesaState[m.code]?.estado === "Confirmada").length;
  const libres = MESAS_LAYOUT.filter((m) => !mesaState[m.code] && !bloqueadas.has(m.code)).length;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>
      <div>
        {/* Top bar: zone tabs + franja toggle */}
        <div className="row between" style={{ marginBottom: 14 }}>
          <div className="hostal-type-tabs">
            <button className={`hostal-type-tab ${zonaFilter === "todas" ? "on" : ""}`} onClick={() => setZonaFilter("todas")}>
              Todo el salón
              <span className="mono" style={{ opacity: .6, fontSize: 10 }}>{MESAS_LAYOUT.length}</span>
            </button>
            {zonas.map((z) => (
              <button key={z} className={`hostal-type-tab ${zonaFilter === z ? "on" : ""}`} onClick={() => setZonaFilter(z)}>{z}</button>
            ))}
          </div>
          <div className="seg">
            <button className={franjaFilter === "todas" ? "on" : ""} onClick={() => setFranjaFilter("todas")}>Día</button>
            <button className={franjaFilter === "mañana" ? "on" : ""} onClick={() => setFranjaFilter("mañana")}>Mañana</button>
            <button className={franjaFilter === "mediodia" ? "on" : ""} onClick={() => setFranjaFilter("mediodia")}>Mediodía</button>
            <button className={franjaFilter === "noche" ? "on" : ""} onClick={() => setFranjaFilter("noche")}>Noche</button>
          </div>
        </div>

        {/* Salón */}
        <div style={{
          background: "#fff", border: "1px solid var(--line)", borderRadius: 18,
          padding: 24, position: "relative",
        }}>
          {/* Salón header */}
          <div className="row between" style={{ marginBottom: 18, paddingBottom: 14, borderBottom: "1px dashed var(--line)" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Plano del salón</div>
              <div className="mono text-xs dim" style={{ marginTop: 2 }}>
                {ocupadas} ocupadas · {reservadas} reservadas · {libres} libres · {bloqueadas.size} bloqueada{bloqueadas.size === 1 ? "" : "s"}
              </div>
            </div>
            <div className="row gap-3 text-xs" style={{ color: "var(--ink-60)" }}>
              <span className="row gap-2"><i style={{ width: 14, height: 6, borderRadius: 3, border: "2px solid var(--yg)", display: "inline-block" }} /> Libre</span>
              <span className="row gap-2"><i style={{ width: 14, height: 6, borderRadius: 3, border: "2px solid var(--ink)", display: "inline-block" }} /> Reservada</span>
              <span className="row gap-2"><i style={{ width: 14, height: 6, borderRadius: 3, border: "2px dashed var(--ink)", display: "inline-block" }} /> Pendiente</span>
              <span className="row gap-2"><i style={{ width: 14, height: 6, borderRadius: 3, background: "var(--ink)", display: "inline-block" }} /> Ocupada</span>
            </div>
          </div>

          <div className="mesas-grid">
            {visibleMesas.map((m) => {
              const r = mesaState[m.code];
              const cli = r ? clientes.find((c) => c.id === r.clienteId) : null;
              return (
                <MesaCard
                  key={m.code}
                  mesa={m}
                  reserva={r}
                  cliente={cli}
                  onClick={(reserva) => {
                    if (reserva) onOpenReserva(reserva);
                    else setModalMesa(m);
                  }}
                  onClickAvailability={() => setModalMesa(m)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Agenda lateral */}
      <div className="agenda-day">
        <div className="row between" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Agenda del día</div>
          <span className="badge night">Hoy</span>
        </div>

        <div className="eyebrow" style={{ marginTop: 4, marginBottom: 8 }}>Almuerzo · {almuerzo.length}</div>
        {almuerzo.length === 0 && <div className="muted text-sm" style={{ padding: "4px 0 8px" }}>Sin reservas de almuerzo.</div>}
        {almuerzo.map((r) => {
          const c = clientes.find((x) => x.id === r.clienteId);
          return (
            <div className="agenda-row" key={r.id} onClick={() => onOpenReserva(r)} style={{ cursor: "pointer" }}>
              <div className="t">{r.hora}</div>
              <div className="info">
                <div className="row gap-2"><span className="nm">{c?.nombre}</span>{r.origen === "quepa" && <Icon name="whatsapp" size={11} color="#25D366" />}</div>
                <div className="meta">{r.mesa} · {r.pax} pers · {r.estado === "Pendiente" ? "esperando confirmar" : "ok"}</div>
              </div>
              {r.estado === "Confirmada" && <button className="btn sm">Check-in</button>}
              {r.estado === "Pendiente" && <button className="btn sm primary">Confirmar</button>}
            </div>
          );
        })}

        <div className="eyebrow" style={{ marginTop: 16, marginBottom: 8 }}>Cena · {cena.length}</div>
        {cena.length === 0 && <div className="muted text-sm" style={{ padding: "4px 0 8px" }}>Sin reservas de cena.</div>}
        {cena.map((r) => {
          const c = clientes.find((x) => x.id === r.clienteId);
          return (
            <div className="agenda-row" key={r.id} onClick={() => onOpenReserva(r)} style={{ cursor: "pointer" }}>
              <div className="t">{r.hora}</div>
              <div className="info">
                <div className="row gap-2"><span className="nm">{c?.nombre}</span>{r.origen === "quepa" && <Icon name="whatsapp" size={11} color="#25D366" />}</div>
                <div className="meta">{r.mesa} · {r.pax} pers · {r.estado}</div>
              </div>
              {r.estado === "Confirmada" && <button className="btn sm">Check-in</button>}
              {r.estado === "Pendiente" && <button className="btn sm primary">Confirmar</button>}
            </div>
          );
        })}
      </div>

      <ModalDisponibilidadMesa
        open={!!modalMesa}
        mesa={modalMesa}
        reservas={reservas}
        clientes={clientes}
        onClose={() => setModalMesa(null)}
        onOpenReserva={(r) => { setModalMesa(null); onOpenReserva(r); }}
      />
    </div>
  );
}

// ============================================================
// Modal · Disponibilidad por mesa (hora por hora)
// ============================================================
function ModalDisponibilidadMesa({ open, mesa, reservas, clientes, onClose, onOpenReserva }) {
  if (!mesa) return null;
  const HORAS = Array.from({ length: 15 }, (_, i) => 8 + i); // 08–22
  const today = reservas.filter((r) => r.mesa === mesa.code && r.fecha === 0);
  const ahora = new Date();
  const horaActualBucket = ahora.getHours();

  const findReserva = (h) => today.find((r) => {
    const start = parseInt(r.hora.slice(0, 2));
    // duración default 90 min → cubre 2 buckets
    return h >= start && h < start + 2;
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className="row gap-3" style={{ alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{mesa.code}</div>
          <div>
            <div style={{ fontSize: 16 }}>{mesa.code} · {mesa.pax} comensales</div>
            <div className="mono dim text-xs" style={{ marginTop: 2 }}>{mesa.zona} · disponibilidad de hoy</div>
          </div>
        </div>
      }
      footer={
        <React.Fragment>
          <button className="btn ghost" onClick={onClose}>Cerrar</button>
          <button className="btn primary"><Icon name="plus" size={13} /> Nueva reserva</button>
        </React.Fragment>
      }
    >
      <div className="cm-day-grid">
        {HORAS.map((h) => {
          const horaTxt = `${String(h).padStart(2, "0")}:00`;
          const reserva = findReserva(h);
          const cli = reserva ? clientes.find((c) => c.id === reserva.clienteId) : null;
          const isNow = h === horaActualBucket;
          return (
            <React.Fragment key={h}>
              <div className={`cm-hour-lbl ${isNow ? "now" : ""}`}>{horaTxt}</div>
              {reserva ? (
                <button
                  className={`cm-slot taken ${reserva.origen === "quepa" ? "quepa" : ""}`}
                  onClick={() => onOpenReserva(reserva)}
                  style={{ border: 0 }}
                >
                  <span>{cli?.nombre.split(" ").slice(0, 2).join(" ")} · {reserva.pax}p · {reserva.estado.toLowerCase()}</span>
                  {reserva.origen === "quepa" && <Icon name="whatsapp" size={11} />}
                </button>
              ) : (
                <button className="cm-slot libre" style={{ border: 0 }}>
                  Libre — click para reservar
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Modal>
  );
}

function KPIsMesas() {
  const k = KPI_MESAS;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 18 }}>
      <KPI label="Ocupación ahora" value={`${k.ocupacion}%`} hint={`${Math.round(k.ocupacion / 100 * 9)}/9 mesas`} />
      <KPI label="Reservas hoy" value={k.reservasHoy} hint={`${k.comensalesHoy} comensales esperados`} />
      <KPI label="No-show 30d" value={`${k.noShow30d}%`} delta={-1.4} />
      <div className="kpi">
        <div className="lbl">Hora pico de la semana</div>
        <MiniBars data={k.horaPico} peakIdx={k.peakIdx} h={32} />
        <div className="hint mono" style={{ fontSize: 10 }}>12h ─────── 23h · pico 20:00</div>
      </div>
      <KPI label="Rotación mesa" value={`${k.rotacionMin} min`} hint="Promedio último mes" />
      <KPI label="Ticket / mesa" value={fmtCOP(k.ticketProm)} delta={+8.2} />
    </div>
  );
}

Object.assign(window, { LienzoMesas, KPIsMesas, MesaCard, chairsFor });


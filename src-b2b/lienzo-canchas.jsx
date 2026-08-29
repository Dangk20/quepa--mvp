// Quepa B2B · Lienzo Canchas (espacios por hora)
// Rediseño: timer en vivo + estados (live / excedida / próxima / idle) + modal de horarios
const { useState: _uS_canch, useMemo: _uM_canch, useEffect: _uE_canch } = React;

// ---------- Hook: now() ticking every second ----------
function useNow() {
  const [now, setNow] = _uS_canch(() => new Date());
  _uE_canch(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// ---------- Helpers ----------
const parseHora = (s) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + (m || 0);
};
const fmtTimer = (totalSec) => {
  const a = Math.abs(totalSec);
  const h = Math.floor(a / 3600);
  const m = Math.floor((a % 3600) / 60);
  const s = a % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};
const fmtHora = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// Determine state for a cancha given current time and that cancha's slots today
function computeCanchaState(reservasDelDia, nowMin) {
  const sorted = [...reservasDelDia].sort((a, b) => a.hora.localeCompare(b.hora));
  // Current slot (within its time window)
  const current = sorted.find((r) => {
    const start = parseHora(r.hora);
    const end = start + r.duracion * 60;
    return nowMin >= start && nowMin < end + 30; // 30 min grace window to count as "excedida"
  });
  if (current) {
    const start = parseHora(current.hora);
    const end = start + current.duracion * 60;
    if (nowMin < end) return { state: "live", reserva: current, endMin: end };
    return { state: "excedida", reserva: current, endMin: end };
  }
  const next = sorted.find((r) => parseHora(r.hora) > nowMin);
  if (next) {
    const start = parseHora(next.hora);
    return { state: start - nowMin <= 15 ? "proxima" : "idle", reserva: next, startMin: start };
  }
  return { state: "idle", reserva: null };
}

// ---------- Synthetic demo slots so timer is always visible ----------
function useDemoSlots() {
  return _uM_canch(() => {
    const n = new Date();
    const nowMin = n.getHours() * 60 + n.getMinutes();
    // C1: en juego — empezó hace 22 min, dura 60 min (faltan 38 min)
    const c1Start = nowMin - 22;
    // C5: excedida — empezó hace 70 min, era de 60 min (15 min vencida)
    const c5Start = nowMin - 75;
    // C2: próxima — empieza en 6 min
    const c2Start = nowMin + 6;
    // C3: próxima en 38 min (próximo pero no urgente)
    const c3Start = nowMin + 38;
    const mk = (id, cancha, clienteId, startMin, duracion, valor, origen, notas) => ({
      id, cancha, clienteId,
      hora: fmtHora(Math.max(0, startMin)),
      duracion, fecha: 0, estado: "Confirmada", origen, valor, notas: notas || "",
    });
    return [
      mk("dC1", "C1", "k1",  c1Start, 1, 95000, "quepa",  "Grupo fijo de los miércoles."),
      mk("dC5", "C5", "k4",  c5Start, 1, 55000, "manual", "Cumple infantil — pidieron 15 min extra."),
      mk("dC2", "C2", "k10", c2Start, 2, 190000, "quepa",  "Torneo amigos · 2 horas."),
      mk("dC3", "C3", "k2",  c3Start, 1, 60000, "quepa",  ""),
    ];
  }, []);
}

// ---------- Cancha card ----------
function CanchaCard({ cancha, snapshot, cliente, onOpenModal, onOpenReserva, onCerrarSlot }) {
  const now = useNow();
  const nowSec = Math.floor(now.getTime() / 1000);
  const { state, reserva, endMin, startMin } = snapshot;

  // Compute timer text
  let timerLine = null, timerLabel = null, metaLine = null;
  if (state === "live") {
    const endSec = endMin * 60; // seconds since midnight
    const nowSecToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const remaining = endSec - nowSecToday;
    timerLine = fmtTimer(remaining);
    timerLabel = "termina en";
    metaLine = `${reserva.hora} — ${fmtHora(endMin)} · ${reserva.duracion}h · ${fmtCOP(reserva.valor)}`;
  } else if (state === "excedida") {
    const endSec = endMin * 60;
    const nowSecToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const overdue = nowSecToday - endSec;
    timerLine = fmtTimer(overdue);
    timerLabel = "excedida por";
    metaLine = `Debió cerrar a las ${fmtHora(endMin)} · ${reserva.duracion}h`;
  } else if (state === "proxima") {
    const startSec = startMin * 60;
    const nowSecToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const togo = startSec - nowSecToday;
    timerLine = fmtTimer(togo);
    timerLabel = "empieza en";
    metaLine = `${reserva.hora} · ${reserva.duracion}h · ${fmtCOP(reserva.valor)}`;
  } else if (reserva) {
    timerLine = reserva.hora;
    timerLabel = "próximo slot";
    metaLine = `${reserva.duracion}h · ${fmtCOP(reserva.valor)}`;
  } else {
    timerLine = "—";
    timerLabel = "sin reservas hoy";
  }

  const tagLabel = ({
    live:     "● EN JUEGO",
    excedida: "● EXCEDIDA",
    proxima:  "PRÓXIMA",
  })[state];

  return (
    <div
      className={`cancha-v2 ${state}`}
      onClick={() => onOpenModal(cancha)}
    >
      {tagLabel && (
        <div className="cancha-tag">
          {(state === "live" || state === "excedida") && <span className="pulse" />}
          {tagLabel.replace("● ", "")}
        </div>
      )}
      {reserva?.origen === "quepa" && (
        <div className="quepa-pip" title="Origen Quepa"><Icon name="whatsapp" size={11} /></div>
      )}

      <div className="head">
        <div>
          <div className="code">{cancha.code}</div>
          <div className="nm">{cancha.nombre}</div>
          <div className="sport">{cancha.sport}</div>
        </div>
      </div>

      <div style={{ marginTop: 4 }}>
        <div className="cancha-timer-lbl">{timerLabel}</div>
        <div className="cancha-timer">{timerLine}</div>
        {metaLine && <div className="cancha-meta">{metaLine}</div>}
      </div>

      {cliente && (state === "live" || state === "excedida" || state === "proxima") && (
        <div className="cancha-cliente">
          <div className="av">{cliente.nombre.split(" ").map((s) => s[0]).slice(0, 2).join("")}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nm-cl" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cliente.nombre}</div>
            <div className="meta-cl">{cliente.wa}</div>
          </div>
        </div>
      )}

      {(state === "live" || state === "excedida") && (
        <button
          className="cancha-action"
          onClick={(e) => { e.stopPropagation(); onCerrarSlot(reserva); }}
        >
          {state === "live" ? "Cerrar slot ahora" : "Liberar cancha"} <Icon name="check" size={13} />
        </button>
      )}
    </div>
  );
}

// ---------- Main Lienzo ----------
function LienzoCanchas({ reservas, clientes, onOpenReserva }) {
  const [modalCancha, setModalCancha] = _uS_canch(null);
  const now = useNow();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const demoSlots = useDemoSlots();

  // Merge demo slots con reservas reales (los demo se priorizan para hoy)
  const allReservas = _uM_canch(() => {
    const demoForCancha = new Set(demoSlots.map((d) => d.cancha));
    const rest = reservas.filter((r) => !(r.fecha === 0 && demoForCancha.has(r.cancha)));
    return [...rest, ...demoSlots];
  }, [reservas, demoSlots]);

  // Snapshot per cancha
  const snapshots = _uM_canch(() => {
    const map = {};
    CANCHAS_LAYOUT.forEach((c) => {
      const todayHere = allReservas.filter((r) => r.cancha === c.code && r.fecha === 0);
      map[c.code] = computeCanchaState(todayHere, nowMin);
    });
    return map;
  }, [allReservas, nowMin]);

  const liveCount = Object.values(snapshots).filter((s) => s.state === "live").length;
  const excedidaCount = Object.values(snapshots).filter((s) => s.state === "excedida").length;
  const proximaCount = Object.values(snapshots).filter((s) => s.state === "proxima").length;

  return (
    <div>
      <div className="row between" style={{ marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
            Espacios deportivos · ahora
          </h2>
          <div className="muted text-sm" style={{ marginTop: 2 }}>
            {liveCount} en juego{excedidaCount > 0 && ` · ${excedidaCount} excedida${excedidaCount === 1 ? "" : "s"}`} · {proximaCount} próxima{proximaCount === 1 ? "" : "s"} · click cualquier cancha para ver horarios
          </div>
        </div>
        <div className="row gap-3 text-xs" style={{ color: "var(--ink-60)" }}>
          <span className="row gap-2"><i style={{ width: 14, height: 6, borderRadius: 3, background: "var(--yg)", display: "inline-block" }} /> En juego</span>
          <span className="row gap-2"><i style={{ width: 14, height: 6, borderRadius: 3, background: "var(--ink)", display: "inline-block" }} /> Excedida</span>
          <span className="row gap-2"><i style={{ width: 14, height: 6, borderRadius: 3, border: "2px solid var(--ink)", display: "inline-block" }} /> Próxima &lt;15m</span>
          <span className="row gap-2"><i style={{ width: 14, height: 6, borderRadius: 3, border: "2px dashed var(--ink-30)", display: "inline-block" }} /> Idle</span>
        </div>
      </div>

      <div className="canchas-grid">
        {CANCHAS_LAYOUT.map((c) => {
          const snap = snapshots[c.code];
          const cliente = snap.reserva ? clientes.find((x) => x.id === snap.reserva.clienteId) : null;
          return (
            <CanchaCard
              key={c.code}
              cancha={c}
              snapshot={snap}
              cliente={cliente}
              onOpenModal={(cancha) => setModalCancha(cancha)}
              onOpenReserva={onOpenReserva}
              onCerrarSlot={(r) => onOpenReserva(r)}
            />
          );
        })}
      </div>

      <ModalHorariosCancha
        open={!!modalCancha}
        cancha={modalCancha}
        onClose={() => setModalCancha(null)}
        reservas={allReservas}
        clientes={clientes}
        onOpenReserva={(r) => { setModalCancha(null); onOpenReserva(r); }}
        nowMin={nowMin}
      />
    </div>
  );
}

// ---------- Modal de horarios de la cancha ----------
function ModalHorariosCancha({ open, onClose, cancha, reservas, clientes, onOpenReserva, nowMin }) {
  if (!cancha) return null;
  const HORAS = Array.from({ length: 15 }, (_, i) => 8 + i); // 08–22
  const today = reservas.filter((r) => r.cancha === cancha.code && r.fecha === 0);

  // Helper to determine if a given hour is "now" (current hour)
  const currentHourBucket = Math.floor(nowMin / 60);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className="row gap-3" style={{ alignItems: "center" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "var(--paper)", color: "var(--ink)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-mono)", fontWeight: 700,
          }}>{cancha.code}</div>
          <div>
            <div style={{ fontSize: 16 }}>{cancha.nombre}</div>
            <div className="mono dim text-xs" style={{ marginTop: 2 }}>{cancha.sport} · horarios de hoy</div>
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
          // Find a reservation whose window includes this hour bucket
          const reserva = today.find((r) => {
            const start = parseHora(r.hora);
            const end = start + r.duracion * 60;
            const hourStart = h * 60;
            const hourEnd = hourStart + 60;
            return start < hourEnd && end > hourStart;
          });
          const isLive = reserva && (() => {
            const start = parseHora(reserva.hora);
            const end = start + reserva.duracion * 60;
            return nowMin >= start && nowMin < end;
          })();
          const isNow = h === currentHourBucket;
          const cliente = reserva ? clientes.find((c) => c.id === reserva.clienteId) : null;

          return (
            <React.Fragment key={h}>
              <div className={`cm-hour-lbl ${isNow ? "now" : ""}`}>{horaTxt}</div>
              {reserva ? (
                <button
                  className={`cm-slot ${isLive ? "live" : "taken"} ${reserva.origen === "quepa" && !isLive ? "quepa" : ""}`}
                  onClick={(e) => { e.stopPropagation(); onOpenReserva(reserva); }}
                  style={{ width: "100%", textAlign: "left", border: 0 }}
                >
                  <span>{cliente?.nombre.split(" ").slice(0, 2).join(" ")} · {reserva.duracion}h</span>
                  {reserva.origen === "quepa" && !isLive && <Icon name="whatsapp" size={11} style={{ marginLeft: "auto" }} />}
                </button>
              ) : (
                <button
                  className="cm-slot libre"
                  style={{ width: "100%", textAlign: "left", border: 0 }}
                  onClick={(e) => { e.stopPropagation(); /* TODO: open create modal prefilled */ }}
                >
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

function KPIsCanchas() {
  const k = KPI_CANCHAS;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 1.6fr 1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
      <KPI label="Ocupación slots hoy" value={`${k.ocupacionHoy}%`} hint="14 / 24 slots" />
      <KPI label="Ocupación esta semana" value={`${k.ocupacionSem}%`} delta={+4.8} />
      <KPI label="Top cancha último mes" value={k.topCancha} hint="38 reservas" />
      <div className="kpi">
        <div className="lbl">Franja horaria pico</div>
        <MiniBars data={k.franjaHoras} peakIdx={k.franjaPeakIdx} />
        <div className="hint mono" style={{ fontSize: 10 }}>10h ───── 22h · pico 18–19h</div>
      </div>
      <KPI label="Duración promedio" value={`${k.duracionProm}h`} hint="Mediana 1h" />
      <KPI label="No-show 30d" value={`${k.noShow30d}%`} delta={-0.4} />
      <KPI label="Ingreso último mes" value={fmtCOP(k.ingresoCancha)} delta={+12.1} />
    </div>
  );
}

Object.assign(window, { LienzoCanchas, KPIsCanchas });

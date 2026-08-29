// Quepa Canchas · rejilla canchas × horas + detalle de reserva
const { useState: _rcS, useMemo: _rcM, useRef: _rcR, useEffect: _rcE } = React;

const ESTADO_CLASE = {
  "Confirmada": "confirmada",
  "Llegó": "llego",
  "Pagó": "pago",
  "No llegó": "nollego",
};

// ---------- Detalle de una reserva ----------
function DetalleReserva({ open, onClose, reserva, onEstado, onCancelar }) {
  if (!reserva) return null;
  const c = reserva.cliente || ebCliente(reserva.clienteId) || { nombre: "Sin nombre", wa: "", reservas: 0, noshow: 0, ticketProm: 0 };
  const cancha = ebCancha(reserva.cancha);
  const estados = ["Confirmada", "Llegó", "Pagó"];

  return (
    <QSheet open={open} onClose={onClose}
            titulo={`${ebFmtHora(reserva.hora)} · ${cancha?.nombre}`}
            sub={`${ebFechaLarga(reserva.fecha)} · ${reserva.duracion} ${reserva.duracion === 1 ? "hora" : "horas"} · ${fmtCOP(reserva.valor)}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
        <Avatar name={c.nombre} size={64} tone="ink" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.025em" }}>{c.nombre}</div>
          <div className="q-mono q-muted" style={{ fontSize: 18, fontWeight: 600 }}>{c.wa}</div>
        </div>
        {reserva.origen === "quepa" && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--green-soft)", color: "#12833f", borderRadius: 999, padding: "10px 18px", fontSize: 16, fontWeight: 700, flex: "none" }}>
            <Icon name="whatsapp" size={17} /> Entró por Quepa
          </span>
        )}
      </div>

      <button className="q-btn wa" style={{ width: "100%", marginBottom: 30 }}>
        <Icon name="whatsapp" size={24} /> Escribirle por WhatsApp
      </button>

      <div className="q-tile-lbl" style={{ marginBottom: 14 }}>¿Cómo va la reserva?</div>
      <div className="q-opts c3" style={{ marginBottom: 14 }}>
        {estados.map((e) => (
          <button key={e} className={`q-opt ${reserva.estado === e ? "on" : ""}`}
                  style={{ minHeight: 84, alignItems: "center", justifyContent: "center" }}
                  onClick={() => onEstado(reserva.id, e)}>
            <span className="t">{e}</span>
          </button>
        ))}
      </div>
      <div className="q-opts c2" style={{ marginBottom: 30 }}>
        <button className={`q-btn ${reserva.estado === "No llegó" ? "dark" : ""}`} onClick={() => onEstado(reserva.id, "No llegó")}>
          No llegó
        </button>
        <button className="q-btn danger" onClick={() => { onCancelar(reserva.id); onClose(); }}>
          Cancelar reserva
        </button>
      </div>

      <div className="q-tile-lbl" style={{ marginBottom: 14 }}>Este cliente</div>
      <div className="q-stats" style={{ marginBottom: 20 }}>
        <QStat label="Reservas" valor={c.reservas} />
        <QStat label="No llegó" valor={c.noshow} />
        <QStat label="Suele gastar" valor={fmtCOP(c.ticketProm)} />
      </div>

      <div className="q-note">
        Creada por {reserva.origen === "quepa" ? "Quepa" : "Marcela G."} · {ebFechaCorta(reserva.fecha)}
      </div>
    </QSheet>
  );
}

// ---------- Rejilla ----------
function ScreenReservasCanchas({ reservas, onEstado, onCancelar, onCrear, dia, setDia }) {
  const [detalle, setDetalle] = _rcS(null);
  const scroller = _rcR(null);
  const horas = ebHoras();
  const ahora = new Date().getHours();

  const delDia = _rcM(() => reservas.filter((r) => r.fecha === dia && r.estado !== "Cancelada"), [reservas, dia]);

  // mapa cancha → hora → reserva (y horas cubiertas por duración)
  const mapa = _rcM(() => {
    const m = {};
    delDia.forEach((r) => {
      m[r.cancha] = m[r.cancha] || {};
      m[r.cancha][r.hora] = { r, inicio: true };
      for (let i = 1; i < r.duracion; i++) m[r.cancha][r.hora + i] = { r, inicio: false };
    });
    return m;
  }, [delDia]);

  // arrancar con la hora actual a la vista
  _rcE(() => {
    if (!scroller.current) return;
    const idx = Math.max(0, horas.indexOf(Math.max(EB_APERTURA, Math.min(ahora, EB_CIERRE - 1))) - 1);
    scroller.current.scrollLeft = idx * 112;
  }, [dia]);

  const ocupadasAhora = dia === 0
    ? delDia.filter((r) => r.hora <= ahora && ahora < r.hora + r.duracion).length : 0;
  const ingresos = delDia.filter((r) => r.estado === "Pagó").reduce((s, r) => s + r.valor, 0);

  return (
    <div className="q-wrap">
      <div className="q-head">
        <div style={{ flex: 1 }}>
          <h1 className="q-h1">Reservas</h1>
          <div className="q-sub">{ebFechaLarga(dia)}</div>
        </div>
        <button className="q-btn pri" onClick={() => onCrear({ fecha: dia })}>
          <Icon name="plus" size={24} /> Nueva reserva
        </button>
      </div>

      <div className="q-days" style={{ marginBottom: 24 }}>
        {[{ v: -1, l: "Ayer" }, { v: 0, l: "Hoy" }, { v: 1, l: "Mañana" }].map((o) => (
          <button key={o.v} className={`q-day ${dia === o.v ? "on" : ""}`} onClick={() => setDia(o.v)}>{o.l}</button>
        ))}
        <button className="q-day ic" aria-label="Otra fecha"><Icon name="calendar" size={24} /></button>
      </div>

      <div className="q-stats">
        <QStat label="Reservas de hoy" valor={delDia.length} />
        <QStat label="Canchas ocupadas ahora" valor={`${ocupadasAhora} de ${EB_CANCHAS.length}`} />
        <QStat label="Ingresos de hoy" valor={fmtCOP(ingresos)} />
      </div>

      <div className="q-gridwrap">
        <div className="q-gridscroll" ref={scroller}>
          <div className="q-grid">
            {/* fila de horas */}
            <div className="q-grow q-hours">
              <div className="q-gcell-head"><span className="q-tile-lbl">Hora</span></div>
              {horas.map((h) => (
                <div key={h} className={`q-hour ${dia === 0 && h === ahora ? "now" : ""}`}>{ebFmtHora(h)}</div>
              ))}
            </div>

            {/* una fila por cancha */}
            {EB_CANCHAS.filter((c) => c.activa).map((cancha) => (
              <div className="q-grow" key={cancha.id}>
                <div className="q-gcell-head">
                  <span className="n">{cancha.nombre}</span>
                  <span className="t">{cancha.tipo}</span>
                </div>
                {horas.map((h) => {
                  const cerrada = h < cancha.desde || h >= cancha.hasta;
                  const celda = mapa[cancha.id]?.[h];

                  if (cerrada) return <div key={h} className="q-cell cerrada" />;

                  // horas cubiertas por una reserva de 2h+ : el bloque de inicio ya ocupa su ancho
                  if (celda && !celda.inicio) return null;

                  if (celda) {
                    const r = celda.r;
                    const enJuego = dia === 0 && r.hora <= ahora && ahora < r.hora + r.duracion && r.estado !== "No llegó";
                    const cl = enJuego ? "ahora" : (ESTADO_CLASE[r.estado] || "confirmada");
                    const cli = r.cliente || ebCliente(r.clienteId);
                    return (
                      <button key={h} className="q-cell" onClick={() => setDetalle(r)}
                              style={{ width: 112 * r.duracion, borderRight: "1px solid var(--line)" }}>
                        <div className={`q-blk ${cl}`}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            {r.origen === "quepa" && <span className="wa" />}
                            <span className="nm">{(cli?.nombre || "Reserva").split(" ")[0]}</span>
                          </div>
                          <span className="hr">{ebFmtHoraCorta(r.hora)}–{ebFmtHoraCorta(r.hora + r.duracion)}</span>
                        </div>
                      </button>
                    );
                  }

                  return (
                    <button key={h} className="q-cell libre"
                            aria-label={`Reservar ${cancha.nombre} a las ${ebFmtHora(h)}`}
                            onClick={() => onCrear({ cancha: cancha.id, hora: h, fecha: dia })}>
                      <span className="plus">+</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="q-legend">
          <span className="q-legend-i"><span className="q-legend-sw" style={{ background: "#fff" }} /> Reservada</span>
          <span className="q-legend-i"><span className="q-legend-sw" style={{ background: "var(--yg)", borderColor: "var(--yg)" }} /> Ya llegó</span>
          <span className="q-legend-i"><span className="q-legend-sw" style={{ background: "var(--night)" }} /> Ya pagó</span>
          <span className="q-legend-i"><span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--green)" }} /> Entró por Quepa</span>
        </div>
      </div>

      <DetalleReserva
        open={!!detalle} onClose={() => setDetalle(null)} reserva={detalle}
        onEstado={(id, e) => { onEstado(id, e); setDetalle((d) => (d ? { ...d, estado: e } : d)); }}
        onCancelar={onCancelar}
      />
    </div>
  );
}

Object.assign(window, { ScreenReservasCanchas, DetalleReserva });

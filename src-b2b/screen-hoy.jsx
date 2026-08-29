// Quepa Canchas · vista principal
// Izquierda: reservas de hoy. Derecha: una tarjeta por cancha con lo que pasa AHORA.
const { useState: _hyS, useEffect: _hyE, useMemo: _hyM } = React;

// reloj que late cada segundo
function useAhora() {
  const [n, setN] = _hyS(() => new Date());
  _hyE(() => { const id = setInterval(() => setN(new Date()), 1000); return () => clearInterval(id); }, []);
  return n;
}

const fmtCrono = (seg) => {
  const a = Math.abs(seg);
  const h = Math.floor(a / 3600), m = Math.floor((a % 3600) / 60), s = a % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};
const fmtMin = (mins) => {
  const h = Math.floor(mins / 60) % 24, m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// Slots de demostración anclados a la hora real, para que la pantalla
// siempre muestre algo en juego, algo excedido y algo próximo.
function useSlotsDemo() {
  return _hyM(() => {
    const n = new Date();
    const ahoraMin = n.getHours() * 60 + n.getMinutes();
    return {
      c1: { inicio: ahoraMin - 22, duracion: 60,  clienteId: "e1",  valor: 70000,  origen: "quepa" },
      c2: { inicio: ahoraMin - 75, duracion: 60,  clienteId: "e11", valor: 70000,  origen: "manual" },
      c3: { inicio: ahoraMin + 6,  duracion: 120, clienteId: "e10", valor: 220000, origen: "quepa" },
      c4: { inicio: ahoraMin - 40, duracion: 60,  clienteId: "e9",  valor: 110000, origen: "quepa" },
      c5: null, // libre ahora mismo
      c6: { inicio: ahoraMin + 34, duracion: 60,  clienteId: "e8",  valor: 55000,  origen: "manual" },
    };
  }, []);
}

// ---------- Tarjeta de una cancha ----------
function TarjetaCancha({ cancha, slot, onCerrar, onReservar, onVer }) {
  const ahora = useAhora();
  const segHoy = ahora.getHours() * 3600 + ahora.getMinutes() * 60 + ahora.getSeconds();

  let estado = "idle", crono = null, etiqueta = null, meta = null, cliente = null;

  if (slot) {
    const iniSeg = slot.inicio * 60, finSeg = (slot.inicio + slot.duracion) * 60;
    cliente = ebCliente(slot.clienteId);
    meta = `${fmtMin(slot.inicio)} — ${fmtMin(slot.inicio + slot.duracion)} · ${slot.duracion / 60}h · ${fmtCOP(slot.valor)}`;
    if (segHoy >= iniSeg && segHoy < finSeg) {
      estado = "live"; etiqueta = "termina en"; crono = fmtCrono(finSeg - segHoy);
    } else if (segHoy >= finSeg) {
      estado = "excedida"; etiqueta = "excedida por"; crono = fmtCrono(segHoy - finSeg);
      meta = `Debió cerrar a las ${fmtMin(slot.inicio + slot.duracion)}`;
    } else {
      estado = "proxima"; etiqueta = "empieza en"; crono = fmtCrono(iniSeg - segHoy);
    }
  }

  const tag = { live: "En juego", excedida: "Excedida", proxima: "Próxima" }[estado];

  return (
    <div className={`q-cc ${estado}`} onClick={() => (slot ? onVer(cancha, slot) : onReservar(cancha))}>
      {tag && (
        <span className="q-cc-tag">
          {(estado === "live" || estado === "excedida") && <i />}
          {tag}
        </span>
      )}
      {slot?.origen === "quepa" && (
        <span className="q-cc-pip" title="Entró por Quepa"><Icon name="whatsapp" size={19} /></span>
      )}

      <span className="q-cc-code">{cancha.code}</span>
      <span className="q-cc-nm">{cancha.nombre}</span>
      <span className="q-cc-sport">{cancha.tipo}</span>

      {slot ? (
        <React.Fragment>
          <span className="q-cc-lbl">{etiqueta}</span>
          <span className="q-cc-timer">{crono}</span>
          <span className="q-cc-meta">{meta}</span>
          {cliente && (
            <div className="q-cc-cli">
              <Avatar name={cliente.nombre} size={46} tone="yg" />
              <div style={{ minWidth: 0 }}>
                <div className="nm">{cliente.nombre}</div>
                <div className="wa">{cliente.wa}</div>
              </div>
            </div>
          )}
          {(estado === "live" || estado === "excedida") && (
            <button className="q-cc-btn" onClick={(e) => { e.stopPropagation(); onCerrar(cancha, slot); }}>
              {estado === "live" ? "Cerrar slot ahora" : "Liberar cancha"} <Icon name="check" size={22} />
            </button>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <span className="q-cc-empty">Libre ahora mismo</span>
          <button className="q-cc-btn libre" onClick={(e) => { e.stopPropagation(); onReservar(cancha); }}>
            <Icon name="plus" size={22} /> Reservar esta cancha
          </button>
        </React.Fragment>
      )}
    </div>
  );
}

// ---------- Pantalla ----------
function ScreenHoy({ reservas, onNav, onCrear, onVerReserva, onVerCancha, diaAbierto }) {
  const ahora = new Date().getHours();
  const slots = useSlotsDemo();
  const [cerrados, setCerrados] = _hyS({});

  const hoy = _hyM(() => reservas.filter((r) => r.fecha === 0 && r.estado !== "Cancelada"), [reservas]);
  const proximas = _hyM(
    () => hoy.filter((r) => r.hora >= ahora && r.estado === "Confirmada").sort((a, b) => a.hora - b.hora),
    [hoy]
  );

  return (
    <div className="q-wrap fit">
      <div className="q-home">
        {/* ---------- izquierda: acción + reservas de hoy ---------- */}
        <div className="q-col">
          <button className="q-btn pri lg" style={{ width: "100%" }} onClick={() => onCrear({ fecha: 0 })}>
            <Icon name="plus" size={28} /> Nueva reserva
          </button>

          <div className="q-panel">
            <div className="q-panel-top">
              <div>
                <span className="q-tile-lbl">Reservas de hoy</span>
                <div className="q-panel-big">{hoy.length}</div>
              </div>
              <span className="q-panel-hoy">Hoy</span>
            </div>

            {proximas.length === 0 ? (
              <div className="q-note" style={{ padding: "8px 0 16px" }}>
                No queda ninguna reserva por delante hoy.
              </div>
            ) : (
              <div className="q-next">
                {proximas.map((r) => {
                  const c = r.cliente || ebCliente(r.clienteId);
                  return (
                    <button key={r.id} className="q-next-item" onClick={() => onVerReserva(r)}>
                      <span className="q-next-h">{ebFmtHora(r.hora)}</span>
                      <span style={{ minWidth: 0, flex: 1 }}>
                        <span className="q-next-n" style={{ display: "block" }}>{c?.nombre || "Reserva"}</span>
                        <span className="q-next-c">{ebCancha(r.cancha)?.nombre}</span>
                      </span>
                      {r.origen === "quepa" && <Icon name="whatsapp" size={24} color="#25D366" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ---------- derecha: qué pasa ahora en cada cancha ---------- */}
        <div className="q-ccs">
          {EB_CANCHAS.filter((c) => c.activa).map((c) => (
            <TarjetaCancha
              key={c.id}
              cancha={c}
              slot={cerrados[c.id] ? null : slots[c.id]}
              onCerrar={(cancha) => setCerrados((s) => ({ ...s, [cancha.id]: true }))}
              onReservar={(cancha) => onVerCancha(cancha)}
              onVer={() => onVerCancha(c)}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

Object.assign(window, { ScreenHoy, TarjetaCancha, useAhora });

// Quepa Canchas · agenda de una cancha
// Al tocar una cancha: elige el día (hoy / mañana / calendario) y ve sus horarios
// reservados vs. libres según el horario configurado del negocio.
const { useState: _agS, useMemo: _agM } = React;

const DIAS_CORTOS = ["L", "M", "M", "J", "V", "S", "D"];
const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
                      "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// diferencia en días entre una fecha y hoy (a medianoche)
const difDias = (fecha) => {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const f = new Date(fecha); f.setHours(0, 0, 0, 0);
  return Math.round((f - hoy) / 86400000);
};

// ---------- Calendario de un mes ----------
function Calendario({ seleccionado, onElegir }) {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const inicial = new Date(); inicial.setDate(inicial.getDate() + seleccionado);
  const [mes, setMes] = _agS(() => new Date(inicial.getFullYear(), inicial.getMonth(), 1));

  const celdas = _agM(() => {
    const primero = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const dias = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    const arranque = (primero.getDay() + 6) % 7; // lunes = 0
    const out = Array.from({ length: arranque }, () => null);
    for (let d = 1; d <= dias; d++) out.push(new Date(mes.getFullYear(), mes.getMonth(), d));
    return out;
  }, [mes]);

  const mover = (n) => setMes(new Date(mes.getFullYear(), mes.getMonth() + n, 1));

  return (
    <div>
      <div className="q-cal-head">
        <button className="q-cal-nav" onClick={() => mover(-1)} aria-label="Mes anterior">
          <Icon name="chevron-left" size={24} />
        </button>
        <span className="q-cal-mes">{MESES_LARGOS[mes.getMonth()]} {mes.getFullYear()}</span>
        <button className="q-cal-nav" onClick={() => mover(1)} aria-label="Mes siguiente">
          <Icon name="chevron-right" size={24} />
        </button>
      </div>

      <div className="q-cal-dows">
        {DIAS_CORTOS.map((d, i) => <span key={i}>{d}</span>)}
      </div>

      <div className="q-cal-grid">
        {celdas.map((f, i) => {
          if (!f) return <span key={i} />;
          const dif = difDias(f);
          const pasado = dif < 0;
          const esHoy = dif === 0;
          const activo = dif === seleccionado;
          return (
            <button key={i} disabled={pasado}
                    className={`q-cal-dia ${activo ? "on" : ""} ${esHoy ? "hoy" : ""}`}
                    onClick={() => onElegir(dif)}>
              {f.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Lista de horarios de una cancha (compartida por la agenda y por Nueva reserva) ----------
function ListaHorarios({ cancha, reservas, dia, seleccion, onElegir }) {
  const ahora = new Date().getHours();

  const horas = _agM(
    () => (cancha ? Array.from({ length: cancha.hasta - cancha.desde }, (_, i) => cancha.desde + i) : []),
    [cancha]
  );

  const mapa = _agM(() => {
    if (!cancha) return {};
    const m = {};
    reservas
      .filter((r) => r.cancha === cancha.id && r.fecha === dia && r.estado !== "Cancelada")
      .forEach((r) => {
        m[r.hora] = { r, inicio: true };
        for (let i = 1; i < r.duracion; i++) m[r.hora + i] = { r, inicio: false };
      });
    return m;
  }, [reservas, cancha, dia]);

  if (!cancha) return null;

  return (
    <div className="q-agenda">
      {horas.map((h) => {
        const celda = mapa[h];
        const pasada = dia === 0 && h < ahora;
        const enJuego = dia === 0 && celda && h <= ahora && ahora < celda.r.hora + celda.r.duracion;

        if (celda && !celda.inicio) {
          return (
            <div className="q-agenda-row" key={h}>
              <span className="q-agenda-h">{ebFmtHora(h)}</span>
              <div className={`q-agenda-slot cont ${enJuego ? "enjuego" : ""}`}>
                <span className="cont-l">sigue</span>
              </div>
            </div>
          );
        }

        if (celda) {
          const r = celda.r;
          const c = r.cliente || ebCliente(r.clienteId);
          return (
            <div className="q-agenda-row" key={h}>
              <span className={`q-agenda-h ${enJuego ? "ahora" : ""}`}>
                {enJuego && <i className="pip" />}{ebFmtHora(h)}
              </span>
              <div className={`q-agenda-slot ocupada ${enJuego ? "enjuego" : ""} ${r.estado === "Pagó" ? "pago" : ""}`}>
                <span className="nm">{c?.nombre || "Reserva"}</span>
                <span className="du">{r.duracion}h</span>
                {r.origen === "quepa" && <Icon name="whatsapp" size={18} />}
                <span className="est">{enJuego ? "En juego" : r.estado}</span>
              </div>
            </div>
          );
        }

        const elegida = seleccion === h;
        return (
          <div className="q-agenda-row" key={h}>
            <span className={`q-agenda-h ${elegida ? "ahora" : ""}`}>{ebFmtHora(h)}</span>
            <button className={`q-agenda-slot libre ${pasada ? "pasada" : ""} ${elegida ? "elegida" : ""}`}
                    disabled={pasada}
                    onClick={() => onElegir(h)}>
              {pasada ? "Ya pasó" : elegida ? "Elegida" : "Libre — toca para reservar"}
              {elegida && <Icon name="check" size={22} />}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Agenda de la cancha ----------
function AgendaCancha({ open, cancha, reservas, onClose, onReservar }) {
  const [dia, setDia] = _agS(0);
  const [vista, setVista] = _agS("agenda");
  const ahora = new Date().getHours();

  React.useEffect(() => { if (open) { setDia(0); setVista("agenda"); } }, [open, cancha && cancha.id]);

  // OJO: todos los hooks van ANTES de cualquier return condicional.
  const conteo = _agM(() => {
    if (!cancha) return { libres: 0, ocupadas: 0 };
    const total = cancha.hasta - cancha.desde;
    let ocup = 0;
    reservas
      .filter((r) => r.cancha === cancha.id && r.fecha === dia && r.estado !== "Cancelada")
      .forEach((r) => { ocup += r.duracion; });
    return { libres: Math.max(0, total - ocup), ocupadas: ocup };
  }, [reservas, cancha, dia]);

  if (!cancha) return null;

  const { libres, ocupadas } = conteo;

  const etiquetaDia =
    dia === 0 ? "Hoy" : dia === 1 ? "Mañana" : ebFechaLarga(dia);

  // ---------- vista calendario ----------
  if (vista === "calendario") {
    return (
      <QSheet open={open} onClose={onClose} onBack={() => setVista("agenda")}
              titulo="¿Qué día?" sub={cancha.nombre}>
        <Calendario seleccionado={dia} onElegir={(d) => { setDia(d); setVista("agenda"); }} />
      </QSheet>
    );
  }

  // ---------- vista agenda ----------
  return (
    <QSheet
      open={open} onClose={onClose}
      titulo={cancha.nombre}
      sub={`${cancha.tipo} · ${fmtCOP(cancha.precio)} la hora`}
      footer={
        <button className="q-btn pri grow" onClick={() => onReservar({ cancha: cancha.id, fecha: dia })}>
          <Icon name="plus" size={24} /> Reservar en esta cancha
        </button>
      }
    >
      {/* selector de día */}
      <div className="q-days" style={{ marginBottom: 20 }}>
        <button className={`q-day ${dia === 0 ? "on" : ""}`} onClick={() => setDia(0)}>Hoy</button>
        <button className={`q-day ${dia === 1 ? "on" : ""}`} onClick={() => setDia(1)}>Mañana</button>
        <button className={`q-day ic ${dia > 1 || dia < 0 ? "on" : ""}`} onClick={() => setVista("calendario")}>
          <Icon name="calendar" size={24} />
          {(dia > 1 || dia < 0) && <span style={{ marginLeft: 10 }}>{ebFechaCorta(dia)}</span>}
        </button>
      </div>

      <div className="q-agenda-meta">
        <span style={{ textTransform: "capitalize" }}>{etiquetaDia}</span>
        <span>·</span>
        <span><strong>{libres}</strong> {libres === 1 ? "hora libre" : "horas libres"}</span>
        <span>·</span>
        <span><strong>{ocupadas}</strong> {ocupadas === 1 ? "reservada" : "reservadas"}</span>
      </div>

      <ListaHorarios
        cancha={cancha} reservas={reservas} dia={dia}
        onElegir={(h) => onReservar({ cancha: cancha.id, hora: h, fecha: dia })}
      />
    </QSheet>
  );
}

Object.assign(window, { AgendaCancha, Calendario, ListaHorarios });

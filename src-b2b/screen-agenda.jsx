// Quepa Canchas · Reservas (screen-agenda.jsx)
// Agenda tipo calendario: semana (bloques por hora) y mes (resumen por día).
// Un bloque = una hora de un día. Adentro caben tantas reservas como canchas abiertas a esa hora.
// Tocar un bloque con cupo abre "Nueva reserva" ya parada en ese día y esa hora;
// tocar una reserva abre su detalle.
const { useState: _rsS, useMemo: _rsM, useEffect: _rsE, useRef: _rsR } = React;

const RS_DOW = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
const RS_DOW_KEY = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"]; // getDay() → llave de EB_PERFIL.horarios
const RS_MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
                  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const RS_MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
const RS_COL = 136;   // ancho de una hora en la vista Día (px)
const RS_LBL = 210;   // ancho de la columna de canchas
const RS_HEAD = 48;   // alto de la cabecera de horas
const RS_FILA_MIN = 64, RS_FILA_MAX = 100;   // alto de una fila-cancha: se estira para que quepan todas

// reloj que late cada medio minuto (basta para mover la línea de "ahora")
function useRelojCal() {
  const [n, setN] = _rsS(() => new Date());
  _rsE(() => { const id = setInterval(() => setN(new Date()), 30000); return () => clearInterval(id); }, []);
  return n;
}

// ---- fechas ----
const rsMedianoche = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const rsDif = (d) => Math.round((rsMedianoche(d) - rsMedianoche(new Date())) / 86400000);
const rsSumar = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const rsLunes = (d) => rsSumar(rsMedianoche(d), -((d.getDay() + 6) % 7));
const rsMismoDia = (a, b) => rsMedianoche(a).getTime() === rsMedianoche(b).getTime();
const rsHoraLbl = (h) => `${h % 12 === 0 ? 12 : h % 12} ${h >= 12 ? "pm" : "am"}`;
const rsNombreCorto = (n) => {
  if (!n) return "Reserva";
  const p = n.trim().split(/\s+/);
  return p.length > 1 ? `${p[0]} ${p[p.length - 1][0]}.` : p[0];
};

// reservas activas agrupadas por día (dif), ordenadas por hora y cancha
const rsAgrupar = (reservas) => {
  const m = {};
  reservas.forEach((r) => {
    if (r.estado === "Cancelada") return;
    (m[r.fecha] = m[r.fecha] || []).push(r);
  });
  Object.values(m).forEach((l) => l.sort((a, b) => a.hora - b.hora || a.cancha.localeCompare(b.cancha)));
  return m;
};

// franja horaria del negocio para un día, según EB_PERFIL.horarios
const rsFranja = (perfil, fecha) => {
  const tramos = (perfil?.horarios || {})[RS_DOW_KEY[fecha.getDay()]] || [];
  if (!tramos.length) return null;
  const desde = Math.min(...tramos.map((t) => parseInt(t[0], 10)));
  const hasta = Math.max(...tramos.map((t) => parseInt(t[1], 10)));
  return { desde, hasta };
};

// ---------- día: filas = canchas, columnas = horas (como el tablero de un hotel) ----------
// Cada fila es una cancha. Cada celda vacía es una hora libre que se puede tocar; las reservas son
// barras que ocupan su duración. Las que van entrando por Quepa aparecen solas, con animación.
function VistaDia({ fecha, reservas, canchas, perfil, nuevas, reloj, onCrear, onVer }) {
  const ref = _rsR(null);
  const dif = rsDif(fecha);
  const franja = rsFranja(perfil, fecha);
  const activas = canchas.filter((c) => c.activa);
  const desde = franja ? Math.min(franja.desde, ...activas.map((c) => c.desde)) : EB_APERTURA;
  const hasta = franja ? Math.max(franja.hasta, ...activas.map((c) => c.hasta)) : EB_CIERRE;
  const horas = Array.from({ length: hasta - desde }, (_, i) => desde + i);
  const ahora = reloj.getHours();
  const ahoraH = ahora + reloj.getMinutes() / 60;
  const esHoy = dif === 0;

  // al entrar, llevar el scroll a la hora actual (una columna antes)
  _rsE(() => {
    if (!ref.current) return;
    // hoy: la hora actual queda pegada a la izquierda, así lo que viene cabe completo a la derecha
    const h = esHoy ? new Date().getHours() : (franja ? Math.max(franja.desde, 15) : 15);
    ref.current.scrollLeft = Math.max(0, (h - desde) * RS_COL - (esHoy ? 24 : RS_COL));
  }, [dif, desde]);

  const ancho = RS_LBL + horas.length * RS_COL;

  // Las filas se reparten el alto disponible para que quepan TODAS las canchas sin scroll.
  // Si aun así no caben (pantalla baja), se avisa abajo cuántas faltan.
  const [filaH, setFilaH] = _rsS(RS_FILA_MIN);
  const [ocultas, setOcultas] = _rsS(0);
  _rsE(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      const libre = el.clientHeight - RS_HEAD;
      const h = Math.max(RS_FILA_MIN, Math.min(RS_FILA_MAX, Math.floor(libre / activas.length)));
      setFilaH(h);
      setOcultas(Math.max(0, Math.ceil((el.scrollHeight - el.scrollTop - el.clientHeight - 2) / h)));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    el.addEventListener("scroll", medir);
    return () => { ro.disconnect(); el.removeEventListener("scroll", medir); };
  }, [activas.length, dif]);

  return (
    <div className="q-agd-wrap">
    <div className="q-agd" ref={ref}>
      <div className="q-agd-in" style={{ width: ancho }}>
        {/* cabecera pegada: horas */}
        <div className="q-agd-head" style={{ gridTemplateColumns: `${RS_LBL}px repeat(${horas.length}, ${RS_COL}px)` }}>
          <div className="q-agd-corner">Cancha</div>
          {horas.map((h) => (
            <div key={h} className={`q-agd-h ${esHoy && h === ahora ? "ahora" : ""}`}>{rsHoraLbl(h)}</div>
          ))}
        </div>

        {/* una fila por cancha */}
        {activas.map((c) => {
          const propias = reservas.filter((r) => r.cancha === c.id && r.fecha === dif);
          return (
            <div key={c.id} className="q-agd-row" style={{ height: filaH, gridTemplateColumns: `${RS_LBL}px repeat(${horas.length}, ${RS_COL}px)` }}>
              <div className="q-agd-lbl">
                <span className="cd">{c.code}</span>
                <span>
                  <span className="nm">{c.nombre}</span>
                  <span className="tp">{c.tipo} · {fmtCOP(c.precio)}</span>
                </span>
              </div>
              {horas.map((h) => {
                const abierto = !!franja && h >= franja.desde && h < franja.hasta && h >= c.desde && h < c.hasta;
                const pasado = dif < 0 || (esHoy && h < ahora);
                const ocupado = propias.some((r) => r.hora <= h && h < r.hora + r.duracion);
                const libre = abierto && !pasado && !ocupado;
                return (
                  <button key={h} disabled={!libre}
                          className={`q-cel ${!abierto ? "cerrado" : ""} ${pasado ? "pasado" : ""} ${libre ? "libre" : ""}`}
                          title={libre ? `${c.nombre} libre · ${rsHoraLbl(h)} — toca para reservar` : undefined}
                          onClick={() => libre && onCrear({ fecha: dif, hora: h, cancha: c.id })}>
                    {libre && <span className="mas"><Icon name="plus" size={18} /> Libre</span>}
                  </button>
                );
              })}
              {propias.map((r) => {
                const cli = r.cliente || ebCliente(r.clienteId);
                const hist = dif < 0 || (esHoy && r.hora + r.duracion <= ahora);
                const enJuego = esHoy && r.hora <= ahoraH && ahoraH < r.hora + r.duracion;
                const nueva = nuevas.has(r.id);
                const k = ["q-bar", r.estado === "Pagó" && "pago", r.origen === "quepa" && "quepa",
                           nueva && "nueva", hist && "hist", enJuego && "enjuego"].filter(Boolean).join(" ");
                return (
                  <button key={r.id} className={k}
                          style={{ left: RS_LBL + (r.hora - desde) * RS_COL + 3, width: r.duracion * RS_COL - 6 }}
                          onClick={() => onVer(r)}
                          title={`${cli?.nombre || "Reserva"} · ${rsHoraLbl(r.hora)} – ${rsHoraLbl(r.hora + r.duracion)} · ${r.estado}`}>
                    <span className="nm">{cli?.nombre || "Reserva"}</span>
                    <span className="hr">{rsHoraLbl(r.hora)} – {rsHoraLbl(r.hora + r.duracion)}{enJuego ? " · en juego" : ""}</span>
                    {r.origen === "quepa" && <Icon name="whatsapp" size={16} />}
                    {nueva && <span className="tag">Acaba de entrar por Quepa</span>}
                  </button>
                );
              })}
            </div>
          );
        })}

        {esHoy && ahoraH >= desde && ahoraH <= hasta && (
          <div className="q-agd-now" style={{ left: RS_LBL + (ahoraH - desde) * RS_COL }}><i /></div>
        )}
      </div>
    </div>
    {ocultas > 0 && (
      <button className="q-agd-mas" onClick={() => ref.current && ref.current.scrollBy({ top: ocultas * filaH, behavior: "smooth" })}>
        <Icon name="chevron-down" size={22} />
        {ocultas === 1 ? "1 cancha más abajo" : `${ocultas} canchas más abajo`}
      </button>
    )}
    </div>
  );
}

// ---------- mes ----------
// Como Google Calendar: cada día lista sus primeras reservas con un punto y "N más".
// Tocar el día (o el "N más") abre el detalle del día completo.
function VistaMes({ mes, reservas, perfil, reloj, onDia, onVer }) {
  const celdas = _rsM(() => {
    const primero = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const inicio = rsLunes(primero);
    return Array.from({ length: 42 }, (_, i) => rsSumar(inicio, i));
  }, [mes]);

  const porDia = _rsM(() => rsAgrupar(reservas), [reservas]);

  // solo 5 filas si la sexta cae entera fuera del mes
  const filas = celdas[35].getMonth() === mes.getMonth() ? 6 : 5;
  const max = 3;

  return (
    <div className="q-month" style={{ gridTemplateRows: `auto repeat(${filas}, minmax(150px,1fr))` }}>
      {RS_DOW.map((d) => <div key={d} className="q-month-dow">{d}</div>)}
      {celdas.slice(0, filas * 7).map((d, i) => {
        const dif = rsDif(d);
        const lista = porDia[dif] || [];
        const fuera = d.getMonth() !== mes.getMonth();
        const hoy = rsMismoDia(d, reloj);
        const cerrado = !rsFranja(perfil, d);
        return (
          <div key={i} className={`q-md ${fuera ? "fuera" : ""} ${hoy ? "hoy" : ""} ${dif < 0 ? "pasado" : ""}`}
               onClick={() => onDia(d)} role="button" tabIndex={0}
               onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onDia(d)}>
            <div className="q-md-top">
              <span className="num">{d.getDate() === 1 ? `${d.getDate()} ${RS_MESES_CORTOS[d.getMonth()]}` : d.getDate()}</span>
            </div>
            {cerrado ? (
              <span className="q-md-cerrado">Cerrado</span>
            ) : (
              <div className="q-md-evs">
                {lista.slice(0, max).map((r) => {
                  const c = r.cliente || ebCliente(r.clienteId);
                  return (
                    <button key={r.id} className={`q-md-ev ${r.origen === "quepa" ? "quepa" : ""} ${r.estado === "Pagó" ? "pago" : ""}`}
                            onClick={(e) => { e.stopPropagation(); onVer(r); }}>
                      <i className="dot" />
                      <span className="h">{ebFmtHoraCorta(r.hora)}</span>
                      <span className="cd">{ebCancha(r.cancha)?.code}</span>
                      <span className="nm">{rsNombreCorto(c?.nombre)}</span>
                    </button>
                  );
                })}
                {lista.length > max && (
                  <button className="q-md-mas" onClick={(e) => { e.stopPropagation(); onDia(d); }}>
                    {lista.length - max} más
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- detalle de un día (desde el mes) ----------
function DiaSheet({ fecha, reservas, perfil, onClose, onVer, onCrear, onVerDia }) {
  if (!fecha) return null;
  const dif = rsDif(fecha);
  const lista = (rsAgrupar(reservas)[dif] || []);
  const franja = rsFranja(perfil, fecha);
  const dow = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][fecha.getDay()];
  const titulo = `${dow} ${fecha.getDate()} de ${RS_MESES[fecha.getMonth()]}`;
  const sub = !franja ? "Cerrado" : lista.length === 0 ? "Sin reservas todavía"
            : `${lista.length} ${lista.length === 1 ? "reserva" : "reservas"} · abre ${rsHoraLbl(franja.desde)} – ${rsHoraLbl(franja.hasta)}`;

  return (
    <QSheet open onClose={onClose} titulo={titulo} sub={sub}
            footer={
              <React.Fragment>
                <button className="q-btn grow" onClick={() => onVerDia(fecha)}>
                  <Icon name="calendar" size={24} /> Ver el día
                </button>
                {franja && dif >= 0 && (
                  <button className="q-btn pri grow" onClick={() => { onClose(); onCrear({ fecha: dif, saltarDia: true }); }}>
                    <Icon name="plus" size={24} /> Reservar este día
                  </button>
                )}
              </React.Fragment>
            }>
      {lista.length === 0 ? (
        <div className="q-note" style={{ padding: "8px 0 16px" }}>
          {franja ? "Este día no tiene reservas. Las que entren por Quepa aparecen aquí solas." : "El negocio no abre este día."}
        </div>
      ) : (
        <div className="q-dia-lista">
          {lista.map((r) => {
            const c = r.cliente || ebCliente(r.clienteId);
            return (
              <button key={r.id} className="q-dia-item" onClick={() => onVer(r)}>
                <span className="h">{ebFmtHora(r.hora)}</span>
                <span className="cd">{ebCancha(r.cancha)?.code}</span>
                <span className="body">
                  <span className="nm">{c?.nombre || "Reserva"}</span>
                  <span className="mt">{ebCancha(r.cancha)?.nombre} · {r.duracion} {r.duracion === 1 ? "hora" : "horas"} · {r.estado}</span>
                </span>
                {r.origen === "quepa" && <Icon name="whatsapp" size={24} color="#25D366" />}
              </button>
            );
          })}
        </div>
      )}
    </QSheet>
  );
}

// ---------- pantalla ----------
function ScreenReservas({ reservas, canchas, perfil, nuevas, onCrear, onVerReserva, contarTodo }) {
  const [vista, setVista] = _rsS("dia");
  const [ancla, setAncla] = _rsS(() => rsMedianoche(new Date()));
  const [diaAbierto, setDiaAbierto] = _rsS(null);   // Date del día abierto desde el mes
  const reloj = useRelojCal();

  const mes = _rsM(() => new Date(ancla.getFullYear(), ancla.getMonth(), 1), [ancla]);

  const mover = (n) => setAncla(vista === "dia"
    ? rsSumar(ancla, n)
    : new Date(ancla.getFullYear(), ancla.getMonth() + n, 1));

  const DOW_LARGO = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const difAncla = rsDif(ancla);
  const titulo = vista === "mes"
    ? `${RS_MESES[mes.getMonth()].charAt(0).toUpperCase()}${RS_MESES[mes.getMonth()].slice(1)} de ${mes.getFullYear()}`
    : `${difAncla === 0 ? "Hoy" : difAncla === 1 ? "Mañana" : difAncla === -1 ? "Ayer" : DOW_LARGO[ancla.getDay()]}, ${ancla.getDate()} de ${RS_MESES[ancla.getMonth()]}`;

  const esHoy = vista === "dia"
    ? difAncla === 0
    : mes.getMonth() === new Date().getMonth() && mes.getFullYear() === new Date().getFullYear();

  const activas = _rsM(() => reservas.filter((r) => r.estado !== "Cancelada"), [reservas]);

  // contador del día a la vista: cuántas hay y cuántas entraron solas
  // contarTodo (modo grabación): suma todo lo que ha ido cayendo desde hoy en adelante, no solo el día a la vista
  const delDia = _rsM(() => activas.filter((r) => (contarTodo ? r.fecha >= 0 : r.fecha === difAncla)), [activas, difAncla, contarTodo]);
  const solas = delDia.filter((r) => r.origen === "quepa").length;
  const [latido, setLatido] = _rsS(0);
  _rsE(() => { if (nuevas.size) setLatido((n) => n + 1); }, [nuevas]);
  // modo grabación: de 80 tiembla, en 100 revienta
  const casi = contarTodo && delDia.length >= 80;
  const boom = contarTodo && delDia.length >= 100;

  // la agenda ocupa exactamente lo que queda de pantalla debajo de la barra superior
  const [alto, setAlto] = _rsS(null);
  _rsE(() => {
    const medir = () => {
      const top = document.querySelector(".q-top");
      setAlto(Math.max(520, window.innerHeight - (top ? top.offsetHeight : 0) - 16));
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  return (
    <div className={`q-wrap fit q-cal-wrap ${boom ? "reventar" : ""}`} style={alto ? { height: alto } : undefined}>
      {/* barra: hoy · navegación · título · vista · nueva */}
      <div className="q-cal-bar">
        <button className={`q-btn ${esHoy ? "on" : ""}`} onClick={() => setAncla(rsMedianoche(new Date()))}>Hoy</button>
        <div className="q-cal-arrows">
          <button className="q-cal-nav" onClick={() => mover(-1)} aria-label={vista === "dia" ? "Día anterior" : "Mes anterior"}>
            <Icon name="chevron-left" size={26} />
          </button>
          <button className="q-cal-nav" onClick={() => mover(1)} aria-label={vista === "dia" ? "Día siguiente" : "Mes siguiente"}>
            <Icon name="chevron-right" size={26} />
          </button>
        </div>
        <h1 className="q-cal-title">{titulo}</h1>
        <div className="q-seg" role="tablist">
          <button role="tab" aria-selected={vista === "dia"} className={vista === "dia" ? "on" : ""} onClick={() => setVista("dia")}>Día</button>
          <button role="tab" aria-selected={vista === "mes"} className={vista === "mes" ? "on" : ""} onClick={() => setVista("mes")}>Mes</button>
        </div>
        {vista === "dia" && (
          <div className={`q-cal-vivo ${latido ? "late" : ""} ${casi ? "casi" : ""} ${boom ? "boom" : ""}`} key={boom ? "boom" : latido}>
            <span className="pip" />
            <span className="n">{delDia.length}</span>
            <span className="l">{delDia.length === 1 ? "reserva" : "reservas"}</span>
            <span className="sep" />
            <Icon name="whatsapp" size={20} />
            <span className="n">{solas}</span>
            <span className="l">{solas === 1 ? "entró sola" : "entraron solas"}</span>
          </div>
        )}
        <button className="q-btn pri" onClick={() => onCrear({ fecha: Math.max(0, difAncla) })}>
          <Icon name="plus" size={26} /> Nueva reserva
        </button>
      </div>

      {vista === "dia" ? (
        <VistaDia fecha={ancla} reservas={activas} canchas={canchas} perfil={perfil}
                  nuevas={nuevas} reloj={reloj} onCrear={onCrear} onVer={onVerReserva} />
      ) : (
        <VistaMes mes={mes} reservas={activas} perfil={perfil} reloj={reloj}
                  onDia={(d) => setDiaAbierto(rsMedianoche(d))} onVer={onVerReserva} />
      )}

      <DiaSheet fecha={diaAbierto} reservas={activas} perfil={perfil}
                onClose={() => setDiaAbierto(null)} onCrear={onCrear}
                onVerDia={(d) => { setDiaAbierto(null); setAncla(rsMedianoche(d)); setVista("dia"); }}
                onVer={(r) => { setDiaAbierto(null); onVerReserva(r); }} />

      <div className="q-cal-leyenda">
        <span><i className="l-quepa" /> Entró por Quepa</span>
        <span><i className="l-manual" /> La cargaste tú</span>
        <span><i className="l-pago" /> Pagada</span>
        <span><i className="l-libre" /> Espacio libre</span>
        <span><i className="l-nueva" /> Acaba de entrar</span>
        <span className="tip">Cada fila es una cancha. Toca un espacio libre para reservar; toca una reserva para verla.</span>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenReservas });

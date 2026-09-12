// Quepa · reservar desde el celular
// La página a la que Quepa manda al cliente por WhatsApp. Una sola pregunta por pantalla,
// sin scroll, y arriba siempre se ve cuánto falta. Usa los mismos datos sembrados del panel
// (canchas, horarios y reservas), así lo que se ve libre aquí es lo mismo que ve el negocio.
const { useState: _rvS, useMemo: _rvM, useEffect: _rvE } = React;

const RV_DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const RV_DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const RV_MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
const rvCOP = (n) => "$ " + Math.round(n).toLocaleString("es-CO");
const rvHora = (h) => `${h % 12 === 0 ? 12 : h % 12}:00 ${h >= 12 ? "pm" : "am"}`;
const rvHoraCorta = (h) => `${h % 12 === 0 ? 12 : h % 12} ${h >= 12 ? "pm" : "am"}`;
const rvCap = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);

// ¿está libre esta cancha a esta hora, este día?
const rvLibre = (cancha, dif, h) =>
  h >= cancha.desde && h < cancha.hasta &&
  !EB_RESERVAS.some((r) => r.cancha === cancha.id && r.fecha === dif && r.estado !== "Cancelada"
                            && r.hora <= h && h < r.hora + r.duracion);

// deportes que ofrece el negocio, con el precio más bajo de cada uno
const RV_DEPORTES = EB_TIPOS.map((t) => {
  const cs = EB_CANCHAS.filter((c) => c.activa && c.tipo === t);
  return cs.length ? { tipo: t, precio: Math.min(...cs.map((c) => c.precio)), canchas: cs } : null;
}).filter(Boolean);

const RV_EMOJI = { "Fútbol 5": "⚽", "Fútbol 7": "⚽", "Pádel": "🎾", "Voleiplaya": "🏐" };

// ---------- pantalla ----------
function Reservar() {
  const params = new URLSearchParams(location.search);
  const preNombre = params.get("n") || "";
  const preWa = params.get("wa") || "";

  const [paso, setPaso] = _rvS("dia");      // dia · deporte · hora · tiempo · datos · pago · listo
  const [verCal, setVerCal] = _rvS(false);  // calendario para un día lejano
  const [dir, setDir] = _rvS(1);            // 1 adelante · -1 atrás (para la animación)
  const [d, setD] = _rvS({ dif: null, tipo: null, hora: null, duracion: null, cancha: null,
                           nombre: preNombre, wa: preWa });
  const set = (k, v) => setD((p) => ({ ...p, [k]: v }));

  // si Quepa ya mandó nombre y WhatsApp en el link, no se vuelven a pedir
  const yaConocido = preNombre.trim().length > 2 && preWa.replace(/\D/g, "").length >= 10;
  const ORDEN = yaConocido ? ["dia", "deporte", "hora", "tiempo", "pago"] : ["dia", "deporte", "hora", "tiempo", "datos", "pago"];
  const n = ORDEN.indexOf(paso);
  const total = ORDEN.length;
  const ir = (p) => { setDir(ORDEN.indexOf(p) >= n ? 1 : -1); setPaso(p); };
  const atras = () => { if (verCal) return setVerCal(false); if (n > 0) ir(ORDEN[n - 1]); };

  _rvE(() => { window.scrollTo(0, 0); }, [paso]);

  const ahora = new Date().getHours();
  const dias = _rvM(() => Array.from({ length: 7 }, (_, i) => ({ dif: i, f: ebFecha(i) })), []);
  const deporte = RV_DEPORTES.find((x) => x.tipo === d.tipo);

  // horas en las que hay al menos una cancha libre del deporte elegido
  const horas = _rvM(() => {
    if (!deporte || d.dif == null) return [];
    const desde = Math.min(...deporte.canchas.map((c) => c.desde));
    const hasta = Math.max(...deporte.canchas.map((c) => c.hasta));
    return Array.from({ length: hasta - desde }, (_, i) => desde + i).map((h) => ({
      h, libre: (d.dif > 0 || h > ahora) && deporte.canchas.some((c) => rvLibre(c, d.dif, h)),
    }));
  }, [deporte, d.dif]);

  // duraciones posibles a esa hora (y qué cancha las cumple)
  const duraciones = _rvM(() => {
    if (!deporte || d.hora == null) return [];
    const todas = [...new Set(deporte.canchas.flatMap((c) => c.duraciones))].sort((a, b) => a - b);
    return todas.map((dur) => {
      const cancha = deporte.canchas.find((c) => c.duraciones.includes(dur) &&
        Array.from({ length: dur }).every((_, i) => rvLibre(c, d.dif, d.hora + i)));
      return { dur, cancha };
    });
  }, [deporte, d.dif, d.hora]);

  const cancha = d.cancha ? ebCancha(d.cancha) : null;
  const totalPagar = cancha && d.duracion ? cancha.precio * d.duracion : 0;
  const datosOk = d.nombre.trim().length > 2 && d.wa.replace(/\D/g, "").length >= 10;

  // ---------- cabecera con el progreso ----------
  const Cabecera = () => {
    if (paso === "listo") return null;
    const faltan = total - n - 1;
    return (
      <header className="rv-head">
        <div className="rv-head-row">
          {(n > 0 || verCal) ? (
            <button className="rv-back" onClick={atras} aria-label="Atrás"><Icon name="chevron-left" size={24} /></button>
          ) : (
            <span className="rv-back vacio" />
          )}
          <div className="rv-biz">
            <span className="rv-star"><QStarRv /></span>
            <span>{EB_NEGOCIO.name}</span>
          </div>
          <span className="rv-cont">{n + 1}/{total}</span>
        </div>
        <div className="rv-prog" aria-label={`Paso ${n + 1} de ${total}`}>
          {ORDEN.map((p, i) => <i key={p} className={i < n ? "done" : i === n ? "on" : ""} />)}
        </div>
        <div className="rv-faltan">
          {faltan === 0 ? "Último paso" : faltan === 1 ? "Te falta 1 paso" : `Te faltan ${faltan} pasos`}
        </div>
      </header>
    );
  };

  // ---------- resumen chiquito de lo elegido (va debajo de la pregunta) ----------
  const Miga = () => {
    const partes = [];
    if (d.dif != null) partes.push(d.dif === 0 ? "Hoy" : d.dif === 1 ? "Mañana" : rvCap(ebFechaLarga(d.dif)));
    if (d.tipo) partes.push(d.tipo);
    if (d.hora != null) partes.push(rvHora(d.hora));
    if (d.duracion) partes.push(`${d.duracion} h`);
    if (!partes.length) return null;
    return <div className="rv-miga">{partes.map((p, i) => <span key={i}>{p}</span>)}</div>;
  };

  let cuerpo = null;

  // ---------- 1 · día ----------
  const elegirDia = (dif) => { setD((p) => ({ ...p, dif, hora: null, duracion: null, cancha: null })); setVerCal(false); ir("deporte"); };
  if (paso === "dia" && verCal) {
    cuerpo = (
      <section className="rv-paso">
        <h1>Elige el día</h1>
        <CalendarioRv seleccionado={d.dif} onElegir={elegirDia} />
      </section>
    );
  } else if (paso === "dia") {
    cuerpo = (
      <section className="rv-paso">
        <h1>{preNombre ? `${preNombre.split(" ")[0]}, ¿qué día quieres jugar?` : "¿Qué día quieres jugar?"}</h1>
        <div className="rv-lista">
          {dias.slice(0, 5).map(({ dif, f }) => (
            <button key={dif} className={`rv-opt ${d.dif === dif ? "on" : ""}`} onClick={() => elegirDia(dif)}>
              <span className="fecha"><b>{f.getDate()}</b><i>{RV_MESES[f.getMonth()]}</i></span>
              <span className="tx">
                <span className="t">{dif === 0 ? "Hoy" : dif === 1 ? "Mañana" : rvCap(RV_DIAS[f.getDay()])}</span>
                <span className="s">{dif <= 1 ? rvCap(RV_DIAS[f.getDay()]) : `${f.getDate()} de ${RV_MESES[f.getMonth()]}`}</span>
              </span>
              <Icon name="chevron-right" size={22} />
            </button>
          ))}
          <button className={`rv-opt cal ${d.dif != null && d.dif > 4 ? "on" : ""}`} onClick={() => setVerCal(true)}>
            <span className="fecha ic"><Icon name="calendar" size={26} /></span>
            <span className="tx">
              <span className="t">Otro día</span>
              <span className="s">{d.dif != null && d.dif > 4 ? rvCap(ebFechaLarga(d.dif)) : "abrir el calendario"}</span>
            </span>
            <Icon name="chevron-right" size={22} />
          </button>
        </div>
      </section>
    );
  }

  // ---------- 2 · deporte ----------
  if (paso === "deporte") {
    cuerpo = (
      <section className="rv-paso">
        <h1>¿Qué vas a jugar?</h1>
        <Miga />
        <div className="rv-lista">
          {RV_DEPORTES.map((x) => (
            <button key={x.tipo} className={`rv-opt ${d.tipo === x.tipo ? "on" : ""}`}
                    onClick={() => { setD((p) => ({ ...p, tipo: x.tipo, hora: null, duracion: null, cancha: null })); ir("hora"); }}>
              <span className="em">{RV_EMOJI[x.tipo] || "🏟️"}</span>
              <span className="tx">
                <span className="t">{x.tipo}</span>
                <span className="s">{x.canchas.length === 1 ? "1 cancha" : `${x.canchas.length} canchas`} · desde {rvCOP(x.precio)} la hora</span>
              </span>
              <Icon name="chevron-right" size={22} />
            </button>
          ))}
        </div>
      </section>
    );
  }

  // ---------- 3 · hora ----------
  if (paso === "hora") {
    const libres = horas.filter((x) => x.libre).length;
    cuerpo = (
      <section className="rv-paso">
        <h1>¿A qué hora?</h1>
        <Miga />
        {libres === 0 ? (
          <div className="rv-vacio">Ese día ya está lleno para {d.tipo}. <button onClick={() => ir("dia")}>Prueba otro día</button></div>
        ) : (
          <div className="rv-horas">
            {horas.map(({ h, libre }) => (
              <button key={h} disabled={!libre} className={`rv-hora ${d.hora === h ? "on" : ""} ${libre ? "" : "no"}`}
                      onClick={() => { setD((p) => ({ ...p, hora: h, duracion: null, cancha: null })); ir("tiempo"); }}>
                {rvHoraCorta(h)}
              </button>
            ))}
          </div>
        )}
        <div className="rv-nota">Solo te muestro las horas que de verdad están libres.</div>
      </section>
    );
  }

  // ---------- 4 · tiempo ----------
  if (paso === "tiempo") {
    cuerpo = (
      <section className="rv-paso">
        <h1>¿Cuánto tiempo?</h1>
        <Miga />
        <div className="rv-lista">
          {duraciones.map(({ dur, cancha: c }) => (
            <button key={dur} disabled={!c} className={`rv-opt ${d.duracion === dur ? "on" : ""}`}
                    onClick={() => { setD((p) => ({ ...p, duracion: dur, cancha: c.id })); ir(yaConocido ? "pago" : "datos"); }}>
              <span className="tx">
                <span className="t">{dur} {dur === 1 ? "hora" : "horas"}</span>
                <span className="s">{c ? `hasta las ${rvHora(d.hora + dur)} · ${rvCOP(c.precio * dur)}` : "no hay cancha libre tanto tiempo"}</span>
              </span>
              {c && <Icon name="chevron-right" size={22} />}
            </button>
          ))}
        </div>
      </section>
    );
  }

  // ---------- 5 · datos ----------
  if (paso === "datos") {
    cuerpo = (
      <section className="rv-paso">
        <h1>¿A nombre de quién?</h1>
        <Miga />
        <label className="rv-field">
          <span>Tu nombre</span>
          <input autoFocus placeholder="Nombre y apellido" value={d.nombre} onChange={(e) => set("nombre", e.target.value)} />
        </label>
        <label className="rv-field">
          <span>Tu WhatsApp</span>
          <input inputMode="tel" placeholder="300 000 0000" value={d.wa} onChange={(e) => set("wa", e.target.value)} />
        </label>
        <div className="rv-nota">Te mando la confirmación por ahí.</div>
        <div className="rv-espacio" />
        <button className="rv-btn pri" disabled={!datosOk} onClick={() => ir("pago")}>Siguiente <Icon name="chevron-right" size={24} /></button>
      </section>
    );
  }

  // ---------- 6 · confirmar ----------
  if (paso === "pago") {
    cuerpo = (
      <section className="rv-paso">
        <h1>Revisa y confirma</h1>
        <div className="rv-resumen">
          <div className="row"><span className="k">Cancha</span><span className="v">{cancha?.nombre} · {cancha?.tipo}</span></div>
          <div className="row"><span className="k">Cuándo</span><span className="v">{rvCap(ebFechaLarga(d.dif))}<br /><span className="mono">{rvHora(d.hora)} – {rvHora(d.hora + d.duracion)}</span></span></div>
          <div className="row"><span className="k">A nombre de</span><span className="v">{d.nombre}</span></div>
          <div className="row tot"><span className="k">Valor</span><span className="v mono">{rvCOP(totalPagar)}</span></div>
        </div>
        <div className="rv-nota">Pagas en la cancha. Si algo cambia, escríbele a Quepa por WhatsApp.</div>
        <div className="rv-espacio" />
        <button className="rv-btn pri" onClick={() => ir("listo")}>
          <Icon name="check" size={24} /> Reservar
        </button>
      </section>
    );
  }

  // ---------- listo ----------
  if (paso === "listo") {
    const wa = `https://wa.me/${EB_NEGOCIO.whatsapp.replace(/\D/g, "")}`;
    cuerpo = (
      <section className="rv-listo">
        <div className="rv-check"><Icon name="check" size={44} /></div>
        <h1>¡Reservada!</h1>
        <p className="rv-sub">Ya quedó apartada a tu nombre. Pagas en la cancha.</p>
        <div className="rv-ticket">
          <div className="big">{cancha?.nombre}</div>
          <div className="mid">{rvCap(ebFechaLarga(d.dif))}</div>
          <div className="mono">{rvHora(d.hora)} – {rvHora(d.hora + d.duracion)}</div>
          <div className="sep" />
          <div className="small">{d.nombre} · {EB_NEGOCIO.name}</div>
          <div className="small">{EB_NEGOCIO.address}, {EB_NEGOCIO.city}</div>
        </div>
        <div className="rv-espacio" />
        <a className="rv-btn wa" href={wa}><Icon name="whatsapp" size={24} /> Volver a WhatsApp</a>
        <div className="rv-pie">Te mandé la confirmación por WhatsApp. ¡Que parche!</div>
      </section>
    );
  }

  return (
    <div className={`rv-app ${paso === "listo" ? "oscuro" : ""}`}>
      <Cabecera />
      <main className={`rv-main ${dir > 0 ? "ade" : "atr"}`} key={paso}>{cuerpo}</main>
    </div>
  );
}

// ---------- calendario de un mes ----------
const rvDif = (f) => { const hoy = new Date(); hoy.setHours(0,0,0,0); const x = new Date(f); x.setHours(0,0,0,0); return Math.round((x - hoy) / 86400000); };
function CalendarioRv({ seleccionado, onElegir }) {
  const ini = ebFecha(seleccionado || 0);
  const [mes, setMes] = _rvS(() => new Date(ini.getFullYear(), ini.getMonth(), 1));
  const celdas = _rvM(() => {
    const dias = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    const arranque = (new Date(mes.getFullYear(), mes.getMonth(), 1).getDay() + 6) % 7;   // lunes = 0
    const out = Array.from({ length: arranque }, () => null);
    for (let d = 1; d <= dias; d++) out.push(new Date(mes.getFullYear(), mes.getMonth(), d));
    return out;
  }, [mes]);
  const MESES_L = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return (
    <div className="rv-cal">
      <div className="rv-cal-head">
        <button onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))} aria-label="Mes anterior"><Icon name="chevron-left" size={22} /></button>
        <span>{rvCap(MESES_L[mes.getMonth()])} {mes.getFullYear()}</span>
        <button onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))} aria-label="Mes siguiente"><Icon name="chevron-right" size={22} /></button>
      </div>
      <div className="rv-cal-dows">{["L", "M", "M", "J", "V", "S", "D"].map((x, i) => <span key={i}>{x}</span>)}</div>
      <div className="rv-cal-grid">
        {celdas.map((f, i) => {
          if (!f) return <span key={i} />;
          const dif = rvDif(f);
          return (
            <button key={i} disabled={dif < 0} className={`rv-cal-dia ${dif === seleccionado ? "on" : ""} ${dif === 0 ? "hoy" : ""}`}
                    onClick={() => onElegir(dif)}>{f.getDate()}</button>
          );
        })}
      </div>
    </div>
  );
}

const QStarRv = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="currentColor">
      <rect x="44" y="4" width="12" height="92" rx="6" />
      <rect x="44" y="4" width="12" height="92" rx="6" transform="rotate(45 50 50)" />
      <rect x="44" y="4" width="12" height="92" rx="6" transform="rotate(90 50 50)" />
      <rect x="44" y="4" width="12" height="92" rx="6" transform="rotate(135 50 50)" />
    </g>
  </svg>
);

ReactDOM.createRoot(document.getElementById("root")).render(<Reservar />);

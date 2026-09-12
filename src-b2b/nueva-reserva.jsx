// Quepa Canchas · crear reserva en 6 pasos · una sola pregunta por pantalla
const { useState: _nrS, useMemo: _nrM, useEffect: _nrE } = React;

const capitalizar = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);

function NuevaReserva({ open, onClose, onGuardar, reservas, inicial }) {
  const [paso, setPaso] = _nrS(0);
  const [verCal, setVerCal] = _nrS(false);
  const [editaPrecio, setEditaPrecio] = _nrS(false);
  const [d, setD] = _nrS({ cancha: null, fecha: 0, hora: null, duracion: 1, nombre: "", wa: "", valor: "" });

  // Modo bloque: viene desde la agenda con día y hora ya elegidos, pero sin cancha.
  // Se pregunta solo la cancha (entre las que están libres a esa hora) y sigue el flujo normal.
  const modoBloque = !!(inicial && inicial.hora != null && !inicial.cancha);

  _nrE(() => {
    if (!open) return;
    // arranca en el primer paso que falta: si ya vienen cancha y hora, salta a la duración
    const yaCancha = !!(inicial && inicial.cancha);
    const yaHora = !!(inicial && inicial.hora != null);
    setPaso(modoBloque ? 0 : yaHora ? 3 : yaCancha ? 2 : 0);
    setVerCal(false);
    setEditaPrecio(false);
    setD({
      cancha: inicial?.cancha || null,
      fecha: inicial?.fecha ?? 0,
      hora: inicial?.hora ?? null,
      duracion: (inicial?.cancha ? (ebCancha(inicial.cancha)?.duraciones || [1])[0] : 1),
      nombre: "", wa: "", valor: "",
    });
  }, [open]);

  const cancha = _nrM(() => (d.cancha ? ebCancha(d.cancha) : null), [d.cancha]);
  const set = (k, v) => setD((p) => ({ ...p, [k]: v }));

  // cliente conocido por WhatsApp
  const conocido = _nrM(() => {
    const limpio = d.wa.replace(/\D/g, "");
    if (limpio.length < 7) return null;
    return EB_CLIENTES.find((c) => c.wa.replace(/\D/g, "").endsWith(limpio.slice(-7))) || null;
  }, [d.wa]);
  _nrE(() => { if (conocido && !d.nombre) set("nombre", conocido.nombre); }, [conocido]);

  const ocupadas = _nrM(() => {
    const s = new Set();
    reservas.filter((r) => r.fecha === d.fecha && r.cancha === d.cancha && r.estado !== "Cancelada")
      .forEach((r) => { for (let i = 0; i < r.duracion; i++) s.add(r.hora + i); });
    return s;
  }, [reservas, d.fecha, d.cancha]);

  // en modo bloque: qué canchas están libres a la hora elegida
  const libresEnBloque = _nrM(() => {
    if (!modoBloque) return {};
    const m = {};
    EB_CANCHAS.forEach((c) => {
      const abre = d.hora >= c.desde && d.hora < c.hasta;
      const tomada = reservas.some((r) => r.fecha === d.fecha && r.cancha === c.id && r.estado !== "Cancelada"
                                          && r.hora <= d.hora && d.hora < r.hora + r.duracion);
      m[c.id] = abre && !tomada;
    });
    return m;
  }, [modoBloque, reservas, d.fecha, d.hora]);

  const precioSugerido = cancha ? cancha.precio * d.duracion : 0;

  const pasoCancha = {
      t: "¿Qué cancha?",
      ok: !!d.cancha,
      c: (
        <div>
          {modoBloque && (
            <div className="q-agenda-meta" style={{ marginBottom: 16 }}>
              <span style={{ textTransform: "capitalize" }}>{ebFechaLarga(d.fecha)}</span>
              <span>·</span>
              <span className="mono">{ebFmtHora(d.hora)}</span>
              <span>·</span>
              <span><strong>{Object.values(libresEnBloque).filter(Boolean).length}</strong> libres a esa hora</span>
            </div>
          )}
          <div className="q-opts">
            {EB_CANCHAS.filter((c) => c.activa).map((c) => {
              const libre = !modoBloque || libresEnBloque[c.id];
              return (
                <button key={c.id} disabled={!libre} className={`q-opt ${d.cancha === c.id ? "on" : ""}`}
                        style={libre ? undefined : { opacity: .35, cursor: "not-allowed" }}
                        onClick={() => {
                          set("cancha", c.id);
                          set("duracion", (c.duraciones || [1])[0]);
                          setPaso((p) => p + 1);
                        }}>
                  <span className="t">{c.nombre}</span>
                  <span className="s">{libre ? `${c.tipo} · ${fmtCOP(c.precio)} la hora` : `${c.tipo} · ocupada a esa hora`}</span>
                </button>
              );
            })}
          </div>
        </div>
      ),
  };

  const pasosTodos = [
    pasoCancha,
    {
      key: "dia",
      t: verCal ? "Elige la fecha" : "¿Qué día?",
      ok: true,
      c: verCal ? (
        <Calendario seleccionado={d.fecha} onElegir={(dif) => { set("fecha", dif); set("hora", null); setVerCal(false); setPaso((p) => p + 1); }} />
      ) : (
        <div className="q-opts c3">
          {[{ v: 0, l: "Hoy" }, { v: 1, l: "Mañana" }].map((o) => (
            <button key={o.v} className={`q-opt ${d.fecha === o.v ? "on" : ""}`}
                    onClick={() => { set("fecha", o.v); set("hora", null); setPaso((p) => p + 1); }}>
              <span className="t">{o.l}</span>
              <span className="s">{ebFechaCorta(o.v)}</span>
            </button>
          ))}
          <button className={`q-opt ${d.fecha > 1 || d.fecha < 0 ? "on" : ""}`} onClick={() => setVerCal(true)}>
            <span className="t" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Icon name="calendar" size={26} /> Otra fecha
            </span>
            <span className="s">{d.fecha > 1 || d.fecha < 0 ? ebFechaCorta(d.fecha) : "abrir el calendario"}</span>
          </button>
        </div>
      ),
    },
    {
      key: "hora",
      t: "¿A qué hora?",
      ok: d.hora != null,
      c: (
        <div>
          <div className="q-agenda-meta" style={{ marginBottom: 16 }}>
            <span>{cancha?.nombre}</span>
            <span>·</span>
            <span style={{ textTransform: "capitalize" }}>{ebFechaLarga(d.fecha)}</span>
          </div>
          <ListaHorarios
            cancha={cancha} reservas={reservas} dia={d.fecha} seleccion={d.hora}
            onElegir={(h) => { set("hora", h); setPaso((p) => p + 1); }}
          />
        </div>
      ),
    },
    {
      t: "¿Cuántas horas?",
      ok: true,
      c: (
        <div>
        <div className="q-opts c3">
          {(cancha?.duraciones || [1]).map((n) => {
            const cabe = Array.from({ length: n }).every((_, i) => !ocupadas.has(d.hora + i) && d.hora + i < (cancha?.hasta || 23));
            return (
              <button key={n} disabled={!cabe} className={`q-opt ${d.duracion === n ? "on" : ""}`}
                      style={{ opacity: cabe ? 1 : .3, cursor: cabe ? "pointer" : "not-allowed" }}
                      onClick={() => { set("duracion", n); set("valor", String((cancha?.precio || 0) * n)); setPaso((p) => p + 1); }}>
                <span className="t">{n} {n === 1 ? "hora" : "horas"}</span>
                <span className="s">{cabe ? `hasta las ${ebFmtHora(d.hora + n)}` : "no cabe"}</span>
              </button>
            );
          })}
        </div>
        </div>
      ),
    },
    {
      t: "¿Quién reserva?",
      ok: d.nombre.trim().length > 2 && d.wa.replace(/\D/g, "").length >= 10,
      c: (
        <div>
          <div className="q-field">
            <label htmlFor="nr-wa">WhatsApp</label>
            <input id="nr-wa" className="q-input" inputMode="tel" placeholder="300 000 0000"
                   value={d.wa} onChange={(e) => set("wa", e.target.value)} />
          </div>
          {conocido && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--yg)", borderRadius: 16, padding: "18px 22px", marginBottom: 22 }}>
              <Avatar name={conocido.nombre} size={52} tone="ink" />
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.02em" }}>{conocido.nombre}</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Ya es cliente tuyo — {conocido.reservas} reservas</div>
              </div>
            </div>
          )}
          <div className="q-field">
            <label htmlFor="nr-nom">Nombre</label>
            <input id="nr-nom" className="q-input" placeholder="Nombre y apellido"
                   value={d.nombre} onChange={(e) => set("nombre", e.target.value)} />
          </div>
        </div>
      ),
    },
    {
      t: "Revisa y confirma",
      ok: Number(d.valor) > 0,
      c: (
        <div>
          <span className="q-sec-lbl">La reserva</span>
          <div className="q-sum">
            <div className="q-sum-row">
              <span className="k">Cancha</span>
              <span className="v">{cancha?.nombre} <span style={{ color: "var(--ink-50)", fontWeight: 600 }}>· {cancha?.tipo}</span></span>
            </div>
            <div className="q-sum-row">
              <span className="k">Cuándo</span>
              <span className="v">
                {capitalizar(ebFechaLarga(d.fecha))}
                <span className="mono" style={{ display: "block", fontSize: 17, color: "var(--ink-50)", fontWeight: 600 }}>
                  {ebFmtHora(d.hora)} — {ebFmtHora(d.hora + d.duracion)}
                </span>
              </span>
            </div>
            <div className="q-sum-row">
              <span className="k">Tarifa</span>
              <span className="v mono">{d.duracion} × {fmtCOP(cancha?.precio || 0)}</span>
            </div>

            <div className="q-sum-sep" />

            <div className="q-sum-total">
              <span className="k">Total</span>
              <span className="lado">
                {editaPrecio ? (
                  <input
                    className="q-sum-input" inputMode="numeric" autoFocus
                    value={d.valor}
                    onChange={(e) => set("valor", e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && setEditaPrecio(false)}
                    onBlur={() => setEditaPrecio(false)}
                  />
                ) : (
                  <span className="v">{fmtCOP(Number(d.valor) || 0)}</span>
                )}
                <button className={`q-sum-edit ${editaPrecio ? "on" : ""}`}
                        onClick={() => setEditaPrecio((v) => !v)}
                        aria-label={editaPrecio ? "Listo" : "Editar el total"}>
                  <Icon name={editaPrecio ? "check" : "edit"} size={24} />
                </button>
              </span>
            </div>

            {Number(d.valor) !== precioSugerido && (
              <div className="q-sum-nota">
                Le cambiaste el precio. Lo normal serían <strong>{fmtCOP(precioSugerido)}</strong>.
              </div>
            )}
          </div>

          <span className="q-sec-lbl">Quién reserva</span>
          <div className="q-cli-card">
            <Avatar name={d.nombre || "?"} size={54} tone="ink" />
            <div style={{ minWidth: 0 }}>
              <div className="nm">{d.nombre || "Sin nombre"}</div>
              <div className="wa">{d.wa || "Sin WhatsApp"}</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const pasos = pasosTodos.filter((p) =>
    modoBloque ? (p.key !== "dia" && p.key !== "hora") : !(inicial?.saltarDia && p.key === "dia"));
  const esUltimo = paso === pasos.length - 1;
  const actual = pasos[paso];
  _nrE(() => { if (esUltimo && !d.valor) set("valor", String(precioSugerido)); }, [esUltimo, precioSugerido]);

  const guardar = () => {
    onGuardar({
      id: "n" + Math.random().toString(36).slice(2, 7),
      cancha: d.cancha, hora: d.hora, duracion: d.duracion, fecha: d.fecha,
      estado: "Confirmada", origen: "manual", valor: Number(d.valor),
      nuevoCliente: { nombre: d.nombre.trim(), wa: d.wa },
      clienteId: conocido ? conocido.id : null,
    });
    onClose();
  };

  // Lo ya elegido, siempre a la vista en la cabecera: día · hora · cancha
  const contexto = (
    <span className="q-nr-ctx">
      <span className="on">{capitalizar(ebFechaLarga(d.fecha))}</span>
      <i>·</i>
      {d.hora != null
        ? <span className="on mono">{ebFmtHora(d.hora)}{esUltimo || paso > pasos.findIndex((p) => p.t === "¿Cuántas horas?") ? ` – ${ebFmtHora(d.hora + d.duracion)}` : ""}</span>
        : <span className="off">hora</span>}
      <i>·</i>
      {cancha ? <span className="on">{cancha.nombre}</span> : <span className="off">cancha</span>}
      <span className="paso">Paso {paso + 1} de {pasos.length}</span>
    </span>
  );

  return (
    <QSheet
      open={open}
      onClose={onClose}
      onBack={verCal ? () => setVerCal(false) : (paso > 0 ? () => setPaso(paso - 1) : null)}
      titulo={actual?.t}
      sub={contexto}
      footer={
        verCal ? null : esUltimo ? (
          <button className="q-btn pri grow lg" disabled={!actual.ok} onClick={guardar}>
            <Icon name="check" size={26} /> Guardar reserva
          </button>
        ) : (
          <button className="q-btn pri grow" disabled={!actual.ok} onClick={() => setPaso(paso + 1)}>
            Siguiente <Icon name="chevron-right" size={22} />
          </button>
        )
      }
    >
      <div style={{ marginBottom: 26 }}><QSteps total={pasos.length} actual={paso} /></div>
      {actual?.c}

    </QSheet>
  );
}

Object.assign(window, { NuevaReserva });

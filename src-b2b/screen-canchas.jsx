// Quepa Canchas · Mis canchas (constructor) + Usuarios
const { useState: _mcS } = React;

// ---------------- Mis canchas ----------------
function ScreenCanchas({ canchas, tipos, onGuardar, onArchivar, onActiva, onNuevoTipo, onBorrarTipo }) {
  const [editando, setEditando] = _mcS(null);
  const [confirmar, setConfirmar] = _mcS(null);
  const [creandoTipo, setCreandoTipo] = _mcS(false);
  const [tipoNuevo, setTipoNuevo] = _mcS("");

  const enUso = (t) => canchas.some((c) => c.tipo === t);
  const agregarTipo = () => {
    const t = tipoNuevo.trim();
    if (!t || tipos.includes(t)) { setCreandoTipo(false); setTipoNuevo(""); return; }
    onNuevoTipo(t);
    setEditando((e) => (e ? { ...e, tipo: t } : e));
    setTipoNuevo(""); setCreandoTipo(false);
  };

  const nueva = () => setEditando({ id: null, nombre: "", tipo: tipos[0] || "", precio: "", desde: 6, hasta: 23, activa: true });
  const activas = canchas.filter((c) => c.activa).length;

  return (
    <div className="q-wrap">
      <div className="q-head">
        <div style={{ flex: 1 }}>
          <h1 className="q-h1">Mis canchas</h1>
          <div className="q-sub">Lo que la gente puede reservar</div>
        </div>
      </div>

      <div className="q-cards">
        {canchas.map((c) => (
          <div className="q-card" key={c.id}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="nm">{c.nombre}</div>
                <div className="tp">{c.tipo}</div>
              </div>
              <button className="q-back" style={{ minHeight: 56, padding: "0 18px" }} onClick={() => setEditando({ ...c, precio: String(c.precio) })}>
                <Icon name="edit" size={20} /> Editar
              </button>
            </div>
            <div className="q-note">De {ebFmtHora(c.desde)} a {ebFmtHora(c.hasta)}</div>
            <div className="pr">{fmtCOP(c.precio)} <small>la hora</small></div>
            <QSwitch on={c.activa} onChange={(v) => onActiva(c.id, v)}>
              {c.activa ? "Activa" : "Inactiva"}
            </QSwitch>
          </div>
        ))}

        {canchas.length < EB_NEGOCIO.limites.canchas && (
          <button className="q-card add" onClick={nueva}>
            <Icon name="plus" size={44} />
            Agregar cancha
          </button>
        )}
      </div>

      <div style={{ maxWidth: 460 }}>
        <QLimite usado={canchas.length} total={EB_NEGOCIO.limites.canchas} unidad="canchas" />
      </div>

      {/* ---- crear / editar ---- */}
      <QSheet
        open={!!editando}
        onClose={() => setEditando(null)}
        titulo={editando?.id ? "Editar cancha" : "Nueva cancha"}
        footer={
          <React.Fragment>
            {editando?.id && (
              <button className="q-btn danger" onClick={() => { setConfirmar(editando); setEditando(null); }}>
                Archivar
              </button>
            )}
            <button className="q-btn pri grow"
                    disabled={!editando?.nombre?.trim() || !Number(editando?.precio) || !editando?.tipo}
                    onClick={() => { onGuardar({ ...editando, precio: Number(editando.precio) }); setEditando(null); }}>
              <Icon name="check" size={24} /> Guardar
            </button>
          </React.Fragment>
        }
      >
        {editando && (
          <React.Fragment>
            <div className="q-field">
              <label htmlFor="mc-nom">¿Cómo se llama?</label>
              <input id="mc-nom" className="q-input" placeholder="Cancha 1" value={editando.nombre}
                     onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} />
            </div>

            <div className="q-field">
              <label>¿Qué tipo es?</label>
              <span className="q-note" style={{ marginTop: -4, marginBottom: 4 }}>
                Crea los que necesites: fútbol 8, microfútbol, tenis, lo que tengas.
              </span>
              <div className="q-chips">
                {tipos.map((t) => (
                  <span key={t} className={`q-chip-set ${editando.tipo === t ? "on" : ""}`}>
                    <button className="lbl" onClick={() => setEditando({ ...editando, tipo: t })}>{t}</button>
                    {!enUso(t) && (
                      <button className="x" onClick={() => onBorrarTipo(t)} aria-label={`Quitar ${t}`}>
                        <Icon name="x" size={18} />
                      </button>
                    )}
                  </span>
                ))}

                {creandoTipo ? (
                  <span className="q-chip-nuevo">
                    <input autoFocus value={tipoNuevo} placeholder="Ej: Fútbol 8"
                           onChange={(e) => setTipoNuevo(e.target.value)}
                           onKeyDown={(e) => { if (e.key === "Enter") agregarTipo(); if (e.key === "Escape") { setCreandoTipo(false); setTipoNuevo(""); } }} />
                    <button onClick={agregarTipo} aria-label="Agregar tipo"><Icon name="check" size={20} /></button>
                  </span>
                ) : (
                  <button className="q-chip agregar" onClick={() => setCreandoTipo(true)}>
                    <Icon name="plus" size={20} /> Crear tipo
                  </button>
                )}
              </div>
            </div>

            <div className="q-field">
              <label htmlFor="mc-pre">¿Cuánto cobras por hora?</label>
              <div className="q-money">
                <span className="sig">$</span>
                <input id="mc-pre" className="q-input" inputMode="numeric" placeholder="70000"
                       value={editando.precio}
                       onChange={(e) => setEditando({ ...editando, precio: e.target.value.replace(/\D/g, "") })} />
              </div>
            </div>

            <div className="q-field">
              <label>¿En qué horario se puede reservar?</label>
              <div className="q-row">
                <select className="q-input" style={{ width: 190 }} value={editando.desde}
                        onChange={(e) => setEditando({ ...editando, desde: Number(e.target.value) })}>
                  {ebHoras().map((h) => <option key={h} value={h}>{ebFmtHora(h)}</option>)}
                </select>
                <span style={{ fontSize: 19, fontWeight: 700 }}>a</span>
                <select className="q-input" style={{ width: 190 }} value={editando.hasta}
                        onChange={(e) => setEditando({ ...editando, hasta: Number(e.target.value) })}>
                  {ebHoras().concat([EB_CIERRE]).filter((h) => h > editando.desde).map((h) => (
                    <option key={h} value={h}>{ebFmtHora(h)}</option>
                  ))}
                </select>
              </div>
            </div>
          </React.Fragment>
        )}
      </QSheet>

      {/* ---- confirmar archivar ---- */}
      <QSheet open={!!confirmar} onClose={() => setConfirmar(null)} titulo="¿Archivar esta cancha?"
              footer={
                <React.Fragment>
                  <button className="q-btn grow" onClick={() => setConfirmar(null)}>No, dejarla</button>
                  <button className="q-btn danger grow" onClick={() => { onArchivar(confirmar.id); setConfirmar(null); }}>
                    Sí, archivar
                  </button>
                </React.Fragment>
              }>
        <p style={{ fontSize: 21, lineHeight: 1.5, fontWeight: 500 }}>
          <strong>{confirmar?.nombre}</strong> deja de aparecer para reservar y Quepa no la va a ofrecer más.
        </p>
        <p style={{ fontSize: 19, lineHeight: 1.5, color: "var(--ink-50)", marginTop: 16, fontWeight: 500 }}>
          Las reservas que ya tiene se mantienen y se pueden cumplir con normalidad. Puedes volver a activarla
          cuando quieras.
        </p>
      </QSheet>
    </div>
  );
}

// ---------------- Usuarios ----------------
const ROLES = [
  { id: "Administrador", desc: "Ve y cambia todo: reservas, canchas, ventas y el perfil del negocio." },
  { id: "Recepción", desc: "Solo ve y maneja las reservas. No ve las ventas ni la configuración." },
];

function ScreenUsuarios({ usuarios, onInvitar, onQuitar }) {
  const [invitando, setInvitando] = _mcS(false);
  const [nuevo, setNuevo] = _mcS({ nombre: "", wa: "", rol: "Recepción" });

  return (
    <div className="q-wrap">
      <div className="q-head">
        <div style={{ flex: 1 }}>
          <h1 className="q-h1">Usuarios</h1>
          <div className="q-sub">Quién puede entrar a manejar tu cancha</div>
        </div>
      </div>

      <div className="q-cards">
        {usuarios.map((u) => (
          <div className="q-card" key={u.id} style={{ minHeight: 190 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar name={u.nombre} size={62} tone={u.rol === "Administrador" ? "ink" : "yg"} />
              <div style={{ minWidth: 0 }}>
                <div className="nm" style={{ fontSize: 22 }}>{u.nombre}</div>
                <div className="q-mono q-muted" style={{ fontSize: 16, fontWeight: 600 }}>{u.wa}</div>
              </div>
            </div>
            <span className="q-chip on" style={{ alignSelf: "flex-start", minHeight: 52, pointerEvents: "none" }}>{u.rol}</span>
            <div className="q-note" style={{ marginTop: "auto" }}>
              {ROLES.find((r) => r.id === u.rol)?.desc}
            </div>
            {u.rol !== "Administrador" && (
              <button className="q-btn danger" style={{ minHeight: 58 }} onClick={() => onQuitar(u.id)}>Quitar acceso</button>
            )}
          </div>
        ))}

        {usuarios.length < EB_NEGOCIO.limites.usuarios && (
          <button className="q-card add" onClick={() => setInvitando(true)}>
            <Icon name="plus" size={44} />
            Invitar a alguien
          </button>
        )}
      </div>

      <div style={{ maxWidth: 460 }}>
        <QLimite usado={usuarios.length} total={EB_NEGOCIO.limites.usuarios} unidad="usuarios" />
      </div>

      <QSheet open={invitando} onClose={() => setInvitando(false)} titulo="Invitar a alguien"
              footer={
                <button className="q-btn pri grow" disabled={!nuevo.nombre.trim() || nuevo.wa.replace(/\D/g, "").length < 10}
                        onClick={() => { onInvitar(nuevo); setNuevo({ nombre: "", wa: "", rol: "Recepción" }); setInvitando(false); }}>
                  <Icon name="send" size={24} /> Mandarle la invitación
                </button>
              }>
        <div className="q-field">
          <label htmlFor="us-nom">¿Cómo se llama?</label>
          <input id="us-nom" className="q-input" placeholder="Nombre y apellido" value={nuevo.nombre}
                 onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
        </div>
        <div className="q-field">
          <label htmlFor="us-wa">¿Cuál es su WhatsApp?</label>
          <input id="us-wa" className="q-input" inputMode="tel" placeholder="300 000 0000" value={nuevo.wa}
                 onChange={(e) => setNuevo({ ...nuevo, wa: e.target.value })} />
        </div>
        <div className="q-field">
          <label>¿Qué va a poder hacer?</label>
          <div className="q-opts">
            {ROLES.map((r) => (
              <button key={r.id} className={`q-opt ${nuevo.rol === r.id ? "on" : ""}`} onClick={() => setNuevo({ ...nuevo, rol: r.id })}>
                <span className="t">{r.id}</span>
                <span className="s">{r.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </QSheet>
    </div>
  );
}

Object.assign(window, { ScreenCanchas, ScreenUsuarios });

// Quepa Canchas · Clientes
// Quién viene, cada cuánto, cuánto gasta y quién deja plantada la cancha.
const { useState: _clS, useMemo: _clM } = React;

const tipoCliente = (c) => (c.reservas >= 5 ? "Frecuente" : c.reservas <= 1 ? "Nuevo" : "Recurrente");

function ScreenClientes({ clientes, reservas, onNuevo }) {
  const [busca, setBusca] = _clS("");
  const [ver, setVer] = _clS(null);
  const [creando, setCreando] = _clS(false);
  const [nuevo, setNuevo] = _clS({ nombre: "", wa: "" });

  const filtrados = _clM(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (c) => c.nombre.toLowerCase().includes(q) || c.wa.replace(/\D/g, "").includes(q.replace(/\D/g, ""))
    );
  }, [clientes, busca]);

  const frecuentes = clientes.filter((c) => c.reservas >= 5).length;
  const nuevos = clientes.filter((c) => c.reservas <= 1).length;

  // reservas de un cliente
  const historial = _clM(() => {
    if (!ver) return [];
    return reservas
      .filter((r) => r.clienteId === ver.id || (r.cliente && r.cliente.id === ver.id))
      .sort((a, b) => b.fecha - a.fecha || b.hora - a.hora);
  }, [ver, reservas]);

  return (
    <div className="q-wrap">
      <div className="q-head">
        <div style={{ flex: 1 }}>
          <h1 className="q-h1">Clientes</h1>
          <div className="q-sub">Quién viene a jugar a tu cancha</div>
        </div>
        <button className="q-btn pri" onClick={() => setCreando(true)}>
          <Icon name="plus" size={24} /> Agregar cliente
        </button>
      </div>

      <div className="q-stats">
        <QStat label="En total" valor={clientes.length} />
        <QStat label="Frecuentes" valor={frecuentes} />
        <QStat label="Nuevos" valor={nuevos} />
      </div>

      <div className="q-buscar">
        <Icon name="search" size={24} />
        <input className="q-input" placeholder="Busca por nombre o WhatsApp"
               value={busca} onChange={(e) => setBusca(e.target.value)} />
        {busca && (
          <button className="q-buscar-x" onClick={() => setBusca("")} aria-label="Limpiar">
            <Icon name="x" size={22} />
          </button>
        )}
      </div>

      {filtrados.length === 0 ? (
        <div className="q-empty">
          <div className="t">No encontramos a nadie</div>
          <div className="s">Prueba con otro nombre o con el número de WhatsApp.</div>
        </div>
      ) : (
        <div className="q-list">
          {filtrados.map((c) => (
            <button key={c.id} className="q-li q-cli-li" onClick={() => setVer(c)}>
              <Avatar name={c.nombre} size={52} tone={c.reservas >= 5 ? "ink" : "yg"} />
              <span className="datos">
                <span className="nm">{c.nombre}</span>
                <span className="wa">{c.wa}</span>
              </span>
              <span className="cifra">
                <span className="n">{c.reservas}</span>
                <span className="l">reservas</span>
              </span>
              <span className="cifra">
                <span className={`n ${c.noshow > 0 ? "mal" : ""}`}>{c.noshow}</span>
                <span className="l">no llegó</span>
              </span>
              <span className="cifra ancha">
                <span className="n">{fmtCOP(c.ticketProm)}</span>
                <span className="l">suele gastar</span>
              </span>
              <span className={`q-tag ${tipoCliente(c) === "Frecuente" ? "on" : ""}`}>{tipoCliente(c)}</span>
              <Icon name="chevron-right" size={24} color="#8C8F7E" />
            </button>
          ))}
        </div>
      )}

      {/* ---------- ficha del cliente ---------- */}
      <QSheet open={!!ver} onClose={() => setVer(null)}
              titulo={ver?.nombre || ""} sub={ver?.wa || ""}
              footer={
                <button className="q-btn wa grow">
                  <Icon name="whatsapp" size={24} /> Escribirle por WhatsApp
                </button>
              }>
        {ver && (
          <React.Fragment>
            <div className="q-stats" style={{ marginBottom: 24 }}>
              <QStat label="Reservas" valor={ver.reservas} />
              <QStat label="No llegó" valor={ver.noshow} />
              <QStat label="Suele gastar" valor={fmtCOP(ver.ticketProm)} />
            </div>

            <span className="q-sec-lbl">Sus reservas</span>
            {historial.length === 0 ? (
              <div className="q-note" style={{ padding: "18px 0" }}>
                Todavía no tiene reservas registradas en el sistema.
              </div>
            ) : (
              <div className="q-list" style={{ borderRadius: 18 }}>
                {historial.map((r) => (
                  <div key={r.id} className="q-li" style={{ cursor: "default", minHeight: 76 }}>
                    <span className="d" style={{ width: 118 }}>{ebFechaCorta(r.fecha)}</span>
                    <span className="t">{ebCancha(r.cancha)?.nombre}</span>
                    <span className="q-note">{ebFmtHora(r.hora)} · {r.duracion}h</span>
                    {r.origen === "quepa" && <Icon name="whatsapp" size={20} color="#25D366" />}
                    <span className="v">{fmtCOP(r.valor)}</span>
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        )}
      </QSheet>

      {/* ---------- agregar cliente ---------- */}
      <QSheet open={creando} onClose={() => setCreando(false)} titulo="Agregar cliente"
              footer={
                <button className="q-btn pri grow"
                        disabled={!nuevo.nombre.trim() || nuevo.wa.replace(/\D/g, "").length < 10}
                        onClick={() => { onNuevo(nuevo); setNuevo({ nombre: "", wa: "" }); setCreando(false); }}>
                  <Icon name="check" size={24} /> Guardar cliente
                </button>
              }>
        <div className="q-field">
          <label htmlFor="cl-nom">¿Cómo se llama?</label>
          <input id="cl-nom" className="q-input" placeholder="Nombre y apellido"
                 value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
        </div>
        <div className="q-field">
          <label htmlFor="cl-wa">¿Cuál es su WhatsApp?</label>
          <input id="cl-wa" className="q-input" inputMode="tel" placeholder="300 000 0000"
                 value={nuevo.wa} onChange={(e) => setNuevo({ ...nuevo, wa: e.target.value })} />
        </div>
        <p className="q-note">
          Con el WhatsApp guardado, cuando esta persona escriba a Quepa ya sabemos quién es.
        </p>
      </QSheet>
    </div>
  );
}

Object.assign(window, { ScreenClientes, tipoCliente });

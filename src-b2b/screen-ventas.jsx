// Quepa Canchas · Ventas con apertura y cierre de caja diario
// NOTA: el cierre de caja no existe en las HU actuales. Se diseña aquí por primera vez.
const { useState: _vtS, useMemo: _vtM } = React;

const capVentas = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);

function ScreenVentas({ reservas, diaAbierto, onAbrir, onCerrar, cierres }) {
  const [verCierre, setVerCierre] = _vtS(null);
  const [confirmando, setConfirmando] = _vtS(false);

  const hoy = _vtM(() => reservas.filter((r) => r.fecha === 0 && r.estado !== "Cancelada"), [reservas]);
  const pagadas = hoy.filter((r) => r.estado === "Pagó");
  const cumplidas = hoy.filter((r) => r.estado === "Llegó" || r.estado === "Pagó");
  const porCobrar = hoy.filter((r) => r.estado === "Llegó");
  const total = pagadas.reduce((s, r) => s + r.valor, 0);
  const ayer = cierres[0]?.total || 0;
  const delta = ayer ? Math.round(((total - ayer) / ayer) * 100) : 0;

  const porCancha = _vtM(() => EB_CANCHAS.map((c) => ({
    code: c.id, nombre: c.nombre,
    valor: pagadas.filter((r) => r.cancha === c.id).reduce((s, r) => s + r.valor, 0),
  })), [pagadas]);
  const maxCancha = Math.max(1, ...porCancha.map((c) => c.valor));

  // ---------- día sin abrir ----------
  if (!diaAbierto) {
    return (
      <div className="q-wrap">
        <div className="q-full">
          <span className="q-tile-lbl">{ebFechaLarga(0)}</span>
          <h1 className="q-h1">Todavía no has<br />abierto el día.</h1>
          <p className="q-sub" style={{ maxWidth: 520 }}>
            Ábrelo para empezar a registrar lo que se cobra hoy. Las reservas siguen entrando igual.
          </p>
          <button className="q-btn pri lg" style={{ minWidth: 340, marginTop: 12 }} onClick={onAbrir}>
            <Icon name="play" size={28} /> Abrir el día
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="q-wrap">
      <div className="q-head">
        <div style={{ flex: 1 }}>
          <h1 className="q-h1">Ventas</h1>
          <div className="q-sub">{capVentas(ebFechaLarga(0))} · el día está abierto</div>
        </div>
      </div>

      <div className="q-caja">
        <div className="lbl">Vendido hoy</div>
        <div className="total">{fmtCOP(total)}</div>
        <div className="q-caja-grid">
          <div className="q-caja-sub">
            <div className="n">{cumplidas.length}</div>
            <div className="l">reservas cumplidas</div>
          </div>
          <div className="q-caja-sub">
            <div className="n">{pagadas.length}</div>
            <div className="l">reservas pagadas</div>
          </div>
          <div className="q-caja-sub">
            <div className={`n ${porCobrar.length > 0 ? "ojo" : ""}`}>{porCobrar.length}</div>
            <div className="l">pendientes de cobro</div>
          </div>
        </div>
      </div>

      <button className="q-btn pri lg" style={{ width: "100%", marginBottom: 8 }} onClick={() => setConfirmando(true)}>
        Cerrar el día
      </button>

      {porCobrar.length > 0 && (
        <div className="q-sec">
          <h2 className="q-h2" style={{ marginBottom: 16 }}>Canchas por pagar</h2>
          <div className="q-list">
            {porCobrar.map((r) => {
              const c = r.cliente || ebCliente(r.clienteId);
              return (
                <div key={r.id} className="q-li" style={{ cursor: "default" }}>
                  <span className="d">{ebFmtHora(r.hora)}</span>
                  <span className="t">{c?.nombre}</span>
                  <span className="q-note">{ebCancha(r.cancha)?.nombre}</span>
                  <span className="v">{fmtCOP(r.valor)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="q-sec">
        <h2 className="q-h2" style={{ marginBottom: 16 }}>Días anteriores</h2>
        <div className="q-list">
          {cierres.map((c) => (
            <button key={c.fecha} className="q-li" onClick={() => setVerCierre(c)}>
              <span className="d" style={{ textTransform: "capitalize" }}>{ebFechaCorta(c.fecha)}</span>
              <span className="t">{c.reservas} reservas</span>
              <span className="v">{fmtCOP(c.total)}</span>
              <Icon name="chevron-right" size={24} color="#8C8F7E" />
            </button>
          ))}
        </div>
      </div>

      {/* ---------- confirmar cierre ---------- */}
      <QSheet
        open={confirmando}
        onClose={() => setConfirmando(false)}
        titulo="Resumen del día"
        sub={ebFechaLarga(0)}
        footer={
          <React.Fragment>
            <button className="q-btn grow" onClick={() => setConfirmando(false)}>Todavía no</button>
            <button className="q-btn dark grow" onClick={() => { onCerrar({ total, reservas: hoy.length, pagadas: pagadas.length, porCancha }); setConfirmando(false); }}>
              <Icon name="check" size={24} /> Cerrar el día
            </button>
          </React.Fragment>
        }
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div className="q-tile-lbl">Total del día</div>
          <div className="q-mono" style={{ fontSize: "clamp(46px,7vw,84px)", fontWeight: 700, letterSpacing: "-.05em", lineHeight: 1, marginTop: 8 }}>
            {fmtCOP(total)}
          </div>
          {ayer > 0 && (
            <div style={{ marginTop: 14, fontSize: 22, fontWeight: 700, color: delta >= 0 ? "#12833f" : "#B4342F" }}>
              {delta >= 0 ? "↑ Te fue mejor que ayer" : "↓ Te fue peor que ayer"}
              <span className="q-mono q-muted" style={{ fontSize: 18, marginLeft: 10, fontWeight: 600 }}>
                {delta >= 0 ? "+" : ""}{delta}%
              </span>
            </div>
          )}
        </div>

        <div className="q-tile-lbl" style={{ marginBottom: 16 }}>Por cancha</div>
        <div className="q-bars">
          {porCancha.map((c) => (
            <div className="q-bar-r" key={c.code}>
              <span className="n">{c.nombre}</span>
              <span className="tr"><i style={{ width: `${(c.valor / maxCancha) * 100}%` }} /></span>
              <span className="v">{fmtCOP(c.valor)}</span>
            </div>
          ))}
        </div>
      </QSheet>

      {/* ---------- ver un cierre pasado ---------- */}
      <QSheet open={!!verCierre} onClose={() => setVerCierre(null)}
              titulo={verCierre ? ebFechaLarga(verCierre.fecha) : ""}
              sub={verCierre ? `Cerrado por ${verCierre.cerradoPor} a las ${verCierre.hora}` : ""}>
        {verCierre && (
          <React.Fragment>
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <div className="q-tile-lbl">Total</div>
              <div className="q-mono" style={{ fontSize: "clamp(46px,7vw,84px)", fontWeight: 700, letterSpacing: "-.05em", marginTop: 8 }}>
                {fmtCOP(verCierre.total)}
              </div>
            </div>
            <div className="q-stats" style={{ marginBottom: 26 }}>
              <QStat label="Reservas" valor={verCierre.reservas} />
              <QStat label="Pagaron" valor={verCierre.pagadas} />
              <QStat label="No llegaron" valor={verCierre.noLlego} />
            </div>
            <div className="q-tile-lbl" style={{ marginBottom: 16 }}>Por cancha</div>
            <div className="q-bars">
              {verCierre.porCancha.map((c) => {
                const mx = Math.max(...verCierre.porCancha.map((x) => x.valor)) || 1;
                return (
                  <div className="q-bar-r" key={c.code}>
                    <span className="n">{ebCancha(c.code)?.nombre || c.code}</span>
                    <span className="tr"><i style={{ width: `${(c.valor / mx) * 100}%` }} /></span>
                    <span className="v">{fmtCOP(c.valor)}</span>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        )}
      </QSheet>
    </div>
  );
}

Object.assign(window, { ScreenVentas });

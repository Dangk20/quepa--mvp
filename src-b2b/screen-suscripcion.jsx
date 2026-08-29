// Quepa B2B · Mi suscripción
const { useState: _uS_sus } = React;

function ScreenSuscripcion({ estab }) {
  const [openUpgrade, setOpenUpgrade] = _uS_sus(false);

  return (
    <div className="page-pad">
      <div className="page-h">
        <div>
          <div className="eyebrow">Mi suscripción</div>
          <h1>Plan {estab.plan}.</h1>
          <div className="sub">Renueva o mejora cuando quieras. Sin permanencia.</div>
        </div>
      </div>

      {/* Plan actual */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="row between" style={{ marginBottom: 14 }}>
            <div>
              <div className="eyebrow">Plan actual</div>
              <div className="row gap-2" style={{ marginTop: 6 }}>
                <QStar size={18} fill="#0A0A0A" />
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>Quepa {estab.plan}</div>
              </div>
            </div>
            <Badge variant="leaf">● Activa</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
            <div>
              <div className="mono text-xs dim">Próximo cargo</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>{estab.plan === "Free" ? "—" : "01 Junio 2026"}</div>
            </div>
            <div>
              <div className="mono text-xs dim">Mensualidad</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>{estab.plan === "Free" ? "Gratis" : estab.plan === "Pro" ? fmtCOP(89000) : fmtCOP(179000)}</div>
            </div>
            <div>
              <div className="mono text-xs dim">Reservas este mes</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>{estab.plan === "Free" ? "23 / 30" : "Ilimitadas"}</div>
            </div>
          </div>
          <div className="row gap-2" style={{ marginTop: 18 }}>
            <button className="btn primary" onClick={() => setOpenUpgrade(true)}><Icon name="trending-up" size={13} /> Mejorar plan</button>
            <button className="btn">Renovar manualmente</button>
            <button className="btn ghost">Cancelar suscripción</button>
          </div>
        </div>

        <div className="card" style={{ background: "var(--yg)", borderColor: "var(--yg)", padding: 24 }}>
          <div className="mono text-xs" style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>Atribuible a Quepa</div>
          <div style={{ fontSize: 38, fontWeight: 700, marginTop: 8, letterSpacing: "-0.025em" }}>{fmtCOP(8460000)}</div>
          <div style={{ fontSize: 13, color: "var(--ink-70)", marginTop: 6, lineHeight: 1.4 }}>
            Lo que entró por reservas marcadas <em>"no las habría tenido sin Quepa"</em> este mes. Eso es lo que tu suscripción te devuelve.
          </div>
          <div className="row gap-2" style={{ marginTop: 14, color: "var(--ink-70)", fontSize: 12 }}>
            <Icon name="trending-up" size={12} /> 95× tu suscripción de Pro
          </div>
        </div>
      </div>

      {/* Comparativo de planes */}
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 14px" }}>Comparar planes</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 30 }}>
        {PLANES.map((p) => {
          const isCurrent = (p.id === "free" && estab.plan === "Free") || (p.id === "pro" && estab.plan === "Pro") || (p.id === "connection" && estab.plan === "Connection");
          const dark = p.color === "night";
          const yg = p.color === "yg";
          return (
            <div
              key={p.id}
              style={{
                padding: 24, borderRadius: 16,
                background: dark ? "var(--night)" : yg ? "var(--yg)" : "#fff",
                color: dark ? "#fff" : "var(--ink)",
                border: `1px solid ${isCurrent ? "var(--night)" : "var(--line)"}`,
                position: "relative",
              }}
            >
              {p.destacado && <div className="mono" style={{ position: "absolute", top: -10, left: 24, background: "var(--yg)", color: "var(--night)", padding: "3px 10px", borderRadius: 999, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Más popular</div>}
              <div className="row gap-2">
                <QStar size={16} fill={dark ? "#D4F542" : "#0A0A0A"} />
                <div style={{ fontSize: 18, fontWeight: 700 }}>{p.nombre}</div>
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, marginTop: 8, letterSpacing: "-0.03em" }}>
                {p.precio === 0 ? "Gratis" : fmtCOP(p.precio)}
                {p.precio > 0 && <span style={{ fontSize: 13, fontWeight: 500, color: dark ? "rgba(255,255,255,.5)" : "var(--ink-50)" }}>/mes</span>}
              </div>
              <ul style={{ marginTop: 16, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {p.incluye.map((it, i) => (
                  <li key={i} className="row gap-2" style={{ fontSize: 13 }}>
                    <Icon name="check" size={14} color={dark ? "#D4F542" : "#1a8c45"} />
                    {it}
                  </li>
                ))}
                {p.excluye.map((it, i) => (
                  <li key={i} className="row gap-2" style={{ fontSize: 13, opacity: 0.5, textDecoration: "line-through" }}>
                    <Icon name="x" size={14} />
                    {it}
                  </li>
                ))}
              </ul>
              <button
                className="btn"
                disabled={isCurrent}
                style={{
                  width: "100%", justifyContent: "center", marginTop: 18,
                  background: isCurrent ? "transparent" : (dark ? "var(--yg)" : "var(--night)"),
                  color: isCurrent ? (dark ? "rgba(255,255,255,.6)" : "var(--ink-60)") : (dark ? "var(--night)" : "#fff"),
                  borderColor: "transparent",
                }}
              >
                {isCurrent ? "Tu plan actual" : `Mejorar a ${p.nombre.replace("Quepa ", "")}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Historial */}
      <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 12px" }}>Historial de pagos</h2>
      <div className="card" style={{ padding: 0 }}>
        <table className="tbl">
          <thead><tr><th>Fecha</th><th>Concepto</th><th>Estado</th><th>Valor</th><th></th></tr></thead>
          <tbody>
            {PAGOS.map((p) => (
              <tr key={p.id}>
                <td className="mono text-sm">{p.fecha}</td>
                <td>{p.concepto}</td>
                <td><Badge variant="leaf">● {p.estado}</Badge></td>
                <td className="mono" style={{ fontWeight: 700 }}>{fmtCOP(p.valor)}</td>
                <td className="row-action"><button className="btn ghost sm">Descargar <Icon name="external" size={12} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={openUpgrade}
        onClose={() => setOpenUpgrade(false)}
        title="Mejorar a Quepa Pro"
        footer={<React.Fragment>
          <button className="btn ghost" onClick={() => setOpenUpgrade(false)}>Cancelar</button>
          <button className="btn primary"><Icon name="credit-card" size={13} /> Pagar con Wompi · {fmtCOP(89000)}</button>
        </React.Fragment>}
      >
        <div className="text-sm" style={{ marginBottom: 14 }}>El cargo se hace por la pasarela que tienes configurada. Sin permanencia. Cancelas cuando quieras.</div>
        <div className="card" style={{ padding: 16, background: "var(--paper)", borderColor: "transparent" }}>
          <div className="row between"><span>Quepa Pro · 1 mes</span><span className="mono">{fmtCOP(89000)}</span></div>
          <div className="row between" style={{ marginTop: 6 }}><span className="dim">IVA (19%)</span><span className="mono dim">{fmtCOP(89000 * 0.19)}</span></div>
          <div className="row between" style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--line)", fontWeight: 700 }}><span>Total a pagar</span><span className="mono">{fmtCOP(89000 * 1.19)}</span></div>
        </div>
      </Modal>
    </div>
  );
}

Object.assign(window, { ScreenSuscripcion });

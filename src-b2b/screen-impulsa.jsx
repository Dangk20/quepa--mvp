// Quepa B2B · Impulsa tu negocio (publicidad por tiempo limitado)
const { useState: _uS_imp } = React;

function ScreenImpulsa({ estab }) {
  const [openNew, setOpenNew] = _uS_imp(false);

  return (
    <div className="page-pad">
      <div className="page-h">
        <div>
          <div className="eyebrow">Impulsa tu negocio</div>
          <h1>Promociones por tiempo limitado.</h1>
          <div className="sub">
            Configura un evento o producto a destacar dentro de Quepa. <strong>Aparece etiquetado como "Destacado"</strong> — nunca se confunde con la recomendación curada por mérito.
          </div>
        </div>
        <button className="btn primary" onClick={() => setOpenNew(true)}><Icon name="plus" size={13} /> Nueva campaña</button>
      </div>

      {/* Banner explicativo */}
      <div style={{ background: "var(--night)", color: "#fff", borderRadius: 14, padding: 22, marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        <div>
          <div className="row gap-2 mono" style={{ color: "var(--yg)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>
            <Icon name="rocket" size={12} /> Cómo funciona
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>Tú configuras. Pagas. Aparece.</div>
          <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
            Eliges qué destacar, las fechas, el foco. Pagas por la pasarela que ya configuraste.
          </div>
        </div>
        <div>
          <div className="row gap-2 mono" style={{ color: "var(--yg)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>
            <QStar size={11} fill="#D4F542" /> Etiqueta clara
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>Marca "Destacado".</div>
          <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
            Tus campañas aparecen con un sello visible. La recomendación curada de Quepa sigue siendo independiente.
          </div>
        </div>
        <div>
          <div className="row gap-2 mono" style={{ color: "var(--yg)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>
            <Icon name="trending-up" size={12} /> Mides
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>Alcance y reservas.</div>
          <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
            Cuántas personas la vieron en el chat. Cuántas terminaron reservando contigo.
          </div>
        </div>
      </div>

      {/* Campañas */}
      <div className="row between" style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Tus campañas</h2>
        <div className="seg">
          <button className="on">Todas</button><button>Activas</button><button>Borrador</button><button>Finalizadas</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {CAMPANAS.map((c) => (
          <CampanaCard key={c.id} campana={c} />
        ))}
        <button
          onClick={() => setOpenNew(true)}
          className="card"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 8,
            border: "1.5px dashed var(--ink-12)", minHeight: 220,
            background: "transparent", cursor: "pointer", color: "var(--ink-50)",
          }}
        >
          <Icon name="plus" size={28} />
          <div style={{ fontSize: 13, fontWeight: 600 }}>Crear campaña</div>
        </button>
      </div>

      <Modal
        open={openNew}
        onClose={() => setOpenNew(false)}
        title="Nueva campaña Impulsa"
        footer={<React.Fragment>
          <button className="btn ghost" onClick={() => setOpenNew(false)}>Guardar como borrador</button>
          <button className="btn primary"><Icon name="credit-card" size={13} /> Pagar y activar</button>
        </React.Fragment>}
      >
        <div className="col gap-3">
          <div className="field"><label>¿Qué quieres impulsar?</label><input className="input" placeholder="Ej. Cena temática Bandeja Paisa de autor" /></div>
          <div className="field"><label>Foco</label>
            <div className="seg" style={{ marginTop: 4 }}>
              <button className="on">El negocio entero</button><button>Un servicio/producto</button><button>Un evento puntual</button>
            </div>
          </div>
          <div className="field"><label>Descripción corta (la verá la gente en el chat)</label>
            <textarea className="textarea" placeholder='Ej. "Esta semana viene el chef invitado de Cartagena. Reserva con código BANDEJA10."' />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div className="field"><label>Desde</label><input className="input" type="date" /></div>
            <div className="field"><label>Hasta</label><input className="input" type="date" /></div>
            <div className="field"><label>Inversión (COP)</label><input className="input mono" defaultValue="240.000" /></div>
          </div>
          <div style={{ background: "var(--paper)", padding: 12, borderRadius: 10 }} className="text-sm">
            <strong>Alcance estimado:</strong> 1.800–2.400 personas en Pereira y Neiva durante la vigencia.
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CampanaCard({ campana: c }) {
  const tone = c.estado === "activa" ? "leaf" : c.estado === "borrador" ? "default" : "amber";
  const dias = c.estado === "activa" ? `${c.fin - c.inicio}d activa` : c.estado === "borrador" ? "Borrador" : "Finalizada";
  const fmtDay = (d) => {
    const x = new Date(_today); x.setDate(_today.getDate() + d);
    return x.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
  };
  return (
    <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="row between">
        <span className={`badge ${tone}`}>{c.estado === "activa" ? "● Activa" : c.estado === "borrador" ? "Borrador" : "Finalizada"}</span>
        <button className="btn icon ghost sm"><Icon name="more" size={14} /></button>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.2 }}>{c.titulo}</div>
      <div className="mono text-xs dim">{c.foco} · {fmtDay(c.inicio)} → {fmtDay(c.fin)}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, paddingTop: 12, borderTop: "1px solid var(--line)", marginTop: 4 }}>
        <div>
          <div className="mono text-xs dim">Inversión</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{c.inversion ? fmtCOP(c.inversion) : "—"}</div>
        </div>
        <div>
          <div className="mono text-xs dim">Alcance</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{c.alcance ? c.alcance.toLocaleString("es-CO") : "—"}</div>
        </div>
        <div>
          <div className="mono text-xs dim">Reservas</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{c.reservas || "—"}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenImpulsa });

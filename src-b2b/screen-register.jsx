// Quepa B2B · Registro de establecimiento
const { useState: _uS_reg } = React;

const CATEGORIAS = [
  { id: "mesas",        label: "Restaurante / Bar",        icon: "store",      vertical: "mesas" },
  { id: "habitaciones", label: "Hotel / Hostal",            icon: "bed",        vertical: "habitaciones" },
  { id: "canchas",      label: "Canchas / Espacios por hora", icon: "court",   vertical: "canchas" },
  { id: "agenda",       label: "Servicios / Citas",          icon: "stethoscope",vertical: "agenda" },
  { id: "tour",         label: "Experiencia / Tour",         icon: "rocket",   vertical: "agenda" },
];

function ScreenRegister({ onBack, onDone }) {
  const [cat, setCat] = _uS_reg("mesas");
  const [step, setStep] = _uS_reg(0);
  const [data, setData] = _uS_reg({
    nombre: "", ciudad: "Pereira", direccion: "", responsable: "",
    whatsapp: "+57 ", correo: "", pwd: "", maps: "", terminos: false,
  });
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <div className="row gap-3" style={{ position: "relative", zIndex: 1 }}>
          <QStar size={36} fill="#D4F542" />
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.035em", color: "#fff" }}>Quepa</div>
            <div className="mono" style={{ fontSize: 10, color: "#D4F542", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>Plan Free · gratis</div>
          </div>
        </div>

        <div className="glow" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.5)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 18 }}>Bienvenida al parche</div>
          <div className="quote">
            "Que la gente<br/>te encuentre<br/><em>por boca a boca digital.</em>"
          </div>
          <ul style={{ color: "rgba(255,255,255,.7)", fontSize: 13.5, lineHeight: 1.7, marginTop: 24, paddingLeft: 18 }}>
            <li>Recibe reservas por WhatsApp, sin app aparte.</li>
            <li>Quepa no cobra comisión — el dinero entra a tu cuenta.</li>
            <li>Cliente ideal: entérate de por qué te eligen.</li>
            <li>30 reservas/mes gratis. Empieza ya, escala después.</li>
          </ul>
        </div>

        <button onClick={onBack} className="row gap-2" style={{ color: "rgba(255,255,255,.6)", fontSize: 12, position: "relative", zIndex: 1 }}>
          <Icon name="chevron-left" size={14} /> Volver a entrar
        </button>
      </div>

      <div className="auth-content" style={{ padding: 40, overflowY: "auto" }}>
        <div className="auth-card" style={{ maxWidth: 520 }}>
          <div className="row between" style={{ marginBottom: 6 }}>
            <div className="eyebrow">Registro de negocio · paso {step + 1} de 2</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-30)" }}>{step === 0 ? "Categoría" : "Datos"}</div>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em", margin: "4px 0 22px" }}>
            {step === 0 ? "¿Qué tipo de negocio tienes?" : "Cuéntanos un poco de ti."}
          </h1>

          {step === 0 && (
            <React.Fragment>
              <div className="col gap-3" style={{ marginBottom: 22 }}>
                {CATEGORIAS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCat(c.id)}
                    className="row gap-3"
                    style={{
                      padding: "14px 16px",
                      border: `1.5px solid ${cat === c.id ? "var(--night)" : "var(--line)"}`,
                      background: cat === c.id ? "var(--paper)" : "#fff",
                      borderRadius: 12,
                      textAlign: "left",
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: cat === c.id ? "var(--night)" : "var(--paper)",
                      color: cat === c.id ? "var(--yg)" : "var(--ink)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon name={c.icon} size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>{c.label}</div>
                      <div className="muted text-xs" style={{ marginTop: 2 }}>
                        {c.id === "mesas" && "Plano de mesas, agenda del día, comensales."}
                        {c.id === "habitaciones" && "Timeline tipo Gantt, tarifa por noche."}
                        {c.id === "canchas" && "Rejilla de espacios, slots por hora."}
                        {c.id === "agenda" && "Agenda por profesional, citas y servicios."}
                        {c.id === "tour" && "Cupos por experiencia, listas de participantes."}
                      </div>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: 999,
                      border: `2px solid ${cat === c.id ? "var(--night)" : "var(--ink-12)"}`,
                      background: cat === c.id ? "var(--night)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {cat === c.id && <Icon name="check" size={12} stroke="#D4F542" />}
                    </div>
                  </button>
                ))}
              </div>

              <button className="btn primary" onClick={() => setStep(1)} style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
                Continuar <Icon name="chevron-right" size={14} />
              </button>
            </React.Fragment>
          )}

          {step === 1 && (
            <React.Fragment>
              <div className="col gap-4">
                <div className="field">
                  <label>Nombre del negocio</label>
                  <input className="input" value={data.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Ej. Sazón del Río" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="field">
                    <label>Ciudad</label>
                    <select className="select" value={data.ciudad} onChange={(e) => set("ciudad", e.target.value)}>
                      <option>Pereira</option><option>Neiva</option>
                    </select>
                    <span className="hint">Solo Pereira y Neiva durante el piloto.</span>
                  </div>
                  <div className="field">
                    <label>Dirección</label>
                    <input className="input" value={data.direccion} onChange={(e) => set("direccion", e.target.value)} placeholder="Cra 5 # 22-08" />
                  </div>
                </div>
                <div className="field">
                  <label>Responsable</label>
                  <input className="input" value={data.responsable} onChange={(e) => set("responsable", e.target.value)} placeholder="Quién opera el panel" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="field">
                    <label>WhatsApp del negocio</label>
                    <input className="input" value={data.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+57 3xx xxx xxxx" />
                  </div>
                  <div className="field">
                    <label>Correo</label>
                    <input className="input" type="email" value={data.correo} onChange={(e) => set("correo", e.target.value)} placeholder="hola@minegocio.co" />
                  </div>
                </div>
                <div className="field">
                  <label>Contraseña</label>
                  <input className="input" type="password" value={data.pwd} onChange={(e) => set("pwd", e.target.value)} placeholder="Mínimo 8 caracteres" />
                </div>
                <div className="field">
                  <label>Link de Google Maps <span className="dim text-xs">(opcional)</span></label>
                  <input className="input" value={data.maps} onChange={(e) => set("maps", e.target.value)} placeholder="https://maps.app.goo.gl/..." />
                </div>
                <label className="checkbox" style={{ marginTop: 4 }}>
                  <input type="checkbox" checked={data.terminos} onChange={(e) => set("terminos", e.target.checked)} />
                  <span>Acepto los términos de Quepa y la política de tratamiento de datos (Ley 1581/2012, Col).</span>
                </label>
              </div>

              <div className="row gap-3" style={{ marginTop: 22 }}>
                <button className="btn" onClick={() => setStep(0)} style={{ flex: 1, justifyContent: "center" }}>
                  <Icon name="chevron-left" size={14} /> Atrás
                </button>
                <button className="btn primary" disabled={!data.terminos} onClick={onDone} style={{ flex: 2, justifyContent: "center" }}>
                  Crear negocio · Quepa Free <Icon name="check" size={14} />
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenRegister });

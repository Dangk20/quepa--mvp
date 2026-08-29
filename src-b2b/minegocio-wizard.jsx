// Quepa B2B · Mi Negocio — Wizard de onboarding (4 pasos)
const { useState: _uS_wiz } = React;

function initialData(estab) {
  return {
    nombre: estab?.nuevo ? "" : (estab?.name || ""),
    descripcionCorta: "",
    portada: null,
    atributos: { vista: [], ambiente: [], clima: [], mascotas: [], dieta: [], reglas: [] },
    precio: "$$",
    vertical: estab?.vertical || "mesas",
    recursos: [],
    horarios: DIAS.reduce((acc, d) => {
      acc[d] = { abierto: d !== "Dom", franjas: d !== "Dom" ? [{ de: "09:00", a: "18:00" }] : [] };
      return acc;
    }, {}),
  };
}

function OnboardingWizard({ open, onClose, onDone, estab }) {
  const [step, setStep] = _uS_wiz(0);
  const [data, setData] = _uS_wiz(() => initialData(estab));

  // Reset al abrir (asegura step 0 + datos del establecimiento activo)
  React.useEffect(() => {
    if (open) {
      setStep(0);
      setData(initialData(estab));
    }
  }, [open, estab?.id]); // eslint-disable-line

  if (!open) return null;

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const setAttr = (g, opts) => setData((d) => ({ ...d, atributos: { ...d.atributos, [g]: opts } }));

  const steps = [
    { title: "Perfil básico", icon: "store" },
    { title: "Recursos",      icon: "grid" },
    { title: "Horarios",      icon: "clock" },
    { title: "Vista previa",  icon: "whatsapp" },
  ];

  return (
    <div className="modal-backdrop" style={{ alignItems: "stretch", padding: 0 }}>
      <div style={{
        background: "var(--paper)",
        width: "100%", maxWidth: 920,
        margin: "auto",
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        maxHeight: "92vh",
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
      }}>
        {/* Header */}
        <div style={{
          background: "var(--night)", color: "#fff",
          padding: "18px 24px",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <QStar size={24} fill="#D4F542" />
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--yg)", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>
              Setup inicial · paso {step + 1} de {steps.length}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.015em", marginTop: 2 }}>{steps[step].title}</div>
          </div>
          <button className="btn icon ghost" onClick={onClose} style={{ color: "#fff" }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", padding: "0 24px", background: "var(--night)", paddingBottom: 14 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 999,
                background: i <= step ? "var(--yg)" : "rgba(255,255,255,.1)",
                color: i <= step ? "var(--ink)" : "rgba(255,255,255,.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)",
                flexShrink: 0,
              }}>
                {i < step ? <Icon name="check" size={12} /> : i + 1}
              </div>
              <div className="mono" style={{
                fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                color: i === step ? "#fff" : "rgba(255,255,255,.5)",
                fontWeight: 600,
              }}>{s.title}</div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < step ? "var(--yg)" : "rgba(255,255,255,.1)", marginLeft: 4 }} />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "26px 32px" }}>
          {step === 0 && <Step1Perfil data={data} set={set} setAttr={setAttr} />}
          {step === 1 && <Step2Recursos data={data} set={set} />}
          {step === 2 && <Step3Horarios data={data} set={set} />}
          {step === 3 && <Step4Preview data={data} />}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 24px",
          background: "#fff",
          borderTop: "1px solid var(--line)",
          display: "flex", gap: 10,
        }}>
          <button className="btn ghost" onClick={onClose}>Salir y completar después</button>
          <div style={{ flex: 1 }} />
          {step > 0 && (
            <button className="btn" onClick={() => setStep((s) => s - 1)}>
              <Icon name="chevron-left" size={13} /> Atrás
            </button>
          )}
          {step < steps.length - 1 ? (
            <button className="btn primary" onClick={() => setStep((s) => s + 1)}>
              Siguiente <Icon name="chevron-right" size={13} />
            </button>
          ) : (
            <button className="btn accent" onClick={() => { onDone?.(data); onClose(); }}>
              <Icon name="check" size={13} /> Listo · activar mi negocio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Paso 1 · Perfil básico
// ============================================================
function Step1Perfil({ data, set, setAttr }) {
  const verticalLabels = {
    mesas: "Restaurante / Bar",
    habitaciones: "Hotel / Hostal",
    canchas: "Canchas / Espacios por hora",
    agenda: "Servicios / Citas",
  };
  return (
    <div className="col gap-4">
      <div>
        <div className="mono text-xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-50)", marginBottom: 4 }}>1.1 · Identidad</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>Empecemos por lo básico.</h2>
        <p className="muted text-sm" style={{ marginTop: 4 }}>Tu nombre, descripción y una foto. Quepa usa esto para empezar a recomendarte.</p>
      </div>

      <div className="card" style={{ padding: 20, background: "#fff" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 18 }}>
          <PhotoSlot src={data.portada} label="Portada" big />
          <div className="col gap-3">
            <div className="field">
              <label>Nombre del negocio *</label>
              <input className="input" value={data.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Ej. Sazón del Río" />
            </div>
            <div className="field">
              <label>Tipo de negocio</label>
              <div className="seg">
                {Object.entries(verticalLabels).map(([k, l]) => (
                  <button key={k} className={data.vertical === k ? "on" : ""} onClick={() => set("vertical", k)}>{l}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Descripción corta *</label>
              <input className="input" value={data.descripcionCorta} onChange={(e) => set("descripcionCorta", e.target.value)} placeholder="Una línea — la que va a leer la gente en WhatsApp" />
              <span className="hint">{data.descripcionCorta.length} / 90 caracteres</span>
            </div>
            <div className="field">
              <label>Rango de precio</label>
              <div className="row gap-2">
                {["$", "$$", "$$$", "$$$$"].map((p) => (
                  <button
                    key={p}
                    onClick={() => set("precio", p)}
                    className={`mn-price sm ${data.precio === p ? "on" : ""}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, background: "#fff" }}>
        <div className="mono text-xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-50)", marginBottom: 4 }}>1.2 · Cómo te describes</div>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Atributos esenciales</h3>
        <p className="muted text-sm" style={{ marginBottom: 16 }}>Marca lo que aplica. Podemos agregar más en Mi Negocio luego.</p>
        <div className="col gap-3">
          {ATTR_GROUPS.filter((g) => ["ambiente", "vista", "mascotas", "dieta"].includes(g.key)).map((grp) => (
            <AttrGroupRow key={grp.key} group={grp} selected={data.atributos[grp.key] || []} onChange={(opts) => setAttr(grp.key, opts)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Paso 2 · Recursos (alta inicial)
// ============================================================
function Step2Recursos({ data, set }) {
  const labels = {
    mesas: { singular: "mesa", plural: "mesas", icon: "store" },
    habitaciones: { singular: "habitación", plural: "habitaciones", icon: "bed" },
    canchas: { singular: "cancha", plural: "canchas", icon: "court" },
    agenda: { singular: "profesional", plural: "profesionales", icon: "stethoscope" },
  };
  const lbl = labels[data.vertical] || labels.mesas;

  const addRecurso = () => {
    set("recursos", [...data.recursos, { id: Date.now(), nombre: "", pax: 4 }]);
  };
  const updateRecurso = (id, field, val) => {
    set("recursos", data.recursos.map((r) => r.id === id ? { ...r, [field]: val } : r));
  };
  const removeRecurso = (id) => {
    set("recursos", data.recursos.filter((r) => r.id !== id));
  };

  // Default a 3 recursos vacíos si no hay ninguno
  React.useEffect(() => {
    if (data.recursos.length === 0) {
      const defaults = data.vertical === "mesas" ? 4
                     : data.vertical === "habitaciones" ? 3
                     : data.vertical === "canchas" ? 2
                     : 1;
      set("recursos", Array.from({ length: defaults }, (_, i) => ({
        id: Date.now() + i,
        nombre: data.vertical === "mesas"        ? `T${i + 1}`
              : data.vertical === "habitaciones" ? `${101 + i}`
              : data.vertical === "canchas"      ? `C${i + 1}`
              : "",
        pax: data.vertical === "mesas" ? 4 : data.vertical === "habitaciones" ? 2 : 6,
      })));
    }
  }, [data.vertical]); // eslint-disable-line

  return (
    <div className="col gap-4">
      <div>
        <div className="mono text-xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-50)", marginBottom: 4 }}>2 · Recursos</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>Ahora carga tus {lbl.plural}.</h2>
        <p className="muted text-sm" style={{ marginTop: 4 }}>Lo que Quepa va a poder reservarle a tus clientes. Mínimo {lbl.plural === "canchas" ? "una" : "tres"}.</p>
      </div>

      <div className="card" style={{ padding: 20, background: "#fff" }}>
        <div className="col gap-2">
          {data.recursos.map((r, i) => (
            <div key={r.id} className="row gap-3" style={{
              background: "var(--paper)", padding: "10px 12px", borderRadius: 10,
            }}>
              <div className="mono" style={{ width: 36, fontSize: 11, color: "var(--ink-50)" }}>#{i + 1}</div>
              <input
                className="input"
                value={r.nombre}
                onChange={(e) => updateRecurso(r.id, "nombre", e.target.value)}
                placeholder={data.vertical === "mesas" ? "T1, T2..." : data.vertical === "habitaciones" ? "101, 102..." : data.vertical === "canchas" ? "C1, Fútbol 5 A..." : "Dra. Marín"}
                style={{ flex: 1 }}
              />
              {data.vertical !== "agenda" && (
                <select
                  className="select"
                  style={{ width: 130 }}
                  value={r.pax}
                  onChange={(e) => updateRecurso(r.id, "pax", parseInt(e.target.value))}
                >
                  {data.vertical === "mesas" && [2, 4, 6, 8].map((n) => <option key={n} value={n}>{n} personas</option>)}
                  {data.vertical === "habitaciones" && [["Estándar", 2], ["Doble", 4], ["Suite", 4], ["Dormitorio", 8]].map(([t, c]) => <option key={t} value={c}>{t}</option>)}
                  {data.vertical === "canchas" && ["Fútbol 5", "Pádel", "Multipropósito"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
              <button className="btn icon ghost" onClick={() => removeRecurso(r.id)}>
                <Icon name="x" size={14} />
              </button>
            </div>
          ))}
        </div>
        <button className="btn sm" onClick={addRecurso} style={{ marginTop: 14 }}>
          <Icon name="plus" size={13} /> Agregar {lbl.singular}
        </button>

        <div className="mono text-xs dim" style={{ marginTop: 16, padding: "10px 12px", background: "var(--paper)", borderRadius: 8 }}>
          <Icon name="alert" size={11} style={{ marginRight: 6, verticalAlign: -1 }} />
          Puedes editar atributos, fotos y tarifas después en Mi Negocio &gt; Recursos.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Paso 3 · Horarios
// ============================================================
function Step3Horarios({ data, set }) {
  return (
    <div className="col gap-4">
      <div>
        <div className="mono text-xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-50)", marginBottom: 4 }}>3 · Horarios</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>¿Cuándo abres?</h2>
        <p className="muted text-sm" style={{ marginTop: 4 }}>Quepa solo te recomienda cuando estás abierto.</p>
      </div>

      <div className="card" style={{ padding: 20, background: "#fff" }}>
        <HorariosEditor horarios={data.horarios} onChange={(h) => set("horarios", h)} />
      </div>

      <div className="row gap-2" style={{ background: "var(--paper)", padding: 12, borderRadius: 10 }}>
        <Icon name="alert" size={16} color="#C98A2E" style={{ flexShrink: 0, marginTop: 1 }} />
        <div className="text-sm" style={{ color: "var(--ink-70)" }}>
          ¿Cierras por temporada o festivos? Eso se gestiona en Mi Negocio &gt; Perfil &gt; Cierres programados.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Paso 4 · Preview de cómo te recomendará Quepa
// ============================================================
function Step4Preview({ data }) {
  const attrs = Object.values(data.atributos).flat().slice(0, 4);
  const verticalAction = {
    mesas: "reservarte una mesa",
    habitaciones: "reservarte una noche",
    canchas: "reservarte una cancha",
    agenda: "agendarte una cita",
  }[data.vertical] || "reservarte";

  const verticalCount = {
    mesas: `${data.recursos.length} mesas`,
    habitaciones: `${data.recursos.length} habitaciones`,
    canchas: `${data.recursos.length} canchas`,
    agenda: `${data.recursos.length} profesionales`,
  }[data.vertical];

  return (
    <div className="col gap-4">
      <div>
        <div className="mono text-xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-50)", marginBottom: 4 }}>4 · Vista previa</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>Así te va a recomendar Quepa.</h2>
        <p className="muted text-sm" style={{ marginTop: 4 }}>Cuando alguien le pida un parche a Quepa por WhatsApp y tu negocio matchee, esto es lo que verá.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* WhatsApp mock */}
        <div style={{
          background: "#efeae2",
          borderRadius: 18,
          padding: 16,
          backgroundImage: "radial-gradient(circle at 15% 25%, rgba(0,0,0,.04) 0 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(0,0,0,.04) 0 1px, transparent 1px)",
          backgroundSize: "22px 22px, 30px 30px",
        }}>
          <div className="mono text-xs" style={{ color: "var(--ink-50)", marginBottom: 10, letterSpacing: "0.08em" }}>WhatsApp · chat con Quepa</div>

          {/* Mensaje cliente */}
          <div style={{ marginBottom: 10, textAlign: "right" }}>
            <div style={{
              display: "inline-block",
              background: "#DCF8C6",
              borderRadius: "14px 14px 4px 14px",
              padding: "8px 12px",
              fontSize: 13,
              maxWidth: "85%",
              textAlign: "left",
            }}>
              ¡Que parche! Estoy buscando algo {attrs[0] || "rico"} para hoy
            </div>
          </div>

          {/* Mensaje Quepa */}
          <div>
            <div style={{
              display: "inline-block",
              background: "#fff",
              borderRadius: "14px 14px 14px 4px",
              padding: 12,
              maxWidth: "92%",
              boxShadow: "0 1px 1px rgba(0,0,0,.13)",
            }}>
              <div className="row gap-2" style={{ marginBottom: 6, color: "#128C46", fontSize: 11, fontWeight: 700 }}>
                <QStar size={12} fill="#128C46" /> Quepa · Te tira el parche
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.4, marginBottom: 8 }}>
                Te tengo uno bueno 👇
              </div>
              {/* Card preview */}
              <div style={{
                background: "var(--paper)",
                borderRadius: 12,
                padding: 10,
                marginTop: 4,
              }}>
                <div style={{
                  height: 100,
                  background: data.portada ? `url(${data.portada}) center/cover` : "var(--line)",
                  borderRadius: 8,
                  marginBottom: 8,
                  position: "relative",
                }}>
                  {!data.portada && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-30)", fontSize: 11 }}>
                      sin foto aún
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.15 }}>{data.nombre || "Tu negocio"}</div>
                <div className="text-xs" style={{ color: "var(--ink-60)", marginTop: 3 }}>{data.descripcionCorta || "Sin descripción aún — agrégala en el paso anterior"}</div>
                <div className="row gap-2 text-xs" style={{ marginTop: 6, color: "var(--ink-50)" }}>
                  <span>{data.precio}</span>
                  <span>·</span>
                  <span>{verticalCount}</span>
                </div>
                <div className="row gap-2" style={{ flexWrap: "wrap", marginTop: 8 }}>
                  {attrs.map((a, i) => (
                    <span key={i} style={{
                      background: "var(--yg)", color: "var(--night)",
                      borderRadius: 999, padding: "2px 8px",
                      fontSize: 10, fontWeight: 600,
                    }}>{a}</span>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.4, marginTop: 10 }}>
                ¿Te {verticalAction}? Decime cuántos y para cuándo.
              </div>
              <div className="mono" style={{ fontSize: 9, color: "rgba(0,0,0,.4)", textAlign: "right", marginTop: 4 }}>10:42 AM</div>
            </div>
          </div>
        </div>

        {/* Checklist final */}
        <div className="card" style={{ padding: 20, background: "#fff", alignSelf: "start" }}>
          <div className="mono text-xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-50)", marginBottom: 10 }}>Resumen</div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            <CheckItem ok={!!data.nombre} text={`Nombre: ${data.nombre || "—"}`} />
            <CheckItem ok={!!data.descripcionCorta} text={`Descripción corta`} />
            <CheckItem ok={!!data.portada} text={`Foto de portada`} sub={data.portada ? "" : "Falta — agrégala desde el paso 1"} />
            <CheckItem ok={data.recursos.length > 0} text={`${data.recursos.length} recursos cargados`} />
            <CheckItem ok={Object.values(data.atributos).some((a) => a.length > 0)} text={`Atributos marcados`} />
            <CheckItem ok={Object.values(data.horarios).some((d) => d.abierto)} text={`Horarios configurados`} />
          </ul>

          <div style={{ marginTop: 16, padding: 12, background: "var(--yg)", borderRadius: 10 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>¿Qué pasa al terminar?</div>
            <div className="text-sm" style={{ color: "var(--ink)", lineHeight: 1.4 }}>
              Tu negocio queda <strong>activo en Quepa</strong>. Empezamos a recomendarte hoy mismo. Las reservas caen automáticamente en tu panel.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ ok, text, sub }) {
  return (
    <li className="row gap-2" style={{ alignItems: "flex-start" }}>
      <div style={{
        width: 18, height: 18, borderRadius: 999,
        background: ok ? "var(--yg)" : "var(--paper)",
        border: ok ? "0" : "1.5px dashed var(--ink-30)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 1,
      }}>
        {ok && <Icon name="check" size={11} color="#0A0A0A" />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: ok ? "var(--ink)" : "var(--ink-50)", fontWeight: ok ? 600 : 500 }}>{text}</div>
        {sub && <div className="text-xs dim" style={{ marginTop: 2 }}>{sub}</div>}
      </div>
    </li>
  );
}

Object.assign(window, { OnboardingWizard });

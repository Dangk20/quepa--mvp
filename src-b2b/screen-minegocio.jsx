// Quepa B2B · Mi Negocio (perfil enriquecido + recursos)
const { useState: _uS_mn, useMemo: _uM_mn } = React;

function ScreenMiNegocio({ estab, onLaunchWizard }) {
  const [tab, setTab] = _uS_mn("perfil");
  const data = MI_NEGOCIO[estab.id] || MI_NEGOCIO.nuevo;
  const isEmpty = data.salud.completo === 0;

  return (
    <div className="page-pad">
      <div className="page-h">
        <div>
          <div className="eyebrow">Mi negocio · base de conocimiento</div>
          <h1>Tu negocio en Quepa.</h1>
          <div className="sub">
            Define qué tienes y quién eres. Esto es lo que Quepa usa para recomendarte por WhatsApp.
          </div>
        </div>
        <SaludPerfil salud={data.salud} onLaunchWizard={onLaunchWizard} />
      </div>

      {isEmpty ? (
        <EmptyStateMN onLaunchWizard={onLaunchWizard} />
      ) : (
        <React.Fragment>
          <div className="row between" style={{ marginBottom: 18 }}>
            <div className="seg">
              <button className={tab === "perfil" ? "on" : ""} onClick={() => setTab("perfil")}>
                <Icon name="store" size={13} /> Perfil del negocio
              </button>
              <button className={tab === "recursos" ? "on" : ""} onClick={() => setTab("recursos")}>
                <Icon name="grid" size={13} /> Recursos
                <span className="mono" style={{ opacity: .6, fontSize: 10, marginLeft: 4 }}>
                  {countRecursos(estab)}
                </span>
              </button>
            </div>
            <div className="row gap-2">
              <button className="btn ghost sm" onClick={onLaunchWizard}>
                <Icon name="play" size={13} /> Repetir wizard
              </button>
              <button className="btn ghost sm"><Icon name="eye" size={13} /> Vista previa Quepa</button>
            </div>
          </div>

          {tab === "perfil"   && <TabPerfil data={data} estab={estab} />}
          {tab === "recursos" && <TabRecursos data={data} estab={estab} />}
        </React.Fragment>
      )}
    </div>
  );
}

function countRecursos(estab) {
  return {
    mesas: MESAS_LAYOUT.length,
    habitaciones: HABS_LAYOUT.length,
    canchas: CANCHAS_LAYOUT.length,
    agenda: PROFESIONALES.length + BOXES.length + SERVICIOS_SONRISA.length,
  }[estab.vertical] || 0;
}

// ============================================================
// Salud del perfil — badge con barra y mini-checklist
// ============================================================
function SaludPerfil({ salud, onLaunchWizard }) {
  const isComplete = salud.completo === 100;
  return (
    <div className="card" style={{
      padding: 16, minWidth: 320, maxWidth: 380,
      background: isComplete ? "var(--yg)" : "#fff",
      borderColor: isComplete ? "var(--yg)" : "var(--line)",
    }}>
      <div className="row between" style={{ marginBottom: 8 }}>
        <div className="row gap-2 mono" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: isComplete ? "var(--ink)" : "var(--ink-60)", fontWeight: 600 }}>
          <QStar size={11} fill={isComplete ? "#0A0A0A" : "#0A0A0A"} />
          Perfil de Quepa
        </div>
        {isComplete
          ? <span style={{ fontSize: 12, fontWeight: 700 }}><Icon name="check" size={12} /> Completo</span>
          : <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{salud.completo}%</span>
        }
      </div>
      {/* Bar */}
      <div style={{ height: 8, borderRadius: 999, background: isComplete ? "rgba(10,10,10,.15)" : "var(--paper)", overflow: "hidden" }}>
        <div style={{ width: `${salud.completo}%`, height: "100%", background: isComplete ? "var(--ink)" : "var(--yg)", transition: "width .3s" }} />
      </div>

      {!isComplete && salud.pendientes.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-50)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            Te falta · {salud.pendientes.length}
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
            {salud.pendientes.map((p, i) => (
              <li key={i} className="row gap-2 text-xs" style={{ color: "var(--ink-70)" }}>
                <i style={{
                  width: 4, height: 4, borderRadius: 999, background: "var(--ink)",
                  flexShrink: 0, marginTop: 6,
                }} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          {salud.completo === 0 && (
            <button className="btn primary sm" onClick={onLaunchWizard} style={{ marginTop: 10, width: "100%", justifyContent: "center" }}>
              <Icon name="play" size={13} /> Empezar setup · 4 pasos
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Empty state cuando completo === 0
// ============================================================
function EmptyStateMN({ onLaunchWizard }) {
  return (
    <div style={{ background: "var(--night)", color: "#fff", borderRadius: 18, padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.06,
        background: "radial-gradient(circle at 50% 0%, var(--yg), transparent 50%)" }} />
      <div style={{ position: "relative" }}>
        <QStar size={48} fill="#D4F542" />
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.025em", marginTop: 16, marginBottom: 8 }}>¡Que parche! Bienvenido a Quepa.</h2>
        <p style={{ color: "rgba(255,255,255,.7)", fontSize: 15, maxWidth: 480, marginInline: "auto", marginBottom: 24 }}>
          Antes de que entren reservas, contanos qué tienes y cómo eres. Es un wizard de 4 pasos — toma 5 minutos.
        </p>
        <button className="btn accent" onClick={onLaunchWizard} style={{ padding: "12px 22px", fontSize: 14 }}>
          Empezar setup · 4 pasos <Icon name="chevron-right" size={14} />
        </button>
        <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.4)", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 24 }}>
          O salta y configura después — pero Quepa no te recomendará hasta que termines.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Tab Perfil
// ============================================================
function TabPerfil({ data, estab }) {
  const [perfil, setPerfil] = _uS_mn(data.perfil);

  const set = (key, val) => setPerfil((p) => ({ ...p, [key]: val }));
  const setAttr = (group, options) => setPerfil((p) => ({ ...p, atributos: { ...p.atributos, [group]: options } }));

  return (
    <div className="col gap-4">
      {/* Identidad / fotos */}
      <SectionMN title="Identidad visual" subtitle="Lo primero que ve el cliente cuando Quepa te recomienda.">
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 18 }}>
          <PhotoSlot src={perfil.portada} label="Portada" big />
          <div>
            <div className="mono text-xs" style={{ marginBottom: 8, color: "var(--ink-50)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Galería · {perfil.galeria.filter(Boolean).length} / {perfil.galeria.length}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {perfil.galeria.map((src, i) => (
                <PhotoSlot key={i} src={src} label={`Foto ${i + 1}`} />
              ))}
            </div>
            <button className="btn sm" style={{ marginTop: 12 }}>
              <Icon name="plus" size={13} /> Agregar foto
            </button>
          </div>
        </div>
      </SectionMN>

      {/* Sobre el negocio */}
      <SectionMN title="Sobre el negocio">
        <div className="col gap-3">
          <div className="field">
            <label>Descripción corta (1 línea)</label>
            <input className="input" value={perfil.descripcionCorta} onChange={(e) => set("descripcionCorta", e.target.value)} />
            <span className="hint">Aparece en el primer mensaje de Quepa al recomendarte.</span>
          </div>
          <div className="field">
            <label>Descripción larga (1–2 párrafos)</label>
            <textarea className="textarea" rows={6} value={perfil.descripcionLarga} onChange={(e) => set("descripcionLarga", e.target.value)} />
          </div>
        </div>
      </SectionMN>

      {/* Ubicación + redes */}
      <SectionMN title="Ubicación y redes">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="field">
            <label>Dirección</label>
            <input className="input" value={perfil.direccion} onChange={(e) => set("direccion", e.target.value)} />
          </div>
          <div className="field">
            <label>Google Maps</label>
            <input className="input mono text-xs" value={perfil.maps} onChange={(e) => set("maps", e.target.value)} />
          </div>
          <div className="field">
            <label><Icon name="store" size={12} /> Instagram</label>
            <input className="input" value={perfil.redes.instagram} onChange={(e) => set("redes", { ...perfil.redes, instagram: e.target.value })} placeholder="@negocio" />
          </div>
          <div className="field">
            <label>Facebook</label>
            <input className="input" value={perfil.redes.facebook} onChange={(e) => set("redes", { ...perfil.redes, facebook: e.target.value })} placeholder="/pagina" />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Sitio web (opcional)</label>
            <input className="input" value={perfil.redes.sitio} onChange={(e) => set("redes", { ...perfil.redes, sitio: e.target.value })} placeholder="negocio.co" />
          </div>
        </div>
      </SectionMN>

      {/* Horarios */}
      <SectionMN title="Horarios de atención" subtitle="Cuándo Quepa puede aceptar reservas para ti.">
        <HorariosEditor horarios={perfil.horarios} onChange={(h) => set("horarios", h)} />
      </SectionMN>

      {/* Formato de reservas */}
      <SectionMN title="Formato de reservas" subtitle="¿Cómo entregas la mesa al cliente? Quepa lo respeta al ofrecerla.">
        <div className="col gap-3">
          <ToggleField
            label="Recibo reservas por hora específica"
            checked={perfil.reservasPorHora !== false}
            onChange={(v) => set("reservasPorHora", v)}
            hint="Si está activo: el cliente pide '20:00 para 4'. Si está apagado: solo elige franja (Mañana / Mediodía / Noche)."
          />
          {perfil.reservasPorHora !== false && (
            <div className="field">
              <label>Duración estimada de la mesa</label>
              <div className="row gap-2">
                {[60, 90, 120, 150, 180].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set("duracionMesa", n)}
                    className={`mn-chip ${(perfil.duracionMesa || 90) === n ? "on" : ""}`}
                  >
                    {n} min
                  </button>
                ))}
              </div>
              <span className="hint">Quepa libera la mesa pasada esta duración + 15 min de cortesía.</span>
            </div>
          )}

          <div className="field">
            <label>Franjas que atiendes</label>
            <ChipSelector
              options={[
                { value: "mañana",   label: "Mañana (8–11h)" },
                { value: "mediodia", label: "Mediodía (12–15h)" },
                { value: "tarde",    label: "Tarde (15–18h)" },
                { value: "noche",    label: "Noche (18–23h)" },
              ]}
              selected={perfil.franjas || ["mediodia", "noche"]}
              onChange={(v) => set("franjas", v)}
            />
            <span className="hint">Quepa solo te ofrece dentro de las franjas marcadas. Si una franja no aplica (ej. desayuno), no la marques.</span>
          </div>
        </div>
      </SectionMN>

      {/* Rango de precio */}
      <SectionMN title="Rango de precio típico" subtitle="¿En qué rango de cuenta cae normalmente un cliente tuyo? Quepa lo usa para filtrar gente que busca dentro de tu rango.">
        <RangoPrecio
          min={perfil.rangoMin || 30000}
          max={perfil.rangoMax || 90000}
          onChange={(rango) => { set("rangoMin", rango.min); set("rangoMax", rango.max); }}
          vertical={estab.vertical}
        />
      </SectionMN>

      {/* Atributos */}
      <SectionMN title="Atributos que te describen" subtitle="Marca todo lo que aplique. Estos son los términos contra los que Quepa contrasta lo que pide la gente.">
        <div className="col gap-3">
          {ATTR_GROUPS.map((grp) => (
            <AttrGroupRow
              key={grp.key}
              group={grp}
              selected={perfil.atributos[grp.key] || []}
              onChange={(opts) => setAttr(grp.key, opts)}
            />
          ))}
        </div>
        <div style={{ marginTop: 14, padding: 12, background: "var(--paper)", borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon name="alert" size={16} color="#C98A2E" style={{ flexShrink: 0, marginTop: 1 }} />
          <div className="text-sm" style={{ color: "var(--ink-70)" }}>
            Estos atributos son los que Quepa usa para recomendarte. Si la gente te busca por <strong>"pet-friendly"</strong> y no lo tienes marcado, no te encuentra.
          </div>
        </div>
      </SectionMN>

      <div className="row gap-2" style={{ justifyContent: "flex-end" }}>
        <button className="btn ghost">Descartar cambios</button>
        <button className="btn primary"><Icon name="check" size={13} /> Guardar perfil</button>
      </div>
    </div>
  );
}

// ============================================================
// Componentes auxiliares Perfil
// ============================================================
function SectionMN({ title, subtitle, children }) {
  return (
    <div className="card" style={{ padding: 22 }}>
      <div className="row between" style={{ marginBottom: 16, alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.015em" }}>{title}</div>
          {subtitle && <div className="muted text-sm" style={{ marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

function PhotoSlot({ src, label, big = false }) {
  const h = big ? 200 : 90;
  return (
    <div
      style={{
        background: src ? "transparent" : "var(--paper)",
        border: src ? "0" : "1.5px dashed var(--line-2)",
        borderRadius: 12,
        height: h,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {src ? (
        <React.Fragment>
          <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button className="btn icon sm" style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,.9)" }}>
            <Icon name="edit" size={12} />
          </button>
        </React.Fragment>
      ) : (
        <div style={{ textAlign: "center", color: "var(--ink-50)" }}>
          <Icon name="plus" size={big ? 28 : 18} />
          <div className="mono text-xs" style={{ marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: big ? 11 : 9 }}>{label}</div>
        </div>
      )}
    </div>
  );
}

function HorariosEditor({ horarios, onChange }) {
  return (
    <div className="col gap-2">
      {DIAS.map((d) => {
        const dia = horarios[d];
        return (
          <div key={d} className="row gap-3" style={{ alignItems: "center", padding: "8px 12px", background: dia.abierto ? "transparent" : "var(--paper)", borderRadius: 10 }}>
            <div className="mono" style={{ width: 56, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{d}</div>
            <label className="checkbox" style={{ width: 92 }}>
              <input
                type="checkbox"
                checked={dia.abierto}
                onChange={(e) => onChange({ ...horarios, [d]: { ...dia, abierto: e.target.checked, franjas: e.target.checked && dia.franjas.length === 0 ? [{ de: "09:00", a: "18:00" }] : dia.franjas } })}
              />
              <span style={{ fontSize: 12 }}>{dia.abierto ? "Abierto" : "Cerrado"}</span>
            </label>
            {dia.abierto && (
              <div className="row gap-2" style={{ flex: 1, flexWrap: "wrap" }}>
                {dia.franjas.map((f, i) => (
                  <div key={i} className="row gap-2" style={{
                    background: "#fff", border: "1px solid var(--line)",
                    borderRadius: 8, padding: "5px 10px",
                  }}>
                    <span className="mono text-xs">{f.de}</span>
                    <span className="dim">→</span>
                    <span className="mono text-xs">{f.a}</span>
                    <button className="btn icon ghost" style={{ padding: 2 }}><Icon name="x" size={11} /></button>
                  </div>
                ))}
                <button className="btn ghost sm">
                  <Icon name="plus" size={11} /> Franja
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AttrGroupRow({ group, selected, onChange }) {
  const toggle = (opt) => {
    if (selected.includes(opt)) onChange(selected.filter((x) => x !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <div>
      <div className="row between" style={{ marginBottom: 6 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-60)", fontWeight: 600 }}>
          {group.label}
        </div>
        <div className="mono dim text-xs">{selected.length} de {group.options.length}</div>
      </div>
      <div className="row gap-2" style={{ flexWrap: "wrap" }}>
        {group.options.map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`mn-chip ${on ? "on" : ""}`}
            >
              {on && <Icon name="check" size={11} />}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TabRecursos({ data, estab }) {
  return (
    <div className="col gap-4">
      {estab.vertical === "mesas"        && <RecursosMesas />}
      {estab.vertical === "habitaciones" && <RecursosHabs />}
      {estab.vertical === "canchas"      && <RecursosCanchas />}
      {estab.vertical === "agenda"       && <RecursosAgenda />}
    </div>
  );
}

// ============================================================
// RangoPrecio — slider dual con valores en COP
// ============================================================
function RangoPrecio({ min, max, onChange, vertical = "mesas" }) {
  const ABSMIN = 0;
  // Topes razonables por vertical
  const ABSMAX = vertical === "habitaciones" ? 1500000 : vertical === "agenda" ? 800000 : 500000;
  const STEP = vertical === "habitaciones" ? 25000 : 5000;

  const setMin = (v) => onChange({ min: Math.min(v, max - STEP), max });
  const setMax = (v) => onChange({ min, max: Math.max(v, min + STEP) });

  const leftPct  = (min / ABSMAX) * 100;
  const rightPct = (max / ABSMAX) * 100;

  // Presets relevantes
  const presets = vertical === "habitaciones"
    ? [{ lbl: "Económico", min: 60000, max: 180000 }, { lbl: "Estándar", min: 180000, max: 350000 }, { lbl: "Alto", min: 350000, max: 600000 }, { lbl: "Premium", min: 600000, max: 1500000 }]
    : vertical === "agenda"
    ? [{ lbl: "Bajo", min: 0, max: 100000 }, { lbl: "Medio", min: 100000, max: 300000 }, { lbl: "Alto", min: 300000, max: 600000 }, { lbl: "Premium", min: 600000, max: 1500000 }]
    : [{ lbl: "Económico", min: 0, max: 50000 }, { lbl: "Estándar", min: 50000, max: 120000 }, { lbl: "Alto", min: 120000, max: 250000 }, { lbl: "Premium", min: 250000, max: 500000 }];

  return (
    <div>
      {/* Inputs Desde / Hasta */}
      <div className="row gap-3" style={{ alignItems: "flex-end", marginBottom: 18 }}>
        <div className="field" style={{ flex: 1 }}>
          <label>Desde</label>
          <div className="row gap-2" style={{ alignItems: "center", background: "var(--paper)", borderRadius: 10, padding: "4px 12px", border: "1.5px solid var(--line)" }}>
            <span className="mono" style={{ color: "var(--ink-50)" }}>$</span>
            <input
              type="number"
              value={min}
              min={ABSMIN}
              max={ABSMAX - STEP}
              step={STEP}
              onChange={(e) => setMin(parseInt(e.target.value) || ABSMIN)}
              style={{ border: 0, background: "transparent", outline: "none", flex: 1, fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, padding: "8px 0" }}
            />
            <span className="mono text-xs dim">COP</span>
          </div>
        </div>
        <div style={{ paddingBottom: 12, color: "var(--ink-30)", fontWeight: 700 }}>→</div>
        <div className="field" style={{ flex: 1 }}>
          <label>Hasta</label>
          <div className="row gap-2" style={{ alignItems: "center", background: "var(--paper)", borderRadius: 10, padding: "4px 12px", border: "1.5px solid var(--line)" }}>
            <span className="mono" style={{ color: "var(--ink-50)" }}>$</span>
            <input
              type="number"
              value={max}
              min={ABSMIN + STEP}
              max={ABSMAX}
              step={STEP}
              onChange={(e) => setMax(parseInt(e.target.value) || ABSMAX)}
              style={{ border: 0, background: "transparent", outline: "none", flex: 1, fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, padding: "8px 0" }}
            />
            <span className="mono text-xs dim">COP</span>
          </div>
        </div>
      </div>

      {/* Track visual */}
      <div style={{ position: "relative", marginBottom: 14, padding: "8px 0" }}>
        <div style={{
          height: 6, borderRadius: 999, background: "var(--paper-2)", position: "relative",
        }}>
          {/* Range fill */}
          <div style={{
            position: "absolute",
            left: `${leftPct}%`,
            width: `${rightPct - leftPct}%`,
            top: 0, bottom: 0,
            background: "var(--yg)",
            borderRadius: 999,
          }} />
        </div>
        {/* Native range inputs (overlapping) */}
        <input
          type="range"
          min={ABSMIN}
          max={ABSMAX}
          step={STEP}
          value={min}
          onChange={(e) => setMin(parseInt(e.target.value))}
          className="rango-range"
          style={{ position: "absolute", inset: 0, width: "100%", pointerEvents: "none", background: "transparent" }}
        />
        <input
          type="range"
          min={ABSMIN}
          max={ABSMAX}
          step={STEP}
          value={max}
          onChange={(e) => setMax(parseInt(e.target.value))}
          className="rango-range"
          style={{ position: "absolute", inset: 0, width: "100%", pointerEvents: "none", background: "transparent" }}
        />
        {/* Min/max labels */}
        <div className="row between mono text-xs dim" style={{ marginTop: 18 }}>
          <span>{fmtCOP(ABSMIN)}</span>
          <span>{fmtCOP(ABSMAX)}</span>
        </div>
      </div>

      {/* Presets */}
      <div>
        <div className="mono text-xs dim" style={{ marginBottom: 6, letterSpacing: "0.06em" }}>Presets rápidos</div>
        <div className="row gap-2" style={{ flexWrap: "wrap" }}>
          {presets.map((p) => {
            const active = p.min === min && p.max === max;
            return (
              <button
                key={p.lbl}
                type="button"
                onClick={() => onChange({ min: p.min, max: p.max })}
                className={`mn-chip ${active ? "on" : ""}`}
              >
                {active && <Icon name="check" size={11} />}
                {p.lbl}
                <span className="mono" style={{ opacity: 0.6, fontSize: 10, marginLeft: 4 }}>
                  {fmtCOP(p.min)}–{fmtCOP(p.max)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 14, padding: "10px 12px", background: "var(--paper)", borderRadius: 10, fontSize: 12.5, color: "var(--ink-70)", lineHeight: 1.4 }}>
        <Icon name="alert" size={12} style={{ marginRight: 6, verticalAlign: -1 }} />
        Los clientes que pidan a Quepa <strong>"algo de máximo {fmtCOP(max)}"</strong> verán tu negocio. Los que pidan algo más caro no.
      </div>
    </div>
  );
}

function RecursosMesas() {
  const [openAdd, setOpenAdd] = _uS_mn(false);
  const toast = useToast();
  return (
    <SectionMN
      title="Mesas del salón"
      subtitle="Lo que Quepa entrega a cada cliente cuando le confirma una mesa."
    >
      <div className="row between" style={{ marginBottom: 12 }}>
        <div className="mono text-xs dim">{MESAS_LAYOUT.length} mesas · {MESAS_LAYOUT.reduce((a, c) => a + c.pax, 0)} comensales máximo</div>
        <button className="btn primary sm" onClick={() => setOpenAdd(true)}>
          <Icon name="plus" size={13} /> Agregar mesa
        </button>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Código</th><th>Capacidad</th><th>Zona</th><th>Atributos</th><th>Estado</th><th></th>
          </tr>
        </thead>
        <tbody>
          {MESAS_LAYOUT.map((m) => {
            const extra = MESAS_ATTR[m.code] || { atributos: [], activa: true };
            return (
              <tr key={m.code}>
                <td className="mono" style={{ fontWeight: 700 }}>{m.code}</td>
                <td className="mono text-sm">{m.pax} comensales</td>
                <td className="text-sm">{m.zona}</td>
                <td>
                  <div className="row gap-2" style={{ flexWrap: "wrap" }}>
                    {extra.atributos.map((a, i) => <Badge key={i} variant="default">{a}</Badge>)}
                  </div>
                </td>
                <td>
                  {extra.activa
                    ? <Badge variant="leaf">● Activa</Badge>
                    : <Badge variant="default">Archivada</Badge>}
                </td>
                <td className="row-action">
                  <button className="btn ghost sm"><Icon name="edit" size={12} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ModalAgregarMesa
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={(form) => toast.push({ title: `Mesa ${form.code} creada`, body: `${form.pax} personas · ${form.zona}`, icon: <Icon name="check" size={14} /> })}
      />
    </SectionMN>
  );
}

// ---------- Recursos Habitaciones ----------
function RecursosHabs() {
  const [openAdd, setOpenAdd] = _uS_mn(false);
  const toast = useToast();
  return (
    <React.Fragment>
      <SectionMN title="Tipos de habitación" subtitle="Define una vez, aplica a todas las habitaciones de cada tipo.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {TIPOS_HAB.map((t) => (
            <div key={t.id} className="card" style={{ padding: 14, borderColor: "var(--line)" }}>
              <div className="row gap-3" style={{ alignItems: "flex-start" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 10,
                  background: t.foto ? `url(${t.foto}) center/cover` : "var(--paper)",
                  border: t.foto ? "0" : "1.5px dashed var(--line-2)",
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row between">
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t.nombre}</div>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700 }}>{fmtCOP(t.tarifa)}/n</span>
                  </div>
                  <div className="mono text-xs dim">Capacidad {t.capacidad} · {t.habs.length} habs</div>
                  <div className="row gap-2" style={{ flexWrap: "wrap", marginTop: 6 }}>
                    {t.amenities.slice(0, 4).map((a, i) => <Badge key={i} variant="default">{a}</Badge>)}
                  </div>
                  <div className="row gap-2 mono text-xs dim" style={{ marginTop: 8 }}>
                    Habs: {t.habs.join(" · ")}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => setOpenAdd(true)}
            className="card"
            style={{ border: "1.5px dashed var(--line-2)", background: "transparent", padding: 14, color: "var(--ink-50)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 600, cursor: "pointer" }}
          >
            <Icon name="plus" size={14} /> Agregar tipo
          </button>
        </div>
      </SectionMN>

      <SectionMN title="Habitaciones físicas" subtitle="Las habs individuales que se asignan a clientes.">
        <div className="row between" style={{ marginBottom: 12 }}>
          <div className="mono text-xs dim">{HABS_LAYOUT.length} habitaciones</div>
          <button className="btn primary sm" onClick={() => setOpenAdd(true)}>
            <Icon name="plus" size={13} /> Agregar habitación
          </button>
        </div>
        <table className="tbl">
          <thead><tr><th>Código</th><th>Tipo</th><th>Capacidad</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {HABS_LAYOUT.map((h) => (
              <tr key={h.code}>
                <td className="mono" style={{ fontWeight: 700 }}>Hab. {h.code}</td>
                <td className="text-sm">{h.tipo}</td>
                <td className="mono text-sm">cap {h.capacidad}</td>
                <td><Badge variant="leaf">● Activa</Badge></td>
                <td className="row-action"><button className="btn ghost sm"><Icon name="edit" size={12} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionMN>

      <ModalAgregarHab
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={(form) => {
          const label = form.modo === "fisica" ? `Hab. ${form.code} creada` : `Tipo "${form.nombreTipo}" creado`;
          toast.push({ title: label, body: form.modo === "fisica" ? `${form.capacidad} personas` : `${fmtCOP(form.tarifa)}/noche`, icon: <Icon name="check" size={14} /> });
        }}
      />
    </React.Fragment>
  );
}

// ---------- Recursos Canchas ----------
function RecursosCanchas() {
  const [openAdd, setOpenAdd] = _uS_mn(false);
  const toast = useToast();
  return (
    <SectionMN title="Espacios deportivos" subtitle="Cada cancha con su superficie, iluminación y tarifa por hora.">
      <div className="row between" style={{ marginBottom: 12 }}>
        <div className="mono text-xs dim">{CANCHAS_LAYOUT.length} espacios</div>
        <button className="btn primary sm" onClick={() => setOpenAdd(true)}>
          <Icon name="plus" size={13} /> Agregar cancha
        </button>
      </div>
      <table className="tbl">
        <thead>
          <tr><th>Código</th><th>Nombre</th><th>Deporte</th><th>Superficie</th><th>Techada</th><th>Iluminación</th><th>Tarifa/h</th><th></th></tr>
        </thead>
        <tbody>
          {CANCHAS_LAYOUT.map((c) => {
            const extra = CANCHAS_ATTR[c.code] || {};
            return (
              <tr key={c.code}>
                <td className="mono" style={{ fontWeight: 700 }}>{c.code}</td>
                <td>{c.nombre}</td>
                <td className="text-sm">{c.sport}</td>
                <td className="text-sm">{extra.superficie || "—"}</td>
                <td>{extra.techada ? <Badge variant="leaf">Sí</Badge> : <Badge variant="default">No</Badge>}</td>
                <td>{extra.iluminacion ? <Badge variant="yg">Sí</Badge> : <Badge variant="default">No</Badge>}</td>
                <td className="mono" style={{ fontWeight: 700 }}>{fmtCOP(extra.tarifaHora || 0)}</td>
                <td className="row-action"><button className="btn ghost sm"><Icon name="edit" size={12} /></button></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ModalAgregarCancha
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={(form) => toast.push({ title: `${form.code} · ${form.nombre} creada`, body: `${form.deporte} · ${fmtCOP(form.tarifaHora)}/h`, icon: <Icon name="check" size={14} /> })}
      />
    </SectionMN>
  );
}

// ---------- Recursos Agenda ----------
function RecursosAgenda() {
  const [sub, setSub] = _uS_mn("servicios");
  const [openModal, setOpenModal] = _uS_mn(null); // 'servicio' | 'profesional' | 'box'
  const toast = useToast();
  return (
    <React.Fragment>
      <div className="seg" style={{ marginBottom: 10 }}>
        <button className={sub === "servicios" ? "on" : ""} onClick={() => setSub("servicios")}>Catálogo de servicios <span className="mono" style={{ opacity: .6 }}>{SERVICIOS_SONRISA.length}</span></button>
        <button className={sub === "profesionales" ? "on" : ""} onClick={() => setSub("profesionales")}>Profesionales <span className="mono" style={{ opacity: .6 }}>{PROFESIONALES.length}</span></button>
        <button className={sub === "boxes" ? "on" : ""} onClick={() => setSub("boxes")}>Recursos físicos <span className="mono" style={{ opacity: .6 }}>{BOXES.length}</span></button>
      </div>

      {sub === "servicios" && (
        <SectionMN title="Catálogo de servicios" subtitle="Lo que ofreces a tus clientes. Quepa lo usa para matchear lo que piden con lo que tienes.">
          <div className="row between" style={{ marginBottom: 12 }}>
            <div className="mono text-xs dim">{SERVICIOS_SONRISA.length} servicios activos</div>
            <button className="btn primary sm" onClick={() => setOpenModal("servicio")}>
              <Icon name="plus" size={13} /> Agregar servicio
            </button>
          </div>
          <table className="tbl">
            <thead><tr><th>Servicio</th><th>Duración</th><th>Precio</th><th>Profesionales</th><th>Recursos</th><th></th></tr></thead>
            <tbody>
              {SERVICIOS_SONRISA.map((sv) => (
                <tr key={sv.id}>
                  <td><div style={{ fontWeight: 600 }}>{sv.nombre}</div></td>
                  <td className="mono text-sm">{sv.duracion} min</td>
                  <td className="mono" style={{ fontWeight: 700 }}>{sv.precio ? fmtCOP(sv.precio) : "Gratis"}</td>
                  <td className="text-sm">
                    <div className="row gap-2">
                      {sv.pros.map((pid) => {
                        const p = PROFESIONALES.find((x) => x.id === pid);
                        return p ? <span key={pid} className="mono text-xs" style={{ background: "var(--paper)", padding: "2px 6px", borderRadius: 6 }}>{p.inicial}</span> : null;
                      })}
                    </div>
                  </td>
                  <td className="mono text-xs">{sv.recursos.map((rid) => BOXES.find((b) => b.id === rid)?.nombre).join(" · ")}</td>
                  <td className="row-action"><button className="btn ghost sm"><Icon name="edit" size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionMN>
      )}

      {sub === "profesionales" && (
        <SectionMN title="Profesionales" subtitle="Quien atiende. Quepa los muestra a la hora de elegir cita.">
          <div className="row between" style={{ marginBottom: 12 }}>
            <div className="mono text-xs dim">{PROFESIONALES.length} profesionales</div>
            <button className="btn primary sm" onClick={() => setOpenModal("profesional")}>
              <Icon name="plus" size={13} /> Agregar profesional
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {PROFESIONALES.map((p) => {
              const servicios = SERVICIOS_SONRISA.filter((sv) => sv.pros.includes(p.id));
              return (
                <div key={p.id} className="card" style={{ padding: 16 }}>
                  <div className="row gap-3" style={{ alignItems: "flex-start" }}>
                    <Avatar name={p.nombre} size={48} tone="yg" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>{p.nombre}</div>
                      <div className="mono text-xs dim" style={{ marginTop: 2 }}>{p.especialidad}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed var(--line)" }}>
                    <div className="mono text-xs dim" style={{ marginBottom: 6 }}>Servicios que presta · {servicios.length}</div>
                    <div className="row gap-2" style={{ flexWrap: "wrap" }}>
                      {servicios.map((sv) => <Badge key={sv.id} variant="default">{sv.nombre}</Badge>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionMN>
      )}

      {sub === "boxes" && (
        <SectionMN title="Recursos físicos" subtitle="Boxes, sillones, salas — los espacios donde sucede el servicio.">
          <div className="row between" style={{ marginBottom: 12 }}>
            <div className="mono text-xs dim">{BOXES.length} recursos</div>
            <button className="btn primary sm" onClick={() => setOpenModal("box")}>
              <Icon name="plus" size={13} /> Agregar recurso
            </button>
          </div>
          <table className="tbl">
            <thead><tr><th>Recurso</th><th>Uso semanal</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {BOXES.map((b) => {
                const usoTotal = b.uso.reduce((a, c) => a + c, 0);
                const pct = Math.round((usoTotal / (b.uso.length * 8)) * 100);
                return (
                  <tr key={b.id}>
                    <td><div style={{ fontWeight: 600 }}>{b.nombre}</div></td>
                    <td>
                      <div className="row gap-3" style={{ alignItems: "center" }}>
                        <MiniBars data={b.uso} peakIdx={b.uso.indexOf(Math.max(...b.uso))} h={24} />
                        <span className="mono text-xs dim">{pct}%</span>
                      </div>
                    </td>
                    <td><Badge variant="leaf">● Activa</Badge></td>
                    <td className="row-action"><button className="btn ghost sm"><Icon name="edit" size={12} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SectionMN>
      )}

      <ModalAgregarServicio
        open={openModal === "servicio"}
        onClose={() => setOpenModal(null)}
        onSave={(form) => toast.push({ title: `Servicio "${form.nombre}" creado`, body: `${form.duracion} min · ${form.gratis ? "Gratis" : fmtCOP(form.precio)}`, icon: <Icon name="check" size={14} /> })}
      />
      <ModalAgregarProfesional
        open={openModal === "profesional"}
        onClose={() => setOpenModal(null)}
        onSave={(form) => toast.push({ title: `${form.nombre} agregado/a`, body: `${form.especialidad} · ${form.servicios.length} servicios`, icon: <Icon name="check" size={14} /> })}
      />
      <ModalAgregarBox
        open={openModal === "box"}
        onClose={() => setOpenModal(null)}
        onSave={(form) => toast.push({ title: `${form.nombre} creado`, body: `${form.tipo}`, icon: <Icon name="check" size={14} /> })}
      />
    </React.Fragment>
  );
}

Object.assign(window, { ScreenMiNegocio, SaludPerfil });

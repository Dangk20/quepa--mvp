// Quepa B2B · Mi Negocio — Modales para agregar recursos
// (Mesa · Habitación física · Tipo habitación · Cancha · Servicio · Profesional · Box)
const { useState: _uS_mod, useMemo: _uM_mod } = React;

// ============================================================
// Helpers compartidos
// ============================================================
const FieldGroup = ({ label, hint, children, required = false }) => (
  <div className="field">
    <label>{label} {required && <span style={{ color: "var(--rose)", fontWeight: 700 }}>*</span>}</label>
    {children}
    {hint && <span className="hint">{hint}</span>}
  </div>
);

const ChipSelector = ({ options, selected, onChange, multi = true, layout = "row" }) => {
  const toggle = (opt) => {
    if (multi) {
      if (selected.includes(opt)) onChange(selected.filter((x) => x !== opt));
      else onChange([...selected, opt]);
    } else {
      onChange(opt);
    }
  };
  return (
    <div className="row gap-2" style={{ flexWrap: "wrap" }}>
      {options.map((opt) => {
        const val = typeof opt === "object" ? opt.value : opt;
        const label = typeof opt === "object" ? opt.label : opt;
        const on = multi ? selected.includes(val) : selected === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => toggle(val)}
            className={`mn-chip ${on ? "on" : ""}`}
          >
            {on && <Icon name="check" size={11} />}
            {label}
          </button>
        );
      })}
    </div>
  );
};

const SeatVisualizer = ({ pax }) => {
  const c = chairsFor(pax);
  return (
    <div style={{
      background: "var(--paper)",
      borderRadius: 12,
      padding: 14,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
    }}>
      {c.top > 0 && (
        <div className="mesa-chairs h">
          {Array.from({ length: c.top }).map((_, i) => <div key={i} className="mesa-chair" />)}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {c.left > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {Array.from({ length: c.left }).map((_, i) => (
              <div key={i} className="mesa-chair" style={{ width: 6, height: 22 }} />
            ))}
          </div>
        )}
        <div style={{
          background: "#fff",
          border: "2.5px solid var(--ink)",
          borderRadius: 14,
          padding: "10px 18px",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 700,
          minWidth: 80,
          textAlign: "center",
        }}>{pax}p</div>
        {c.right > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {Array.from({ length: c.right }).map((_, i) => (
              <div key={i} className="mesa-chair" style={{ width: 6, height: 22 }} />
            ))}
          </div>
        )}
      </div>
      {c.bot > 0 && (
        <div className="mesa-chairs h">
          {Array.from({ length: c.bot }).map((_, i) => <div key={i} className="mesa-chair" />)}
        </div>
      )}
    </div>
  );
};

// ============================================================
// TagPicker — chips fijos + agregar custom + sugerencias
// ============================================================
function TagPicker({ suggested = [], selected, onChange, placeholder = "Agregar etiqueta personalizada…" }) {
  const [input, setInput] = _uS_mod("");
  const add = (v) => {
    const val = (v ?? input).trim();
    if (val && !selected.includes(val)) {
      onChange([...selected, val]);
    }
    setInput("");
  };
  const remove = (v) => onChange(selected.filter((x) => x !== v));

  return (
    <div className="col gap-2">
      {/* Etiquetas seleccionadas (preset + custom mezcladas) */}
      {selected.length > 0 && (
        <div className="row gap-2" style={{ flexWrap: "wrap" }}>
          {selected.map((s) => (
            <span key={s} className="mn-chip on" style={{ paddingRight: 6 }}>
              <Icon name="check" size={11} />
              <span>{s}</span>
              <button
                type="button"
                onClick={() => remove(s)}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 16, height: 16, borderRadius: 999,
                  background: "rgba(255,255,255,.18)", color: "inherit",
                  border: 0, cursor: "pointer", marginLeft: 4,
                }}
                aria-label="Quitar"
              >
                <Icon name="x" size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input para agregar custom */}
      <div
        className="row gap-2"
        style={{
          background: "#fff",
          border: "1.5px dashed var(--line)",
          borderRadius: 10,
          padding: "4px 4px 4px 12px",
          alignItems: "center",
        }}
      >
        <Icon name="plus" size={13} color="var(--ink-50)" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          style={{ border: 0, background: "transparent", outline: "none", flex: 1, fontSize: 13, padding: "4px 0" }}
        />
        <button
          type="button"
          onClick={() => add()}
          disabled={!input.trim()}
          className="btn primary sm"
          style={{ padding: "4px 12px" }}
        >
          Agregar
        </button>
      </div>

      {/* Sugerencias (solo las no seleccionadas) */}
      {suggested.filter((s) => !selected.includes(s)).length > 0 && (
        <div>
          <div className="mono text-xs dim" style={{ marginTop: 2, marginBottom: 4, letterSpacing: "0.06em" }}>
            Sugerencias
          </div>
          <div className="row gap-2" style={{ flexWrap: "wrap" }}>
            {suggested.filter((s) => !selected.includes(s)).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="mn-chip"
                style={{ borderStyle: "dashed", opacity: 0.85 }}
              >
                <Icon name="plus" size={10} /> {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// NumberStepper — input numérico con +/- buttons
// ============================================================
function NumberStepper({ value, min = 1, max = 30, onChange, suffix = "" }) {
  return (
    <div className="row gap-2" style={{ alignItems: "center" }}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="btn"
        style={{ padding: 8, minWidth: 38, justifyContent: "center" }}
        disabled={value <= min}
      >
        <Icon name="chevron-left" size={14} />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
        className="input mono"
        style={{ width: 80, textAlign: "center", fontSize: 18, fontWeight: 700, padding: "8px 10px" }}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="btn"
        style={{ padding: 8, minWidth: 38, justifyContent: "center" }}
        disabled={value >= max}
      >
        <Icon name="chevron-right" size={14} />
      </button>
      {suffix && <span className="dim text-sm" style={{ marginLeft: 4 }}>{suffix}</span>}
    </div>
  );
}

// ============================================================
// MODAL · Agregar Mesa
// ============================================================
function ModalAgregarMesa({ open, onClose, onSave }) {
  const [form, setForm] = _uS_mod({
    code: "T" + (MESAS_LAYOUT.length + 1),
    pax: 4,
    zona: "Central",
    forma: "cuadrada",
    atributos: [],
    activa: true,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const formas = ["cuadrada", "redonda", "ovalada", "alta"];
  const zonas  = ["Ventana", "Central", "Terraza", "Privado", "Barra"];
  const sugerencias = ["junto a ventana", "rincón", "vista al río", "esquina", "comunal", "ajustable", "para grupos", "iluminación tenue", "cerca de la cocina"];

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="modal-wide"
      title={
        <div>
          <div className="row gap-2">
            <Icon name="store" size={16} /> Agregar mesa
          </div>
          <div className="muted text-sm" style={{ fontWeight: 400, marginTop: 4 }}>
            Cómo aparece en el plano del salón y qué tiene en cuenta Quepa al asignarla.
          </div>
        </div>
      }
      footer={
        <React.Fragment>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={() => { onSave?.(form); onClose(); }}>
            <Icon name="check" size={13} /> Crear mesa {form.code}
          </button>
        </React.Fragment>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24 }}>
        {/* Form */}
        <div className="col gap-3">
          <FieldGroup label="Código de mesa" required hint="Cómo la identifica el equipo (T1, T2, M-VIP…)">
            <input className="input mono" value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} />
          </FieldGroup>

          <FieldGroup label="Capacidad" required hint="Cuántos comensales caben cómodamente.">
            <NumberStepper value={form.pax} min={1} max={20} onChange={(v) => set("pax", v)} suffix="comensales" />
          </FieldGroup>

          <FieldGroup label="Forma de la mesa">
            <ChipSelector options={formas} selected={form.forma} onChange={(v) => set("forma", v)} multi={false} />
          </FieldGroup>

          <FieldGroup label="Zona del salón" required hint="Quepa lo usa cuando el cliente pide 'terraza' o 'rincón privado'.">
            <ChipSelector options={zonas} selected={form.zona} onChange={(v) => set("zona", v)} multi={false} />
          </FieldGroup>

          <FieldGroup label="Atributos adicionales" hint="Etiquetas personalizables. Maximiza tu match: escribe cualquier característica especial.">
            <TagPicker
              suggested={sugerencias}
              selected={form.atributos}
              onChange={(v) => set("atributos", v)}
            />
          </FieldGroup>

          <label className="checkbox" style={{ marginTop: 6 }}>
            <input type="checkbox" checked={form.activa} onChange={(e) => set("activa", e.target.checked)} />
            <span>Activa para reservas desde el día de creación</span>
          </label>
        </div>

        {/* Preview */}
        <div style={{ position: "sticky", top: 0, alignSelf: "start" }}>
          <div className="mono text-xs" style={{ color: "var(--ink-50)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Vista previa</div>
          <SeatVisualizer pax={form.pax} />
          <div className="text-sm" style={{ textAlign: "center", marginTop: 12 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-50)", letterSpacing: "0.08em" }}>{form.code} · {form.forma}</div>
            <div style={{ fontWeight: 600, marginTop: 4 }}>{form.zona}</div>
            <div className="mono text-xs dim" style={{ marginTop: 2 }}>{form.pax} {form.pax === 1 ? "comensal" : "comensales"}</div>
          </div>
          <div className="row gap-2" style={{ flexWrap: "wrap", justifyContent: "center", marginTop: 10 }}>
            {form.atributos.map((a, i) => <Badge key={i} variant="default">{a}</Badge>)}
          </div>
          {(form.atributos.some((a) => a.toLowerCase().includes("ventana") || a.toLowerCase().includes("vista"))) && (
            <div style={{ marginTop: 12, background: "rgba(212,245,66,.18)", borderRadius: 10, padding: 10, fontSize: 11.5, color: "var(--ink-70)" }}>
              <Icon name="whatsapp" size={11} color="#25D366" style={{ marginRight: 4, verticalAlign: -1 }} />
              Quepa te ofrecerá esta mesa cuando alguien pida <strong>"con vista"</strong>.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ============================================================
// MODAL · Agregar Habitación (física) y Tipo
// ============================================================
function ModalAgregarHab({ open, onClose, onSave }) {
  const [modo, setModo] = _uS_mod("fisica"); // fisica | tipo
  const [form, setForm] = _uS_mod({
    code: "",
    tipo: TIPOS_HAB[0].id,
    capacidad: TIPOS_HAB[0].capacidad,
    notas: "",
    // tipo nuevo
    nombreTipo: "",
    tarifa: 0,
    amenities: ["WiFi", "AC"],
    foto: null,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const tipoSel = TIPOS_HAB.find((t) => t.id === form.tipo);
  const amenitiesOpts = ["WiFi", "AC", "TV", "Mini-bar", "Jacuzzi", "Caja fuerte", "Balcón", "Vista río", "Desayuno", "Cafetera"];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div>
          <div className="row gap-2"><Icon name="bed" size={16} /> Agregar habitación</div>
          <div className="muted text-sm" style={{ fontWeight: 400, marginTop: 4 }}>
            Crea una habitación física existente o define un nuevo tipo.
          </div>
        </div>
      }
      footer={
        <React.Fragment>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={() => { onSave?.({ ...form, modo }); onClose(); }}>
            <Icon name="check" size={13} />
            {modo === "fisica" ? `Crear hab. ${form.code || "?"}` : `Crear tipo ${form.nombreTipo || "?"}`}
          </button>
        </React.Fragment>
      }
    >
      {/* Sub-modo selector */}
      <div className="seg" style={{ marginBottom: 18 }}>
        <button className={modo === "fisica" ? "on" : ""} onClick={() => setModo("fisica")}>Habitación física</button>
        <button className={modo === "tipo" ? "on" : ""} onClick={() => setModo("tipo")}>Nuevo tipo de habitación</button>
      </div>

      {modo === "fisica" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22 }}>
          <div className="col gap-3">
            <FieldGroup label="Número o código" required hint="Como lo conoce el equipo (101, 302, Suite Norte…)">
              <input className="input mono" value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="Ej. 204" />
            </FieldGroup>
            <FieldGroup label="Tipo de habitación" required hint="Define tarifa, capacidad y amenities por defecto.">
              <select className="select" value={form.tipo} onChange={(e) => { const t = TIPOS_HAB.find((x) => x.id === e.target.value); set("tipo", e.target.value); set("capacidad", t.capacidad); }}>
                {TIPOS_HAB.map((t) => (
                  <option key={t.id} value={t.id}>{t.nombre} · {fmtCOP(t.tarifa)}/n · cap {t.capacidad}</option>
                ))}
              </select>
            </FieldGroup>
            <FieldGroup label="Capacidad (puedes ajustar el default del tipo)">
              <input className="input mono" type="number" min={1} max={12} value={form.capacidad} onChange={(e) => set("capacidad", parseInt(e.target.value))} />
            </FieldGroup>
            <FieldGroup label="Notas internas" hint="No se muestran al cliente — solo para tu equipo.">
              <textarea className="textarea" value={form.notas} onChange={(e) => set("notas", e.target.value)} placeholder="Ej. Sin balcón · Pintada en mayo 2026" />
            </FieldGroup>
          </div>

          <div>
            <div className="mono text-xs" style={{ color: "var(--ink-50)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Vista previa</div>
            <div className="card" style={{ padding: 14 }}>
              <div style={{
                height: 100,
                background: tipoSel?.foto ? `url(${tipoSel.foto}) center/cover` : "var(--paper)",
                borderRadius: 10,
                marginBottom: 10,
                border: tipoSel?.foto ? 0 : "1.5px dashed var(--line-2)",
              }} />
              <div className="row between">
                <div style={{ fontSize: 14, fontWeight: 700 }}>Hab. {form.code || "—"}</div>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-60)" }}>{fmtCOP(tipoSel?.tarifa || 0)}/n</span>
              </div>
              <div className="mono text-xs dim">{tipoSel?.nombre} · cap {form.capacidad}</div>
              <div className="row gap-2" style={{ flexWrap: "wrap", marginTop: 8 }}>
                {(tipoSel?.amenities || []).slice(0, 4).map((a, i) => <Badge key={i} variant="default">{a}</Badge>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {modo === "tipo" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22 }}>
          <div className="col gap-3">
            <FieldGroup label="Nombre del tipo" required>
              <input className="input" value={form.nombreTipo} onChange={(e) => set("nombreTipo", e.target.value)} placeholder="Ej. Suite con vista al río" />
            </FieldGroup>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FieldGroup label="Tarifa base / noche (COP)" required>
                <input className="input mono" type="number" value={form.tarifa} onChange={(e) => set("tarifa", parseInt(e.target.value) || 0)} placeholder="450000" />
              </FieldGroup>
              <FieldGroup label="Capacidad" required>
                <input className="input mono" type="number" min={1} max={20} value={form.capacidad} onChange={(e) => set("capacidad", parseInt(e.target.value))} />
              </FieldGroup>
            </div>
            <FieldGroup label="Amenities" hint="Quepa los muestra a los clientes que filtren por estos.">
              <ChipSelector options={amenitiesOpts} selected={form.amenities} onChange={(v) => set("amenities", v)} />
            </FieldGroup>
          </div>

          <div>
            <div className="mono text-xs" style={{ color: "var(--ink-50)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Vista previa</div>
            <div className="card" style={{ padding: 14 }}>
              <PhotoSlotInline src={form.foto} h={100} label="Sube una foto del tipo" />
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 10 }}>{form.nombreTipo || "Sin nombre aún"}</div>
              <div className="mono" style={{ fontSize: 12, color: "var(--ink-60)", marginTop: 2 }}>
                {form.tarifa ? fmtCOP(form.tarifa) : "—"}/noche · cap {form.capacidad}
              </div>
              <div className="row gap-2" style={{ flexWrap: "wrap", marginTop: 8 }}>
                {form.amenities.slice(0, 6).map((a, i) => <Badge key={i} variant="default">{a}</Badge>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ============================================================
// MODAL · Agregar Cancha
// ============================================================
function ModalAgregarCancha({ open, onClose, onSave }) {
  const [form, setForm] = _uS_mod({
    code: "C" + (CANCHAS_LAYOUT.length + 1),
    nombre: "",
    deporte: "Fútbol 5",
    atributos: ["Césped sintético FIFA", "Iluminación nocturna"],
    tarifaHora: 80000,
    horarioPropio: false,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const deportes = ["Fútbol 5", "Pádel", "Tenis", "Voleibol", "Baloncesto", "Multipropósito"];
  const sugerenciasPorDeporte = {
    "Fútbol 5":      ["Césped sintético FIFA", "Césped sintético estándar", "Césped natural", "Techada", "Iluminación nocturna", "Vestuarios", "Parqueadero amplio", "Reglamentaria"],
    "Pádel":         ["Cristal pádel", "Pista panorámica", "Techada", "Iluminación nocturna", "Vidrio templado", "Climatizada"],
    "Tenis":         ["Tierra batida", "Hard court", "Cemento", "Techada", "Iluminación nocturna", "Tribuna"],
    "Voleibol":      ["Madera", "PVC", "Cemento pulido", "Techada", "Iluminación nocturna", "Tribuna"],
    "Baloncesto":    ["Madera", "Cemento pulido", "PVC", "Techada", "Iluminación nocturna", "Tribuna", "Aros profesionales"],
    "Multipropósito":["Cemento pulido", "PVC", "Cuarzo", "Techada", "Iluminación nocturna", "Pintura desmontable"],
  };
  const sugerencias = sugerenciasPorDeporte[form.deporte] || [];

  const isTechada = form.atributos.some((a) => a.toLowerCase().includes("techa") || a.toLowerCase().includes("cubiert"));
  const isLuz     = form.atributos.some((a) => a.toLowerCase().includes("iluminación") || a.toLowerCase().includes("noctur") || a.toLowerCase().includes("luz"));

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="modal-wide"
      title={
        <div>
          <div className="row gap-2"><Icon name="court" size={16} /> Agregar cancha o espacio</div>
          <div className="muted text-sm" style={{ fontWeight: 400, marginTop: 4 }}>
            Quepa la ofrece según deporte, atributos y disponibilidad horaria.
          </div>
        </div>
      }
      footer={
        <React.Fragment>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={() => { onSave?.(form); onClose(); }}>
            <Icon name="check" size={13} /> Crear cancha {form.code}
          </button>
        </React.Fragment>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24 }}>
        <div className="col gap-3">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
            <FieldGroup label="Código" required>
              <input className="input mono" value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} />
            </FieldGroup>
            <FieldGroup label="Nombre" required hint="El que ve el cliente">
              <input className="input" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Ej. Pádel 3 · Cancha sur" />
            </FieldGroup>
          </div>

          <FieldGroup label="Deporte" required>
            <ChipSelector options={deportes} selected={form.deporte} onChange={(v) => set("deporte", v)} multi={false} />
          </FieldGroup>

          <FieldGroup
            label="Atributos del espacio"
            required
            hint="Etiquetas personalizables: superficie, techada, iluminación nocturna, lo que quieras. Quepa las usa para matchear con lo que pide el cliente."
          >
            <TagPicker
              suggested={sugerencias}
              selected={form.atributos}
              onChange={(v) => set("atributos", v)}
              placeholder="Agregar atributo (ej. 'climatizada', 'piso recién pulido')…"
            />
          </FieldGroup>

          <FieldGroup label="Tarifa por hora (COP)" required>
            <input className="input mono" type="number" value={form.tarifaHora} onChange={(e) => set("tarifaHora", parseInt(e.target.value) || 0)} />
          </FieldGroup>

          <ToggleField
            label="Tiene horario propio"
            checked={form.horarioPropio}
            onChange={(v) => set("horarioPropio", v)}
            hint="Si esta cancha cierra antes que el resto, marca y configúralo abajo."
          />
        </div>

        <div style={{ position: "sticky", top: 0, alignSelf: "start" }}>
          <div className="mono text-xs" style={{ color: "var(--ink-50)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Vista previa</div>
          <div className="cancha-v2 idle" style={{ cursor: "default", minHeight: "auto" }}>
            <div className="head">
              <div>
                <div className="code">{form.code}</div>
                <div className="nm">{form.nombre || "Sin nombre aún"}</div>
                <div className="sport">{form.deporte}</div>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div className="cancha-timer-lbl">Tarifa por hora</div>
              <div className="cancha-timer" style={{ fontSize: 22 }}>{fmtCOP(form.tarifaHora)}</div>
            </div>
            <div className="row gap-2" style={{ marginTop: 10, flexWrap: "wrap" }}>
              {form.atributos.slice(0, 6).map((a, i) => (
                <Badge
                  key={i}
                  variant={a.toLowerCase().includes("noctur") || a.toLowerCase().includes("luz") ? "yg" : (a.toLowerCase().includes("techa") || a.toLowerCase().includes("cubiert") ? "leaf" : "default")}
                >
                  {a}
                </Badge>
              ))}
              {form.atributos.length > 6 && <Badge variant="default">+{form.atributos.length - 6}</Badge>}
            </div>
          </div>
          {(isLuz || isTechada) && (
            <div style={{ marginTop: 12, background: "rgba(212,245,66,.18)", borderRadius: 10, padding: 10, fontSize: 11.5, color: "var(--ink-70)" }}>
              <Icon name="whatsapp" size={11} color="#25D366" style={{ marginRight: 4, verticalAlign: -1 }} />
              Quepa ofrecerá esta cancha cuando alguien pida {isTechada && "techada"}{isTechada && isLuz && " o "}{isLuz && "con luz nocturna"}.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ============================================================
// MODAL · Agregar Servicio (vertical agenda)
// ============================================================
function ModalAgregarServicio({ open, onClose, onSave }) {
  const [form, setForm] = _uS_mod({
    nombre: "",
    duracion: 60,
    precio: 0,
    gratis: false,
    pros: [],
    recursos: [],
    categoria: "consulta",
    descripcion: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const duraciones = [15, 30, 45, 60, 75, 90, 120, 150, 180];
  const categorias = [
    { value: "limpieza",    label: "Limpieza" },
    { value: "diagnostico", label: "Diagnóstico" },
    { value: "endodoncia",  label: "Endodoncia" },
    { value: "ortodoncia",  label: "Ortodoncia" },
    { value: "consulta",    label: "Consulta" },
    { value: "estetica",    label: "Estética" },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div>
          <div className="row gap-2"><Icon name="stethoscope" size={16} /> Agregar servicio</div>
          <div className="muted text-sm" style={{ fontWeight: 400, marginTop: 4 }}>
            Lo que el cliente puede reservar. Quepa lo matchea con lo que pide.
          </div>
        </div>
      }
      footer={
        <React.Fragment>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={() => { onSave?.(form); onClose(); }}>
            <Icon name="check" size={13} /> Crear servicio
          </button>
        </React.Fragment>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22 }}>
        <div className="col gap-3">
          <FieldGroup label="Nombre del servicio" required>
            <input className="input" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Ej. Limpieza dental, Endodoncia molar..." />
          </FieldGroup>

          <FieldGroup label="Categoría" required hint="Determina el color del bloque en la agenda.">
            <ChipSelector options={categorias} selected={form.categoria} onChange={(v) => set("categoria", v)} multi={false} />
          </FieldGroup>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FieldGroup label="Duración" required>
              <select className="select mono" value={form.duracion} onChange={(e) => set("duracion", parseInt(e.target.value))}>
                {duraciones.map((d) => <option key={d} value={d}>{d} min</option>)}
              </select>
            </FieldGroup>
            <FieldGroup label="Precio (COP)">
              <input
                className="input mono"
                type="number"
                value={form.gratis ? 0 : form.precio}
                onChange={(e) => set("precio", parseInt(e.target.value) || 0)}
                disabled={form.gratis}
              />
              <label className="checkbox" style={{ marginTop: 4 }}>
                <input type="checkbox" checked={form.gratis} onChange={(e) => set("gratis", e.target.checked)} />
                <span className="text-xs">Es gratis (primera consulta, valoración…)</span>
              </label>
            </FieldGroup>
          </div>

          <FieldGroup label="Profesionales habilitados" required hint="Quién puede prestar este servicio.">
            <ChipSelector
              options={PROFESIONALES.map((p) => ({ value: p.id, label: `${p.inicial} · ${p.nombre.replace("Dr. ", "").replace("Dra. ", "")}` }))}
              selected={form.pros}
              onChange={(v) => set("pros", v)}
            />
          </FieldGroup>

          <FieldGroup label="Recursos físicos requeridos" hint="Box, sillón o sala que necesita el servicio.">
            <ChipSelector
              options={BOXES.map((b) => ({ value: b.id, label: b.nombre }))}
              selected={form.recursos}
              onChange={(v) => set("recursos", v)}
            />
          </FieldGroup>

          <FieldGroup label="Descripción" hint="Lo que aparece en el detalle de la cita.">
            <textarea className="textarea" rows={2} value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} placeholder="Procedimiento incluido, qué traer, etc." />
          </FieldGroup>
        </div>

        <div>
          <div className="mono text-xs" style={{ color: "var(--ink-50)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Vista previa</div>
          <div className={`timeline-block ${form.categoria}`} style={{ position: "static", padding: "12px 14px", marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>
              {form.nombre || "Nombre del servicio"}
            </div>
            <div className="cli" style={{ fontSize: 11 }}>
              {form.duracion} min · {form.gratis ? "Gratis" : (form.precio ? fmtCOP(form.precio) : "—")}
            </div>
          </div>
          <div className="card" style={{ padding: 14, background: "var(--paper)", borderColor: "transparent" }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-60)", marginBottom: 6 }}>Profesionales</div>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              {form.pros.length === 0 && <span className="text-xs dim">Ninguno marcado</span>}
              {form.pros.map((pid) => {
                const p = PROFESIONALES.find((x) => x.id === pid);
                return p ? <Badge key={pid} variant="default">{p.inicial} · {p.nombre.replace("Dr. ", "").replace("Dra. ", "").split(" ")[0]}</Badge> : null;
              })}
            </div>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-60)", margin: "10px 0 6px" }}>Recursos</div>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              {form.recursos.length === 0 && <span className="text-xs dim">Ninguno</span>}
              {form.recursos.map((rid) => {
                const b = BOXES.find((x) => x.id === rid);
                return b ? <Badge key={rid} variant="default">{b.nombre}</Badge> : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================
// MODAL · Agregar Profesional
// ============================================================
function ModalAgregarProfesional({ open, onClose, onSave }) {
  const [form, setForm] = _uS_mod({
    nombre: "",
    especialidad: "",
    foto: null,
    servicios: [],
    horarioPropio: false,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div>
          <div className="row gap-2"><Icon name="users" size={16} /> Agregar profesional</div>
          <div className="muted text-sm" style={{ fontWeight: 400, marginTop: 4 }}>
            Quien atiende. Aparece en la agenda y en las opciones del cliente.
          </div>
        </div>
      }
      footer={
        <React.Fragment>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={() => { onSave?.(form); onClose(); }}>
            <Icon name="check" size={13} /> Crear profesional
          </button>
        </React.Fragment>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22 }}>
        <div className="col gap-3">
          <FieldGroup label="Nombre completo" required>
            <input className="input" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Ej. Dra. Lucía Marín" />
          </FieldGroup>
          <FieldGroup label="Especialidad" required>
            <input className="input" value={form.especialidad} onChange={(e) => set("especialidad", e.target.value)} placeholder="Ej. Odontología general, Ortodoncia..." />
          </FieldGroup>
          <FieldGroup label="Servicios que presta" required hint="Marca los servicios del catálogo que puede prestar.">
            <ChipSelector
              options={SERVICIOS_SONRISA.map((sv) => ({ value: sv.id, label: sv.nombre }))}
              selected={form.servicios}
              onChange={(v) => set("servicios", v)}
            />
          </FieldGroup>
          <ToggleField
            label="Tiene horario propio"
            checked={form.horarioPropio}
            onChange={(v) => set("horarioPropio", v)}
            hint="Si difiere del horario del negocio."
          />
        </div>

        <div>
          <div className="mono text-xs" style={{ color: "var(--ink-50)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Vista previa</div>
          <div className="card" style={{ padding: 16 }}>
            <div className="row gap-3" style={{ alignItems: "flex-start" }}>
              <Avatar name={form.nombre || "??"} size={48} tone="yg" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>{form.nombre || "Sin nombre"}</div>
                <div className="mono text-xs dim" style={{ marginTop: 2 }}>{form.especialidad || "—"}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed var(--line)" }}>
              <div className="mono text-xs dim" style={{ marginBottom: 6 }}>Servicios · {form.servicios.length}</div>
              <div className="row gap-2" style={{ flexWrap: "wrap" }}>
                {form.servicios.length === 0 && <span className="text-xs dim">Ninguno marcado aún</span>}
                {form.servicios.map((sid) => {
                  const sv = SERVICIOS_SONRISA.find((x) => x.id === sid);
                  return sv ? <Badge key={sid} variant="default">{sv.nombre}</Badge> : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================
// MODAL · Agregar recurso físico (box)
// ============================================================
function ModalAgregarBox({ open, onClose, onSave }) {
  const [form, setForm] = _uS_mod({
    nombre: "Box " + (BOXES.length + 1),
    tipo: "Box",
    activa: true,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const tipos = ["Box", "Sillón", "Sala", "Camilla", "Otro"];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div>
          <div className="row gap-2"><Icon name="grid" size={16} /> Agregar recurso físico</div>
          <div className="muted text-sm" style={{ fontWeight: 400, marginTop: 4 }}>
            El espacio donde sucede el servicio: box, sillón, sala…
          </div>
        </div>
      }
      footer={
        <React.Fragment>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={() => { onSave?.(form); onClose(); }}>
            <Icon name="check" size={13} /> Crear recurso
          </button>
        </React.Fragment>
      }
    >
      <div className="col gap-3">
        <FieldGroup label="Nombre del recurso" required>
          <input className="input" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
        </FieldGroup>
        <FieldGroup label="Tipo" required>
          <ChipSelector options={tipos} selected={form.tipo} onChange={(v) => set("tipo", v)} multi={false} />
        </FieldGroup>
        <label className="checkbox">
          <input type="checkbox" checked={form.activa} onChange={(e) => set("activa", e.target.checked)} />
          <span>Activo desde el día de creación</span>
        </label>
      </div>
    </Modal>
  );
}

// ============================================================
// Componentes auxiliares
// ============================================================
function ToggleField({ label, checked, onChange, hint }) {
  return (
    <div className="field">
      <label className="row between" style={{ marginBottom: 0, cursor: "pointer" }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`toggle-pill ${checked ? "on" : ""}`}
        >
          <span />
        </button>
      </label>
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

function PhotoSlotInline({ src, h = 100, label = "Sube foto" }) {
  return (
    <div style={{
      height: h,
      background: src ? `url(${src}) center/cover` : "var(--paper)",
      border: src ? 0 : "1.5px dashed var(--line-2)",
      borderRadius: 10,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "var(--ink-50)", cursor: "pointer",
    }}>
      {!src && (
        <div style={{ textAlign: "center" }}>
          <Icon name="plus" size={20} />
          <div className="mono text-xs" style={{ marginTop: 4, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  ModalAgregarMesa,
  ModalAgregarHab,
  ModalAgregarCancha,
  ModalAgregarServicio,
  ModalAgregarProfesional,
  ModalAgregarBox,
  ToggleField,
  PhotoSlotInline,
  FieldGroup,
  ChipSelector,
});

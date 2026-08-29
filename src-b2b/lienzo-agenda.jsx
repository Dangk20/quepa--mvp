// Quepa B2B · Lienzo Agenda (servicios / citas)
const { useState: _uS_ag, useMemo: _uM_ag } = React;

function LienzoAgenda({ reservas, clientes, onOpenReserva }) {
  const [selectedDay, setSelectedDay] = _uS_ag(_D);
  const [filterPro, setFilterPro] = _uS_ag("todos");
  const [newSlot, setNewSlot] = _uS_ag(null); // { pro, hora }
  const horas = Array.from({ length: 10 }, (_, i) => 8 + i); // 08–17 (10 cols)
  const startMin = 8 * 60;
  const totalMin = 10 * 60;

  const reservasDelDia = reservas.filter((r) => {
    const targetD = _D + r.fecha;
    return targetD === selectedDay;
  });

  const visiblePros = filterPro === "todos" ? PROFESIONALES : PROFESIONALES.filter((p) => p.id === filterPro);

  // Click handler for empty slot — convert pixel offset to hora
  const handleTrackClick = (e, pro) => {
    if (e.target.closest(".timeline-block")) return; // ignore clicks on existing blocks
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pctX = x / rect.width;
    const minutesFromStart = pctX * totalMin;
    // snap a 30 min
    const snapped = Math.floor(minutesFromStart / 30) * 30;
    const totalM = startMin + snapped;
    const hh = String(Math.floor(totalM / 60)).padStart(2, "0");
    const mm = String(totalM % 60).padStart(2, "0");
    setNewSlot({ pro: pro.id, proNombre: pro.nombre, hora: `${hh}:${mm}` });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 18 }}>
      <div>
        {/* Filtro de profesional */}
        <div className="row between" style={{ marginBottom: 12 }}>
          <div className="hostal-type-tabs">
            <button
              className={`hostal-type-tab ${filterPro === "todos" ? "on" : ""}`}
              onClick={() => setFilterPro("todos")}
            >
              Todos
              <span className="mono" style={{ opacity: .6, fontSize: 10 }}>{PROFESIONALES.length}</span>
            </button>
            {PROFESIONALES.map((p) => (
              <button
                key={p.id}
                className={`hostal-type-tab ${filterPro === p.id ? "on" : ""}`}
                onClick={() => setFilterPro(p.id)}
              >
                <span className="mono" style={{ fontSize: 9, background: filterPro === p.id ? "var(--yg)" : "var(--ink-12)", color: filterPro === p.id ? "var(--ink)" : "var(--ink)", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>{p.inicial}</span>
                {p.nombre.replace("Dr. ", "").replace("Dra. ", "")}
              </button>
            ))}
          </div>
          <div className="mono text-xs dim row gap-2">
            <Icon name="plus" size={11} /> Click en un espacio libre para crear cita
          </div>
        </div>

        {/* Boxes / recursos */}
        <div className="resource-cards">
          {BOXES.map((b) => (
            <div className="rc" key={b.id}>
              <div>
                <div className="nm">{b.nombre}</div>
                <div className="pc">uso semanal {Math.round((b.uso.reduce((a, c) => a + c, 0) / (b.uso.length * 8)) * 100)}%</div>
              </div>
              <MiniBars data={b.uso} peakIdx={b.uso.indexOf(Math.max(...b.uso))} h={24} />
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div>
          <div className="timeline-h">
            <div className="corner">Profesional</div>
            <div className="timeline-hours" style={{ gridTemplateColumns: `repeat(${horas.length}, 1fr)` }}>
              {horas.map((h) => (
                <div key={h} className="timeline-hour">{String(h).padStart(2, "0")}:00</div>
              ))}
            </div>
          </div>

          {visiblePros.map((p) => {
            const myCitas = reservasDelDia.filter((r) => r.pro === p.id);
            const totalOcupado = myCitas.reduce((acc, r) => acc + r.dur, 0);
            return (
              <div key={p.id} className="timeline-row">
                <div className="pro">
                  <div className="av">{p.inicial}</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="nm" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nombre}</div>
                    <div className="free">{(10 - totalOcupado).toFixed(1)}h libre</div>
                  </div>
                </div>
                <div
                  className="timeline-track"
                  style={{ backgroundSize: `calc(100%/${horas.length}) 100%`, cursor: "crosshair" }}
                  onClick={(e) => handleTrackClick(e, p)}
                  title="Click para crear cita aquí"
                >
                  {myCitas.map((r) => {
                    const cli = clientes.find((c) => c.id === r.clienteId);
                    const [hh, mm] = r.hora.split(":").map(Number);
                    const startM = hh * 60 + mm;
                    const left = ((startM - startMin) / totalMin) * 100;
                    const width = (r.dur * 60 / totalMin) * 100;
                    return (
                      <div
                        key={r.id}
                        className={`timeline-block ${r.tipo}`}
                        style={{ left: `${left}%`, width: `calc(${width}% - 4px)` }}
                        onClick={(e) => { e.stopPropagation(); onOpenReserva(r); }}
                        title={`${r.servicio} · ${cli?.nombre}`}
                      >
                        <div className="row gap-2" style={{ fontWeight: 700 }}>
                          {r.origen === "quepa" && <Icon name="whatsapp" size={10} />}
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.servicio}</span>
                        </div>
                        <div className="cli">{cli?.nombre} · {r.hora}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div style={{ padding: "10px 14px", borderTop: "1px solid var(--line)", borderLeft: "1px solid var(--line)", borderRight: "1px solid var(--line)", borderBottom: "1px solid var(--line)", borderRadius: "0 0 10px 10px", background: "#fff", display: "flex", gap: 14, fontSize: 11, color: "var(--ink-60)" }}>
            <span className="row gap-2"><i style={{ width: 12, height: 6, background: "var(--yg)", borderRadius: 3, borderLeft: "3px solid var(--ink)" }} /> Limpieza</span>
            <span className="row gap-2"><i style={{ width: 12, height: 6, background: "var(--ink)", borderRadius: 3, borderLeft: "3px solid var(--yg)" }} /> Endodoncia</span>
            <span className="row gap-2"><i style={{ width: 12, height: 6, background: "rgba(212,245,66,.35)", borderRadius: 3, borderLeft: "3px solid var(--ink)" }} /> Ortodoncia</span>
            <span className="row gap-2"><i style={{ width: 12, height: 6, background: "#fff", borderRadius: 3, border: "1.5px dashed var(--ink)", borderLeft: "3px solid var(--ink)" }} /> Diagnóstico</span>
            <span className="row gap-2"><i style={{ width: 12, height: 6, background: "var(--paper-2)", borderRadius: 3, borderLeft: "3px solid var(--ink)" }} /> Consulta</span>
          </div>
        </div>
      </div>

      <div className="col gap-3">
        <MiniCal selectedDay={selectedDay} onSelect={setSelectedDay} reservas={reservas} />
        <div className="card">
          <div className="row between" style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Hoy · resumen</div>
            <span className="badge yg">{reservas.filter((r) => r.fecha === 0).length} citas</span>
          </div>
          <div className="col gap-2 text-sm">
            {Object.entries(reservas.filter((r) => r.fecha === 0).reduce((acc, r) => {
              acc[r.tipo] = (acc[r.tipo] || 0) + 1; return acc;
            }, {})).map(([tipo, n]) => (
              <div key={tipo} className="row between">
                <span className="row gap-2"><i style={{ width: 8, height: 8, borderRadius: 999, background: tipoColor(tipo) }} /> <span style={{ textTransform: "capitalize" }}>{tipo}</span></span>
                <span className="mono dim text-xs">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal crear cita */}
      <ModalCrearCita
        open={!!newSlot}
        onClose={() => setNewSlot(null)}
        slot={newSlot}
        clientes={clientes}
      />
    </div>
  );
}

// ============================================================
// Modal · Crear cita (al hacer click en slot vacío de la agenda)
// ============================================================
function ModalCrearCita({ open, onClose, slot, clientes }) {
  if (!slot) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div>
          <div className="row gap-2"><Icon name="plus" size={16} /> Nueva cita</div>
          <div className="muted text-sm" style={{ fontWeight: 400, marginTop: 4 }}>
            {slot.proNombre} · {slot.hora}
          </div>
        </div>
      }
      footer={
        <React.Fragment>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={onClose}>
            <Icon name="check" size={13} /> Crear cita
          </button>
        </React.Fragment>
      }
    >
      <div className="col gap-3">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="field">
            <label>Profesional</label>
            <select className="select" defaultValue={slot.pro}>
              {PROFESIONALES.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Hora</label>
            <input className="input mono" defaultValue={slot.hora} />
          </div>
        </div>
        <div className="field">
          <label>Servicio</label>
          <select className="select">
            <option value="">Selecciona un servicio…</option>
            {SERVICIOS_SONRISA.map((sv) => (
              <option key={sv.id} value={sv.id}>{sv.nombre} · {sv.duracion} min · {sv.precio ? fmtCOP(sv.precio) : "Gratis"}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Cliente</label>
          <input className="input" placeholder="Busca por nombre o WhatsApp, o escribe uno nuevo…" />
          <span className="hint">Si es nuevo, se crea automáticamente al guardar.</span>
        </div>
        <div className="field">
          <label>Nota interna</label>
          <textarea className="textarea" rows={2} placeholder="Lo que el cliente pidió, alergias, recordatorios…" />
        </div>
      </div>
    </Modal>
  );
}

const tipoColor = (t) => ({
  limpieza:    "var(--yg)",
  endodoncia:  "var(--ink)",
  ortodoncia:  "rgba(212,245,66,.6)",
  diagnostico: "var(--ink-30)",
  consulta:    "var(--paper-2)",
}[t] || "var(--ink)");

function MiniCal({ selectedDay, onSelect, reservas }) {
  const monthStart = new Date(_Y, _M, 1);
  const startDow = (monthStart.getDay() + 6) % 7; // make Mon=0
  const daysInMonth = new Date(_Y, _M + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthName = new Date(_Y, _M).toLocaleDateString("es-CO", { month: "long", year: "numeric" });

  const tipoPorDia = (d) => {
    const tipos = new Set();
    reservas.filter((r) => _D + r.fecha === d).forEach((r) => tipos.add(r.tipo));
    return [...tipos].slice(0, 3);
  };

  return (
    <div className="mini-cal">
      <div className="row between" style={{ marginBottom: 4 }}>
        <div style={{ fontWeight: 700, fontSize: 14, textTransform: "capitalize" }}>{monthName}</div>
        <div className="row gap-2">
          <button className="btn icon ghost sm"><Icon name="chevron-left" size={14} /></button>
          <button className="btn icon ghost sm"><Icon name="chevron-right" size={14} /></button>
        </div>
      </div>
      <div className="mini-cal-grid">
        {["L","M","M","J","V","S","D"].map((d, i) => <div className="dh" key={i}>{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const tipos = tipoPorDia(d);
          return (
            <button
              key={i}
              className={`d ${selectedDay === d ? "sel" : ""}`}
              onClick={() => onSelect(d)}
            >
              <span>{d}</span>
              <div className="dots">{tipos.map((t, j) => <i key={j} style={{ background: tipoColor(t), opacity: 1 }} />)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function KPIsAgenda() {
  const k = KPI_AGENDA;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12, marginBottom: 18 }}>
      <KPI label="Citas hoy" value={k.citasHoy} hint="3 profesionales activos" />
      <KPI label="Ocupación agenda · semana" value={`${k.ocupacionSem}%`} delta={+2.2} />
      <KPI label="Servicio más solicitado" value={k.topServicio} hint="último mes" />
      <KPI label="Profesional top" value="Dra. Marín" hint="46% de las citas" />
      <KPI label="Duración promedio" value={`${k.duracionProm} min`} hint="excl. consulta" />
      <KPI label="No-show 30d" value={`${k.noShow30d}%`} delta={-1.2} />
      <KPI label="Nuevos vs recurrentes" value={`${k.nuevosVsRecurrentes.nuevos} / ${k.nuevosVsRecurrentes.recurrentes}`} hint="este mes" />
    </div>
  );
}

Object.assign(window, { LienzoAgenda, KPIsAgenda });

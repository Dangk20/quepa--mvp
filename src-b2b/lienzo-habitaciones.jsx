// Quepa B2B · Lienzo Habitaciones (Hoteles / Hostales)
// Rediseño: week board con píldoras suaves + stat cards
const { useState: _uS_hab, useMemo: _uM_hab } = React;

function LienzoHabitaciones({ reservas, clientes, onOpenReserva }) {
  const [weekOffset, setWeekOffset] = _uS_hab(0);
  const [filterTipo, setFilterTipo] = _uS_hab("todos");
  const [selectedDay, setSelectedDay] = _uS_hab(_D); // day-of-month focused
  const [newSlot, setNewSlot] = _uS_hab(null); // { hab, dayStart }

  // Click on empty track → create reservation
  const handleTrackClick = (e, room, weekStartDay) => {
    if (e.target.closest(".hostal-pill")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pctX = x / rect.width;
    const dayOffset = Math.floor(pctX * 7);
    const dayStart = weekStartDay + dayOffset;
    setNewSlot({ hab: room.code, tipo: room.tipo, dayStart });
  };

  // Compute Monday of the visible week (relative to today + weekOffset)
  const weekStart = _uM_hab(() => {
    const d = new Date(_today);
    const dow = (d.getDay() + 6) % 7; // 0 = Mon
    d.setDate(d.getDate() - dow + weekOffset * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [weekOffset]);

  const days = _uM_hab(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  }), [weekStart]);

  const weekStartDay = weekStart.getDate();
  const weekEndDay = days[6].getDate();
  const monthSpan = days[0].getMonth() !== days[6].getMonth()
    ? `${days[0].toLocaleDateString("es-CO", { day: "numeric", month: "short" })} – ${days[6].toLocaleDateString("es-CO", { day: "numeric", month: "short" })}`
    : `${days[0].getDate()}–${days[6].getDate()} ${days[6].toLocaleDateString("es-CO", { month: "long" })}`;

  const visibles = reservas
    .filter((r) => {
      const start = r.diaInicio;
      const end = r.diaInicio + r.noches - 1;
      return end >= weekStartDay && start <= weekEndDay;
    })
    .filter((r) => {
      if (filterTipo === "todos") return true;
      const room = HABS_LAYOUT.find((h) => h.code === r.hab);
      return room?.tipo === filterTipo;
    })
    .sort((a, b) => a.diaInicio - b.diaInicio || a.hab.localeCompare(b.hab));

  // Pill color is by STATE (on-brand: solo paleta Quepa)
  const estadoKlass = (estado) => ({
    "Pagada":     "pagada",
    "Confirmada": "confirmada",
    "Pendiente":  "pendiente",
    "Cancelada":  "cancelada",
  }[estado] || "confirmada");

  // Tiny mono tag of room type (rendered inside pill)
  const roomTag = (tipo) => ({
    "Estándar": "EST",
    "Doble": "DOB",
    "Suite": "SUITE",
    "Dormitorio compartido": "DORM",
  }[tipo] || "—");

  // Sidebar stats reflect SELECTED day
  const arrivalsSel = reservas.filter((r) => r.diaInicio === selectedDay);
  const departuresSel = reservas.filter((r) => r.diaInicio + r.noches === selectedDay);
  const pendingSel = reservas.filter((r) => r.estado === "Pendiente" && r.diaInicio >= selectedDay && r.diaInicio <= selectedDay + 7);

  const selectedActive = (r) =>
    r.diaInicio <= selectedDay && r.diaInicio + r.noches - 1 >= selectedDay;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>
      <div>
        {/* Type tabs (still by room type — they filter what's visible) */}
        <div className="row between" style={{ marginBottom: 12 }}>
          <div className="hostal-type-tabs">
            <button className={`hostal-type-tab ${filterTipo === "todos" ? "on" : ""}`} onClick={() => setFilterTipo("todos")}>
              Todas
              <span className="mono" style={{ opacity: .6, fontSize: 10 }}>{HABS_LAYOUT.length}</span>
            </button>
            <button className={`hostal-type-tab ${filterTipo === "Estándar" ? "on" : ""}`} onClick={() => setFilterTipo("Estándar")}>Estándar</button>
            <button className={`hostal-type-tab ${filterTipo === "Doble" ? "on" : ""}`} onClick={() => setFilterTipo("Doble")}>Doble</button>
            <button className={`hostal-type-tab ${filterTipo === "Suite" ? "on" : ""}`} onClick={() => setFilterTipo("Suite")}>Suite</button>
            <button className={`hostal-type-tab ${filterTipo === "Dormitorio compartido" ? "on" : ""}`} onClick={() => setFilterTipo("Dormitorio compartido")}>Dormitorio</button>
          </div>
          <div className="row gap-2">
            <button className="btn icon ghost sm" onClick={() => setWeekOffset((o) => o - 1)} title="Semana anterior"><Icon name="chevron-left" size={14} /></button>
            <button className="btn ghost sm" onClick={() => { setWeekOffset(0); setSelectedDay(_D); }} disabled={weekOffset === 0 && selectedDay === _D}>Hoy</button>
            <button className="btn icon ghost sm" onClick={() => setWeekOffset((o) => o + 1)} title="Semana siguiente"><Icon name="chevron-right" size={14} /></button>
          </div>
        </div>

        {/* Week strip — days clicables */}
        <div className="hostal-week-strip">
          <div className="hostal-week-meta">
            <span className="lbl">Semana del</span>
            <span className="rng" style={{ textTransform: "capitalize" }}>{monthSpan}</span>
          </div>
          {days.map((d, i) => {
            const isToday = d.toDateString() === _today.toDateString();
            const dayNum = d.getDate();
            const isSelected = dayNum === selectedDay;
            const weekend = d.getDay() === 0 || d.getDay() === 6;
            return (
              <button
                key={i}
                type="button"
                className={`hostal-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${weekend ? "weekend" : ""}`}
                onClick={() => setSelectedDay(dayNum)}
                aria-pressed={isSelected}
              >
                <div className="dow">{["Do","Lu","Ma","Mi","Ju","Vi","Sa"][d.getDay()]}</div>
                <div className="d">{dayNum}</div>
              </button>
            );
          })}
        </div>

        {/* Board */}
        <div className="hostal-board">
          {/* Vertical marker line at selected day */}
          {selectedDay >= weekStartDay && selectedDay <= weekEndDay && (() => {
            const col = selectedDay - weekStartDay;
            const leftPct = ((col + 0.5) / 7) * 100;
            return (
              <div
                className="hostal-day-marker"
                style={{ left: `calc(130px + (100% - 130px) * ${leftPct / 100} + 18px - 130px * ${leftPct / 100})` }}
              />
            );
          })()}
          <div className="hostal-board-head">
            <div className="ttl">Reservas</div>
            <div className="meta row between">
              <span>{visibles.length} {visibles.length === 1 ? "estancia" : "estancias"} en esta semana</span>
              <span>{arrivalsSel.length} llegan el {selectedDay}{selectedDay === _D ? " · hoy" : ""}</span>
            </div>
          </div>

          {visibles.length === 0 ? (
            <EmptyState icon="bed" title="Nadie esta semana." body="No hay reservas en el rango. Crea una manual o espera a que entre por Quepa." />
          ) : (
            visibles.map((r) => {
              const cli = clientes.find((c) => c.id === r.clienteId);
              const room = HABS_LAYOUT.find((h) => h.code === r.hab);
              const startCol = Math.max(0, r.diaInicio - weekStartDay);
              const endCol   = Math.min(7, r.diaInicio - weekStartDay + r.noches);
              const span     = endCol - startCol;
              if (span <= 0) return null;
              const leftPct  = (startCol / 7) * 100;
              const widthPct = (span / 7) * 100;
              const klass    = estadoKlass(r.estado);
              const initials = cli?.nombre.split(" ").map((s) => s[0]).slice(0, 2).join("");
              const isFocus  = selectedActive(r);
              // Solo destacamos las píldoras del día seleccionado cuando NO es hoy
              // (al cargar, todo se ve normal; al hacer click en un día, se destaca).
              const isNonTodayPick = selectedDay !== _D;
              const focusMod = isNonTodayPick ? (isFocus ? "focus" : "dim") : "";

              return (
                <div key={r.id} className="hostal-row">
                  <div className="room-lbl">
                    <span>Hab. {r.hab}</span>
                    <span className="sub">{room?.tipo === "Dormitorio compartido" ? "Compartida" : `cap ${room?.capacidad}`}</span>
                  </div>
                  <div
                    className="hostal-track"
                    onClick={(e) => handleTrackClick(e, room, weekStartDay)}
                    style={{ cursor: "crosshair" }}
                    title="Click para crear reserva"
                  >
                    <div
                      className={`hostal-pill ${klass} ${focusMod}`}
                      style={{ left: `calc(${leftPct}% + 4px)`, width: `calc(${widthPct}% - 8px)` }}
                      onClick={() => onOpenReserva(r)}
                    >
                      <div className="av-w">{initials}</div>
                      <div className="pill-body">
                        <div className="ttl row gap-2">
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cli?.nombre}</span>
                          {r.origen === "quepa" && (
                            <span className="quepa-pip" title="Origen Quepa"><Icon name="whatsapp" size={9} /></span>
                          )}
                        </div>
                        <div className="sub">
                          <span className="room-tag">{roomTag(room?.tipo)}</span>
                          <span>{r.noches}n · {fmtCOP(r.valor)}</span>
                        </div>
                      </div>
                      <button className="more" onClick={(e) => { e.stopPropagation(); onOpenReserva(r); }} aria-label="Ver detalle">
                        <Icon name="more" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Legend (now by status, on brand) */}
          <div className="row gap-3 text-xs" style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)", color: "var(--ink-60)", flexWrap: "wrap" }}>
            <span className="row gap-2"><i style={{ width: 14, height: 8, borderRadius: 999, background: "var(--yg)", display: "inline-block" }} /> Pagada</span>
            <span className="row gap-2"><i style={{ width: 14, height: 8, borderRadius: 999, background: "var(--night)", display: "inline-block" }} /> Confirmada</span>
            <span className="row gap-2"><i style={{ width: 14, height: 8, borderRadius: 999, background: "#fff", border: "1.5px dashed var(--ink)", display: "inline-block" }} /> Pendiente</span>
            <span className="row gap-2"><i style={{ width: 14, height: 8, borderRadius: 999, background: "var(--paper-2)", display: "inline-block" }} /> Cancelada</span>
            <span className="row gap-2" style={{ marginLeft: "auto" }}><Icon name="whatsapp" size={12} color="#25D366" /> Origen Quepa</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="col gap-3">
        {/* Colorful stat cards — on brand */}
        <div className="hostal-stat-cards">
          <div className="hostal-stat arrivals">
            <div className="ic"><Icon name="chevron-right" size={16} /></div>
            <div className="lbl">Llegan{selectedDay !== _D ? " (día " + selectedDay + ")" : " hoy"}</div>
            <div className="val">{arrivalsSel.length}</div>
          </div>
          <div className="hostal-stat departures">
            <div className="ic"><Icon name="chevron-left" size={16} /></div>
            <div className="lbl">Salen</div>
            <div className="val">{departuresSel.length}</div>
          </div>
          <div className="hostal-stat pending">
            <div className="ic"><Icon name="clock" size={16} /></div>
            <div className="lbl">Pend.</div>
            <div className="val">{pendingSel.length}</div>
          </div>
        </div>

        <div className="card">
          <div className="row between" style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              Llegadas {selectedDay === _D ? "hoy" : `· día ${selectedDay}`}
            </div>
            <span className="badge yg">{arrivalsSel.length}</span>
          </div>
          {arrivalsSel.length === 0 && <div className="muted text-sm">Ninguna llegada ese día.</div>}
          {arrivalsSel.map((r) => {
            const c = clientes.find((x) => x.id === r.clienteId);
            return (
              <div className="agenda-row" key={r.id} onClick={() => onOpenReserva(r)} style={{ cursor: "pointer" }}>
                <Avatar name={c?.nombre || "?"} size={32} />
                <div className="info" style={{ marginLeft: 4 }}>
                  <div className="row gap-2">
                    <span className="nm">{c?.nombre}</span>
                    {r.origen === "quepa" && <Icon name="whatsapp" size={11} color="#25D366" />}
                  </div>
                  <div className="meta">Hab. {r.hab} · {r.noches}n · <EstadoMini estado={r.estado} /></div>
                </div>
                <button className="btn sm">Check-in</button>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="row between" style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Salidas {selectedDay === _D ? "hoy" : `· día ${selectedDay}`}</div>
            <span className="badge">{departuresSel.length}</span>
          </div>
          {departuresSel.length === 0 && <div className="muted text-sm">Ninguna salida ese día.</div>}
          {departuresSel.map((r) => {
            const c = clientes.find((x) => x.id === r.clienteId);
            return (
              <div className="agenda-row" key={r.id} onClick={() => onOpenReserva(r)} style={{ cursor: "pointer" }}>
                <Avatar name={c?.nombre || "?"} size={32} />
                <div className="info" style={{ marginLeft: 4 }}>
                  <div className="nm">{c?.nombre}</div>
                  <div className="meta">Hab. {r.hab} · llegó día {r.diaInicio}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini month cal */}
        <HostalMiniCal reservas={reservas} selectedDay={selectedDay} onSelect={setSelectedDay} />
      </div>

      {/* Modal crear reserva de habitación */}
      <ModalCrearHabReserva
        open={!!newSlot}
        onClose={() => setNewSlot(null)}
        slot={newSlot}
      />
    </div>
  );
}

// ============================================================
// Modal · Crear reserva de habitación (al click en slot vacío)
// ============================================================
function ModalCrearHabReserva({ open, onClose, slot }) {
  if (!slot) return null;
  const fechaTxt = (() => {
    const d = new Date(_Y, _M, slot.dayStart);
    return d.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "short" });
  })();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div>
          <div className="row gap-2"><Icon name="bed" size={16} /> Nueva reserva</div>
          <div className="muted text-sm" style={{ fontWeight: 400, marginTop: 4, textTransform: "capitalize" }}>
            Hab. {slot.hab} · {slot.tipo} · check-in {fechaTxt}
          </div>
        </div>
      }
      footer={
        <React.Fragment>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={onClose}>
            <Icon name="check" size={13} /> Crear reserva
          </button>
        </React.Fragment>
      }
    >
      <div className="col gap-3">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div className="field">
            <label>Habitación</label>
            <select className="select mono" defaultValue={slot.hab}>
              {HABS_LAYOUT.map((h) => <option key={h.code} value={h.code}>Hab. {h.code} · {h.tipo}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Check-in</label>
            <input className="input mono" type="date" defaultValue={`${_Y}-${String(_M + 1).padStart(2, "0")}-${String(slot.dayStart).padStart(2, "0")}`} />
          </div>
          <div className="field">
            <label>Noches</label>
            <input className="input mono" type="number" min={1} defaultValue={2} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="field">
            <label>Pax</label>
            <input className="input mono" type="number" min={1} defaultValue={2} />
          </div>
          <div className="field">
            <label>Estado</label>
            <select className="select" defaultValue="Confirmada">
              <option>Pendiente</option><option>Confirmada</option><option>Pagada</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>Huésped</label>
          <input className="input" placeholder="Busca por nombre o WhatsApp, o escribe uno nuevo…" />
          <span className="hint">Si es nuevo, se crea automáticamente al guardar.</span>
        </div>
        <div className="field">
          <label>Nota interna</label>
          <textarea className="textarea" rows={2} placeholder="Llegada tarde, mascota, early check-in…" />
        </div>
      </div>
    </Modal>
  );
}

function EstadoMini({ estado }) {
  const color = ({
    Pagada: "rgba(10,10,10,.7)",
    Confirmada: "rgba(255,255,255,.95)",
    Pendiente: "rgba(10,10,10,.7)",
    Cancelada: "rgba(10,10,10,.5)",
  })[estado] || "currentColor";
  return <span style={{ color: "inherit", fontWeight: 600, textTransform: "lowercase", opacity: .8 }}>{estado.toLowerCase()}</span>;
}

function HostalMiniCal({ reservas, selectedDay, onSelect }) {
  const monthStart = new Date(_Y, _M, 1);
  const startDow = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(_Y, _M + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const monthName = new Date(_Y, _M).toLocaleDateString("es-CO", { month: "long", year: "numeric" });

  // Count reservations per day (any overlap)
  const countPerDay = {};
  reservas.forEach((r) => {
    if (r.estado === "Cancelada") return;
    for (let d = r.diaInicio; d < r.diaInicio + r.noches; d++) {
      countPerDay[d] = (countPerDay[d] || 0) + 1;
    }
  });

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
          const count = countPerDay[d] || 0;
          const heat = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : 3;
          const isToday = d === _D;
          const isSelected = d === selectedDay;
          let bg = "transparent", fg = "var(--ink)", border = "transparent";
          if (heat === 1) { bg = "rgba(212,245,66,.22)"; }
          else if (heat === 2) { bg = "rgba(212,245,66,.5)"; }
          else if (heat === 3) { bg = "var(--yg)"; }
          if (isSelected) { bg = "var(--night)"; fg = "#fff"; }
          else if (isToday) { border = "var(--night)"; }
          return (
            <button
              key={i}
              onClick={() => onSelect(d)}
              className="d"
              style={{
                background: bg,
                color: fg,
                fontWeight: heat > 1 || isSelected ? 700 : 500,
                border: `1.5px solid ${border}`,
              }}
              title={count ? `${count} ${count === 1 ? "reserva" : "reservas"}` : "sin reservas"}
            >
              <span>{d}</span>
            </button>
          );
        })}
      </div>
      <div className="row gap-3 text-xs muted" style={{ marginTop: 10 }}>
        <span className="row gap-2"><i style={{ width: 10, height: 10, borderRadius: 3, background: "rgba(212,245,66,.22)", display: "inline-block" }} /> 1–2</span>
        <span className="row gap-2"><i style={{ width: 10, height: 10, borderRadius: 3, background: "rgba(212,245,66,.5)", display: "inline-block" }} /> 3–5</span>
        <span className="row gap-2"><i style={{ width: 10, height: 10, borderRadius: 3, background: "var(--yg)", display: "inline-block" }} /> 6+</span>
        <span className="row gap-2" style={{ marginLeft: "auto" }}><i style={{ width: 10, height: 10, borderRadius: 3, background: "var(--night)", display: "inline-block" }} /> Seleccionado</span>
      </div>
    </div>
  );
}

function KPIsHabitaciones() {
  const k = KPI_HABS;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr) 1.4fr 1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
      <KPI label="Ocupación esta noche" value={`${k.ocupacionHoy}%`} hint="9 / 12 habitaciones" />
      <div className="kpi">
        <div className="lbl">Ocupación próx. 7 días</div>
        <div className="row between" style={{ alignItems: "flex-end" }}>
          <div className="val">{k.ocupacion7d}%</div>
          <Spark data={k.ocupacion7dSpark} color="#D4F542" w={70} h={24} fill />
        </div>
      </div>
      <KPI label="ADR · tarifa promedio" value={fmtCOP(k.adr)} delta={+5.1} />
      <KPI label="RevPAR" value={fmtCOP(k.revpar)} delta={+3.4} />
      <KPI label="Estancia promedio" value={`${k.estanciaProm} noches`} hint="Mediana: 2 noches" />
      <KPI label="Top tipo último mes" value={k.topTipo} hint="46% de las noches" />
      <KPI label="Lead time" value={`${k.leadTime}d`} hint="Reserva → check-in" />
      <KPI label="Cancelaciones 30d" value={`${k.cancel30d}%`} delta={-2.1} />
    </div>
  );
}

Object.assign(window, { LienzoHabitaciones, KPIsHabitaciones });

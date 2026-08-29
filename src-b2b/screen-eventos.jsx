// Quepa B2B · Ventas (movimientos + métricas)
const { useState: _uS_evt, useMemo: _uM_evt } = React;

// Periodos disponibles y multiplicadores sobre la data base (mes)
const PERIODOS = [
  { id: "semana",         label: "Esta semana",   mult: 0.26, ticketMult: 0.98 },
  { id: "mes",            label: "Este mes",      mult: 1,    ticketMult: 1 },
  { id: "ano",            label: "Este año",      mult: 11.4, ticketMult: 1.06 },
  { id: "personalizado",  label: "Personalizado", mult: 1,    ticketMult: 1 },
];

const TITULOS_POR_PERIODO = {
  semana: {
    ventas: "VENTAS DE LA SEMANA",
    deltaLabel: "vs semana pasada",
    reservas: "RESERVAS DE LA SEMANA",
    curvaLabel: "Comparativo diario · semana actual vs semana anterior",
    curvaLeyendaA: "Esta semana",
    curvaLeyendaB: "Semana pasada",
    diaTitle: "Ventas por día",
    diaHint: "últimos 7d",
  },
  mes: {
    ventas: "VENTAS DEL MES",
    deltaLabel: "vs mes anterior",
    reservas: "RESERVAS PAGADAS",
    curvaLabel: "Comparativo semanal · mes actual vs mes anterior",
    curvaLeyendaA: "Mayo",
    curvaLeyendaB: "Abril",
    diaTitle: "Ventas por día de semana",
    diaHint: "últimos 30d",
  },
  ano: {
    ventas: "VENTAS DEL AÑO",
    deltaLabel: "vs año pasado",
    reservas: "RESERVAS DEL AÑO",
    curvaLabel: "Comparativo mensual · año actual vs año anterior",
    curvaLeyendaA: "2026",
    curvaLeyendaB: "2025",
    diaTitle: "Ventas por mes",
    diaHint: "últimos 12 meses",
  },
  personalizado: {
    ventas: "VENTAS DEL PERIODO",
    deltaLabel: "vs periodo anterior",
    reservas: "RESERVAS DEL PERIODO",
    curvaLabel: "Comparativo del periodo seleccionado",
    curvaLeyendaA: "Periodo",
    curvaLeyendaB: "Anterior",
    diaTitle: "Ventas por día",
    diaHint: "rango seleccionado",
  },
};

function ScreenEventos({ estab, onNav }) {
  const data = EVENTOS.sazon;
  const [origen, setOrigen] = _uS_evt("todos");
  const [tab, setTab] = _uS_evt("metricas");
  const [periodo, setPeriodo] = _uS_evt("mes");
  const [openCustom, setOpenCustom] = _uS_evt(false);
  const [rangoCustom, setRangoCustom] = _uS_evt({ desde: "", hasta: "" });

  const periodoCfg = PERIODOS.find((p) => p.id === periodo) || PERIODOS[1];
  const titulos = TITULOS_POR_PERIODO[periodo];

  // Recalculamos métricas según multiplicador
  const ventasPeriodo = Math.round(data.ventasMes * periodoCfg.mult);
  const ventasAnt     = Math.round(data.ventasMesAnt * periodoCfg.mult);
  const ticketPromedio = Math.round(data.ticketProm * periodoCfg.ticketMult);
  const reservasPagadas = Math.round(data.reservasPagadas * periodoCfg.mult);
  const delta = ventasAnt ? ((ventasPeriodo - ventasAnt) / ventasAnt * 100) : 0;
  const movFiltrado = origen === "todos" ? data.movimientos : data.movimientos.filter((m) => m.origen === origen);
  const ventasQuepa = data.movimientos.filter((m) => m.origen === "quepa").reduce((a, c) => a + c.valor, 0) * periodoCfg.mult;
  const ventasManual = data.movimientos.filter((m) => m.origen === "manual").reduce((a, c) => a + c.valor, 0) * periodoCfg.mult;

  // Curva por periodo
  const curvaData = _uM_evt(() => {
    if (periodo === "semana") {
      const baseHoy = [320000, 410000, 580000, 720000, 920000, 1100000, 480000];
      const baseAnt = [280000, 360000, 540000, 660000, 870000, 1020000, 440000];
      return ["L", "M", "M", "J", "V", "S", "D"].map((s, i) => ({ s, actual: baseHoy[i], anterior: baseAnt[i] }));
    }
    if (periodo === "ano") {
      const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
      return meses.map((m, i) => ({
        s: m,
        actual: i < 5 ? Math.round(14000000 + Math.random() * 6000000) : (i === 5 ? 22500000 : 0),
        anterior: Math.round(12000000 + Math.random() * 5000000),
      }));
    }
    return [
      { s: "S1", actual: 3850000, anterior: 3120000 },
      { s: "S2", actual: 4520000, anterior: 5180000 },
      { s: "S3", actual: 6280000, anterior: 4960000 },
      { s: "S4", actual: 3800000, anterior: 4460000 },
    ];
  }, [periodo]);

  const maxCurva = Math.max(...curvaData.flatMap((c) => [c.actual, c.anterior]));
  const picoSemana = curvaData.filter((c) => c.actual > 0).reduce((a, c) => c.actual > a.actual ? c : a, curvaData[0]);

  // Ventas por día/mes según periodo
  const ventasPorDia = _uM_evt(() => {
    if (periodo === "ano") {
      return [
        { dia: "Ene", val: 14500000 },
        { dia: "Feb", val: 16200000 },
        { dia: "Mar", val: 18400000 },
        { dia: "Abr", val: 16720000 },
        { dia: "May", val: 18450000 },
        { dia: "Jun", val: 22500000 },
      ];
    }
    if (periodo === "semana") {
      return [
        { dia: "Lun", val: 320000 }, { dia: "Mar", val: 410000 }, { dia: "Mié", val: 580000 },
        { dia: "Jue", val: 720000 }, { dia: "Vie", val: 920000 }, { dia: "Sáb", val: 1100000 }, { dia: "Dom", val: 480000 },
      ];
    }
    return [
      { dia: "Lun", val: 1200000 }, { dia: "Mar", val: 1850000 }, { dia: "Mié", val: 2100000 },
      { dia: "Jue", val: 2680000 }, { dia: "Vie", val: 4620000 }, { dia: "Sáb", val: 5100000 }, { dia: "Dom", val: 2300000 },
    ];
  }, [periodo]);
  const maxDia = Math.max(...ventasPorDia.map((d) => d.val));
  const mejorDia = ventasPorDia.reduce((a, c) => c.val > a.val ? c : a, ventasPorDia[0]);

  const rangoCustomLabel = (rangoCustom.desde && rangoCustom.hasta)
    ? `${rangoCustom.desde} → ${rangoCustom.hasta}`
    : "Personalizado";

  return (
    <div className="page-pad">
      <div className="page-h">
        <div>
          <div className="eyebrow">Ventas · movimientos pagados</div>
          <h1>Lo que entró al negocio.</h1>
          <div className="sub">
            Mostrando datos del periodo: <strong>{periodo === "personalizado" ? rangoCustomLabel : periodoCfg.label.toLowerCase()}</strong>. Solo se computan reservas marcadas como Pagadas.
          </div>
        </div>
        <div className="row gap-2" style={{ position: "relative" }}>
          <div className="seg">
            {PERIODOS.filter((p) => p.id !== "personalizado").map((p) => (
              <button key={p.id} className={periodo === p.id ? "on" : ""} onClick={() => setPeriodo(p.id)}>{p.label}</button>
            ))}
            <button
              className={periodo === "personalizado" ? "on" : ""}
              onClick={() => { setPeriodo("personalizado"); setOpenCustom(true); }}
            >
              <Icon name="calendar" size={11} /> {periodo === "personalizado" ? rangoCustomLabel : "Personalizado"}
            </button>
          </div>
          <button className="btn"><Icon name="external" size={13} /> Exportar</button>
          {openCustom && (
            <div
              className="card"
              style={{
                position: "absolute", top: "calc(100% + 6px)", right: 110,
                zIndex: 90, padding: 16, minWidth: 320, boxShadow: "var(--shadow-lg)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="eyebrow" style={{ marginBottom: 8 }}>Rango personalizado</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div className="field"><label>Desde</label><input className="input" type="date" value={rangoCustom.desde} onChange={(e) => setRangoCustom({ ...rangoCustom, desde: e.target.value })} /></div>
                <div className="field"><label>Hasta</label><input className="input" type="date" value={rangoCustom.hasta} onChange={(e) => setRangoCustom({ ...rangoCustom, hasta: e.target.value })} /></div>
              </div>
              <div className="row gap-2" style={{ marginTop: 10, justifyContent: "flex-end" }}>
                <button className="btn ghost sm" onClick={() => setOpenCustom(false)}>Cancelar</button>
                <button className="btn primary sm" onClick={() => setOpenCustom(false)}>Aplicar</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div className="kpi" style={{ background: "var(--yg)", borderColor: "var(--yg)" }}>
          <div className="lbl" style={{ color: "var(--ink)" }}>{titulos.ventas}</div>
          <div className="val" style={{ fontSize: 34 }}>{fmtCOP(ventasPeriodo)}</div>
          <div className="row gap-2" style={{ fontSize: 12, fontWeight: 600 }}>
            <Icon name={delta >= 0 ? "trending-up" : "trending-down"} size={13} />
            <span>{delta >= 0 ? "+" : ""}{delta.toFixed(1)}% {titulos.deltaLabel} ({fmtCOP(ventasAnt)})</span>
          </div>
        </div>
        <KPI label="TICKET PROMEDIO" value={fmtCOP(ticketPromedio)} delta={+5.2} />
        <KPI
          label={titulos.reservas}
          value={reservasPagadas}
          hint={`${Math.round(reservasPagadas * 0.4)} origen Quepa · ${Math.round(reservasPagadas * 0.6)} manual`}
        />
        <div className="kpi">
          <div className="lbl">DISTRIBUCIÓN DE ORIGEN</div>
          <div style={{ marginTop: 6 }}>
            <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", background: "var(--paper)" }}>
              <div style={{ width: `${(ventasQuepa / (ventasQuepa + ventasManual)) * 100}%`, background: "var(--yg)" }} />
              <div style={{ width: `${(ventasManual / (ventasQuepa + ventasManual)) * 100}%`, background: "var(--ink)" }} />
            </div>
            <div className="col gap-2" style={{ marginTop: 10, fontSize: 11 }}>
              <span className="row between" style={{ alignItems: "center" }}>
                <span className="row gap-2"><i style={{ width: 8, height: 8, borderRadius: 999, background: "var(--yg)" }} /> Quepa</span>
                <span className="mono dim">{fmtCOP(ventasQuepa)}</span>
              </span>
              <span className="row between" style={{ alignItems: "center" }}>
                <span className="row gap-2"><i style={{ width: 8, height: 8, borderRadius: 999, background: "var(--ink)" }} /> Manual</span>
                <span className="mono dim">{fmtCOP(ventasManual)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row between" style={{ marginBottom: 16 }}>
        <div className="seg">
          <button className={tab === "metricas" ? "on" : ""} onClick={() => setTab("metricas")}>
            <Icon name="trending-up" size={13} /> Métricas
          </button>
          <button className={tab === "historial" ? "on" : ""} onClick={() => setTab("historial")}>
            <Icon name="table" size={13} /> Historial
            <span className="mono" style={{ opacity: .6, fontSize: 10, marginLeft: 4 }}>{data.movimientos.length}</span>
          </button>
        </div>
        <div className="mono text-xs dim row gap-2">
          <Icon name="filter" size={11} />
          Filtro activo: <strong style={{ color: "var(--ink)" }}>{periodo === "personalizado" ? rangoCustomLabel : periodoCfg.label}</strong>
        </div>
      </div>

      {tab === "metricas" && (
        <div className="col gap-3">
          <div className="card" style={{ padding: 22 }}>
            <div className="row between" style={{ marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.015em" }}>Curva de ingresos</div>
                <div className="muted text-sm" style={{ marginTop: 2 }}>{titulos.curvaLabel}</div>
              </div>
              <div className="row gap-3 text-xs">
                <span className="row gap-2"><i style={{ width: 12, height: 12, background: "var(--yg)", borderRadius: 3, display: "inline-block" }} /> {titulos.curvaLeyendaA}</span>
                <span className="row gap-2"><i style={{ width: 12, height: 12, background: "var(--line-2)", borderRadius: 3, display: "inline-block" }} /> {titulos.curvaLeyendaB}</span>
              </div>
            </div>

            <CurvaIngresos data={curvaData} max={maxCurva} />

            <div style={{ marginTop: 18, padding: "12px 14px", background: "var(--paper)", borderRadius: 10, borderLeft: "3px solid var(--yg)" }}>
              <div className="row gap-2" style={{ alignItems: "flex-start" }}>
                <Icon name="alert" size={14} color="var(--ink)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div className="text-sm" style={{ color: "var(--ink-70)" }}>
                  El pico se registró en <strong style={{ color: "var(--ink)" }}>{picoSemana.s} ({fmtCOP(picoSemana.actual)})</strong> — {periodo === "semana" ? "el sábado fue el día más fuerte." : periodo === "ano" ? "junio rompió récord histórico." : "coincide con la campaña Impulsa \"Cena temática Bandeja Paisa\"."} {picoSemana.anterior > 0 && `+${Math.round(((picoSemana.actual - picoSemana.anterior) / picoSemana.anterior) * 100)}% vs periodo anterior.`}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="card" style={{ padding: 20 }}>
              <div className="row between" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{titulos.diaTitle}</div>
                <span className="mono text-xs dim">{titulos.diaHint}</span>
              </div>
              <div className="col gap-2">
                {ventasPorDia.map((d) => (
                  <div key={d.dia} className="row gap-3" style={{ alignItems: "center" }}>
                    <div className="mono" style={{ width: 42, fontSize: 11, color: "var(--ink-60)", fontWeight: 600 }}>{d.dia}</div>
                    <div style={{ flex: 1, height: 18, background: "var(--paper)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        width: `${(d.val / maxDia) * 100}%`,
                        height: "100%",
                        background: d.val === maxDia ? "var(--yg)" : "var(--ink)",
                        opacity: d.val === maxDia ? 1 : 0.85,
                        borderRadius: 4,
                      }} />
                    </div>
                    <div className="mono" style={{ width: 110, textAlign: "right", fontSize: 11, fontWeight: 600 }}>{fmtCOP(d.val)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div className="row between" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Indicadores clave</div>
                <span className="mono text-xs dim">{periodoCfg.label.toLowerCase()}</span>
              </div>
              <div className="col gap-3">
                <MetricRow label="Ticket promedio" value={fmtCOP(ticketPromedio)} delta={+5.2} />
                <MetricRow label={periodo === "ano" ? "Mejor mes" : "Mejor día"} value={mejorDia.dia} hint={`${fmtCOP(mejorDia.val)} promedio`} />
                <MetricRow label="Hora pico de ventas" value="20:00–22:00" hint="38% de las ventas" />
                <MetricRow label="Conversión Quepa → reserva" value="62%" delta={+8.4} />
                <MetricRow label="Cobros pendientes" value={fmtCOP(Math.round(720000 * periodoCfg.mult))} hint={`${Math.round(3 * periodoCfg.mult)} reservas confirmadas sin pagar`} />
                <MetricRow label="Reembolsos" value={fmtCOP(Math.round(180000 * periodoCfg.mult))} hint={`${Math.round(2 * periodoCfg.mult)} cancelaciones aplicaron`} warning />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div className="row between" style={{ marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Top clientes · {periodo === "personalizado" ? rangoCustomLabel : periodoCfg.label.toLowerCase()}</div>
                <div className="muted text-xs" style={{ marginTop: 2 }}>Quienes más gastaron en el periodo.</div>
              </div>
              <button className="btn ghost sm" onClick={() => onNav?.("clientes")}>
                <Icon name="users" size={13} /> Ver todos los clientes <Icon name="chevron-right" size={12} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
              {data.movimientos.slice(0, 5).sort((a, b) => b.valor - a.valor).map((m, i) => (
                <div key={m.id} style={{
                  background: i === 0 ? "var(--night)" : "var(--paper)",
                  color: i === 0 ? "#fff" : "var(--ink)",
                  borderRadius: 12,
                  padding: 14,
                }}>
                  <div className="row gap-2" style={{ alignItems: "center", marginBottom: 10 }}>
                    <Avatar name={m.cliente} size={32} tone={i === 0 ? "yg" : "ink"} />
                    <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", opacity: 0.6, fontWeight: 600 }}>#{i + 1}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.15 }}>{m.cliente}</div>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 700, marginTop: 6, color: i === 0 ? "var(--yg)" : "var(--ink)" }}>{fmtCOP(Math.round(m.valor * periodoCfg.mult))}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "historial" && (
        <div className="card" style={{ padding: 0 }}>
          <div className="row between" style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              Movimientos · {movFiltrado.length} pagos
              <span className="mono text-xs dim" style={{ marginLeft: 8 }}>· {periodo === "personalizado" ? rangoCustomLabel : periodoCfg.label.toLowerCase()}</span>
            </div>
            <div className="row gap-2">
              <div className="seg">
                <button className={origen === "todos" ? "on" : ""} onClick={() => setOrigen("todos")}>Todos</button>
                <button className={origen === "quepa" ? "on" : ""} onClick={() => setOrigen("quepa")}><Icon name="whatsapp" size={11} /> Quepa</button>
                <button className={origen === "manual" ? "on" : ""} onClick={() => setOrigen("manual")}>Manual</button>
              </div>
            </div>
          </div>
          <table className="tbl">
            <thead>
              <tr><th>Fecha</th><th>Cliente</th><th>Reserva</th><th>Origen</th><th>Valor (COP)</th></tr>
            </thead>
            <tbody>
              {movFiltrado.map((m) => (
                <tr key={m.id}>
                  <td className="mono text-sm">{m.fecha === 0 ? "Hoy" : `Hace ${-m.fecha} d`}</td>
                  <td>
                    <div className="row gap-2">
                      <Avatar name={m.cliente} size={26} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{m.cliente}</span>
                    </div>
                  </td>
                  <td className="text-sm">{m.reserva}</td>
                  <td><OriginBadge origin={m.origen} /></td>
                  <td className="mono" style={{ fontWeight: 700 }}>{fmtCOP(m.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CurvaIngresos({ data, max }) {
  const picoVal = Math.max(...data.map((x) => x.actual));
  return (
    <div style={{ position: "relative", height: 240 }}>
      <div style={{
        position: "absolute", inset: "20px 0 32px 0",
        display: "grid",
        gridTemplateColumns: `repeat(${data.length}, 1fr)`,
        gap: 24,
        alignItems: "flex-end",
      }}>
        {data.map((d) => {
          const hActual = (d.actual / max) * 100;
          const hAnt    = (d.anterior / max) * 100;
          const isPico  = d.actual === picoVal;
          return (
            <div key={d.s} style={{ display: "flex", gap: 6, height: "100%", alignItems: "flex-end", justifyContent: "center" }}>
              <div
                style={{
                  width: 42,
                  height: `${hAnt}%`,
                  background: "var(--line-2)",
                  borderRadius: "6px 6px 0 0",
                }}
                title={`Mes anterior: ${fmtCOP(d.anterior)}`}
              />
              <div
                style={{
                  width: 42,
                  height: `${hActual}%`,
                  background: "var(--yg)",
                  borderRadius: "6px 6px 0 0",
                  position: "relative",
                  boxShadow: isPico ? "0 0 0 2px var(--ink)" : "none",
                }}
                title={`Mes actual: ${fmtCOP(d.actual)}`}
              >
                {isPico && (
                  <div style={{
                    position: "absolute", top: -24, left: "50%", transform: "translateX(-50%)",
                    background: "var(--ink)", color: "var(--yg)",
                    padding: "2px 8px", borderRadius: 999,
                    fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                    whiteSpace: "nowrap",
                  }}>PICO</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        display: "grid",
        gridTemplateColumns: `repeat(${data.length}, 1fr)`,
        gap: 24,
        paddingTop: 8,
        borderTop: "1px solid var(--line)",
      }}>
        {data.map((d) => (
          <div key={d.s} style={{ textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-60)", letterSpacing: "0.06em" }}>{d.s}</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-30)", marginTop: 2 }}>{fmtCOP(d.actual)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricRow({ label, value, delta, hint, warning }) {
  return (
    <div className="row between" style={{ alignItems: "flex-start", padding: "8px 0", borderBottom: "1px dashed var(--line)" }}>
      <div style={{ flex: 1 }}>
        <div className="mono text-xs dim" style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
        <div className="row gap-2" style={{ marginTop: 2, alignItems: "baseline" }}>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: warning ? "var(--rose)" : "var(--ink)" }}>{value}</span>
          {delta != null && (
            <span className={`delta ${delta >= 0 ? "up" : "down"}`} style={{ fontSize: 11 }}>
              <Icon name={delta >= 0 ? "trending-up" : "trending-down"} size={11} />
              {delta >= 0 ? "+" : ""}{delta}%
            </span>
          )}
        </div>
        {hint && <div className="text-xs dim" style={{ marginTop: 2 }}>{hint}</div>}
      </div>
    </div>
  );
}

Object.assign(window, { ScreenEventos });

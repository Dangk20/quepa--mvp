// Quepa B2B · Clientes (+ Card Cliente Ideal — corona de tags)
const { useState: _uS_cli, useMemo: _uM_cli } = React;

function ScreenClientes({ estab }) {
  const [q, setQ] = _uS_cli("");
  const [verPerfil, setVerPerfil] = _uS_cli(null);
  const [openEvo, setOpenEvo] = _uS_cli(false);
  const clientes = CLIENTES[estab.id] || [];
  const filtered = clientes.filter((c) => c.nombre.toLowerCase().includes(q.toLowerCase()) || c.wa.includes(q));

  const ideal = CLIENTE_IDEAL[estab.id];
  const enConstruccion = ideal?.estado === "construccion";

  const stats = {
    total: clientes.length,
    nuevos: clientes.filter((c) => c.tipo === "Nuevo").length,
    activos: clientes.filter((c) => Math.abs(c.ultimo) <= 30).length,
    recurrentes: clientes.filter((c) => c.reservas >= 2).length,
  };

  return (
    <div className="page-pad">
      <div className="page-h">
        <div>
          <div className="eyebrow">Clientes</div>
          <h1>Tus clientes</h1>
          <div className="sub">Todos los WhatsApps que reservaron contigo, alguna vez, por cualquier canal.</div>
        </div>
        <div className="row gap-2">
          <button className="btn"><Icon name="filter" size={13} /> Filtros</button>
          <button className="btn primary"><Icon name="plus" size={13} /> Crear cliente</button>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        <KPI label="Nuevos · 30 días"   value={stats.nuevos}   delta={+12.5} />
        <KPI label="Activos · 30 días"  value={stats.activos}  delta={+3.1} />
        <KPI label="Total"              value={stats.total}    hint="histórico completo" />
        <KPI label="Recurrentes (≥2)"   value={stats.recurrentes} delta={+8.0} />
      </div>

      {/* Card cliente ideal */}
      <ClienteIdealCard ideal={ideal} estab={estab} onOpenEvo={() => setOpenEvo(true)} />

      {/* Tabla de clientes */}
      <div className="row between" style={{ margin: "32px 0 12px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>Tu base de clientes</h2>
        <div className="hdr-search" style={{ width: 320 }}>
          <Icon name="search" size={14} />
          <input placeholder="Busca por nombre o WhatsApp..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>WhatsApp</th>
              <th>Día que más reserva</th>
              <th>Reservas</th>
              <th>Ticket promedio</th>
              <th>Tipo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} onClick={() => setVerPerfil(c)} style={{ cursor: "pointer" }}>
                <td>
                  <div className="row gap-3">
                    <Avatar name={c.nombre} size={32} />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.nombre}</div>
                      <div className="row gap-2 text-xs muted">
                        {c.tags.slice(0, 2).map((t, i) => <span key={i} style={{ background: "var(--paper)", padding: "1px 6px", borderRadius: 4 }}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="mono text-sm">{c.wa}</td>
                <td>
                  <span className="row gap-2 text-sm">
                    <span style={{ fontWeight: 600 }}>{c.dia}</span>
                    <span className="dim">· {c.franja}</span>
                  </span>
                </td>
                <td className="mono text-sm">
                  <span style={{ fontWeight: 600 }}>{c.reservas}</span>
                  <span className="dim"> · {Math.round((c.cumplidas / Math.max(1, c.reservas)) * 100)}% ok</span>
                </td>
                <td className="mono text-sm">{c.ticketProm ? fmtCOP(c.ticketProm) : "—"}</td>
                <td><Badge variant={c.tipo === "Frecuente" ? "yg" : c.tipo === "Recurrente" ? "leaf" : "default"}>{c.tipo}</Badge></td>
                <td className="row-action">
                  <button className="btn ghost sm">Ver <Icon name="chevron-right" size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {verPerfil && <PerfilClienteDrawer cliente={verPerfil} estab={estab} onClose={() => setVerPerfil(null)} />}

      {/* Modal Buyer Persona generado con IA */}
      <ModalBuyerPersona
        open={openEvo}
        onClose={() => setOpenEvo(false)}
        ideal={ideal}
        estab={estab}
      />
    </div>
  );
}

// ============================================================
// Modal Buyer Persona · descripción generada con IA
// ============================================================
function ModalBuyerPersona({ open, onClose, ideal, estab }) {
  const [desc, setDesc] = _uS_cli("");
  const [loading, setLoading] = _uS_cli(false);
  const [error, setError] = _uS_cli(false);

  React.useEffect(() => {
    if (!open || !ideal) return;
    setDesc("");
    setError(false);
    setLoading(true);
    const topTags = [...ideal.tags].sort((a, b) => b.pct - a.pct).slice(0, 8);
    const promptStr = `Eres un perfilador de buyer personas para "${estab.name}" (${estab.descripcion}, ${estab.city}, Colombia). Con base en estos motivos por los que la gente lo escoge en WhatsApp en los últimos 90 días (${ideal.sesiones} sesiones): ${topTags.map((t) => `"${t.text}" ${t.pct}%`).join(", ")}. Escribe 2 párrafos cortos (máx 90 palabras total) en español de Colombia, tono cercano sin ser corporativo. Empieza por quién es la persona ("Persona joven adulta...") y termina con qué espera. Sin viñetas, sin saludos, sin "como IA", sin headlines — solo dos párrafos descriptivos en prosa.`;

    let mounted = true;
    if (window.claude && window.claude.complete) {
      window.claude.complete(promptStr).then((r) => {
        if (mounted) { setDesc(r); setLoading(false); }
      }).catch(() => {
        if (mounted) { setError(true); setLoading(false); }
      });
    } else {
      // Fallback estático on-brand
      setTimeout(() => {
        if (!mounted) return;
        setDesc(`Persona joven adulta que busca un sitio con vista al río y ambiente romántico para celebrar momentos importantes — aniversarios, cumpleaños, una cena cuando viene de afuera. Reserva con días de anticipación, casi siempre para dos personas, prefiere la franja de cena (19–22h).\n\nEspera que el lugar le ahorre el "dónde llevo a X", que el plato sea memorable y que la mesa tenga vista. Está dispuesto a pagar un poco más si el ambiente lo justifica. Si la experiencia es buena, vuelve — y trae a alguien más.`);
        setLoading(false);
      }, 1400);
    }
    return () => { mounted = false; };
  }, [open, ideal?.sesiones]);

  if (!ideal) return null;

  const topTags = [...ideal.tags].sort((a, b) => b.pct - a.pct).slice(0, 6);

  return (
    <Modal open={open} onClose={onClose} className="modal-wide" title={null}>
      <div style={{ background: "var(--night)", color: "#fff", margin: "-22px -24px", padding: "32px 28px", borderRadius: "16px 16px 0 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%, rgba(212,245,66,.1), transparent 60%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative" }}>
          <div className="qstar-radar" style={{ width: 140, height: 140 }}>
            <div className="qstar-ring r1" />
            <div className="qstar-ring r2" />
            <div className="qstar-ring r3" />
            <div className="qstar-orbit orb1"><i /></div>
            <div className="qstar-orbit orb2"><i /></div>
            <div className="qstar-orbit orb3"><i /></div>
            <div className="qstar-core" style={{ border: "2px solid var(--yg)", width: 100, height: 100 }}>
              <div className="qstar-spin"><QStar size={44} fill="#D4F542" /></div>
            </div>
          </div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,.5)", textTransform: "uppercase", marginTop: 6 }}>
            Quepa AI · perfil agentic
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em", color: "#fff" }}>Tu cliente ideal</div>
          <div className="mono text-xs" style={{ color: "rgba(255,255,255,.55)" }}>
            generado a partir de {ideal.sesiones} sesiones · {estab.name}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24, padding: "24px 4px 4px" }}>
        {/* Bars con top motivos */}
        <div>
          <div className="mono text-xs" style={{ letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-50)", marginBottom: 12 }}>
            Top motivos
          </div>
          <div className="col gap-3">
            {topTags.map((t, i) => (
              <div key={i}>
                <div className="row between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>{t.text}</span>
                  <span className="mono text-xs" style={{ color: "var(--ink-50)" }}>{t.pct}%</span>
                </div>
                <div style={{ height: 8, background: "var(--paper)", borderRadius: 999, overflow: "hidden", position: "relative" }}>
                  <div style={{
                    width: `${t.pct}%`,
                    height: "100%",
                    background: i === 0 ? "var(--yg)" : "var(--ink)",
                    borderRadius: 999,
                    animation: `barGrow .8s cubic-bezier(.2,.7,.3,1) ${i * 0.08}s both`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Descripción generada */}
        <div>
          <div className="row between" style={{ marginBottom: 12 }}>
            <div className="mono text-xs" style={{ letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-50)" }}>
              Descripción · {loading ? "generando…" : error ? "error" : "lista"}
            </div>
            <div className="row gap-2 mono text-xs" style={{ color: loading ? "var(--yg)" : "var(--leaf)", fontWeight: 600 }}>
              {loading ? <span className="ai-dot" /> : <Icon name="check" size={11} />}
              {loading ? "Quepa AI" : "Generado"}
            </div>
          </div>
          {loading ? (
            <div className="col gap-2">
              <div className="skel" style={{ height: 12, width: "92%" }} />
              <div className="skel" style={{ height: 12, width: "98%" }} />
              <div className="skel" style={{ height: 12, width: "85%" }} />
              <div className="skel" style={{ height: 12, width: "76%" }} />
              <div style={{ height: 14 }} />
              <div className="skel" style={{ height: 12, width: "94%" }} />
              <div className="skel" style={{ height: 12, width: "88%" }} />
              <div className="skel" style={{ height: 12, width: "70%" }} />
            </div>
          ) : error ? (
            <div className="text-sm muted">No pudimos generar la descripción ahora. Intenta de nuevo.</div>
          ) : (
            <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink)", whiteSpace: "pre-wrap" }}>
              {desc}
            </div>
          )}
          <div style={{ marginTop: 16, padding: "10px 12px", background: "var(--paper)", borderRadius: 10, fontSize: 11.5, color: "var(--ink-60)", lineHeight: 1.4 }}>
            <Icon name="alert" size={11} style={{ marginRight: 6, verticalAlign: -1 }} />
            Quepa AI redacta esta descripción cada vez que abres el panel, con base en lo que escogen tu negocio. <strong>No es un texto fijo</strong> — el perfil cambia con la data.
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================
// CLIENTE IDEAL — Banner unificado (estilo "en construcción" para todos)
// ============================================================
function ClienteIdealCard({ ideal, estab, onOpenEvo }) {
  if (!ideal) return null;

  const enConstruccion = ideal.estado === "construccion";
  const objetivoSesiones = 200; // referencia para mostrar avance
  const pctAvance = enConstruccion
    ? Math.min(100, (ideal.sesiones / 30) * 100)  // pre-umbral: avanza a 30
    : Math.min(100, (ideal.sesiones / objetivoSesiones) * 100);

  // Top tags ordenados por pct
  const topTags = [...ideal.tags].sort((a, b) => b.pct - a.pct).slice(0, 8);

  return (
    <div style={{
      background: "var(--night)", borderRadius: 18, padding: "26px 28px",
      color: "#fff", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none",
        background: `radial-gradient(circle at 100% 0%, var(--yg), transparent 50%)`,
      }} />
      {/* Header */}
      <div className="row between" style={{ marginBottom: 18, position: "relative", alignItems: "flex-start" }}>
        <div>
          <div className="row gap-2 mono" style={{ color: "var(--yg)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>
            <QStar size={12} fill="#D4F542" />
            Cliente ideal
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em", margin: "8px 0 4px" }}>
            Tu cliente ideal, según por qué te escogen.
          </h2>
          <div style={{ color: "rgba(255,255,255,.65)", fontSize: 13.5, maxWidth: 600 }}>
            Cuando alguien le pidió un parche a Quepa y terminó eligiéndote, esto fue lo que pesó en la decisión.
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.5)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Basado en</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--yg)", marginTop: 4, letterSpacing: "-0.02em" }}>
            {ideal.sesiones} sesiones
          </div>
          <div className="mono text-xs dim" style={{ color: "rgba(255,255,255,.5)" }}>últimos 90 días</div>
        </div>
      </div>

      {/* Banner — mismo estilo para todos los estados */}
      <div style={{
        background: "rgba(255,255,255,.04)",
        borderRadius: 14,
        padding: 24,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 24,
        alignItems: "center",
        position: "relative",
      }}>
        {/* Avatar central · agentic radar */}
        <div className="qstar-radar" aria-hidden="true">
          <div className="qstar-ring r1" />
          <div className="qstar-ring r2" />
          <div className="qstar-ring r3" />
          <div className="qstar-orbit orb1"><i /></div>
          <div className="qstar-orbit orb2"><i /></div>
          <div className="qstar-orbit orb3"><i /></div>
          <div className="qstar-core" style={{
            border: enConstruccion ? "2px dashed rgba(212,245,66,.35)" : "2px solid var(--yg)",
            color: "var(--yg)",
          }}>
            {enConstruccion ? (
              <span style={{ fontSize: 36, fontWeight: 700 }}>?</span>
            ) : (
              <div className="qstar-spin">
                <QStar size={48} fill="#D4F542" />
              </div>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>
            {enConstruccion ? "Perfil en construcción" : "Perfil consolidado"}
          </div>
          <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13, marginBottom: 12, maxWidth: 540 }}>
            {enConstruccion ? (
              <React.Fragment>
                Aún necesitamos <strong style={{ color: "var(--yg)" }}>~{Math.max(0, 30 - ideal.sesiones)} sesiones más</strong> para mostrarte tu cliente ideal completo. Estos son los indicios tempranos que ya capturamos.
              </React.Fragment>
            ) : (
              <React.Fragment>
                Estos son los <strong style={{ color: "var(--yg)" }}>top {topTags.length} motivos</strong> por los que la gente te escogió en Quepa. La data sigue creciendo — el perfil se ajusta solo.
              </React.Fragment>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ background: "rgba(255,255,255,.06)", height: 6, borderRadius: 999, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ width: `${pctAvance}%`, height: "100%", background: "var(--yg)", transition: "width .3s" }} />
          </div>

          {/* Tags inline */}
          <div className="row" style={{ flexWrap: "wrap", gap: 6 }}>
            {topTags.map((t, i) => (
              <span key={i} style={{
                background: "rgba(212,245,66,.12)",
                border: `1px solid ${catBorder(t.cat)}`,
                color: "var(--yg)",
                borderRadius: 999, padding: "4px 10px", fontSize: 11.5, fontWeight: 600,
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                {t.text}
                <span className="mono" style={{ fontSize: 10, opacity: .7 }}>{t.pct}%</span>
              </span>
            ))}
          </div>

          <div className="mono text-xs" style={{ color: "rgba(255,255,255,.4)", marginTop: 14, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {enConstruccion
              ? "↑ Indicios tempranos · podrían cambiar"
              : `↑ Top ${topTags.length} de ${ideal.tags.length} motivos detectados`}
          </div>
        </div>
      </div>

      {/* Footer · leyenda + CTA */}
      <div className="row between" style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.08)", position: "relative", flexWrap: "wrap", gap: 12 }}>
        <div className="legend" style={{ marginTop: 0 }}>
          <LegendItem c="var(--leaf)"   t="Atributos del lugar" />
          <LegendItem c="var(--sky)"    t="Servicios" />
          <LegendItem c="var(--amber)"  t="Ocasiones" />
          <LegendItem c="#9C73B5"       t="Tamaño grupo" />
          <LegendItem c="var(--rose)"   t="Franja horaria" />
          <LegendItem c="var(--yg)"     t="Voz literal del cliente" />
        </div>
        {!enConstruccion && (
          <button
            className="btn"
            style={{ background: "rgba(212,245,66,.12)", color: "var(--yg)", borderColor: "rgba(212,245,66,.25)" }}
            onClick={onOpenEvo}
          >
            <QStar size={11} fill="#D4F542" /> Generar perfil con IA <Icon name="chevron-right" size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

const catBorder = (c) => ({
  place:    "rgba(107,142,78,0.5)",
  service:  "rgba(74,111,165,0.5)",
  occasion: "rgba(201,138,46,0.5)",
  group:    "rgba(156,115,181,0.5)",
  time:     "rgba(196,74,74,0.5)",
  voice:    "rgba(212,245,66,0.5)",
}[c] || "rgba(255,255,255,0.15)");

const LegendItem = ({ c, t }) => (
  <div className="legend-item" style={{ color: "rgba(255,255,255,.7)" }}>
    <i style={{ background: c }} /> {t}
  </div>
);

function BuildingState({ ideal }) {
  const objetivo = 30;
  const pct = Math.min(100, (ideal.sesiones / objetivo) * 100);
  return (
    <div style={{ background: "rgba(255,255,255,.04)", borderRadius: 14, padding: 24, display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "center", position: "relative" }}>
      <div style={{
        width: 110, height: 110, borderRadius: 999, background: "var(--ink)",
        border: "2px dashed rgba(212,245,66,.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--yg)", fontWeight: 700, fontSize: 32,
      }}>?</div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>Perfil en construcción</div>
        <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13, marginBottom: 12, maxWidth: 460 }}>
          Aún necesitamos <strong style={{ color: "var(--yg)" }}>~{objetivo - ideal.sesiones} sesiones más</strong> para mostrarte tu cliente ideal completo. Estos son los indicios tempranos que ya capturamos.
        </div>
        <div style={{ background: "rgba(255,255,255,.06)", height: 6, borderRadius: 999, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "var(--yg)" }} />
        </div>
        <div className="row" style={{ flexWrap: "wrap", gap: 6 }}>
          {ideal.tags.map((t, i) => (
            <span key={i} style={{
              background: "rgba(212,245,66,.12)",
              border: "1px solid rgba(212,245,66,.2)",
              color: "var(--yg)",
              borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              {t.text} <span className="mono dim" style={{ fontSize: 10 }}>{t.pct}%</span>
            </span>
          ))}
        </div>
        <div className="mono text-xs" style={{ color: "rgba(255,255,255,.4)", marginTop: 14, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          ↑ indicios tempranos · podrían cambiar
        </div>
      </div>
    </div>
  );
}

// Corona: tags positioned around an avatar
function Corona({ tags }) {
  // sort tags by pct desc, then distribute around two rings
  const sorted = [...tags].sort((a, b) => b.pct - a.pct);
  const N = sorted.length;
  const positions = sorted.map((tag, i) => {
    // alternate between inner ring (50%) and outer ring (70-85%)
    const isInner = i % 2 === 0;
    const radius = isInner ? 36 : 50; // % of half-width
    const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle) * 0.85;
    return { ...tag, x, y };
  });

  return (
    <div style={{ position: "relative", height: 440, background: "rgba(255,255,255,.03)", borderRadius: 14, overflow: "hidden" }}>
      {/* Soft rings */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <radialGradient id="ringG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212,245,66,0.07)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <ellipse cx="50%" cy="50%" rx="42%" ry="38%" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1" strokeDasharray="3 6" />
        <ellipse cx="50%" cy="50%" rx="28%" ry="24%" fill="url(#ringG)" />
      </svg>

      {/* Center */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
        textAlign: "center", zIndex: 3, width: 200,
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: 999, margin: "0 auto 12px",
          background: "var(--yg)", color: "var(--night)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 8px rgba(212,245,66,0.15), 0 0 60px rgba(212,245,66,0.18)",
        }}>
          <QStar size={48} fill="#0A0A0A" />
        </div>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 4 }}>tu cliente ideal</div>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
          Lo que pidieron antes<br/>de elegir tu negocio
        </div>
      </div>

      {/* Tags */}
      {positions.map((p, i) => {
        const klass = `cat-${p.cat}`;
        // size by pct
        const fs = Math.max(11, Math.min(16, 10 + p.pct / 8));
        return (
          <div
            key={i}
            className={`corona-tag ${klass}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: fs,
              background: p.cat === "voice" ? "var(--night)" : "#fff",
              color: corCat(p.cat),
              borderColor: corCat(p.cat),
              padding: `${5 + (fs - 11) / 2}px ${10 + (fs - 11) / 2}px`,
              boxShadow: "0 4px 12px rgba(10,10,10,.18)",
              zIndex: 2,
            }}
          >
            {p.text}
            <span className="pct mono" style={{ color: corCat(p.cat), opacity: 0.7 }}>{p.pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

const corCat = (c) => ({
  place:    "#6B8E4E",
  service:  "#4A6FA5",
  occasion: "#C98A2E",
  group:    "#9C73B5",
  time:     "#C44A4A",
  voice:    "#D4F542",
}[c] || "#0A0A0A");

function PerfilClienteDrawer({ cliente, estab, onClose }) {
  return (
    <Drawer open={true} onClose={onClose}>
      <div className="drawer-head">
        <Avatar name={cliente.nombre} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row gap-2">
            <div style={{ fontSize: 17, fontWeight: 700 }}>{cliente.nombre}</div>
            <Badge variant={cliente.tipo === "Frecuente" ? "yg" : "default"}>{cliente.tipo}</Badge>
          </div>
          <div className="mono text-xs dim">{cliente.wa}</div>
        </div>
        <button className="btn icon ghost" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
      <div className="drawer-body">
        <a href={`https://wa.me/${cliente.wa.replace(/\D/g, "")}`} target="_blank" className="btn wa" style={{ width: "100%", justifyContent: "center" }}>
          <Icon name="whatsapp" size={14} /> Abrir conversación
        </a>

        <div style={{ marginTop: 20 }}>
          <div className="eyebrow">Resumen</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
            <KPI label="Reservas" value={cliente.reservas} />
            <KPI label="Cumplidas" value={`${Math.round((cliente.cumplidas / Math.max(1, cliente.reservas)) * 100)}%`} />
            <KPI label="Ticket promedio" value={cliente.ticketProm ? fmtCOP(cliente.ticketProm) : "—"} />
            <KPI label="Último consumo" value={cliente.ultimo === 0 ? "hoy" : `hace ${-cliente.ultimo}d`} />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div className="eyebrow">Etiquetas observadas</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {cliente.tags.map((t, i) => (
              <span key={i} className="badge" style={{ background: "var(--paper)" }}>{t}</span>
            ))}
            {!cliente.tags.length && <span className="muted text-sm">Aún sin etiquetas — se rellenan según consume.</span>}
            <button className="badge" style={{ borderStyle: "dashed", cursor: "pointer" }}><Icon name="plus" size={10} /> Añadir</button>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div className="eyebrow">Editar</div>
          <div className="col gap-3" style={{ marginTop: 10 }}>
            <div className="field"><label>Nombre</label><input className="input" defaultValue={cliente.nombre} /></div>
            <div className="field"><label>WhatsApp</label><input className="input" defaultValue={cliente.wa} />
              <span className="hint">Validado contra duplicados.</span>
            </div>
            <div className="field"><label>Tipo</label>
              <select className="select" defaultValue={cliente.tipo}>
                <option>Nuevo</option><option>Recurrente</option><option>Frecuente</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

Object.assign(window, { ScreenClientes, ClienteIdealCard });

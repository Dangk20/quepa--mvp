// Quepa B2B · Conexiones (Pasarela, PMS, Catálogo, Avisos WhatsApp)
const { useState: _uS_con, useEffect: _uE_con } = React;

// Platos sembrados para Sazón del Río (Wenú · catálogo)
const WENU_DISHES_SAZON = [
  { id: "d1", nombre: "Lechona huilense",         precio: 32000, foto: null, recomendable: true,  desc: "Plato fuerte · 1 persona", adicionales: ["arepa de chócolo", "ají pique", "limonada"] },
  { id: "d2", nombre: "Tamal opita",              precio: 18000, foto: null, recomendable: true,  desc: "Entrada · 1 unidad",       adicionales: [] },
  { id: "d3", nombre: "Asado huilense",           precio: 38000, foto: null, recomendable: true,  desc: "Plato fuerte · 1 persona", adicionales: ["yuca frita", "patacón", "ensalada", "ají"] },
  { id: "d4", nombre: "Sancocho de gallina",      precio: 26000, foto: null, recomendable: true,  desc: "Plato fuerte · 1 persona", adicionales: ["arroz", "aguacate"] },
  { id: "d5", nombre: "Achiras del Huila",        precio: 8000,  foto: null, recomendable: false, desc: "Acompañamiento · 6 unidades", adicionales: [] },
  { id: "d6", nombre: "Mistela artesanal",        precio: 14000, foto: null, recomendable: true,  desc: "Bebida · 250 ml",          adicionales: [] },
  { id: "d7", nombre: "Bandeja paisa de autor",   precio: 45000, foto: null, recomendable: true,  desc: "Plato fuerte · 1 persona", adicionales: ["chicharrón doble", "huevo frito", "chorizo artesanal", "arepa", "patacón", "frijoles", "aguacate"] },
  { id: "d8", nombre: "Trucha al ajillo",         precio: 36000, foto: null, recomendable: true,  desc: "Plato fuerte · 1 persona", adicionales: ["arroz blanco", "papas saladas"] },
  { id: "d9", nombre: "Empanadas opitas",         precio: 12000, foto: null, recomendable: true,  desc: "Entrada · 4 unidades",     adicionales: ["ají de maní"] },
  { id: "d10", nombre: "Tinto del Huila",         precio: 5000,  foto: null, recomendable: false, desc: "Bebida · 250 ml",          adicionales: [] },
];

function ScreenConexiones({ estab }) {
  const [pasarela, setPasarela] = _uS_con("wompi");
  const [pmsConectado, setPmsConectado] = _uS_con(estab.plan === "Connection");
  const [waNumber, setWaNumber] = _uS_con(estab.whatsapp);
  const [testing, setTesting] = _uS_con(false);
  const [tested, setTested] = _uS_con(true);
  const toast = useToast();

  return (
    <div className="page-pad">
      <div className="page-h">
        <div>
          <div className="eyebrow">Conexiones</div>
          <h1>Conecta tu negocio.</h1>
          <div className="sub">Pasarela, PMS y avisos por WhatsApp. Quepa no cobra comisión — el dinero entra a tu cuenta.</div>
        </div>
      </div>

      {/* Pasarela */}
      <div className="card" style={{ padding: 22, marginBottom: 16 }}>
        <div className="row between" style={{ marginBottom: 6 }}>
          <div className="row gap-3">
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}><Icon name="credit-card" size={20} /></div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Pasarela de pagos</div>
              <div className="muted text-sm">Cobra reservas con link de pago al confirmar.</div>
            </div>
          </div>
          {tested
            ? <span className="badge leaf"><span className="dot" /> Conectado</span>
            : <span className="badge amber"><span className="dot" /> No conectado</span>}
        </div>

        <div style={{ background: "var(--paper)", borderRadius: 10, padding: 12, margin: "14px 0", display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Icon name="alert" size={16} color="#C98A2E" />
          <div className="text-sm">
            <strong>Quepa no cobra comisión por reserva.</strong> El dinero entra directo a la cuenta que registres en tu pasarela. Quepa solo cobra tu suscripción mensual.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
          {[
            { id: "wompi", nombre: "Wompi", tag: "Recomendada", color: "#6E4FE2" },
            { id: "mercadopago", nombre: "Mercado Pago", tag: "", color: "#009EE3" },
            { id: "epayco", nombre: "ePayco", tag: "", color: "#FF7A00" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPasarela(p.id)}
              className="row gap-3"
              style={{
                padding: 14, borderRadius: 10,
                border: `1.5px solid ${pasarela === p.id ? "var(--night)" : "var(--line)"}`,
                background: pasarela === p.id ? "var(--paper)" : "#fff",
                textAlign: "left",
                position: "relative",
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: p.color, opacity: .9 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{p.nombre}</div>
                {p.tag && <div className="mono text-xs" style={{ color: "var(--leaf)", letterSpacing: "0.08em" }}>{p.tag}</div>}
              </div>
              {pasarela === p.id && <Icon name="check" size={14} />}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="field"><label>Public key</label><input className="input mono" defaultValue="pub_prod_8eMQ•••••••••••3xK7" /></div>
          <div className="field"><label>Private key</label><input className="input mono" type="password" defaultValue="prv_prod_••••••••••••" /></div>
        </div>
        <div className="row gap-2" style={{ marginTop: 14 }}>
          <button
            className="btn primary"
            onClick={() => {
              setTesting(true);
              setTimeout(() => { setTesting(false); setTested(true); toast.push({ title: "Conexión exitosa", body: "Wompi responde 200 OK · listo para cobrar.", icon: <Icon name="check" size={14} /> }); }, 1100);
            }}
          >
            {testing ? "Probando…" : "Probar conexión"}
          </button>
          <button className="btn">Guardar cambios</button>
        </div>
      </div>

      {/* PMS — solo vertical hotel */}
      {estab.vertical === "habitaciones" && (
      <div className="card" style={{ padding: 22, marginBottom: 16 }}>
        <div className="row between" style={{ marginBottom: 6 }}>
          <div className="row gap-3">
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="link" size={20} /></div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>PMS / sistema externo</div>
              <div className="muted text-sm">Sincroniza Quepa con tu PMS por iCal o webhook · Plan Connection.</div>
            </div>
          </div>
          {pmsConectado
            ? <span className="badge leaf"><span className="dot" /> Sincronizando</span>
            : <span className="badge"><span className="dot" /> No conectado</span>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
          <div className="field">
            <label>URL iCal saliente (Quepa → tu PMS)</label>
            <input className="input mono text-xs" defaultValue="https://q.pa/ical/sazon/9a4f2b88-out.ics" readOnly />
          </div>
          <div className="field">
            <label>Webhook entrante (tu PMS → Quepa)</label>
            <input className="input mono text-xs" defaultValue="https://q.pa/hooks/sazon/in" readOnly />
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Últimas reservas enviadas</div>
          <div className="col gap-2">
            {[
              { t: "Hace 2 min",  st: "✓", lbl: "rh4 · Hab 201 · enviada a Cloudbeds" },
              { t: "Hace 14 min", st: "✓", lbl: "rh2 · Hab 102 · enviada a Cloudbeds" },
              { t: "Hace 41 min", st: "↻", lbl: "rh1 · Hab 101 · cambio de estado sincronizado" },
              { t: "Hace 2h",     st: "✓", lbl: "rh3 · Hab 103 · enviada a Cloudbeds" },
            ].map((row, i) => (
              <div key={i} className="row gap-3 text-sm" style={{ padding: "8px 12px", background: "var(--paper)", borderRadius: 8 }}>
                <span style={{ color: "var(--leaf)", width: 18, textAlign: "center", fontWeight: 700 }}>{row.st}</span>
                <span style={{ flex: 1 }}>{row.lbl}</span>
                <span className="mono text-xs dim">{row.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Catálogo y menú (vertical-aware) */}
      <CatalogoMenuBloque estab={estab} />

      {/* Avisos WhatsApp */}
      <div className="card" style={{ padding: 22 }}>
        <div className="row between" style={{ marginBottom: 6 }}>
          <div className="row gap-3">
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--green-soft)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="whatsapp" size={20} /></div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Avisos por WhatsApp</div>
              <div className="muted text-sm">A qué número te llega el aviso cuando entra una reserva.</div>
            </div>
          </div>
          <span className="badge leaf"><span className="dot" /> Activos</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 14 }}>
          <div>
            <div className="field">
              <label>WhatsApp del negocio</label>
              <input className="input" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} />
              <span className="hint">Si lo cambias, te enviaremos un código de verificación.</span>
            </div>
            <label className="checkbox" style={{ marginTop: 14 }}>
              <input type="checkbox" defaultChecked />
              <span>Aviso de nueva reserva</span>
            </label>
            <label className="checkbox" style={{ marginTop: 8 }}>
              <input type="checkbox" defaultChecked />
              <span>Aviso de pago confirmado</span>
            </label>
            <label className="checkbox" style={{ marginTop: 8 }}>
              <input type="checkbox" />
              <span>Aviso de cancelación / no-show</span>
            </label>
            <label className="checkbox" style={{ marginTop: 8 }}>
              <input type="checkbox" defaultChecked />
              <span>Reporte diario al cierre</span>
            </label>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Vista previa del aviso</div>
            <div style={{ background: "#efeae2", padding: 14, borderRadius: 14, position: "relative" }}>
              <div style={{ background: "#fff", borderRadius: "14px 14px 14px 4px", padding: "10px 12px", maxWidth: 280, boxShadow: "0 1px 1px rgba(0,0,0,.13)" }}>
                <div className="row gap-2" style={{ marginBottom: 6, color: "#128C46", fontSize: 11, fontWeight: 700 }}>
                  <QStar size={12} fill="#128C46" /> Quepa · Reservas
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                  ¡Que parche, <strong>{estab.name}</strong>! Te entró una reserva nueva 🎉
                  <br/><br/>
                  <strong>Daniel Páez</strong><br/>
                  📅 Hoy · 20:00<br/>
                  👥 6 personas · Mesa 4<br/>
                  <span style={{ color: "#128C46" }}>★ Vía Quepa</span><br/><br/>
                  Confirma o gestiona desde tu panel. — <em>Quepa</em>
                </div>
                <div className="mono" style={{ fontSize: 9, color: "rgba(0,0,0,.4)", textAlign: "right", marginTop: 4 }}>10:42 AM ✓✓</div>
              </div>
            </div>
            <button className="btn sm" style={{ marginTop: 10 }}><Icon name="send" size={12} /> Enviar prueba</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenConexiones, CatalogoMenuBloque });

// ============================================================
// CATÁLOGO Y MENÚ · solo se renderiza con vocabulario de Wenú
// cuando el vertical del negocio es "mesas" (restaurante/bar).
// Para los demás verticales, muestra un mensaje informativo.
// ============================================================
function CatalogoMenuBloque({ estab }) {
  const toast = useToast();
  const [wenuConectado, setWenuConectado] = _uS_con(estab.id === "sazon");
  const [authOpen, setAuthOpen] = _uS_con(false);
  const [authing, setAuthing] = _uS_con(false);
  const [syncing, setSyncing] = _uS_con(false);
  const [lastSync, setLastSync] = _uS_con(estab.id === "sazon" ? "hace 2 h" : null);
  const [dishes, setDishes] = _uS_con(WENU_DISHES_SAZON);
  const [verTodos, setVerTodos] = _uS_con(false);

  // Solo se renderiza el bloque cuando el vertical es mesas
  if (estab.vertical !== "mesas") return null;

  return (
    <div className="card" style={{ padding: 22, marginBottom: 16 }}>
      <div className="row between" style={{ marginBottom: 6 }}>
        <div className="row gap-3">
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="tag" size={20} /></div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Catálogo y menú</div>
            <div className="muted text-sm">Conecta el menú de tu restaurante para que Quepa lo recomiende con datos reales.</div>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--paper)", borderRadius: 10, padding: 12, margin: "14px 0", display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Icon name="alert" size={16} color="#C98A2E" />
        <div className="text-sm">
          Si tu carta ya vive en Wenú, Rappi u otro menú digital, <strong>no la cargues de nuevo</strong>. Conéctala aquí y Quepa la aprende.
        </div>
      </div>

      {/* 3 fuentes — jerarquizadas */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 12, marginBottom: wenuConectado ? 18 : 0 }}>
        {/* Wenú — integración nativa */}
        <div
          style={{
            padding: 18,
            borderRadius: 14,
            background: wenuConectado ? "var(--night)" : "#fff",
            color: wenuConectado ? "#fff" : "var(--ink)",
            border: `1.5px solid ${wenuConectado ? "var(--night)" : "var(--ink)"}`,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ position: "absolute", top: -10, left: 16, background: "var(--yg)", color: "var(--night)", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 999 }}>
            Integración nativa
          </div>
          <div className="row between" style={{ marginTop: 4 }}>
            <div className="row gap-3">
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: wenuConectado ? "var(--yg)" : "var(--ink)",
                color: wenuConectado ? "var(--ink)" : "var(--yg)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, letterSpacing: "-0.02em",
              }}>W</div>
              <div>
                <div className="row gap-2" style={{ alignItems: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.015em" }}>Wenú</div>
                  <div title="Sincronización bidireccional"
                       style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 999, background: wenuConectado ? "rgba(212,245,66,.18)" : "var(--paper)", color: wenuConectado ? "var(--yg)" : "var(--ink-60)", fontWeight: 700 }}>↔</div>
                </div>
                <div style={{ fontSize: 11.5, color: wenuConectado ? "rgba(255,255,255,.65)" : "var(--ink-60)", marginTop: 2 }}>
                  Tu carta entra a Quepa. Las reservas y recomendaciones caen directo en tu Wenú.
                </div>
              </div>
            </div>
            {wenuConectado ? (
              <span className="badge leaf"><span className="dot" /> Conectado</span>
            ) : (
              <span className="badge" style={{ background: "var(--paper)", color: "var(--ink-60)" }}><span className="dot" /> No conectado</span>
            )}
          </div>

          {wenuConectado && (
            <div className="row gap-3" style={{ paddingTop: 10, borderTop: "1px solid rgba(255,255,255,.08)" }}>
              <div style={{ flex: 1 }}>
                <div className="mono text-xs" style={{ color: "rgba(255,255,255,.5)", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 9 }}>Última sincronización</div>
                <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: "var(--yg)", marginTop: 2 }}>{lastSync}</div>
              </div>
              <button
                className="btn"
                disabled={syncing}
                onClick={() => {
                  setSyncing(true);
                  setTimeout(() => {
                    setSyncing(false);
                    setLastSync("hace unos segundos");
                    toast.push({ title: "Catálogo sincronizado", body: `${dishes.length} platos · ${dishes.filter((d) => d.recomendable).length} marcados recomendables.`, icon: <Icon name="check" size={14} /> });
                  }, 1100);
                }}
                style={{ background: "var(--yg)", color: "var(--ink)", borderColor: "var(--yg)" }}
              >
                <Icon name={syncing ? "refresh" : "refresh"} size={13} /> {syncing ? "Sincronizando…" : "Sincronizar ahora"}
              </button>
              <button className="btn" style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,.2)" }}>
                Ver catálogo completo <Icon name="external" size={12} />
              </button>
            </div>
          )}

          {!wenuConectado && (
            <button
              className="btn primary"
              onClick={() => setAuthOpen(true)}
              style={{ alignSelf: "flex-start", marginTop: 4 }}
            >
              Conectar Wenú <Icon name="chevron-right" size={13} />
            </button>
          )}
        </div>

        {/* Rappi — próximamente */}
        <div style={{ padding: 18, borderRadius: 14, background: "#fff", border: "1.5px solid var(--line)", display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="row between">
            <div className="row gap-2">
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--paper)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontFamily: "var(--font-mono)" }}>R</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Rappi</div>
            </div>
            <span className="badge" style={{ background: "var(--paper)", color: "var(--ink-60)" }}>Próximamente</span>
          </div>
          <div className="text-sm muted" style={{ flex: 1 }}>
            Si ya tienes tu menú en Rappi, lo importamos para no hacerte cargarlo otra vez.
          </div>
          <button className="btn ghost sm" disabled style={{ alignSelf: "flex-start", opacity: 0.5 }}>
            Notifícame cuando esté
          </button>
        </div>

        {/* Otro menú digital */}
        <div style={{ padding: 18, borderRadius: 14, background: "#fff", border: "1.5px solid var(--line)", display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="row between">
            <div className="row gap-2">
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--paper)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="link" size={14} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Otro menú digital</div>
            </div>
            <span className="badge" style={{ background: "var(--paper)", color: "var(--ink-60)" }}>Próximamente</span>
          </div>
          <div className="text-sm muted" style={{ flex: 1 }}>
            ¿Tu menú está en otra parte? Pega el link y nosotros lo leemos.
          </div>
          <button className="btn ghost sm" disabled style={{ alignSelf: "flex-start", opacity: 0.5 }}>
            Pegar link
          </button>
        </div>
      </div>

      {/* Preview de catálogo */}
      {wenuConectado && (
        <div style={{ marginTop: 8 }}>
          <div className="row between" style={{ marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Esto es lo que Quepa va a saber de tu negocio:</div>
              <div className="muted text-xs" style={{ marginTop: 2 }}>
                {dishes.length} platos · {dishes.filter((d) => d.recomendable).length} aprobados como recomendables.
              </div>
            </div>
            <button className="btn ghost sm" onClick={() => setVerTodos(true)}>Ver todos <Icon name="chevron-right" size={12} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {dishes.slice(0, 6).map((d) => (
              <div
                key={d.id}
                className="row gap-3"
                style={{
                  background: d.recomendable ? "var(--paper)" : "#fff",
                  border: `1px solid ${d.recomendable ? "var(--line)" : "var(--line)"}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                  alignItems: "flex-start",
                  opacity: d.recomendable ? 1 : 0.6,
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 8,
                  background: d.foto ? `url(${d.foto}) center/cover` : "var(--line)",
                  flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--ink-30)",
                  fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
                }}>
                  {!d.foto && d.nombre.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.15 }}>{d.nombre}</div>
                  <div className="mono text-xs dim" style={{ marginTop: 2 }}>{fmtCOP(d.precio)} · {d.desc}</div>
                  {d.adicionales && d.adicionales.length > 0 && (
                    <div className="row gap-2" style={{ flexWrap: "wrap", marginTop: 6 }}>
                      {d.adicionales.slice(0, 3).map((a, i) => (
                        <span
                          key={i}
                          style={{
                            background: "#fff",
                            border: "1px solid var(--ink-12)",
                            borderRadius: 999,
                            padding: "1px 7px",
                            fontSize: 10,
                            fontWeight: 600,
                            color: "var(--ink-70)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {a}
                        </span>
                      ))}
                      {d.adicionales.length > 3 && (
                        <span
                          style={{
                            background: "var(--ink)",
                            color: "var(--yg)",
                            borderRadius: 999,
                            padding: "1px 7px",
                            fontSize: 10,
                            fontWeight: 700,
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          +{d.adicionales.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setDishes((arr) => arr.map((x) => x.id === d.id ? { ...x, recomendable: !x.recomendable } : x))}
                  style={{
                    width: 26, height: 26, borderRadius: 999,
                    border: d.recomendable ? "0" : "1.5px dashed var(--ink-30)",
                    background: d.recomendable ? "var(--yg)" : "transparent",
                    color: "var(--ink)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  aria-label={d.recomendable ? "Quitar como recomendable" : "Marcar como recomendable"}
                  title={d.recomendable ? "Quepa lo recomienda" : "No incluir en recomendaciones"}
                >
                  {d.recomendable && <Icon name="check" size={13} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Ver todos los platos */}
      <Modal
        open={verTodos}
        onClose={() => setVerTodos(false)}
        className="modal-wide"
        title={
          <div>
            <div className="row gap-2"><Icon name="tag" size={16} /> Catálogo completo · Wenú</div>
            <div className="muted text-sm" style={{ fontWeight: 400, marginTop: 4 }}>
              {dishes.length} platos · {dishes.filter((d) => d.recomendable).length} aprobados como recomendables
            </div>
          </div>
        }
        footer={
          <React.Fragment>
            <button className="btn ghost" onClick={() => setVerTodos(false)}>Cerrar</button>
            <button className="btn primary" onClick={() => setVerTodos(false)}>
              <Icon name="check" size={13} /> Guardar selección
            </button>
          </React.Fragment>
        }
      >
        <div className="mono text-xs dim" style={{ marginBottom: 14, padding: "10px 12px", background: "var(--paper)", borderRadius: 8 }}>
          <Icon name="alert" size={11} style={{ marginRight: 6, verticalAlign: -1 }} />
          Marca cuáles platos quieres que Quepa recomiende cuando alguien pregunte por tu carta. Los que no marques siguen visibles en tu Wenú pero Quepa no los menciona.
        </div>
        <div className="col gap-2" style={{ maxHeight: 480, overflowY: "auto", paddingRight: 4 }}>
          {dishes.map((d) => (
            <div
              key={d.id}
              className="row gap-3"
              style={{
                background: d.recomendable ? "var(--paper)" : "#fff",
                border: "1px solid var(--line)",
                borderRadius: 10,
                padding: "12px 14px",
                alignItems: "flex-start",
              }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 10,
                background: d.foto ? `url(${d.foto}) center/cover` : "var(--line)",
                flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--ink-30)",
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
              }}>
                {!d.foto && d.nombre.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row gap-2" style={{ alignItems: "baseline" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>{d.nombre}</span>
                  <span className="mono text-xs dim">{fmtCOP(d.precio)}</span>
                </div>
                <div className="text-xs dim" style={{ marginTop: 2 }}>{d.desc}</div>
                {d.adicionales && d.adicionales.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div className="mono text-xs" style={{ color: "var(--ink-50)", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 9, marginBottom: 4 }}>
                      Adicionales · {d.adicionales.length}
                    </div>
                    <div className="row gap-2" style={{ flexWrap: "wrap" }}>
                      {d.adicionales.map((a, i) => (
                        <span
                          key={i}
                          style={{
                            background: "#fff",
                            border: "1px solid var(--ink-12)",
                            borderRadius: 999,
                            padding: "2px 9px",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--ink-70)",
                          }}
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDishes((arr) => arr.map((x) => x.id === d.id ? { ...x, recomendable: !x.recomendable } : x))}
                style={{
                  width: 30, height: 30, borderRadius: 999,
                  border: d.recomendable ? "0" : "1.5px dashed var(--ink-30)",
                  background: d.recomendable ? "var(--yg)" : "transparent",
                  color: "var(--ink)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                aria-label={d.recomendable ? "Quitar como recomendable" : "Marcar como recomendable"}
              >
                {d.recomendable && <Icon name="check" size={14} />}
              </button>
            </div>
          ))}
        </div>
      </Modal>

      <div className="mono text-xs dim" style={{ marginTop: 16, padding: "10px 12px", background: "var(--paper)", borderRadius: 8, letterSpacing: "0.04em" }}>
        Próximamente: más fuentes de menú gastronómico (DiDi Food, MercadoPago Menú, iFood, sitios web propios).
      </div>

      {/* Modal autorizar Wenú */}
      <Modal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title={
          <div>
            <div className="row gap-2">
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--ink)", color: "var(--yg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>W</div>
              Autorizar Wenú
            </div>
            <div className="muted text-sm" style={{ fontWeight: 400, marginTop: 4 }}>
              Conexión bidireccional · Producto Grexya · integración nativa
            </div>
          </div>
        }
        footer={
          <React.Fragment>
            <button className="btn ghost" onClick={() => setAuthOpen(false)}>Cancelar</button>
            <button
              className="btn primary"
              disabled={authing}
              onClick={() => {
                setAuthing(true);
                setTimeout(() => {
                  setAuthing(false);
                  setAuthOpen(false);
                  setWenuConectado(true);
                  setLastSync("hace unos segundos");
                  toast.push({ title: "Wenú conectado", body: `${dishes.length} platos importados.`, icon: <Icon name="check" size={14} /> });
                }, 1800);
              }}
            >
              {authing ? "Autorizando…" : "Autorizar y conectar"}
            </button>
          </React.Fragment>
        }
      >
        <div className="col gap-3">
          <div className="text-sm">
            Al autorizar, Quepa podrá:
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "var(--ink-70)", lineHeight: 1.7 }}>
            <li>Leer tu carta completa, precios y fotos.</li>
            <li>Recibir actualizaciones en vivo cuando cambies algo en Wenú.</li>
            <li>Enviar a Wenú las reservas que entren por Quepa.</li>
          </ul>
          <div style={{ background: "var(--paper)", padding: 12, borderRadius: 10, fontSize: 12.5, color: "var(--ink-70)" }}>
            Puedes desconectar en cualquier momento desde esta misma pantalla. Tus datos en Wenú no se modifican.
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Quepa Canchas · Mi negocio
// Captura exactamente los mismos campos que el editor de Lugares del console,
// para que lo que llene el dueño alimente la misma base de conocimiento del agente.
const { useState: _mnS, useMemo: _mnM } = React;

// ---------- Campo de etiquetas ----------
function CampoTags({ label, hint, valores, onChange, max, placeholder }) {
  const [txt, setTxt] = _mnS("");
  const lleno = max && valores.length >= max;
  const agregar = () => {
    const t = txt.trim();
    if (!t || valores.includes(t) || lleno) return setTxt("");
    onChange([...valores, t]); setTxt("");
  };
  return (
    <div className="q-campo">
      <div className="q-campo-top">
        <label>{label}</label>
        {max && <span className="lim">hasta {max}</span>}
      </div>
      <div className={`q-tagbox ${lleno ? "lleno" : ""}`}>
        {valores.map((v) => (
          <span className="q-tg" key={v}>
            {v}
            <button onClick={() => onChange(valores.filter((x) => x !== v))} aria-label={`Quitar ${v}`}>
              <Icon name="x" size={16} />
            </button>
          </span>
        ))}
        {!lleno && (
          <input value={txt} placeholder={placeholder || "Agrega y presiona Enter…"}
                 onChange={(e) => setTxt(e.target.value)}
                 onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); agregar(); } }}
                 onBlur={agregar} />
        )}
      </div>
      {hint && <span className="q-campo-hint">{hint}</span>}
    </div>
  );
}

// ---------- Campo de texto ----------
const Campo = ({ label, hint, contador, children }) => (
  <div className="q-campo">
    <div className="q-campo-top">
      <label>{label}</label>
      {contador && <span className="lim">{contador}</span>}
    </div>
    {children}
    {hint && <span className="q-campo-hint">{hint}</span>}
  </div>
);

// ---------- Sección ----------
const Seccion = ({ n, eyebrow, titulo, accion, children }) => (
  <section className="q-mn-sec">
    <header>
      <div>
        <span className="q-mn-eyebrow">· {n} · {eyebrow}</span>
        <h2 className="q-h2">{titulo}</h2>
      </div>
      {accion}
    </header>
    {children}
  </section>
);

function ScreenMiNegocio({ perfil, onCambio }) {
  const [p, setP] = _mnS(perfil);
  const [sedes, setSedes] = _mnS(false);
  const set = (k, v) => { const n = { ...p, [k]: v }; setP(n); onCambio && onCambio(n); };

  const completo = _mnM(() => {
    const checks = [
      !!p.nombre, !!p.categoria, !!p.ciudad, !!p.region, p.descripcion.length > 60,
      p.highlights.length > 0, p.vibe.length > 0, p.idealPara.length > 0,
      !!p.rangoPrecio, !!p.precioDesde, p.amenities.length > 0,
      p.sedes.length > 0, !!p.website, p.redes.length > 0,
      p.fotos >= p.fotosMin,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [p]);

  const setSede = (i, k, v) => set("sedes", p.sedes.map((s, j) => (j === i ? { ...s, [k]: v } : s)));
  const setRed = (i, k, v) => set("redes", p.redes.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const setFranja = (dia, i, pos, v) =>
    set("horarios", { ...p.horarios, [dia]: p.horarios[dia].map((f, j) => (j === i ? (pos === 0 ? [v, f[1]] : [f[0], v]) : f)) });

  return (
    <div className="q-wrap">
      <div className="q-head">
        <div style={{ flex: 1 }}>
          <h1 className="q-h1">Mi negocio</h1>
          <div className="q-sub">Esto es lo que Quepa usa para recomendarte por WhatsApp.</div>
        </div>
        <div className="q-perfil">
          <div className="fila">
            <span className="l">Perfil completo</span>
            <span className="n">{completo}%</span>
          </div>
          <div className="barra"><i style={{ width: `${completo}%` }} /></div>
        </div>
      </div>

      {/* ═══ 01 · IDENTIDAD ═══ */}
      <Seccion n="01" eyebrow="Identidad" titulo="¿Qué es este lugar?">
        <div className="q-grid2">
          <Campo label="Nombre" contador={`${p.nombre.length}/80`}>
            <input className="q-input" value={p.nombre} maxLength={80} onChange={(e) => set("nombre", e.target.value)} />
          </Campo>
          <Campo label="Categoría">
            <select className="q-input" value={p.categoria} onChange={(e) => set("categoria", e.target.value)}>
              {EB_CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Campo>
          <Campo label="Ciudad">
            <input className="q-input" value={p.ciudad} onChange={(e) => set("ciudad", e.target.value)} />
          </Campo>
          <Campo label="Región">
            <input className="q-input" value={p.region} onChange={(e) => set("region", e.target.value)} />
          </Campo>
        </div>

        <Campo label="Descripción" contador={`${p.descripcion.length}/500`}
               hint="Esta descripción la usa Quepa al recomendarte por WhatsApp. Tono cálido y directo.">
          <textarea className="q-input" rows={5} maxLength={500} value={p.descripcion}
                    onChange={(e) => set("descripcion", e.target.value)} />
        </Campo>

        <CampoTags label="Qué lo hace especial" max={6} valores={p.highlights}
                   onChange={(v) => set("highlights", v)} />

        <div className="q-grid2">
          <CampoTags label="Ambiente" valores={p.vibe} onChange={(v) => set("vibe", v)}
                     placeholder="Competitivo, familiar…" />
          <CampoTags label="Ideal para" valores={p.idealPara} onChange={(v) => set("idealPara", v)}
                     placeholder="Torneos, entrenar…" />
        </div>
      </Seccion>

      {/* ═══ 02 · PRECIO Y SERVICIOS ═══ */}
      <Seccion n="02" eyebrow="Económico y servicios" titulo="Precio y servicios">
        <div className="q-grid2">
          <Campo label="Rango de precio">
            <div className="q-rangos">
              {EB_RANGOS.map((r) => (
                <button key={r.v} className={`q-rango ${p.rangoPrecio === r.v ? "on" : ""}`}
                        onClick={() => set("rangoPrecio", r.v)}>
                  <span className="s">{r.s}</span>
                  <span className="l">{r.l}</span>
                </button>
              ))}
            </div>
          </Campo>
          <Campo label="Calificación en Google" hint="Solo lectura · se sincroniza desde Google.">
            <input className="q-input" disabled value={p.ratingExterno || "— sin sincronizar"} />
          </Campo>
        </div>

        <div className="q-grid2">
          <Campo label="Precio desde" hint="En pesos, por hora de cancha.">
            <div className="q-money"><span className="sig">$</span>
              <input className="q-input" inputMode="numeric" value={p.precioDesde}
                     onChange={(e) => set("precioDesde", e.target.value.replace(/\D/g, ""))} />
            </div>
          </Campo>
          <Campo label="Precio hasta">
            <div className="q-money"><span className="sig">$</span>
              <input className="q-input" inputMode="numeric" value={p.precioHasta}
                     onChange={(e) => set("precioHasta", e.target.value.replace(/\D/g, ""))} />
            </div>
          </Campo>
        </div>

        <CampoTags label="Qué tiene" valores={p.amenities} onChange={(v) => set("amenities", v)}
                   placeholder="Parqueadero, camerinos, tienda…" />
      </Seccion>

      {/* ═══ 03 · SEDES ═══ */}
      <Seccion n="03" eyebrow="Sedes" titulo="Dónde está físicamente"
               accion={<button className="q-btn" onClick={() => setSedes(true)}>
                         <Icon name="plus" size={22} /> Agregar sede
                       </button>}>
        {p.sedes.map((s, i) => (
          <div className="q-sede" key={s.id}>
            <div className="q-grid3">
              <Campo label="Nombre de la sede">
                <input className="q-input" value={s.label} onChange={(e) => setSede(i, "label", e.target.value)} />
              </Campo>
              <Campo label="Zona">
                <select className="q-input" value={s.zona} onChange={(e) => setSede(i, "zona", e.target.value)}>
                  {EB_ZONAS.map((z) => <option key={z}>{z}</option>)}
                </select>
              </Campo>
              <Campo label="Ciudad">
                <input className="q-input" value={s.ciudad} onChange={(e) => setSede(i, "ciudad", e.target.value)} />
              </Campo>
            </div>
            <Campo label="Dirección">
              <input className="q-input" value={s.direccion} onChange={(e) => setSede(i, "direccion", e.target.value)} />
            </Campo>
            <div className="q-grid3">
              <Campo label="Teléfono">
                <input className="q-input" value={s.telefono} onChange={(e) => setSede(i, "telefono", e.target.value)} />
              </Campo>
              <Campo label="WhatsApp">
                <input className="q-input" value={s.whatsapp} onChange={(e) => setSede(i, "whatsapp", e.target.value)} />
              </Campo>
              <Campo label="Coordenadas" hint={s.coordenadas}>
                <input className="q-input" placeholder="Pega el enlace de Maps…"
                       onChange={(e) => setSede(i, "coordenadas", e.target.value)} />
              </Campo>
            </div>
            <Campo label="Enlace de Maps" hint="Es el que Quepa le comparte al cliente para llegar.">
              <input className="q-input" value={s.maps} onChange={(e) => setSede(i, "maps", e.target.value)} />
            </Campo>
            {s.principal && <span className="q-principal">★ Sede principal</span>}
          </div>
        ))}
      </Seccion>

      {/* ═══ 04 · CONTACTO ═══ */}
      <Seccion n="04" eyebrow="Contacto y reservas" titulo="Cómo te alcanzamos"
               accion={<button className="q-btn" onClick={() => set("redes", [...p.redes, { id: "r" + Date.now(), tipo: "Instagram", url: "", handle: "", etiqueta: "", principal: false }])}>
                         <Icon name="plus" size={22} /> Agregar red
                       </button>}>
        <div className="q-grid2">
          <Campo label="Página web">
            <input className="q-input" value={p.website} onChange={(e) => set("website", e.target.value)} />
          </Campo>
          <Campo label="Enlace para reservar">
            <input className="q-input" value={p.bookingUrl} onChange={(e) => set("bookingUrl", e.target.value)} />
          </Campo>
        </div>

        <label className="q-campo-lbl">Redes sociales</label>
        {p.redes.map((r, i) => (
          <div className="q-red" key={r.id}>
            <select className="q-input" value={r.tipo} onChange={(e) => setRed(i, "tipo", e.target.value)}>
              {EB_REDES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <input className="q-input" placeholder="https://…" value={r.url} onChange={(e) => setRed(i, "url", e.target.value)} />
            <input className="q-input" placeholder="@usuario" value={r.handle} onChange={(e) => setRed(i, "handle", e.target.value)} />
            <button className={`q-chip ${r.principal ? "on" : ""}`}
                    onClick={() => set("redes", p.redes.map((x, j) => ({ ...x, principal: j === i })))}>
              Principal
            </button>
            <button className="q-quitar" onClick={() => set("redes", p.redes.filter((_, j) => j !== i))} aria-label="Quitar red">
              <Icon name="x" size={22} />
            </button>
          </div>
        ))}
        <span className="q-campo-hint">Quepa solo comparte las redes que estén cargadas aquí. Nunca inventa cuentas.</span>
      </Seccion>

      {/* ═══ 05 · HORARIOS ═══ */}
      <Seccion n="05" eyebrow="Horarios" titulo="¿Cuándo abres?">
        <div className="q-horarios">
          {EB_DIAS.map((d) => (
            <div className="q-hor-row" key={d}>
              <span className="dia">{d}</span>
              <div className="franjas">
                {(p.horarios[d] || []).map((f, i) => (
                  <span className="q-franja" key={i}>
                    <input type="time" value={f[0]} onChange={(e) => setFranja(d, i, 0, e.target.value)} />
                    <span className="g">—</span>
                    <input type="time" value={f[1]} onChange={(e) => setFranja(d, i, 1, e.target.value)} />
                    <button onClick={() => set("horarios", { ...p.horarios, [d]: p.horarios[d].filter((_, j) => j !== i) })}
                            aria-label="Quitar franja"><Icon name="x" size={16} /></button>
                  </span>
                ))}
                <button className="q-franja-add"
                        onClick={() => set("horarios", { ...p.horarios, [d]: [...(p.horarios[d] || []), ["08:00", "22:00"]] })}>
                  + Franja
                </button>
              </div>
            </div>
          ))}
        </div>
        <Campo label="Nota de horario" hint="Excepciones que la grilla no captura: festivos, temporadas. Quepa la comparte tal cual.">
          <input className="q-input" placeholder="Ej: los festivos cerramos a las 8 pm"
                 value={p.notaHorario} onChange={(e) => set("notaHorario", e.target.value)} />
        </Campo>
      </Seccion>

      {/* ---- sedes: aún no disponible ---- */}
      <QSheet open={sedes} onClose={() => setSedes(false)} titulo="Más de una sede"
              footer={<button className="q-btn wa grow" onClick={() => setSedes(false)}>
                        <Icon name="whatsapp" size={24} /> Escribirle a mi asesor
                      </button>}>
        <p style={{ fontSize: 22, lineHeight: 1.5, fontWeight: 600 }}>
          Comunícate con tu asesor para saber más de la funcionalidad de sedes.
        </p>
        <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--ink-50)", marginTop: 16, fontWeight: 500 }}>
          Con varias sedes, Quepa puede responder <strong style={{ color: "var(--ink)" }}>"¿cuál me queda más cerca?"</strong> y
          mandar al cliente a la que le sirve. Tu asesor te cuenta cómo activarla.
        </p>
      </QSheet>
    </div>
  );
}

Object.assign(window, { ScreenMiNegocio, CampoTags });

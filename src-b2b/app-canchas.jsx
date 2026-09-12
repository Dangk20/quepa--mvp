// Quepa Canchas · orquestador
// Comparte con el prototipo original: icons.jsx, ui.jsx, styles.css y screen-login.jsx.
// Todo lo demás es propio de esta versión.
const { useState: _acS, useEffect: _acE, useMemo: _acM } = React;

const NAV = [
  { id: "hoy",       label: "Panel de control", icon: "grid" },
  { id: "reservas",  label: "Reservas",         icon: "calendar" },
  { id: "clientes",  label: "Clientes",         icon: "users" },
  { id: "canchas",   label: "Mis canchas",      icon: "court" },
  { id: "usuarios",  label: "Usuarios",         icon: "settings" },
  { id: "ventas",    label: "Ventas",           icon: "money" },
  { id: "minegocio", label: "Mi negocio",       icon: "store" },
];

// ---- enganche para el modo grabación (local, fuera del producto) ----
// Si index-grabacion.html cargó src-b2b/demo-lluvia.jsx, existe window.QUEPA_DEMO y el app le cede
// el arranque (vista, reservas iniciales y la "lluvia"). Sin ese archivo, esto es null y no pasa nada.
const DEMO = window.QUEPA_DEMO || null;

function AppCanchas() {
  const [nav, setNav] = _acS(DEMO ? DEMO.vistaInicial : "hoy");
  const [dia, setDia] = _acS(0);
  const [reservas, setReservas] = _acS(() => (DEMO ? DEMO.reservasIniciales(EB_RESERVAS) : EB_RESERVAS));
  const [canchas, setCanchas] = _acS(EB_CANCHAS);
  const [usuarios, setUsuarios] = _acS(EB_USUARIOS);
  const [clientes, setClientes] = _acS(EB_CLIENTES);
  const [tipos, setTipos] = _acS(EB_TIPOS);
  const [perfil, setPerfil] = _acS(EB_PERFIL);
  const [cierres, setCierres] = _acS(EB_CIERRES);
  const [diaAbierto, setDiaAbierto] = _acS(true);
  const [crear, setCrear] = _acS(null);        // null | {cancha?, hora?, fecha}
  const [detalle, setDetalle] = _acS(null);    // reserva vista desde "Hoy"
  const [agenda, setAgenda] = _acS(null);      // cancha cuya agenda se está viendo
  const [undo, setUndo] = _acS(null);
  // avisos de "nueva reserva por Quepa": se apilan en el centro del header, máximo 3 a la vista;
  // cuando llega la cuarta, la más vieja se va desvaneciendo
  const [avisos, setAvisos] = _acS([]);
  const setAviso = (nueva) => {
    if (!nueva) return setAvisos([]);
    setAvisos((prev) => {
      const vivos = prev.filter((a) => !a.saliendo);
      const lista = [nueva, ...vivos];
      if (lista.length <= 3) return lista;
      const sale = lista[3];
      setTimeout(() => setAvisos((p) => p.filter((a) => a.id !== sale.id)), 380);
      return [...lista.slice(0, 3), { ...sale, saliendo: true }];
    });
  };
  const quitarAviso = (id) => setAvisos((p) => p.filter((a) => a.id !== id));
  const reloj = useAhora();
  const [menu, setMenu] = _acS(false);
  const [auth, setAuth] = _acS(true);
  const menuRef = React.useRef(null);

  _acE(() => {
    if (!menu) return;
    const fuera = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false); };
    const esc = (e) => e.key === "Escape" && setMenu(false);
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", fuera); document.removeEventListener("keydown", esc); };
  }, [menu]);

  const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
                 "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const fechaTitulo = `${DIAS[reloj.getDay()]}, ${reloj.getDate()} de ${MESES[reloj.getMonth()]}`;
  const _h12 = reloj.getHours() % 12 === 0 ? 12 : reloj.getHours() % 12;
  const horaAhora = `${_h12}:${String(reloj.getMinutes()).padStart(2, "0")} ${reloj.getHours() >= 12 ? "pm" : "am"}`;

  // --- reservas que van entrando por Quepa (realtime simulado) ---
  // La primera a los 6 segundos; después una cada ~20 s en una hora libre de los próximos 7 días,
  // para que la agenda se vea llenándose sola. `nuevas` guarda las recién llegadas unos segundos
  // para resaltarlas en el calendario.
  const [nuevas, setNuevas] = _acS(() => new Set());
  const marcarNueva = (id) => {
    setNuevas((n) => new Set([...n, id]));
    setTimeout(() => setNuevas((n) => { const m = new Set(n); m.delete(id); return m; }), 12000);
  };

  _acE(() => {
    if (DEMO) return;
    const t = setTimeout(() => {
      const nueva = { id: "sim1", cancha: "c2", clienteId: "e13", hora: 16, duracion: 1, fecha: 0,
                      estado: "Confirmada", origen: "quepa", valor: 70000 };
      setReservas((rs) => (rs.some((r) => r.id === "sim1") ? rs : [...rs, nueva]));
      setAviso(nueva);
      marcarNueva("sim1");
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  // ---- modo grabación: la lluvia la maneja demo-lluvia.jsx ----
  _acE(() => {
    if (!DEMO) return;
    return DEMO.iniciar({ setReservas, setAviso, marcarNueva });
  }, []);

  const simRef = React.useRef(0);
  _acE(() => {
    if (DEMO) return;
    const cada = setInterval(() => {
      if (simRef.current >= 24) return;
      setReservas((rs) => {
        const ahora = new Date().getHours();
        // hasta 40 intentos de encontrar una hora libre: primero hoy (lo que se ve), después la semana
        for (let i = 0; i < 40; i++) {
          const fecha = i < 20 ? 0 : Math.floor(Math.random() * 7);
          const hora = fecha === 0 && ahora >= 15 ? ahora + 1 + Math.floor(Math.random() * Math.max(1, 22 - ahora))
                                                   : 15 + Math.floor(Math.random() * 8);   // 3 pm – 10 pm
          if (fecha === 0 && hora <= ahora) continue;
          if (hora >= 23) continue;
          const cancha = EB_CANCHAS[Math.floor(Math.random() * EB_CANCHAS.length)];
          if (!cancha.activa || hora < cancha.desde || hora >= cancha.hasta) continue;
          const tomada = rs.some((r) => r.fecha === fecha && r.cancha === cancha.id && r.estado !== "Cancelada"
                                        && r.hora <= hora && hora < r.hora + r.duracion);
          if (tomada) continue;
          const cliente = EB_CLIENTES[Math.floor(Math.random() * EB_CLIENTES.length)];
          const nueva = { id: "sim" + (simRef.current + 2), cancha: cancha.id, clienteId: cliente.id, hora, duracion: 1,
                          fecha, estado: "Confirmada", origen: "quepa", valor: cancha.precio };
          simRef.current += 1;
          setAviso(nueva);
          marcarNueva(nueva.id);
          return [...rs, nueva];
        }
        return rs;
      });
    }, 12000);
    return () => clearInterval(cada);
  }, []);

  // --- acciones sobre reservas ---
  const cambiarEstado = (id, estado) => {
    const antes = reservas.find((r) => r.id === id);
    setReservas((rs) => rs.map((r) => (r.id === id ? { ...r, estado } : r)));
    setUndo({ texto: `Marcada como "${estado}"`, restaurar: () => setReservas((rs) => rs.map((r) => (r.id === id ? antes : r))) });
  };

  const cancelar = (id) => {
    const antes = reservas.find((r) => r.id === id);
    setReservas((rs) => rs.map((r) => (r.id === id ? { ...r, estado: "Cancelada" } : r)));
    setUndo({ texto: "Reserva cancelada", restaurar: () => setReservas((rs) => rs.map((r) => (r.id === id ? antes : r))) });
  };

  const guardarReserva = (nueva) => {
    let cliente = nueva.clienteId ? ebCliente(nueva.clienteId) : null;
    if (!cliente) {
      cliente = { id: "nc" + Math.random().toString(36).slice(2, 6), ...nueva.nuevoCliente,
                  reservas: 1, noshow: 0, ticketProm: nueva.valor };
      setClientes((cs) => [cliente, ...cs]);   // el cliente nuevo entra al directorio
    }
    setReservas((rs) => [...rs, { ...nueva, clienteId: cliente.id, cliente }]);
    setUndo({ texto: "Reserva guardada", restaurar: () => setReservas((rs) => rs.filter((r) => r.id !== nueva.id)) });
  };

  // --- canchas ---
  const guardarCancha = (c) => {
    if (c.id) setCanchas((cs) => cs.map((x) => (x.id === c.id ? { ...x, ...c } : x)));
    else setCanchas((cs) => [...cs, { ...c, id: "c" + (cs.length + 1), code: "C" + (cs.length + 1) }]);
  };
  const archivarCancha = (id) => setCanchas((cs) => cs.filter((c) => c.id !== id));
  const activarCancha = (id, v) => setCanchas((cs) => cs.map((c) => (c.id === id ? { ...c, activa: v } : c)));

  // --- cierre de caja ---
  const cerrarDia = (resumen) => {
    setCierres((cs) => [{ ...resumen, fecha: 0, noLlego: reservas.filter((r) => r.fecha === 0 && r.estado === "No llegó").length,
                          cerradoPor: "Daniel P.", hora: new Date().toTimeString().slice(0, 5) }, ...cs]);
    setDiaAbierto(false);
    setNav("hoy");
  };

  if (!auth) {
    return <ScreenLogin correo="hola@canchaelbosque.co" sinRegistro onLogin={() => setAuth(true)} />;
  }

  return (
    <div className="q-app">
      {/* ---------- barra superior ---------- */}
      <header className="q-top">
        <div className="q-top-in">

          {/* fila 1 · estado del día, hora, cuenta */}
          <div className="q-idbar">
            <div className={`q-daybtn ${diaAbierto ? "" : "cerrado"}`}>
              <button onClick={() => setNav("ventas")}>
                <span className="dot" />
                <span>
                  <span className="l">{diaAbierto ? "El día está abierto" : "El día está cerrado"}</span>
                  <span className="t">{diaAbierto ? "Cerrar el día" : "Abrir el día"}</span>
                </span>
              </button>
            </div>

            {avisos.length > 0 ? (
              <div className="q-avisos">
                {avisos.map((aviso, i) => (
                  <div className={`q-aviso ${aviso.saliendo ? "saliendo" : ""}`} role="status" key={aviso.id}
                       style={i > 0 ? { top: `calc(100% + ${(i - 1) * 80 + 8}px)` } : undefined}>
                    <span className="pip" />
                    <span className="txt">
                      <span className="l">Nueva reserva por Quepa</span>
                      <span className="v">
                        {(ebCliente(aviso.clienteId)?.nombre || "").split(" ")[0]} · {aviso.fecha === 0 ? "hoy" : aviso.fecha === 1 ? "mañana" : ebFechaCorta(aviso.fecha)} {ebFmtHora(aviso.hora)} · {ebCancha(aviso.cancha)?.nombre}
                      </span>
                    </span>
                    <span className="acc">
                      <button className="ver" onClick={() => { setDetalle(aviso); quitarAviso(aviso.id); }}>Ver</button>
                      <button className="listo" onClick={() => quitarAviso(aviso.id)}>Listo</button>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="q-when">
                <div className="d">{fechaTitulo}</div>
                <div className="h">{horaAhora}</div>
              </div>
            )}

            <div className="q-acct" ref={menuRef}>
              <button className={`q-acct-btn ${menu ? "abierto" : ""}`} onClick={() => setMenu((v) => !v)}
                      aria-haspopup="true" aria-expanded={menu}>
                <div style={{ minWidth: 0 }}>
                  <div className="q-biz-name">{EB_NEGOCIO.name}</div>
                  <div className="q-biz-sub">{EB_NEGOCIO.city}, Huila</div>
                </div>
                <span className="q-biz-mark"><QStar size={38} fill="#0A0A0A" /></span>
                <Icon name="chevron-down" size={22} className="chev" />
              </button>

              {menu && (
                <div className="q-acct-menu" role="menu">
                  <div className="q-acct-user">
                    <Avatar name={usuarios[0].nombre} size={50} tone="ink" />
                    <div>
                      <div className="n">{usuarios[0].nombre}</div>
                      <div className="r">{usuarios[0].rol}</div>
                    </div>
                  </div>
                  <button onClick={() => { setMenu(false); setNav("minegocio"); }}>
                    <Icon name="store" size={22} /> Mi negocio
                  </button>
                  <button onClick={() => { setMenu(false); setNav("usuarios"); }}>
                    <Icon name="users" size={22} /> Usuarios
                  </button>
                  <button className="salir" onClick={() => { setMenu(false); setAuth(false); }}>
                    <Icon name="logout" size={22} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* fila 2 · pestañas siempre visibles */}
          <nav className="q-tabs">
            {NAV.map((n) => (
              <button key={n.id} className={`q-tab ${nav === n.id ? "on" : ""}`} onClick={() => setNav(n.id)}>
                <Icon name={n.icon} size={24} />
                {n.label}
              </button>
            ))}
          </nav>

        </div>
      </header>

      {/* ---------- pantallas ---------- */}
      {nav === "hoy" && (
        <ScreenHoy
          reservas={reservas} onNav={setNav} onCrear={setCrear} enVivo={!!DEMO}
          onVerReserva={setDetalle} onVerCancha={setAgenda} diaAbierto={diaAbierto}
        />
      )}

      {nav === "reservas" && (
        <ScreenReservas
          reservas={reservas} canchas={canchas} perfil={perfil} nuevas={nuevas} contarTodo={!!DEMO}
          onCrear={setCrear} onVerReserva={setDetalle}
        />
      )}

      {nav === "clientes" && (
        <ScreenClientes
          clientes={clientes} reservas={reservas}
          onNuevo={(c) => setClientes((cs) => [{ id: "nc" + Math.random().toString(36).slice(2, 6),
                                                 ...c, reservas: 0, noshow: 0, ticketProm: 0 }, ...cs])}
        />
      )}

      {nav === "canchas" && (
        <ScreenCanchas
          canchas={canchas} tipos={tipos}
          onGuardar={guardarCancha} onArchivar={archivarCancha} onActiva={activarCancha}
          onNuevoTipo={(t) => setTipos((ts) => (ts.includes(t) ? ts : [...ts, t]))}
          onBorrarTipo={(t) => setTipos((ts) => ts.filter((x) => x !== t))}
        />
      )}

      {nav === "ventas" && (
        <ScreenVentas reservas={reservas} diaAbierto={diaAbierto} cierres={cierres}
                      onAbrir={() => setDiaAbierto(true)} onCerrar={cerrarDia} />
      )}

      {nav === "usuarios" && (
        <ScreenUsuarios usuarios={usuarios}
                        onInvitar={(u) => setUsuarios((us) => [...us, { ...u, id: "u" + (us.length + 1), activo: true }])}
                        onQuitar={(id) => setUsuarios((us) => us.filter((u) => u.id !== id))} />
      )}

      {nav === "minegocio" && (
        <ScreenMiNegocio perfil={perfil} onCambio={setPerfil} />
      )}

      {/* ---------- capas ---------- */}
      <AgendaCancha
        open={!!agenda} cancha={agenda} reservas={reservas}
        onClose={() => setAgenda(null)}
        onReservar={(pre) => { setAgenda(null); setCrear(pre); }}
      />

      <NuevaReserva
        open={!!crear} onClose={() => setCrear(null)}
        onGuardar={guardarReserva} reservas={reservas} inicial={crear}
      />

      <DetalleReserva
        open={!!detalle} onClose={() => setDetalle(null)} reserva={detalle}
        onEstado={(id, e) => { cambiarEstado(id, e); setDetalle((d) => (d ? { ...d, estado: e } : d)); }}
        onCancelar={cancelar}
      />

      {undo && <QUndo texto={undo.texto} onUndo={() => { undo.restaurar(); setUndo(null); }} onExpire={() => setUndo(null)} />}

    </div>
  );
}

const rootCanchas = ReactDOM.createRoot(document.getElementById("root"));
rootCanchas.render(<AppCanchas />);

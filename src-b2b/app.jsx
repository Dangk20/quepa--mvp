// Quepa B2B · App orquestador
const { useState: _uS_app, useEffect: _uE_app } = React;

// Lista combinada de establecimientos (los 4 originales + el placeholder al 0%)
const ESTABS_ALL = [...ESTABS, ESTAB_NUEVO];

function App() {
  const [authed, setAuthed] = _uS_app(false);
  const [showReg, setShowReg] = _uS_app(false);
  const [estab, setEstab] = _uS_app(ESTABS_ALL[0]);
  const [role, setRole] = _uS_app("Administrador");
  const [nav, setNav] = _uS_app("reservas");
  const [wizardOpen, setWizardOpen] = _uS_app(false);
  const [sbCollapsed, setSbCollapsed] = _uS_app(false);

  _uE_app(() => {
    if (role === "Operativo" && !["reservas", "clientes"].includes(nav)) setNav("reservas");
  }, [role]);

  // Auto-abrir wizard si entran al negocio nuevo (0%)
  _uE_app(() => {
    if (estab.id === "nuevo" && MI_NEGOCIO[estab.id]?.salud.completo === 0) {
      // Don't auto-open; just expose a clear "Empezar setup" CTA in Mi Negocio.
      // Switch nav to Mi Negocio so the wizard CTA is front and center.
      if (nav === "reservas") setNav("minegocio");
    }
  }, [estab.id]);

  if (!authed && !showReg) return <ScreenLogin onLogin={() => setAuthed(true)} onRegister={() => setShowReg(true)} />;
  if (!authed && showReg) return <ScreenRegister onBack={() => setShowReg(false)} onDone={() => { setShowReg(false); setAuthed(true); }} />;

  return (
    <div className={`app ${sbCollapsed ? "collapsed" : ""}`}>
      <Sidebar
        current={nav}
        onNav={setNav}
        role={role}
        estab={estab}
        collapsed={sbCollapsed}
        onToggleCollapse={() => setSbCollapsed((v) => !v)}
      />
      <div className="main">
        <Header
          estab={estab}
          role={role}
          onRoleChange={setRole}
          onEstabChange={setEstab}
          onNav={setNav}
          estabs={ESTABS_ALL}
        />
        {nav === "reservas"     && <ScreenReservas    estab={estab} onEstabChange={setEstab} />}
        {nav === "ventas"       && <ScreenEventos     estab={estab} onNav={setNav} />}
        {nav === "clientes"     && <ScreenClientes    estab={estab} />}
        {nav === "minegocio"    && <ScreenMiNegocio   estab={estab} onLaunchWizard={() => setWizardOpen(true)} />}
        {nav === "conexiones"   && <ScreenConexiones  estab={estab} />}
        {nav === "impulsa"      && <ScreenImpulsa     estab={estab} />}
        {nav === "suscripcion"  && <ScreenSuscripcion estab={estab} />}
      </div>

      <OnboardingWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onDone={(data) => {
          // En un mundo real: persistir. Aquí solo cerramos y dejamos un toast.
          setWizardOpen(false);
        }}
        estab={estab}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ToastProvider>
    <App />
  </ToastProvider>
);

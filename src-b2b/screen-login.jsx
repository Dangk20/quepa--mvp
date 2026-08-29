// Quepa B2B · Login
const { useState: _uS_login } = React;

function ScreenLogin({ onLogin, onRegister, correo, sinRegistro }) {
  const [email, setEmail] = _uS_login(correo || "hola@sazondelrio.co");
  const [pwd, setPwd]     = _uS_login("••••••••••");
  const [showPwd, setShowPwd] = _uS_login(false);
  const [showErr, setShowErr] = _uS_login(false);

  const submit = (e) => {
    e.preventDefault();
    if (email === "fail@test.com") { setShowErr(true); return; }
    onLogin();
  };

  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <div className="row gap-3" style={{ position: "relative", zIndex: 1 }}>
          <QStar size={36} fill="#D4F542" />
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.035em", color: "#fff" }}>Quepa</div>
            <div className="mono" style={{ fontSize: 10, color: "#D4F542", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>Panel del negocio</div>
          </div>
        </div>

        <div className="glow" />
        <div>
          <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.5)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 18 }}>Promesa del producto</div>
          <div className="quote">
            "Recomendaciones humanas,<br/><em>no algoritmos.</em>"
          </div>
          <div style={{ marginTop: 22, color: "rgba(255,255,255,.65)", fontSize: 14, maxWidth: 380, lineHeight: 1.55 }}>
            Cuando un cliente le pide un parche a Quepa por WhatsApp y elige tu negocio, esa reserva cae aquí. Tú la confirmas, la cobras y la sirves.
          </div>
        </div>

        <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,.4)", letterSpacing: "0.16em", textTransform: "uppercase", position: "relative", zIndex: 1 }}>
          v1.0 · Mayo 2026 · Neiva · Pereira
        </div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          <div className="eyebrow">Acceso al panel</div>
          <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", margin: "8px 0 10px" }}>¡Que parche!</h1>
          <p className="muted" style={{ fontSize: 14, margin: "0 0 28px" }}>Entrá con el correo de tu negocio.</p>

          <form onSubmit={submit} className="col gap-4">
            <div className="field">
              <label>Correo del negocio</label>
              <div style={{ position: "relative" }}>
                <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hola@minegocio.co" style={{ paddingLeft: 36 }} />
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-30)" }}>
                  <Icon name="mail" size={14} />
                </div>
              </div>
            </div>

            <div className="field">
              <label>Contraseña</label>
              <div style={{ position: "relative" }}>
                <input className="input" type={showPwd ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Tu contraseña" style={{ paddingLeft: 36, paddingRight: 38 }} />
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-30)" }}>
                  <Icon name="lock" size={14} />
                </div>
                <button type="button" onClick={() => setShowPwd((v) => !v)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", padding: 6, color: "var(--ink-50)" }}>
                  <Icon name={showPwd ? "eye-off" : "eye"} size={16} />
                </button>
              </div>
            </div>

            {showErr && (
              <div style={{ background: "var(--rose-soft)", color: "var(--rose)", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="alert" size={16} /> Datos incorrectos. Verifica e intenta de nuevo.
              </div>
            )}

            <div className="row between" style={{ marginTop: -6 }}>
              <label className="checkbox"><input type="checkbox" defaultChecked /> Mantener sesión abierta</label>
              <a className="bold" style={{ fontSize: 13, color: "var(--ink-70)" }}>¿Olvidaste la contraseña?</a>
            </div>

            <button className="btn primary" type="submit" style={{ justifyContent: "center", padding: "14px 16px", fontSize: 14 }}>
              Entrar al panel <Icon name="chevron-right" size={16} />
            </button>
          </form>

          {!sinRegistro && (
            <React.Fragment>
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "26px 0 18px" }}>
                <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
                <span className="mono" style={{ fontSize: 9, color: "var(--ink-30)", letterSpacing: "0.18em", textTransform: "uppercase" }}>¿Aún no estás en Quepa?</span>
                <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
              </div>

              <button className="btn" onClick={onRegister} style={{ width: "100%", justifyContent: "center", padding: "12px 16px" }}>
                <Icon name="store" size={16} /> Registrar mi negocio · Free
              </button>

              <p className="muted text-xs" style={{ marginTop: 16, textAlign: "center" }}>
                Quepa Free es gratis para siempre. Sin tarjetas. Sin sorpresas.
              </p>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenLogin });

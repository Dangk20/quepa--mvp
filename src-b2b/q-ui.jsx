// Quepa Canchas · primitivas de escala grande
// Complementan ui.jsx (no lo reemplazan). Todo con área accionable ≥72px.
const { useState: _qS, useEffect: _qE, useCallback: _qC, useMemo: _qM, useRef: _qR } = React;

// ---------- Panel grande (sube desde abajo en vertical, centrado en escritorio) ----------
function QSheet({ open, onClose, titulo, sub, children, footer, onBack }) {
  _qE(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <React.Fragment>
      <div className="q-sheet-bd" onClick={onClose} />
      <section className="q-sheet" role="dialog" aria-modal="true" aria-label={titulo}>
        <header className="q-sheet-h">
          {onBack && (
            <button className="q-back" onClick={onBack} style={{ minHeight: 56 }}>
              <Icon name="chevron-left" size={22} /> Atrás
            </button>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="t">{titulo}</div>
            {sub && <div className="s">{sub}</div>}
          </div>
          <button className="q-back" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={22} /> Cerrar
          </button>
        </header>
        <div className="q-sheet-b">{children}</div>
        {footer && <footer className="q-sheet-f">{footer}</footer>}
      </section>
    </React.Fragment>
  );
}

// ---------- Teclado numérico en pantalla ----------
function QPad({ valor, onChange, sufijo = "", max = 9 }) {
  const tecla = (t) => {
    if (t === "back") return onChange(valor.slice(0, -1));
    if (t === "clear") return onChange("");
    if (valor.length >= max) return;
    onChange(valor + t);
  };
  const mostrar = valor === "" ? "0" : Number(valor).toLocaleString("es-CO");
  return (
    <div>
      <div className="q-pad-out">{sufijo === "$" ? `$ ${mostrar}` : mostrar}</div>
      <div className="q-pad">
        {["1","2","3","4","5","6","7","8","9"].map((n) => (
          <button key={n} className="q-key" onClick={() => tecla(n)}>{n}</button>
        ))}
        <button className="q-key" onClick={() => tecla("clear")} aria-label="Borrar todo"
                style={{ fontSize: 17, fontFamily: "inherit", fontWeight: 700 }}>Borrar</button>
        <button className="q-key" onClick={() => tecla("0")}>0</button>
        <button className="q-key" onClick={() => tecla("back")} aria-label="Borrar un dígito">←</button>
      </div>
    </div>
  );
}

// ---------- Avisos grandes ----------
const QToastCtx = React.createContext({ avisar: () => {} });
function QToasts({ children }) {
  const [items, setItems] = _qS([]);
  const avisar = _qC((t) => {
    const id = Math.random().toString(36).slice(2);
    setItems((a) => [...a, { id, ...t }]);
    if (!t.persistente) setTimeout(() => setItems((a) => a.filter((x) => x.id !== id)), t.duracion || 7000);
  }, []);
  const cerrar = (id) => setItems((a) => a.filter((x) => x.id !== id));
  return (
    <QToastCtx.Provider value={{ avisar }}>
      {children}
      <div className="q-toasts">
        {items.map((t) => (
          <div key={t.id} className="q-toast" role="status">
            <div className="ic"><Icon name="whatsapp" size={26} color="#fff" /></div>
            <div style={{ minWidth: 0 }}>
              <div className="tt">{t.titulo}</div>
              {t.sub && <div className="sb">{t.sub}</div>}
            </div>
            <div className="ac">
              {t.onVer && <button className="v" onClick={() => { t.onVer(); cerrar(t.id); }}>Ver</button>}
              <button className="k" onClick={() => cerrar(t.id)}>Listo</button>
            </div>
          </div>
        ))}
      </div>
    </QToastCtx.Provider>
  );
}
const useQToast = () => React.useContext(QToastCtx);

// ---------- Deshacer ----------
function QUndo({ texto, onUndo, onExpire }) {
  _qE(() => {
    const t = setTimeout(onExpire, 5000);
    return () => clearTimeout(t);
  }, [texto]);
  return (
    <div className="q-undo" role="status">
      <span>{texto}</span>
      <button onClick={onUndo}>Deshacer</button>
    </div>
  );
}

// ---------- Interruptor grande ----------
const QSwitch = ({ on, onChange, children }) => (
  <button className={`q-sw ${on ? "on" : ""}`} onClick={() => onChange(!on)}
          style={{ background: "none", border: 0, padding: 0, fontFamily: "inherit", color: "inherit" }}
          aria-pressed={on}>
    <span className="q-sw-t" />
    <span>{children}</span>
  </button>
);

// ---------- Límite del plan ----------
const QLimite = ({ usado, total, unidad }) => (
  <div className="q-limit">
    <div className="l">Vas {usado} de {total} {unidad}</div>
    <div className="bar"><i style={{ width: `${Math.min(100, (usado / total) * 100)}%` }} /></div>
  </div>
);

// ---------- Cifra grande ----------
const QStat = ({ label, valor }) => (
  <div className="q-stat"><div className="l">{label}</div><div className="v">{valor}</div></div>
);

// ---------- Pasos ----------
const QSteps = ({ total, actual }) => (
  <div className="q-steps" aria-label={`Paso ${actual + 1} de ${total}`}>
    {Array.from({ length: total }).map((_, i) => (
      <i key={i} className={i === actual ? "on" : i < actual ? "done" : ""} />
    ))}
  </div>
);

Object.assign(window, { QSheet, QPad, QToasts, useQToast, QUndo, QSwitch, QLimite, QStat, QSteps });

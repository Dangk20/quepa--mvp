# Quepa · Prototipo del panel del negocio

Prototipos navegables del panel B2B de **Quepa**. Front-only, sin backend, con datos sembrados.

| Ruta | Qué es |
|---|---|
| **`/`** · `/canchas` | **Quepa Canchas** — el MVP de la vertical deportiva. Escala grande, pensado para alguien que no es tecnológico. |
| `/completo` | El prototipo original multi-vertical (mesas · habitaciones · canchas · agenda). |

## Cómo correrlo local

Es una SPA en React cargada con Babel en el navegador: **no hay build ni `npm install`**.
Debe servirse por HTTP — abrir el `.html` con doble clic falla, porque el navegador bloquea los `.jsx` desde `file://`.

```bash
python3 -m http.server 4202
# Canchas  → http://localhost:4202/index-canchas.html
# Completo → http://localhost:4202/index.html
```

## Estructura

```
index-canchas.html      Quepa Canchas · carga un subconjunto de módulos + los propios
index.html              prototipo original · 4 verticales
vercel.json             enrutamiento del despliegue
src-b2b/
  styles.css            sistema base
  escala-grande.css     capa de escala generosa (solo Canchas)
  data-canchas.jsx      Cancha El Bosque · Neiva · 6 canchas, reservas, clientes, cierres
  q-ui.jsx              panel grande, deshacer, interruptor, cifras
  screen-hoy.jsx        panel de control · tarjetas de cancha en vivo
  agenda-cancha.jsx     agenda de una cancha + calendario + lista de horarios
  nueva-reserva.jsx     crear reserva en pasos
  screen-clientes-eb.jsx
  screen-canchas.jsx    mis canchas + usuarios
  screen-ventas.jsx     caja del día
  screen-minegocio-eb.jsx   mismos campos que el editor de Lugares del console
  app-canchas.jsx       orquestador
  …                     módulos compartidos con el prototipo original
```

## Alcance

No incluye backend, autenticación real, ni el agente de WhatsApp. Los datos son sembrados y viven en memoria:
se reinician al recargar.

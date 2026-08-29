# Quepa Canchas

Prototipo navegable del **panel del negocio** para canchas sintéticas. Front-only, sin backend, con datos
sembrados: *Cancha El Bosque*, en Neiva.

Diseñado a escala grande, para alguien que no es tecnológico y que hasta hoy anotaba las reservas en un
cuaderno. Funciona igual con mouse y con dedo.

## Correrlo local

Es una SPA en React cargada con Babel en el navegador: **no hay build ni `npm install`**.
Debe servirse por HTTP — abrir el `.html` con doble clic falla, porque el navegador bloquea los `.jsx`
desde `file://`.

```bash
python3 -m http.server 4202
# → http://localhost:4202/index-canchas.html
```

## Qué trae

| Pantalla | Qué resuelve |
|---|---|
| **Panel de control** | Reservas del día + una tarjeta por cancha con lo que pasa ahora, con contador en vivo |
| **Clientes** | Quién viene, cada cuánto, cuánto gasta y quién no llegó |
| **Mis canchas** | Precios, horarios y tipos de cancha que el negocio crea |
| **Usuarios** | Administrador y Recepción |
| **Ventas** | Caja del día, con apertura y cierre |
| **Mi negocio** | Los mismos campos del editor de Lugares del console de Quepa |

## Estructura

```
index-canchas.html          entrada
vercel.json                 enrutamiento del despliegue
src-b2b/
  styles.css                sistema base
  escala-grande.css         capa de escala generosa
  icons.jsx  ui.jsx         primitivas
  screen-login.jsx          acceso
  data-canchas.jsx          datos sembrados
  q-ui.jsx                  panel grande, deshacer, interruptor, cifras
  screen-hoy.jsx            panel de control
  agenda-cancha.jsx         agenda de una cancha + calendario + lista de horarios
  nueva-reserva.jsx         crear reserva en pasos
  reservas-canchas.jsx      detalle de una reserva
  screen-clientes-eb.jsx    clientes
  screen-canchas.jsx        mis canchas + usuarios
  screen-ventas.jsx         caja del día
  screen-minegocio-eb.jsx   perfil del negocio
  app-canchas.jsx           orquestador
```

## Alcance

No incluye backend, autenticación real ni el agente de WhatsApp. Los datos viven en memoria y se
reinician al recargar.

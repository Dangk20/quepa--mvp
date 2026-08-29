# Prototipo B2B Quepa — Panel del establecimiento

Prototipo navegable de alta fidelidad del **panel administrativo B2B de Quepa** (el panel del
establecimiento, **excluye** el panel interno Quepa/BO). Front-only, **sin backend**, con datos
sembrados. Generado a partir de `../prompt-prototipo-b2b.md`; mapea a las HUs de `../hus-panel-b2b.md`.

## Cómo se construye (sin build step)

Es una SPA en React cargada con **Babel en el navegador** (igual que los prototipos de Wenú):
`index.html` declara cada módulo como `<script type="text/babel" src="src-b2b/*.jsx">`. No hay
`npm install`, no hay bundler. Por eso **debe servirse por HTTP** — abrir `index.html` con doble
clic falla, porque el navegador bloquea la carga de los `.jsx` desde `file://`.

## Levantarlo

```bash
cd proyectos/quepa/tech/prototipo-b2b
python3 -m http.server 4201
# luego abrir http://localhost:4201/
```

## Estructura

```
index.html          shell HTML: fuentes, React+Babel desde CDN, y el orden de carga de los módulos
src-b2b/            todos los módulos en JSX (shell, login, registro, reservas, clientes, mi negocio, …)
  app.jsx           punto de entrada (se carga de último)
  data*.jsx         datos sembrados (4 negocios piloto en Neiva/Pereira)
  lienzo-*.jsx      los 4 lienzos por vertical: mesas, habitaciones, canchas, agenda
assets-b2b/         imágenes de portada de los negocios sembrados (jpg/webp)
```

## Qué demostrar (recorrido de 60 s)

- **Reservas** es la pantalla central; el **selector de vertical** en su cabecera salta entre los
  4 mundos (Mesas · Habitaciones · Canchas · Agenda) sin recargar. Al cargar dispara un toast
  *"Nueva reserva por Quepa"* (realtime simulado).
- **Clientes → card "Cliente ideal"** es el diferencial real del producto (responde *"¿por qué me
  eligen?"*); cada negocio trae una card construida y una *en construcción*.
- El **switcher de rol** (Administrador / Operativo) en el header cambia la navegación visible.

## Notas

- Requiere internet la primera vez (React, ReactDOM y Babel se cargan desde `unpkg.com`).
- Origen: copiado desde `~/Downloads/Quepa` el 2026-06-14. La carpeta `uploads/` del origen era
  basura de generación y **no** se trajo; el prototipo es autocontenido con `assets-b2b/`.
- No incluye el panel interno Quepa (`BO_*`), backend, auth real ni el agente de WhatsApp — todo
  fuera de alcance (ver "No-objetivos" en `../prompt-prototipo-b2b.md`).
```

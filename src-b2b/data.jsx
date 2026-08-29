// ============================================================
// QUEPA · Datos sembrados B2B — 4 establecimientos (Pereira / Neiva)
// ============================================================
// Fechas relativas a "hoy". Todos los nombres y números reales.
// ============================================================

const _today = new Date();
const _Y = _today.getFullYear();
const _M = _today.getMonth();
const _D = _today.getDate();
const ymd = (y, m, d) => new Date(y, m, d);
const todayPlus = (days) => {
  const x = new Date(_today); x.setDate(_today.getDate() + days);
  return x;
};
const isoDate = (d) => d.toISOString().slice(0, 10);

// ----- Establecimientos -----
const ESTABS = [
  {
    id: "sazon",
    vertical: "mesas",
    name: "Sazón del Río",
    city: "Neiva",
    address: "Cra. 5 # 22-08, Centro",
    short: "SR",
    plan: "Pro",
    hero: "assets-b2b/restaurante.jpg",
    descripcion: "Cocina huilense de autor. Mesas para 36 comensales. 9 mesas en planta.",
    whatsapp: "+57 322 845 6712",
    stars: 2,
  },
  {
    id: "catleya",
    vertical: "habitaciones",
    name: "Hostal La Catleya",
    city: "Pereira",
    address: "Cl. 23 # 7-45, Centro",
    short: "LC",
    plan: "Connection",
    hero: "assets-b2b/hotel.jpg",
    descripcion: "Hostal boutique, 12 habitaciones mixtas. Vista a Otún.",
    whatsapp: "+57 313 778 2491",
    stars: 3,
  },
  {
    id: "ellago",
    vertical: "canchas",
    name: "Canchas El Lago",
    city: "Pereira",
    address: "Av. Sur # 38-21, Pinares",
    short: "EL",
    plan: "Pro",
    hero: "assets-b2b/canchas.webp",
    descripcion: "6 espacios deportivos: fútbol 5, pádel y multipropósito.",
    whatsapp: "+57 318 226 4530",
    stars: 1,
  },
  {
    id: "sonrisa",
    vertical: "agenda",
    name: "Odontología Sonrisa Caribe",
    city: "Neiva",
    address: "Cra. 7 # 18-44, La Toma",
    short: "SC",
    plan: "Free",
    hero: "assets-b2b/servicios.jpg",
    descripcion: "Odontología general y estética. 3 profesionales, 3 boxes.",
    whatsapp: "+57 305 612 8847",
    stars: 1,
  },
];

// ============================================================
// CLIENTES por establecimiento (mínimo 10 c/u)
// ============================================================
const CLIENTES_SAZON = [
  { id: "c1",  nombre: "Mariana Quintero",  wa: "+57 311 224 8810", reservas: 6, cumplidas: 6, noshow: 0, ticketProm: 142000, ultimo: -4,  dia: "Vie", franja: "cena", tags: ["vegano", "celebró cumpleaños"], tipo: "Recurrente" },
  { id: "c2",  nombre: "Andrés Salgado",    wa: "+57 322 815 4471", reservas: 3, cumplidas: 3, noshow: 0, ticketProm: 88000,  ultimo: -8,  dia: "Sáb", franja: "almuerzo", tags: ["llevó hijos"], tipo: "Recurrente" },
  { id: "c3",  nombre: "Camila Rojas",      wa: "+57 313 552 9908", reservas: 1, cumplidas: 0, noshow: 1, ticketProm: 0,      ultimo: -16, dia: "Jue", franja: "cena", tags: [], tipo: "Nuevo" },
  { id: "c4",  nombre: "Luis Felipe Castro",wa: "+57 318 446 7732", reservas: 9, cumplidas: 8, noshow: 1, ticketProm: 215000, ultimo: -1,  dia: "Vie", franja: "cena", tags: ["mesa rincón", "celebración pareja"], tipo: "Frecuente" },
  { id: "c5",  nombre: "Isabela Méndez",    wa: "+57 320 117 3398", reservas: 2, cumplidas: 2, noshow: 0, ticketProm: 96000,  ultimo: -12, dia: "Dom", franja: "almuerzo", tags: ["sin gluten"], tipo: "Recurrente" },
  { id: "c6",  nombre: "Juan David Ortiz",  wa: "+57 314 884 0029", reservas: 4, cumplidas: 4, noshow: 0, ticketProm: 168000, ultimo: -2,  dia: "Vie", franja: "cena", tags: ["llevó cliente trabajo"], tipo: "Recurrente" },
  { id: "c7",  nombre: "Lucía Hernández",   wa: "+57 316 553 8821", reservas: 1, cumplidas: 1, noshow: 0, ticketProm: 76000,  ultimo: -22, dia: "Sáb", franja: "almuerzo", tags: [], tipo: "Nuevo" },
  { id: "c8",  nombre: "Daniel Páez",       wa: "+57 321 097 4456", reservas: 12, cumplidas: 11, noshow: 1, ticketProm: 192000, ultimo: 0,  dia: "Jue", franja: "cena", tags: ["VIP", "le encanta el lechona"], tipo: "Frecuente" },
  { id: "c9",  nombre: "Valentina Pino",    wa: "+57 312 778 1190", reservas: 2, cumplidas: 2, noshow: 0, ticketProm: 124000, ultimo: -6,  dia: "Sáb", franja: "cena", tags: ["aniversario"], tipo: "Recurrente" },
  { id: "c10", nombre: "Sebastián Lara",    wa: "+57 304 661 2287", reservas: 1, cumplidas: 1, noshow: 0, ticketProm: 89000,  ultimo: -14, dia: "Vie", franja: "almuerzo", tags: [], tipo: "Nuevo" },
  { id: "c11", nombre: "Paola Gutiérrez",   wa: "+57 319 224 6635", reservas: 5, cumplidas: 5, noshow: 0, ticketProm: 156000, ultimo: -3,  dia: "Vie", franja: "cena", tags: ["mesa terraza"], tipo: "Recurrente" },
];

const CLIENTES_CATLEYA = [
  { id: "h1",  nombre: "Tomás Vergara",       wa: "+57 311 884 5572", reservas: 3, cumplidas: 3, noshow: 0, ticketProm: 380000, ultimo: -10, dia: "Vie", franja: "noche", tags: ["viajó con perro", "estancia larga"], tipo: "Frecuente" },
  { id: "h2",  nombre: "Sara Lozano",         wa: "+57 320 661 4488", reservas: 2, cumplidas: 2, noshow: 0, ticketProm: 240000, ultimo: -18, dia: "Sáb", franja: "noche", tags: ["pareja"], tipo: "Recurrente" },
  { id: "h3",  nombre: "Esteban Bedoya",      wa: "+57 314 552 7791", reservas: 5, cumplidas: 5, noshow: 0, ticketProm: 520000, ultimo: -1,  dia: "Jue", franja: "noche", tags: ["business trip", "vista al río"], tipo: "Frecuente" },
  { id: "h4",  nombre: "Daniela Pulido",      wa: "+57 322 117 3389", reservas: 1, cumplidas: 1, noshow: 0, ticketProm: 180000, ultimo: -25, dia: "Dom", franja: "noche", tags: [], tipo: "Nuevo" },
  { id: "h5",  nombre: "Camilo Restrepo",     wa: "+57 317 884 0091", reservas: 4, cumplidas: 3, noshow: 1, ticketProm: 290000, ultimo: -6,  dia: "Vie", franja: "noche", tags: ["mochilero"], tipo: "Recurrente" },
  { id: "h6",  nombre: "Laura Marín",         wa: "+57 313 220 9985", reservas: 2, cumplidas: 2, noshow: 0, ticketProm: 410000, ultimo: -14, dia: "Sáb", franja: "noche", tags: ["luna de miel"], tipo: "Recurrente" },
  { id: "h7",  nombre: "Mateo Hincapié",      wa: "+57 304 778 2204", reservas: 1, cumplidas: 0, noshow: 0, ticketProm: 0,      ultimo: 0,   dia: "Vie", franja: "noche", tags: [], tipo: "Nuevo" },
  { id: "h8",  nombre: "Natalia Cárdenas",    wa: "+57 319 446 5523", reservas: 3, cumplidas: 3, noshow: 0, ticketProm: 340000, ultimo: -4,  dia: "Sáb", franja: "noche", tags: ["vegana"], tipo: "Recurrente" },
  { id: "h9",  nombre: "Felipe Arias",        wa: "+57 311 998 7715", reservas: 1, cumplidas: 1, noshow: 0, ticketProm: 220000, ultimo: -20, dia: "Vie", franja: "noche", tags: [], tipo: "Nuevo" },
  { id: "h10", nombre: "Andrea Sepúlveda",    wa: "+57 316 117 8836", reservas: 6, cumplidas: 6, noshow: 0, ticketProm: 480000, ultimo: -2,  dia: "Jue", franja: "noche", tags: ["VIP", "early check-in"], tipo: "Frecuente" },
];

const CLIENTES_ELLAGO = [
  { id: "k1",  nombre: "Carlos Ramírez",       wa: "+57 311 446 8820", reservas: 14, cumplidas: 13, noshow: 1, ticketProm: 95000, ultimo: 0,  dia: "Mié", franja: "noche", tags: ["fútbol 5 fijo"], tipo: "Frecuente" },
  { id: "k2",  nombre: "Sebastián Toro",       wa: "+57 318 552 9974", reservas: 8,  cumplidas: 8,  noshow: 0, ticketProm: 75000, ultimo: -1, dia: "Vie", franja: "noche", tags: ["pádel grupo"], tipo: "Frecuente" },
  { id: "k3",  nombre: "Jhon Esteban Marín",   wa: "+57 313 880 4471", reservas: 5,  cumplidas: 4,  noshow: 1, ticketProm: 85000, ultimo: -3, dia: "Mar", franja: "tarde", tags: [], tipo: "Recurrente" },
  { id: "k4",  nombre: "Diana Carolina Rúa",   wa: "+57 322 117 8839", reservas: 3,  cumplidas: 3,  noshow: 0, ticketProm: 60000, ultimo: -5, dia: "Sáb", franja: "mañana", tags: ["voleibol"], tipo: "Recurrente" },
  { id: "k5",  nombre: "Andrés Felipe Cano",   wa: "+57 317 226 5519", reservas: 9,  cumplidas: 8,  noshow: 1, ticketProm: 92000, ultimo: 0,  dia: "Mié", franja: "noche", tags: ["grupo fijo"], tipo: "Frecuente" },
  { id: "k6",  nombre: "Mariana López",        wa: "+57 304 558 1290", reservas: 2,  cumplidas: 2,  noshow: 0, ticketProm: 70000, ultimo: -8, dia: "Dom", franja: "tarde", tags: [], tipo: "Recurrente" },
  { id: "k7",  nombre: "Luis Eduardo Salazar", wa: "+57 311 770 4456", reservas: 6,  cumplidas: 5,  noshow: 1, ticketProm: 88000, ultimo: -2, dia: "Vie", franja: "noche", tags: ["after office"], tipo: "Frecuente" },
  { id: "k8",  nombre: "Cristian Vélez",       wa: "+57 320 226 7785", reservas: 1,  cumplidas: 1,  noshow: 0, ticketProm: 65000, ultimo: -15,dia: "Sáb", franja: "tarde", tags: [], tipo: "Nuevo" },
  { id: "k9",  nombre: "Verónica Aguirre",     wa: "+57 313 994 1147", reservas: 4,  cumplidas: 4,  noshow: 0, ticketProm: 78000, ultimo: -4, dia: "Jue", franja: "noche", tags: ["pádel mixto"], tipo: "Recurrente" },
  { id: "k10", nombre: "Jorge Iván Henao",     wa: "+57 314 663 2280", reservas: 7,  cumplidas: 7,  noshow: 0, ticketProm: 102000,ultimo: -1, dia: "Vie", franja: "noche", tags: ["torneo amigos"], tipo: "Frecuente" },
];

const CLIENTES_SONRISA = [
  { id: "p1",  nombre: "Carolina Rivas",       wa: "+57 311 226 5570", reservas: 4, cumplidas: 4, noshow: 0, ticketProm: 220000, ultimo: -2,  dia: "Mar", franja: "mañana", tags: ["ortodoncia"], tipo: "Recurrente" },
  { id: "p2",  nombre: "Hernán Buitrago",      wa: "+57 320 884 1129", reservas: 6, cumplidas: 5, noshow: 1, ticketProm: 380000, ultimo: -1,  dia: "Jue", franja: "tarde", tags: ["EPS particular"], tipo: "Frecuente" },
  { id: "p3",  nombre: "Liliana Mosquera",     wa: "+57 314 558 7793", reservas: 2, cumplidas: 2, noshow: 0, ticketProm: 165000, ultimo: -9,  dia: "Mié", franja: "mañana", tags: [], tipo: "Recurrente" },
  { id: "p4",  nombre: "Felipe Andrade",       wa: "+57 322 117 8836", reservas: 1, cumplidas: 1, noshow: 0, ticketProm: 90000,  ultimo: -22, dia: "Vie", franja: "tarde", tags: ["primera cita"], tipo: "Nuevo" },
  { id: "p5",  nombre: "Sofía Calderón",       wa: "+57 317 884 0014", reservas: 3, cumplidas: 3, noshow: 0, ticketProm: 195000, ultimo: -4,  dia: "Lun", franja: "mañana", tags: ["limpieza semestral"], tipo: "Recurrente" },
  { id: "p6",  nombre: "Yesid Trujillo",       wa: "+57 304 552 1287", reservas: 8, cumplidas: 7, noshow: 1, ticketProm: 410000, ultimo: 0,   dia: "Mar", franja: "tarde", tags: ["implantes"], tipo: "Frecuente" },
  { id: "p7",  nombre: "Andrea Patiño",        wa: "+57 311 770 4453", reservas: 1, cumplidas: 0, noshow: 1, ticketProm: 0,      ultimo: -11, dia: "Jue", franja: "tarde", tags: [], tipo: "Nuevo" },
  { id: "p8",  nombre: "Diego Mendoza",        wa: "+57 320 226 7782", reservas: 5, cumplidas: 5, noshow: 0, ticketProm: 215000, ultimo: -6,  dia: "Sáb", franja: "mañana", tags: ["estética"], tipo: "Frecuente" },
  { id: "p9",  nombre: "Mónica Gaviria",       wa: "+57 313 994 1144", reservas: 2, cumplidas: 2, noshow: 0, ticketProm: 130000, ultimo: -13, dia: "Mié", franja: "tarde", tags: [], tipo: "Recurrente" },
  { id: "p10", nombre: "Iván Darío López",     wa: "+57 314 663 2287", reservas: 1, cumplidas: 1, noshow: 0, ticketProm: 105000, ultimo: -28, dia: "Vie", franja: "mañana", tags: [], tipo: "Nuevo" },
];

const CLIENTES = {
  sazon: CLIENTES_SAZON,
  catleya: CLIENTES_CATLEYA,
  ellago: CLIENTES_ELLAGO,
  sonrisa: CLIENTES_SONRISA,
};

// ============================================================
// RESERVAS · vertical Mesas (Sazón del Río)
// ============================================================
const MESAS_LAYOUT = [
  { code: "T1", pax: 2, zona: "Ventana" },
  { code: "T2", pax: 4, zona: "Ventana" },
  { code: "T3", pax: 4, zona: "Central" },
  { code: "T4", pax: 6, zona: "Central" },
  { code: "T5", pax: 2, zona: "Terraza" },
  { code: "T6", pax: 4, zona: "Terraza" },
  { code: "T7", pax: 8, zona: "Privado" },
  { code: "T8", pax: 4, zona: "Central" },
  { code: "T9", pax: 2, zona: "Barra" },
];

const RESERVAS_MESAS = [
  { id: "m1", mesa: "T1", clienteId: "c1", pax: 2, hora: "12:30", franja: "Almuerzo", fecha: 0, estado: "Confirmada", origen: "quepa", valor: 92000, notas: "Cumpleaños — sorprenderla con postre.", bitacora: [{ u: "Quepa", a: "Creada por Quepa", t: -2, h: "10:14" }, { u: "Mariana (Op)", a: "Confirmada", t: -2, h: "11:02" }] },
  { id: "m2", mesa: "T2", clienteId: "c4", pax: 4, hora: "13:00", franja: "Almuerzo", fecha: 0, estado: "Ocupada", origen: "quepa", valor: 215000, notas: "Mesa rincón si es posible.", bitacora: [{ u: "Quepa", a: "Creada por Quepa", t: -3, h: "18:22" }, { u: "Sazón (Adm)", a: "Confirmada", t: -3, h: "19:01" }, { u: "Sazón (Adm)", a: "Check-in", t: 0, h: "13:02" }] },
  { id: "m3", mesa: "T4", clienteId: "c8", pax: 6, hora: "20:00", franja: "Cena",   fecha: 0, estado: "Confirmada", origen: "quepa", valor: 380000, notas: "Cena cliente — discreción.", bitacora: [{ u: "Quepa", a: "Creada por Quepa", t: -1, h: "21:33" }] },
  { id: "m4", mesa: "T7", clienteId: "c6", pax: 8, hora: "19:30", franja: "Cena",   fecha: 0, estado: "Confirmada", origen: "manual", valor: 720000, notas: "Reunión de empresa.", bitacora: [{ u: "Sazón (Adm)", a: "Creada manual", t: -5, h: "10:08" }] },
  { id: "m5", mesa: "T3", clienteId: "c11", pax: 3, hora: "13:30", franja: "Almuerzo", fecha: 0, estado: "Pendiente", origen: "quepa", valor: 156000, notas: "", bitacora: [{ u: "Quepa", a: "Creada por Quepa", t: 0, h: "10:45" }] },
  { id: "m6", mesa: "T8", clienteId: "c9", pax: 4, hora: "20:30", franja: "Cena",   fecha: 0, estado: "Confirmada", origen: "quepa", valor: 248000, notas: "Aniversario — pasa al área de las velas.", bitacora: [{ u: "Quepa", a: "Creada por Quepa", t: -4, h: "16:11" }] },
  { id: "m7", mesa: "T2", clienteId: "c2", pax: 4, hora: "19:00", franja: "Cena",   fecha: 1, estado: "Confirmada", origen: "manual", valor: 180000, notas: "", bitacora: [{ u: "Sazón (Op)", a: "Creada manual", t: -2, h: "11:30" }] },
  { id: "m8", mesa: "T5", clienteId: "c5", pax: 2, hora: "20:30", franja: "Cena",   fecha: 1, estado: "Confirmada", origen: "quepa", valor: 124000, notas: "Cliente sin gluten.", bitacora: [{ u: "Quepa", a: "Creada por Quepa", t: -1, h: "09:50" }] },
  { id: "m9", mesa: "T1", clienteId: "c10",pax: 2, hora: "13:30", franja: "Almuerzo", fecha: 2, estado: "Pendiente", origen: "quepa", valor: 0,     notas: "", bitacora: [{ u: "Quepa", a: "Creada por Quepa", t: 0, h: "08:22" }] },
  { id: "m10",mesa: "T6", clienteId: "c7", pax: 4, hora: "20:00", franja: "Cena",   fecha: 3, estado: "Confirmada", origen: "quepa", valor: 198000, notas: "", bitacora: [{ u: "Quepa", a: "Creada por Quepa", t: -2, h: "20:15" }] },
  { id: "m11",mesa: "T4", clienteId: "c3", pax: 5, hora: "13:00", franja: "Almuerzo", fecha: -2, estado: "No-show", origen: "quepa", valor: 0,     notas: "No se presentó pese a confirmación.", bitacora: [{ u: "Quepa", a: "Creada", t: -5, h: "10:00" }, { u: "Sazón (Op)", a: "Marcada No-show", t: -2, h: "14:30" }] },
  { id: "m12",mesa: "T7", clienteId: "c6", pax: 8, hora: "20:00", franja: "Cena",   fecha: -4, estado: "Cumplida", origen: "quepa", valor: 685000, notas: "", bitacora: [{ u: "Quepa", a: "Creada", t: -10, h: "18:00" }, { u: "Sazón (Adm)", a: "Cumplida", t: -4, h: "23:10" }] },
  { id: "m13",mesa: "T3", clienteId: "c4", pax: 2, hora: "21:00", franja: "Cena",   fecha: -7, estado: "Cumplida", origen: "manual", valor: 198000, notas: "", bitacora: [{ u: "Sazón (Op)", a: "Creada", t: -10, h: "09:10" }, { u: "Sazón (Op)", a: "Cumplida", t: -7, h: "23:00" }] },
  { id: "m14",mesa: "T2", clienteId: "c8", pax: 3, hora: "13:00", franja: "Almuerzo", fecha: -3, estado: "Cumplida", origen: "quepa", valor: 195000, notas: "", bitacora: [{ u: "Quepa", a: "Creada", t: -5, h: "11:00" }, { u: "Sazón (Adm)", a: "Cumplida", t: -3, h: "14:55" }] },
];

const KPI_MESAS = {
  ocupacion: 67,
  reservasHoy: 7,
  comensalesHoy: 31,
  noShow30d: 4.2,
  horaPico: [3, 5, 12, 18, 22, 28, 26, 20, 15, 9, 5, 2], // 12h–23h (12 valores)
  peakIdx: 5,
  rotacionMin: 92,
  ticketProm: 168000,
};

// ============================================================
// RESERVAS · vertical Habitaciones (Hostal La Catleya)
// ============================================================
const HABS_LAYOUT = [
  { code: "101", tipo: "Estándar", capacidad: 2 },
  { code: "102", tipo: "Estándar", capacidad: 2 },
  { code: "103", tipo: "Estándar", capacidad: 2 },
  { code: "201", tipo: "Doble", capacidad: 3 },
  { code: "202", tipo: "Doble", capacidad: 3 },
  { code: "203", tipo: "Doble", capacidad: 4 },
  { code: "301", tipo: "Suite", capacidad: 4 },
  { code: "302", tipo: "Suite", capacidad: 4 },
  { code: "D1",  tipo: "Dormitorio compartido", capacidad: 8 },
  { code: "D2",  tipo: "Dormitorio compartido", capacidad: 8 },
  { code: "D3",  tipo: "Dormitorio compartido", capacidad: 8 },
  { code: "D4",  tipo: "Dormitorio compartido", capacidad: 6 },
];

// Reservas como rangos de día del mes actual
const RESERVAS_HABS = [
  { id: "rh1",  hab: "101", clienteId: "h1",  diaInicio: _D - 2,  noches: 3, estado: "Pagada",     origen: "quepa",  valor: 380000 * 3, pax: 2, notas: "Llega con perro pequeño." },
  { id: "rh2",  hab: "102", clienteId: "h2",  diaInicio: _D,      noches: 2, estado: "Confirmada", origen: "quepa",  valor: 240000 * 2, pax: 2, notas: "" },
  { id: "rh3",  hab: "103", clienteId: "h5",  diaInicio: _D + 3,  noches: 4, estado: "Confirmada", origen: "manual", valor: 290000 * 4, pax: 2, notas: "Mochilero, llega tarde." },
  { id: "rh4",  hab: "201", clienteId: "h3",  diaInicio: _D - 1,  noches: 5, estado: "Pagada",     origen: "quepa",  valor: 520000 * 5, pax: 2, notas: "Viaje de trabajo, factura empresa." },
  { id: "rh5",  hab: "202", clienteId: "h4",  diaInicio: _D + 5,  noches: 2, estado: "Pendiente",  origen: "quepa",  valor: 180000 * 2, pax: 3, notas: "Pendiente confirmar pago." },
  { id: "rh6",  hab: "203", clienteId: "h6",  diaInicio: _D + 1,  noches: 3, estado: "Pagada",     origen: "quepa",  valor: 410000 * 3, pax: 2, notas: "Luna de miel — flores en habitación." },
  { id: "rh7",  hab: "301", clienteId: "h10", diaInicio: _D - 1,  noches: 4, estado: "Pagada",     origen: "quepa",  valor: 480000 * 4, pax: 4, notas: "Early check-in solicitado." },
  { id: "rh8",  hab: "302", clienteId: "h8",  diaInicio: _D + 8,  noches: 3, estado: "Confirmada", origen: "quepa",  valor: 340000 * 3, pax: 3, notas: "Cliente vegana — desayuno especial." },
  { id: "rh9",  hab: "D1",  clienteId: "h7",  diaInicio: _D,      noches: 1, estado: "Confirmada", origen: "quepa",  valor: 75000,      pax: 1, notas: "" },
  { id: "rh10", hab: "D2",  clienteId: "h9",  diaInicio: _D + 2,  noches: 5, estado: "Pagada",     origen: "manual", valor: 75000 * 5,  pax: 1, notas: "" },
  { id: "rh11", hab: "D3",  clienteId: "h5",  diaInicio: _D - 4,  noches: 2, estado: "Cancelada",  origen: "quepa",  valor: 0,          pax: 1, notas: "Cancelada por el cliente." },
  { id: "rh12", hab: "D4",  clienteId: "h2",  diaInicio: _D + 10, noches: 2, estado: "Confirmada", origen: "manual", valor: 75000 * 2,  pax: 2, notas: "" },
  { id: "rh13", hab: "101", clienteId: "h6",  diaInicio: _D + 7,  noches: 2, estado: "Confirmada", origen: "quepa",  valor: 240000 * 2, pax: 2, notas: "" },
  { id: "rh14", hab: "201", clienteId: "h1",  diaInicio: _D + 6,  noches: 3, estado: "Confirmada", origen: "quepa",  valor: 320000 * 3, pax: 2, notas: "" },
  { id: "rh15", hab: "302", clienteId: "h3",  diaInicio: _D + 4,  noches: 2, estado: "Pagada",     origen: "quepa",  valor: 340000 * 2, pax: 1, notas: "Repetente, conocido del lugar." },
  { id: "rh16", hab: "102", clienteId: "h8",  diaInicio: _D + 3,  noches: 1, estado: "Pendiente",  origen: "quepa",  valor: 240000,     pax: 2, notas: "" },
  { id: "rh17", hab: "203", clienteId: "h4",  diaInicio: _D - 3,  noches: 2, estado: "Pagada",     origen: "manual", valor: 280000 * 2, pax: 2, notas: "" },
  { id: "rh18", hab: "D1",  clienteId: "h10", diaInicio: _D + 6,  noches: 4, estado: "Confirmada", origen: "quepa",  valor: 75000 * 4,  pax: 1, notas: "" },
];

const KPI_HABS = {
  ocupacionHoy: 75,
  ocupacion7d: 68,
  ocupacion7dSpark: [62, 65, 71, 68, 70, 74, 68],
  adr: 312000,
  revpar: 234000,
  estanciaProm: 2.8,
  topTipo: "Doble",
  leadTime: 9.3,
  cancel30d: 6.5,
};

// ============================================================
// RESERVAS · vertical Canchas (Canchas El Lago)
// ============================================================
const CANCHAS_LAYOUT = [
  { code: "C1", nombre: "Fútbol 5 A",    sport: "Fútbol 5" },
  { code: "C2", nombre: "Fútbol 5 B",    sport: "Fútbol 5" },
  { code: "C3", nombre: "Pádel 1",       sport: "Pádel" },
  { code: "C4", nombre: "Pádel 2",       sport: "Pádel" },
  { code: "C5", nombre: "Multiprop. A",  sport: "Voleibol / Baloncesto" },
  { code: "C6", nombre: "Multiprop. B",  sport: "Voleibol / Baloncesto" },
];

const _now = new Date();
const _nowH = _now.getHours();
// Helper: next slot calculation done at component level

const RESERVAS_CANCHAS = [
  // hoy
  { id: "k1", cancha: "C1", clienteId: "k1", hora: "19:00", duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa", valor: 95000, notas: "Grupo fijo." },
  { id: "k2", cancha: "C1", clienteId: "k5", hora: "20:00", duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa", valor: 95000, notas: "" },
  { id: "k3", cancha: "C2", clienteId: "k10",hora: "18:00", duracion: 2, fecha: 0, estado: "Pagada",     origen: "quepa", valor: 190000, notas: "Torneo amigos." },
  { id: "k4", cancha: "C3", clienteId: "k2", hora: "17:00", duracion: 1, fecha: 0, estado: "Confirmada", origen: "manual", valor: 60000, notas: "" },
  { id: "k5", cancha: "C3", clienteId: "k9", hora: "19:00", duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa", valor: 60000, notas: "Pádel mixto." },
  { id: "k6", cancha: "C4", clienteId: "k7", hora: "20:00", duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa", valor: 60000, notas: "After office." },
  { id: "k7", cancha: "C5", clienteId: "k4", hora: "16:00", duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa", valor: 55000, notas: "Voleibol." },
  { id: "k8", cancha: "C6", clienteId: "k3", hora: "15:00", duracion: 1, fecha: 0, estado: "Pendiente",  origen: "quepa", valor: 55000, notas: "" },
  // mañana
  { id: "k9", cancha: "C1", clienteId: "k1", hora: "19:00", duracion: 1, fecha: 1, estado: "Confirmada", origen: "quepa", valor: 95000, notas: "" },
  { id: "k10",cancha: "C3", clienteId: "k2", hora: "18:00", duracion: 2, fecha: 1, estado: "Confirmada", origen: "manual", valor: 120000, notas: "" },
  // resto semana
  { id: "k11",cancha: "C1", clienteId: "k7", hora: "20:00", duracion: 1, fecha: 2, estado: "Confirmada", origen: "quepa", valor: 95000, notas: "" },
  { id: "k12",cancha: "C4", clienteId: "k9", hora: "19:00", duracion: 1, fecha: 2, estado: "Confirmada", origen: "quepa", valor: 60000, notas: "" },
  { id: "k13",cancha: "C2", clienteId: "k10",hora: "18:00", duracion: 2, fecha: 3, estado: "Pagada",     origen: "quepa", valor: 190000, notas: "" },
  { id: "k14",cancha: "C5", clienteId: "k6", hora: "16:00", duracion: 1, fecha: 4, estado: "Confirmada", origen: "quepa", valor: 55000, notas: "" },
  { id: "k15",cancha: "C3", clienteId: "k7", hora: "20:00", duracion: 1, fecha: 5, estado: "Confirmada", origen: "manual", valor: 60000, notas: "" },
  { id: "k16",cancha: "C1", clienteId: "k5", hora: "19:00", duracion: 1, fecha: 5, estado: "Pagada",     origen: "quepa", valor: 95000, notas: "Grupo fijo." },
  // ayer no-show
  { id: "k17",cancha: "C4", clienteId: "k3", hora: "20:00", duracion: 1, fecha: -1, estado: "No-show", origen: "quepa", valor: 0, notas: "Cliente no llegó." },
  // pasados cumplidos
  { id: "k18",cancha: "C1", clienteId: "k1", hora: "19:00", duracion: 1, fecha: -2, estado: "Cumplida", origen: "quepa", valor: 95000, notas: "" },
  { id: "k19",cancha: "C2", clienteId: "k10",hora: "18:00", duracion: 2, fecha: -3, estado: "Cumplida", origen: "manual", valor: 190000, notas: "" },
  { id: "k20",cancha: "C3", clienteId: "k9", hora: "19:00", duracion: 1, fecha: -4, estado: "Cumplida", origen: "quepa", valor: 60000, notas: "" },
];

const KPI_CANCHAS = {
  ocupacionHoy: 58,
  ocupacionSem: 72,
  topCancha: "C1 — Fútbol 5 A",
  franjaHoras: [0, 1, 1, 2, 3, 5, 8, 12, 14, 13, 11, 7, 3], // 10–22h
  franjaPeakIdx: 8,
  duracionProm: 1.3,
  noShow30d: 5.8,
  ingresoCancha: 4280000,
};

// ============================================================
// RESERVAS · vertical Agenda (Odontología Sonrisa Caribe)
// ============================================================
const PROFESIONALES = [
  { id: "pr1", nombre: "Dra. Lucía Marín",   especialidad: "Odontología general", inicial: "LM" },
  { id: "pr2", nombre: "Dr. Iván Salazar",   especialidad: "Endodoncia",          inicial: "IS" },
  { id: "pr3", nombre: "Dra. Camila Restrepo",especialidad: "Ortodoncia",         inicial: "CR" },
];
const BOXES = [
  { id: "b1", nombre: "Box 1", uso: [4, 5, 3, 6, 4, 2, 1] },
  { id: "b2", nombre: "Box 2", uso: [3, 4, 5, 5, 6, 3, 1] },
  { id: "b3", nombre: "Box 3", uso: [2, 3, 4, 4, 5, 4, 2] },
];

// Citas: profesional, cliente, hora inicio, duración horas, tipo
const RESERVAS_AGENDA = [
  { id: "a1", pro: "pr1", clienteId: "p1", hora: "08:00", dur: 1,   fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 220000, tipo: "ortodoncia",  servicio: "Control ortodoncia",     notas: "Cambio de cauchos." },
  { id: "a2", pro: "pr1", clienteId: "p5", hora: "09:30", dur: 1,   fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 195000, tipo: "limpieza",    servicio: "Limpieza semestral",     notas: "" },
  { id: "a3", pro: "pr1", clienteId: "p10",hora: "11:00", dur: 1.5, fecha: 0, estado: "Pendiente",  origen: "quepa",  valor: 0,      tipo: "diagnostico", servicio: "Diagnóstico inicial",    notas: "Cliente nuevo." },
  { id: "a4", pro: "pr2", clienteId: "p2", hora: "09:00", dur: 2,   fecha: 0, estado: "Pagada",     origen: "manual", valor: 480000, tipo: "endodoncia",  servicio: "Endodoncia molar",       notas: "Sesión 2 de 3." },
  { id: "a5", pro: "pr2", clienteId: "p6", hora: "14:00", dur: 2,   fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 410000, tipo: "endodoncia",  servicio: "Implante — toma molde",  notas: "" },
  { id: "a6", pro: "pr3", clienteId: "p3", hora: "10:00", dur: 1,   fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 165000, tipo: "ortodoncia",  servicio: "Ajuste mensual",         notas: "" },
  { id: "a7", pro: "pr3", clienteId: "p8", hora: "13:00", dur: 1.5, fecha: 0, estado: "Pagada",     origen: "quepa",  valor: 280000, tipo: "ortodoncia",  servicio: "Brackets estéticos",     notas: "Etapa final." },
  { id: "a8", pro: "pr3", clienteId: "p9", hora: "15:30", dur: 1,   fecha: 0, estado: "Confirmada", origen: "manual", valor: 130000, tipo: "consulta",    servicio: "Consulta general",       notas: "" },
  // mañana
  { id: "a9", pro: "pr1", clienteId: "p4", hora: "08:30", dur: 1,   fecha: 1, estado: "Confirmada", origen: "quepa",  valor: 90000,  tipo: "diagnostico", servicio: "Primera cita",           notas: "" },
  { id: "a10",pro: "pr2", clienteId: "p6", hora: "10:00", dur: 2.5, fecha: 1, estado: "Confirmada", origen: "manual", valor: 510000, tipo: "endodoncia",  servicio: "Endodoncia — sesión 3",  notas: "Última sesión." },
  { id: "a11",pro: "pr3", clienteId: "p1", hora: "14:00", dur: 1,   fecha: 1, estado: "Confirmada", origen: "quepa",  valor: 220000, tipo: "ortodoncia",  servicio: "Control",                notas: "" },
  // pasados
  { id: "a12",pro: "pr1", clienteId: "p7", hora: "10:00", dur: 1,   fecha: -3, estado: "No-show",  origen: "quepa",  valor: 0,      tipo: "limpieza",    servicio: "Limpieza",                notas: "No se presentó." },
  { id: "a13",pro: "pr2", clienteId: "p2", hora: "09:00", dur: 2,   fecha: -7, estado: "Cumplida", origen: "manual", valor: 480000, tipo: "endodoncia",  servicio: "Endodoncia molar — s1",  notas: "" },
  { id: "a14",pro: "pr3", clienteId: "p8", hora: "13:00", dur: 1.5, fecha: -10,estado: "Cumplida", origen: "quepa",  valor: 280000, tipo: "ortodoncia",  servicio: "Brackets",                notas: "" },
  // viernes
  { id: "a15",pro: "pr1", clienteId: "p5", hora: "10:00", dur: 1,   fecha: 3, estado: "Confirmada", origen: "quepa",  valor: 195000, tipo: "limpieza",    servicio: "Limpieza",                notas: "" },
  { id: "a16",pro: "pr2", clienteId: "p6", hora: "11:30", dur: 2,   fecha: 3, estado: "Confirmada", origen: "quepa",  valor: 410000, tipo: "endodoncia",  servicio: "Implante — colocación",   notas: "" },
];

const KPI_AGENDA = {
  citasHoy: 8,
  ocupacionSem: 74,
  topServicio: "Limpieza",
  topPro: "Dra. Lucía Marín",
  duracionProm: 75,
  noShow30d: 8.1,
  nuevosVsRecurrentes: { nuevos: 12, recurrentes: 38 },
};

// ============================================================
// CLIENTE IDEAL · corona de tags por establecimiento
// ============================================================
const CLIENTE_IDEAL = {
  sazon: {
    sesiones: 287,
    estado: "activo",
    tags: [
      { cat: "place",   text: "vista al río",          pct: 38 },
      { cat: "place",   text: "ambiente romántico",    pct: 31 },
      { cat: "place",   text: "terraza",               pct: 22 },
      { cat: "service", text: "menú vegetariano",      pct: 26 },
      { cat: "service", text: "estacionamiento",       pct: 19 },
      { cat: "occasion",text: "celebración familiar",  pct: 34 },
      { cat: "occasion",text: "aniversario",           pct: 24 },
      { cat: "occasion",text: "cumpleaños",            pct: 21 },
      { cat: "group",   text: "2 personas",            pct: 41 },
      { cat: "group",   text: "4 personas",            pct: 27 },
      { cat: "time",    text: "cena (19–22h)",         pct: 52 },
      { cat: "time",    text: "almuerzo fin de semana",pct: 28 },
      { cat: "voice",   text: "\u201cpara llevar al jefe\u201d",     pct: 18 },
      { cat: "voice",   text: "\u201cpa\u2019 celebrar a mamá\u201d", pct: 15 },
      { cat: "voice",   text: "\u201csabor de la región\u201d",      pct: 14 },
    ],
  },
  catleya: {
    sesiones: 142,
    estado: "activo",
    tags: [
      { cat: "place",   text: "tranquilo",             pct: 44 },
      { cat: "place",   text: "vista a la montaña",    pct: 32 },
      { cat: "place",   text: "patio interior",        pct: 23 },
      { cat: "service", text: "pet-friendly",          pct: 29 },
      { cat: "service", text: "desayuno incluido",     pct: 41 },
      { cat: "service", text: "WiFi rápido",           pct: 19 },
      { cat: "occasion",text: "viaje de trabajo",      pct: 36 },
      { cat: "occasion",text: "luna de miel",          pct: 14 },
      { cat: "group",   text: "2 personas",            pct: 54 },
      { cat: "group",   text: "solo viajero",          pct: 22 },
      { cat: "time",    text: "fin de semana largo",   pct: 33 },
      { cat: "voice",   text: "\u201cpara escapar de la ciudad\u201d", pct: 21 },
      { cat: "voice",   text: "\u201clugar instagrameable\u201d",       pct: 16 },
      { cat: "voice",   text: "\u201cque me dejen llegar tarde\u201d",  pct: 13 },
    ],
  },
  ellago: {
    sesiones: 198,
    estado: "activo",
    tags: [
      { cat: "place",   text: "techado",               pct: 47 },
      { cat: "place",   text: "parqueadero",           pct: 28 },
      { cat: "service", text: "alquila balones",       pct: 22 },
      { cat: "service", text: "tienda de bebidas",     pct: 19 },
      { cat: "occasion",text: "after office",          pct: 38 },
      { cat: "occasion",text: "torneo amigos",         pct: 24 },
      { cat: "group",   text: "10 personas",           pct: 35 },
      { cat: "group",   text: "4 personas",            pct: 24 },
      { cat: "time",    text: "noche entre semana",    pct: 49 },
      { cat: "time",    text: "sábado AM",             pct: 22 },
      { cat: "voice",   text: "\u201cpa\u2019 jugar con los del trabajo\u201d", pct: 31 },
      { cat: "voice",   text: "\u201cque haya luz buena\u201d",            pct: 18 },
      { cat: "voice",   text: "\u201cque no esté lejos\u201d",             pct: 14 },
    ],
  },
  sonrisa: {
    sesiones: 18, // perfil en construcción
    estado: "construccion",
    tags: [
      { cat: "service", text: "primera consulta gratis", pct: 41 },
      { cat: "service", text: "ortodoncia adultos",       pct: 28 },
      { cat: "occasion",text: "antes de matrimonio",      pct: 19 },
      { cat: "time",    text: "sábado AM",                pct: 33 },
      { cat: "voice",   text: "\u201cque no duela\u201d",            pct: 22 },
      { cat: "voice",   text: "\u201cque salgan cuotas\u201d",       pct: 15 },
    ],
  },
};

// ============================================================
// EVENTOS · movimientos para módulo Eventos (ventas)
// ============================================================
const EVENTOS = {
  sazon: {
    ventasMes: 18450000,
    ventasMesAnt: 16720000,
    ticketProm: 168000,
    reservasPagadas: 110,
    delta: 10.3,
    movimientos: [
      { id: "e1", fecha: -1, cliente: "Daniel Páez",       reserva: "T2 · 13:00", valor: 215000, origen: "quepa" },
      { id: "e2", fecha: -1, cliente: "Mariana Quintero",  reserva: "T1 · 12:30", valor: 92000,  origen: "quepa" },
      { id: "e3", fecha: -2, cliente: "Luis Felipe Castro",reserva: "T4 · 20:00", valor: 685000, origen: "quepa" },
      { id: "e4", fecha: -3, cliente: "Paola Gutiérrez",   reserva: "T8 · 20:30", valor: 248000, origen: "quepa" },
      { id: "e5", fecha: -4, cliente: "Andrés Salgado",    reserva: "T2 · 19:00", valor: 180000, origen: "manual" },
      { id: "e6", fecha: -5, cliente: "Valentina Pino",    reserva: "T3 · 21:00", valor: 198000, origen: "manual" },
      { id: "e7", fecha: -6, cliente: "Juan David Ortiz",  reserva: "T7 · 19:30", valor: 720000, origen: "manual" },
      { id: "e8", fecha: -7, cliente: "Lucía Hernández",   reserva: "T6 · 14:00", valor: 76000,  origen: "quepa" },
      { id: "e9", fecha: -8, cliente: "Isabela Méndez",    reserva: "T5 · 20:30", valor: 124000, origen: "quepa" },
      { id: "e10",fecha: -9, cliente: "Sebastián Lara",    reserva: "T1 · 13:00", valor: 89000,  origen: "quepa" },
    ],
  },
};

// ============================================================
// SUSCRIPCION · planes
// ============================================================
const PLANES = [
  {
    id: "free",
    nombre: "Quepa Free",
    precio: 0,
    color: "default",
    incluye: [
      "Recibe reservas por Quepa",
      "Hasta 30 reservas/mes",
      "Avisos por WhatsApp",
      "Panel básico",
    ],
    excluye: ["Cliente ideal", "Pasarela", "Integración PMS", "Impulsa"],
  },
  {
    id: "pro",
    nombre: "Quepa Pro",
    precio: 89000,
    color: "night",
    destacado: true,
    incluye: [
      "Reservas ilimitadas",
      "Card Cliente Ideal completa",
      "Pasarela de pagos integrada",
      "Métricas avanzadas y exportables",
      "Atribución Quepa (tracking)",
    ],
    excluye: ["Sincronización PMS", "Impulsa publicidad"],
  },
  {
    id: "connection",
    nombre: "Quepa Connection",
    precio: 179000,
    color: "yg",
    incluye: [
      "Todo lo de Pro",
      "Sincronización con tu PMS (iCal / webhook)",
      "Impulsa tu Negocio incluido",
      "Soporte prioritario",
      "Acceso anticipado a Quepa Stars",
    ],
    excluye: [],
  },
];

// ============================================================
// CAMPAÑAS (Impulsa) por establecimiento — ejemplos
// ============================================================
const CAMPANAS = [
  { id: "cmp1", titulo: "Cena temática Bandeja Paisa de autor", foco: "Restaurante",   inicio: -5, fin: 9,  estado: "activa",     inversion: 240000, alcance: 1820, reservas: 14 },
  { id: "cmp2", titulo: "Promo entre semana — 10% off",         foco: "Bar",            inicio: -12, fin: -3,estado: "finalizada", inversion: 180000, alcance: 1260, reservas: 8  },
  { id: "cmp3", titulo: "Fin de semana de pádel — torneo",      foco: "Canchas",        inicio: 3,  fin: 17, estado: "borrador",   inversion: 0,      alcance: 0,    reservas: 0  },
];

// ============================================================
// HISTORIAL pagos
// ============================================================
const PAGOS = [
  { id: "pg1", fecha: "01 Mayo 2026",   concepto: "Quepa Pro · mensual",      valor: 89000,  estado: "Pagado" },
  { id: "pg2", fecha: "01 Abril 2026",  concepto: "Quepa Pro · mensual",      valor: 89000,  estado: "Pagado" },
  { id: "pg3", fecha: "01 Marzo 2026",  concepto: "Quepa Free → Pro upgrade", valor: 89000,  estado: "Pagado" },
  { id: "pg4", fecha: "15 Marzo 2026",  concepto: "Impulsa · Cena temática",  valor: 240000, estado: "Pagado" },
];

// ============================================================
// EXPORT
// ============================================================
Object.assign(window, {
  ESTABS, CLIENTES,
  MESAS_LAYOUT, RESERVAS_MESAS, KPI_MESAS,
  HABS_LAYOUT, RESERVAS_HABS, KPI_HABS,
  CANCHAS_LAYOUT, RESERVAS_CANCHAS, KPI_CANCHAS,
  PROFESIONALES, BOXES, RESERVAS_AGENDA, KPI_AGENDA,
  CLIENTE_IDEAL, EVENTOS, PLANES, CAMPANAS, PAGOS,
  isoDate, todayPlus, _today, _D, _M, _Y,
});

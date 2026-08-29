// Quepa Canchas · datos sembrados
// Negocio único: Cancha El Bosque (Neiva). Reemplaza el multi-negocio del prototipo original.

const EB_NEGOCIO = {
  id: "elbosque",
  vertical: "canchas",
  name: "Cancha El Bosque",
  city: "Neiva",
  address: "Avenida 26 # 51-101",
  short: "EB",
  plan: "Quepa Canchas",
  hero: "assets-b2b/canchas.webp",
  descripcion: "Seis canchas sintéticas techadas, iluminadas y con parqueadero. Abierto todos los días.",
  whatsapp: "+57 318 226 4530",
  stars: 2,
  limites: { canchas: 6, usuarios: 3, conversaciones: 1000 },
  usadas: { conversaciones: 412 },
};

const EB_APERTURA = 6;   // 6:00 am
const EB_CIERRE = 23;    // 11:00 pm

const EB_CANCHAS = [
  { id: "c1", code: "C1", nombre: "Cancha 1", tipo: "Fútbol 5",   precio: 70000,  desde: 6, hasta: 23, duraciones: [1, 2, 3], activa: true },
  { id: "c2", code: "C2", nombre: "Cancha 2", tipo: "Fútbol 5",   precio: 70000,  desde: 6, hasta: 23, duraciones: [1, 2, 3], activa: true },
  { id: "c3", code: "C3", nombre: "Cancha 3", tipo: "Fútbol 7",   precio: 110000, desde: 8, hasta: 23, duraciones: [2, 3], activa: true },
  { id: "c4", code: "C4", nombre: "Cancha 4", tipo: "Fútbol 7",   precio: 110000, desde: 8, hasta: 23, duraciones: [2, 3], activa: true },
  { id: "c5", code: "C5", nombre: "Cancha 5", tipo: "Pádel",      precio: 60000,  desde: 6, hasta: 22, duraciones: [1, 2], activa: true },
  { id: "c6", code: "C6", nombre: "Cancha 6", tipo: "Voleiplaya", precio: 55000,  desde: 8, hasta: 22, duraciones: [1, 2, 3, 4], activa: true },
];

const EB_DURACIONES = [1, 2, 3, 4];

const EB_TIPOS = ["Fútbol 5", "Fútbol 7", "Pádel", "Voleiplaya"];

const EB_CLIENTES = [
  { id: "e1",  nombre: "Carlos Ramírez",       wa: "+57 311 446 8820", reservas: 14, noshow: 1, ticketProm: 70000 },
  { id: "e2",  nombre: "Sebastián Toro",       wa: "+57 318 552 9974", reservas: 8,  noshow: 0, ticketProm: 70000 },
  { id: "e3",  nombre: "Jhon Esteban Marín",   wa: "+57 313 880 4471", reservas: 5,  noshow: 1, ticketProm: 110000 },
  { id: "e4",  nombre: "Diana Carolina Rúa",   wa: "+57 322 117 8839", reservas: 3,  noshow: 0, ticketProm: 70000 },
  { id: "e5",  nombre: "Andrés Felipe Cano",   wa: "+57 317 226 5519", reservas: 9,  noshow: 1, ticketProm: 70000 },
  { id: "e6",  nombre: "Mariana López",        wa: "+57 304 558 1290", reservas: 2,  noshow: 0, ticketProm: 110000 },
  { id: "e7",  nombre: "Luis Eduardo Salazar", wa: "+57 311 770 4456", reservas: 6,  noshow: 1, ticketProm: 70000 },
  { id: "e8",  nombre: "Cristian Vélez",       wa: "+57 320 226 7785", reservas: 1,  noshow: 0, ticketProm: 70000 },
  { id: "e9",  nombre: "Verónica Aguirre",     wa: "+57 313 994 1147", reservas: 4,  noshow: 0, ticketProm: 110000 },
  { id: "e10", nombre: "Jorge Iván Henao",     wa: "+57 314 663 2280", reservas: 7,  noshow: 0, ticketProm: 110000 },
  { id: "e11", nombre: "Yesid Trujillo",       wa: "+57 304 552 1287", reservas: 11, noshow: 0, ticketProm: 70000 },
  { id: "e12", nombre: "Camilo Perdomo",       wa: "+57 316 448 2201", reservas: 3,  noshow: 0, ticketProm: 70000 },
  { id: "e13", nombre: "Óscar Cuéllar",        wa: "+57 315 227 9048", reservas: 6,  noshow: 2, ticketProm: 110000 },
  { id: "e14", nombre: "Natalia Polanía",      wa: "+57 310 885 3316", reservas: 2,  noshow: 0, ticketProm: 70000 },
];

// fecha: -1 ayer · 0 hoy · 1 mañana
// estado: Confirmada · Llegó · Pagó · No llegó · Cancelada
const EB_RESERVAS = [
  // ---------- AYER (cerrado) ----------
  { id: "r01", cancha: "c1", clienteId: "e1",  hora: 18, duracion: 1, fecha: -1, estado: "Pagó",     origen: "quepa",  valor: 70000 },
  { id: "r02", cancha: "c1", clienteId: "e5",  hora: 19, duracion: 1, fecha: -1, estado: "Pagó",     origen: "quepa",  valor: 70000 },
  { id: "r03", cancha: "c1", clienteId: "e11", hora: 20, duracion: 2, fecha: -1, estado: "Pagó",     origen: "manual", valor: 140000 },
  { id: "r04", cancha: "c2", clienteId: "e7",  hora: 19, duracion: 1, fecha: -1, estado: "Pagó",     origen: "manual", valor: 70000 },
  { id: "r05", cancha: "c2", clienteId: "e2",  hora: 20, duracion: 1, fecha: -1, estado: "Pagó",     origen: "quepa",  valor: 70000 },
  { id: "r06", cancha: "c2", clienteId: "e12", hora: 21, duracion: 1, fecha: -1, estado: "No llegó", origen: "quepa",  valor: 70000 },
  { id: "r07", cancha: "c3", clienteId: "e10", hora: 19, duracion: 2, fecha: -1, estado: "Pagó",     origen: "quepa",  valor: 220000 },
  { id: "r08", cancha: "c3", clienteId: "e13", hora: 21, duracion: 1, fecha: -1, estado: "Pagó",     origen: "manual", valor: 110000 },

  // ---------- HOY ----------
  { id: "r10", cancha: "c1", clienteId: "e4",  hora: 9,  duracion: 1, fecha: 0, estado: "Pagó",       origen: "manual", valor: 70000 },
  { id: "r11", cancha: "c1", clienteId: "e14", hora: 15, duracion: 1, fecha: 0, estado: "Llegó",      origen: "quepa",  valor: 70000 },
  { id: "r12", cancha: "c1", clienteId: "e1",  hora: 18, duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 70000 },
  { id: "r13", cancha: "c1", clienteId: "e5",  hora: 19, duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 70000 },
  { id: "r14", cancha: "c1", clienteId: "e11", hora: 20, duracion: 2, fecha: 0, estado: "Confirmada", origen: "manual", valor: 140000 },
  { id: "r15", cancha: "c1", clienteId: "e8",  hora: 22, duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 70000 },

  { id: "r16", cancha: "c2", clienteId: "e12", hora: 10, duracion: 1, fecha: 0, estado: "Pagó",       origen: "manual", valor: 70000 },
  { id: "r17", cancha: "c2", clienteId: "e2",  hora: 17, duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 70000 },
  { id: "r18", cancha: "c2", clienteId: "e7",  hora: 19, duracion: 1, fecha: 0, estado: "Confirmada", origen: "manual", valor: 70000 },
  { id: "r19", cancha: "c2", clienteId: "e14", hora: 20, duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 70000 },
  { id: "r20", cancha: "c2", clienteId: "e6",  hora: 21, duracion: 2, fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 140000 },

  { id: "r21", cancha: "c3", clienteId: "e9",  hora: 16, duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 110000 },
  { id: "r22", cancha: "c3", clienteId: "e10", hora: 19, duracion: 2, fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 220000 },
  { id: "r23", cancha: "c3", clienteId: "e13", hora: 21, duracion: 1, fecha: 0, estado: "Confirmada", origen: "manual", valor: 110000 },
  { id: "r24", cancha: "c3", clienteId: "e3",  hora: 22, duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 110000 },

  { id: "r25", cancha: "c4", clienteId: "e11", hora: 18, duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 110000 },
  { id: "r26", cancha: "c4", clienteId: "e12", hora: 20, duracion: 1, fecha: 0, estado: "Confirmada", origen: "manual", valor: 110000 },
  { id: "r27", cancha: "c5", clienteId: "e6",  hora: 17, duracion: 1, fecha: 0, estado: "Confirmada", origen: "quepa",  valor: 60000 },
  { id: "r28", cancha: "c5", clienteId: "e4",  hora: 19, duracion: 1, fecha: 0, estado: "Pagó",       origen: "quepa",  valor: 60000 },
  { id: "r29", cancha: "c6", clienteId: "e8",  hora: 16, duracion: 2, fecha: 0, estado: "Confirmada", origen: "manual", valor: 110000 },

  // ---------- MAÑANA ----------
  { id: "r30", cancha: "c1", clienteId: "e1",  hora: 18, duracion: 1, fecha: 1, estado: "Confirmada", origen: "quepa",  valor: 70000 },
  { id: "r31", cancha: "c1", clienteId: "e11", hora: 19, duracion: 1, fecha: 1, estado: "Confirmada", origen: "quepa",  valor: 70000 },
  { id: "r32", cancha: "c1", clienteId: "e4",  hora: 20, duracion: 1, fecha: 1, estado: "Confirmada", origen: "manual", valor: 70000 },
  { id: "r33", cancha: "c2", clienteId: "e5",  hora: 18, duracion: 2, fecha: 1, estado: "Confirmada", origen: "quepa",  valor: 140000 },
  { id: "r34", cancha: "c2", clienteId: "e2",  hora: 20, duracion: 1, fecha: 1, estado: "Confirmada", origen: "quepa",  valor: 70000 },
  { id: "r35", cancha: "c3", clienteId: "e10", hora: 19, duracion: 1, fecha: 1, estado: "Confirmada", origen: "quepa",  valor: 110000 },
  { id: "r36", cancha: "c3", clienteId: "e9",  hora: 20, duracion: 2, fecha: 1, estado: "Confirmada", origen: "manual", valor: 220000 },
  { id: "r37", cancha: "c4", clienteId: "e13", hora: 19, duracion: 1, fecha: 1, estado: "Confirmada", origen: "quepa",  valor: 110000 },
  { id: "r38", cancha: "c5", clienteId: "e6",  hora: 18, duracion: 1, fecha: 1, estado: "Confirmada", origen: "quepa",  valor: 60000 },
  { id: "r39", cancha: "c6", clienteId: "e14", hora: 17, duracion: 1, fecha: 1, estado: "Confirmada", origen: "manual", valor: 55000 },
];

// Días ya cerrados (para el historial de Ventas)
const EB_CIERRES = [
  {
    fecha: -1, total: 1145000, reservas: 13, pagadas: 7, noLlego: 1,
    porCancha: [{ code: "c1", valor: 280000 }, { code: "c2", valor: 140000 }, { code: "c3", valor: 330000 }, { code: "c4", valor: 220000 }, { code: "c5", valor: 120000 }, { code: "c6", valor: 55000 }],
    cerradoPor: "Daniel P.", hora: "23:14",
  },
  {
    fecha: -2, total: 1010000, reservas: 12, pagadas: 7, noLlego: 0,
    porCancha: [{ code: "c1", valor: 210000 }, { code: "c2", valor: 180000 }, { code: "c3", valor: 220000 }, { code: "c4", valor: 110000 }, { code: "c5", valor: 180000 }, { code: "c6", valor: 110000 }],
    cerradoPor: "Daniel P.", hora: "22:51",
  },
  {
    fecha: -3, total: 1515000, reservas: 17, pagadas: 9, noLlego: 1,
    porCancha: [{ code: "c1", valor: 350000 }, { code: "c2", valor: 210000 }, { code: "c3", valor: 330000 }, { code: "c4", valor: 220000 }, { code: "c5", valor: 240000 }, { code: "c6", valor: 165000 }],
    cerradoPor: "Marcela G.", hora: "23:02",
  },
];

const EB_USUARIOS = [
  { id: "u1", nombre: "Daniel Peña",    correo: "daniel@canchaelbosque.co",  wa: "+57 318 226 4530", rol: "Administrador", activo: true },
  { id: "u2", nombre: "Marcela Guzmán", correo: "marcela@canchaelbosque.co", wa: "+57 312 447 9981", rol: "Recepción",     activo: true },
];

// Perfil del negocio · mismos campos que el editor de Lugares del console
const EB_PERFIL = {
  // 01 · identidad
  nombre: "Cancha El Bosque",
  categoria: "Cancha deportiva",
  ciudad: "Neiva",
  region: "Huila",
  descripcion: "Cancha El Bosque, en la Avenida 26 de Neiva, es un complejo de seis canchas sintéticas techadas e iluminadas, con parqueadero propio y tienda. Ideal para el partido de la semana, torneos entre amigos y celebraciones. Abierto todos los días hasta las 11 de la noche.",
  highlights: ["Canchas techadas", "Grama certificada FIFA", "Iluminación nocturna", "Parqueadero propio"],
  vibe: ["Competitivo", "Familiar", "Ambiente de barrio"],
  idealPara: ["Partido entre amigos", "Torneos", "Entrenamiento", "Cumpleaños deportivos"],

  // 02 · económico y servicios
  rangoPrecio: 2,                 // 1 $ · 2 $$ · 3 $$$ · 4 $$$$
  ratingExterno: null,            // solo lectura, viene de Google
  precioDesde: 55000,
  precioHasta: 110000,
  amenities: ["Parqueadero", "Baños", "Camerinos", "Tienda", "Iluminación", "Techada"],

  // 03 · sedes
  sedes: [{
    id: "s1", label: "Principal", zona: "Norte", principal: true,
    direccion: "Avenida 26 # 51-101, frente a Almacafé",
    ciudad: "Neiva",
    coordenadas: "2.94829, -75.28190",
    telefono: "+57 318 226 4530",
    whatsapp: "+57 318 226 4530",
    maps: "https://maps.app.goo.gl/elbosqueneiva",
  }],

  // 04 · contacto y reservas
  website: "https://canchaelbosque.co",
  bookingUrl: "https://wa.me/573182264530",
  redes: [
    { id: "r1", tipo: "Instagram", url: "https://instagram.com/canchaelbosque", handle: "@canchaelbosque", etiqueta: "", principal: true },
    { id: "r2", tipo: "Facebook",  url: "https://facebook.com/canchaelbosque",  handle: "@canchaelbosque", etiqueta: "", principal: false },
  ],

  // 05 · horarios
  horarios: {
    LUN: [["06:00", "23:00"]], MAR: [["06:00", "23:00"]], MIE: [["06:00", "23:00"]],
    JUE: [["06:00", "23:00"]], VIE: [["06:00", "23:00"]], SAB: [["08:00", "23:00"]],
    DOM: [["08:00", "22:00"]],
  },
  notaHorario: "",

  // fotos
  fotos: 3, fotosMin: 5,
};

const EB_CATEGORIAS = ["Cancha deportiva", "Club deportivo", "Gimnasio", "Centro recreativo", "Restaurante", "Bar", "Café", "Hotel"];
const EB_ZONAS = ["— Sin zona —", "Norte", "Sur", "Centro", "Oriente", "Occidente"];
const EB_REDES = ["Instagram", "Facebook", "TikTok", "X", "YouTube", "WhatsApp", "Otra"];
const EB_DIAS = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];
const EB_RANGOS = [
  { v: 1, s: "$", l: "Económico" }, { v: 2, s: "$$", l: "Medio" },
  { v: 3, s: "$$$", l: "Alto" },    { v: 4, s: "$$$$", l: "Top" },
];

// ---- helpers ----
const ebCliente = (id) => EB_CLIENTES.find((c) => c.id === id);
const ebCancha = (id) => EB_CANCHAS.find((c) => c.id === id);
const ebHoras = () => Array.from({ length: EB_CIERRE - EB_APERTURA }, (_, i) => EB_APERTURA + i);
const ebFmtHora = (h) => {
  const suf = h >= 12 ? "pm" : "am";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:00 ${suf}`;
};
const ebFmtHoraCorta = (h) => {
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}${h >= 12 ? "p" : "a"}`;
};
const ebFecha = (delta) => {
  const d = new Date();
  d.setDate(d.getDate() + delta);
  return d;
};
const ebFechaLarga = (delta) => {
  const d = ebFecha(delta);
  const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${dias[d.getDay()]} ${d.getDate()} de ${meses[d.getMonth()]}`;
};
const ebFechaCorta = (delta) => {
  const d = ebFecha(delta);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};

Object.assign(window, {
  EB_NEGOCIO, EB_CANCHAS, EB_TIPOS, EB_CLIENTES, EB_RESERVAS, EB_CIERRES,
  EB_USUARIOS, EB_PERFIL, EB_APERTURA, EB_CIERRE,
  EB_CATEGORIAS, EB_ZONAS, EB_REDES, EB_DIAS, EB_RANGOS, EB_DURACIONES,
  ebCliente, ebCancha, ebHoras, ebFmtHora, ebFmtHoraCorta,
  ebFecha, ebFechaLarga, ebFechaCorta,
});

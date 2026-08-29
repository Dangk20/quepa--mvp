// ============================================================
// QUEPA · Mi Negocio — datos sembrados (perfil enriquecido)
// ============================================================
// Cada establecimiento tiene perfil + recursos + salud
// Los 4 originales al ~75% completo; el 5to (placeholder) al 0%
// ============================================================

// Grupos de atributos disponibles (vocabulario base de Quepa)
const ATTR_GROUPS = [
  { key: "vista",         label: "Vista",          options: ["río", "mar", "ciudad", "montaña", "interior", "patio"] },
  { key: "ambiente",      label: "Ambiente",       options: ["romántico", "familiar", "ejecutivo", "juvenil", "instagrameable", "tranquilo", "animado", "íntimo"] },
  { key: "clima",         label: "Clima",          options: ["frío", "templado", "abierto", "cubierto", "AC", "chimenea", "ventilado"] },
  { key: "accesibilidad", label: "Accesibilidad",  options: ["silla de ruedas", "ascensor", "rampa", "baño accesible"] },
  { key: "mascotas",      label: "Mascotas",       options: ["pet-friendly", "no mascotas"] },
  { key: "conectividad",  label: "Conectividad",   options: ["wifi rápido", "proyector", "enchufes mesa", "TV", "sonido"] },
  { key: "dieta",         label: "Dieta",          options: ["vegano", "vegetariano", "sin gluten", "kosher", "halal", "saludable"] },
  { key: "reglas",        label: "Reglas",         options: ["apto niños", "dress code", "fumadores afuera", "solo adultos", "música suave"] },
];

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// ============================================================
// 1. SAZÓN DEL RÍO — Restaurante en Neiva
// ============================================================
const MN_SAZON = {
  perfil: {
    portada: "assets-b2b/restaurante.jpg",
    galeria: ["assets-b2b/restaurante.jpg", null, null, null], // 1 real + 3 placeholders
    descripcionCorta: "Cocina huilense de autor a orillas del Magdalena.",
    descripcionLarga: "Sazón del Río abrió en 2019 con la idea de llevar la lechona, el asado huilense y el tamal opita a un lugar donde la gente quiera celebrar. Terraza con vista al río, cocina abierta y un menú que rota cada dos meses con productos del Huila.\n\nVenimos a comer rico, sin lujos pretenciosos. La cuenta no asusta pero la mesa sí celebra.",
    horarios: {
      Lun: { abierto: false, franjas: [] },
      Mar: { abierto: true, franjas: [{ de: "12:00", a: "15:00" }, { de: "18:30", a: "22:30" }] },
      Mié: { abierto: true, franjas: [{ de: "12:00", a: "15:00" }, { de: "18:30", a: "22:30" }] },
      Jue: { abierto: true, franjas: [{ de: "12:00", a: "15:00" }, { de: "18:30", a: "23:00" }] },
      Vie: { abierto: true, franjas: [{ de: "12:00", a: "15:30" }, { de: "18:30", a: "23:30" }] },
      Sáb: { abierto: true, franjas: [{ de: "12:00", a: "23:30" }] },
      Dom: { abierto: true, franjas: [{ de: "12:00", a: "17:00" }] },
    },
    precio: "$$",
    atributos: {
      vista:         ["río", "interior"],
      ambiente:      ["romántico", "familiar", "instagrameable"],
      clima:         ["templado", "abierto", "ventilado"],
      accesibilidad: ["rampa"],
      mascotas:      [],
      conectividad:  ["wifi rápido"],
      dieta:         ["vegetariano"],
      reglas:        ["apto niños"],
    },
    redes: { instagram: "@sazondelrio", facebook: "sazondelrio.neiva", sitio: "" },
    direccion: "Cra. 5 # 22-08, Centro · Neiva",
    maps: "https://maps.app.goo.gl/sazon-rio-neiva",
  },
  salud: {
    completo: 75,
    pendientes: [
      "Agrega 3 fotos más a la galería",
      "Define si eres pet-friendly o no",
    ],
  },
};

// ============================================================
// 2. HOSTAL LA CATLEYA — Pereira
// ============================================================
const MN_CATLEYA = {
  perfil: {
    portada: "assets-b2b/hotel.jpg",
    galeria: ["assets-b2b/hotel.jpg", null, null, null, null],
    descripcionCorta: "Hostal boutique con vista al Otún. 12 habitaciones, jardín interior.",
    descripcionLarga: "La Catleya está en una casa de los años 50 que restauramos con mucho cariño. Pisos en cemento pulido, plantas por todas partes, un patio interior que es el corazón del hostal. La gente viene a escapar de la ciudad, no a hacer fiesta.\n\nDesayuno de cosecha local incluido. Café del Eje, huevos pericos, arepa de chócolo, fruta de la plaza. Sin TV en las habitaciones — eso es a propósito.",
    horarios: {
      Lun: { abierto: true, franjas: [{ de: "00:00", a: "23:59" }] },
      Mar: { abierto: true, franjas: [{ de: "00:00", a: "23:59" }] },
      Mié: { abierto: true, franjas: [{ de: "00:00", a: "23:59" }] },
      Jue: { abierto: true, franjas: [{ de: "00:00", a: "23:59" }] },
      Vie: { abierto: true, franjas: [{ de: "00:00", a: "23:59" }] },
      Sáb: { abierto: true, franjas: [{ de: "00:00", a: "23:59" }] },
      Dom: { abierto: true, franjas: [{ de: "00:00", a: "23:59" }] },
    },
    precio: "$$$",
    atributos: {
      vista:         ["montaña", "patio"],
      ambiente:      ["romántico", "tranquilo", "instagrameable"],
      clima:         ["templado", "ventilado"],
      accesibilidad: ["rampa", "ascensor"],
      mascotas:      ["pet-friendly"],
      conectividad:  ["wifi rápido", "enchufes mesa"],
      dieta:         ["vegetariano", "vegano"],
      reglas:        ["apto niños"],
    },
    redes: { instagram: "@hostal.lacatleya", facebook: "hostallacatleya", sitio: "lacatleya.co" },
    direccion: "Cl. 23 # 7-45, Centro · Pereira",
    maps: "https://maps.app.goo.gl/catleya-pereira",
  },
  salud: {
    completo: 75,
    pendientes: [
      "Sube las fotos de las habitaciones tipo Suite",
      "Marca políticas de check-in temprano",
    ],
  },
};

// ============================================================
// 3. CANCHAS EL LAGO — Pereira
// ============================================================
const MN_ELLAGO = {
  perfil: {
    portada: "assets-b2b/canchas.webp",
    galeria: ["assets-b2b/canchas.webp", null, null, null],
    descripcionCorta: "6 canchas para tu parche. Fútbol 5, pádel y multipropósito.",
    descripcionLarga: "El Lago lleva 7 años aguantando partidos de oficina, ligas barriales y entrenamientos serios. Tenemos cancha sintética grado FIFA, dos canchas de pádel techadas y dos multipropósito para vóleibol o baloncesto.\n\nIluminación nocturna en todas, parqueadero amplio, tienda de bebidas y alquiler de balones. Reservas por horas, sin mínimo. Si vienen 10, traigan camiseta — nosotros traemos petos.",
    horarios: {
      Lun: { abierto: true, franjas: [{ de: "08:00", a: "22:00" }] },
      Mar: { abierto: true, franjas: [{ de: "08:00", a: "22:00" }] },
      Mié: { abierto: true, franjas: [{ de: "08:00", a: "22:00" }] },
      Jue: { abierto: true, franjas: [{ de: "08:00", a: "22:00" }] },
      Vie: { abierto: true, franjas: [{ de: "08:00", a: "23:30" }] },
      Sáb: { abierto: true, franjas: [{ de: "08:00", a: "23:30" }] },
      Dom: { abierto: true, franjas: [{ de: "08:00", a: "20:00" }] },
    },
    precio: "$$",
    atributos: {
      vista:         ["interior"],
      ambiente:      ["juvenil", "animado"],
      clima:         ["cubierto", "abierto"],
      accesibilidad: ["rampa"],
      mascotas:      [],
      conectividad:  ["wifi rápido"],
      dieta:         [],
      reglas:        ["apto niños"],
    },
    redes: { instagram: "@canchaslago", facebook: "canchaselago.pereira", sitio: "" },
    direccion: "Av. Sur # 38-21, Pinares · Pereira",
    maps: "https://maps.app.goo.gl/ellago-pereira",
  },
  salud: {
    completo: 75,
    pendientes: [
      "Sube fotos de las canchas de pádel",
      "Activa políticas de cancelación",
    ],
  },
};

// ============================================================
// 4. ODONTOLOGÍA SONRISA CARIBE — Neiva
// ============================================================
const MN_SONRISA = {
  perfil: {
    portada: "assets-b2b/servicios.jpg",
    galeria: ["assets-b2b/servicios.jpg", null, null, null],
    descripcionCorta: "Odontología general y estética con calidez humana.",
    descripcionLarga: "Sonrisa Caribe abrió hace 4 años con la idea de que ir al odontólogo no tiene que ser un trauma. Trabajamos con tres profesionales (general, endodoncia y ortodoncia), tres boxes equipados y un área para diagnóstico.\n\nPrimera consulta gratis, planes de pago a 6 meses, y café mientras esperas. Atendemos EPS, particulares y planes complementarios.",
    horarios: {
      Lun: { abierto: true, franjas: [{ de: "08:00", a: "12:00" }, { de: "14:00", a: "18:00" }] },
      Mar: { abierto: true, franjas: [{ de: "08:00", a: "12:00" }, { de: "14:00", a: "18:00" }] },
      Mié: { abierto: true, franjas: [{ de: "08:00", a: "12:00" }, { de: "14:00", a: "18:00" }] },
      Jue: { abierto: true, franjas: [{ de: "08:00", a: "12:00" }, { de: "14:00", a: "18:00" }] },
      Vie: { abierto: true, franjas: [{ de: "08:00", a: "12:00" }, { de: "14:00", a: "17:00" }] },
      Sáb: { abierto: true, franjas: [{ de: "08:00", a: "13:00" }] },
      Dom: { abierto: false, franjas: [] },
    },
    precio: "$$",
    atributos: {
      vista:         ["interior"],
      ambiente:      ["tranquilo", "familiar"],
      clima:         ["AC", "cubierto"],
      accesibilidad: ["silla de ruedas", "rampa", "baño accesible"],
      mascotas:      [],
      conectividad:  ["wifi rápido", "TV"],
      dieta:         [],
      reglas:        ["apto niños"],
    },
    redes: { instagram: "@sonrisacaribe", facebook: "sonrisacaribeneiva", sitio: "sonrisacaribe.co" },
    direccion: "Cra. 7 # 18-44, La Toma · Neiva",
    maps: "https://maps.app.goo.gl/sonrisacaribe",
  },
  salud: {
    completo: 75,
    pendientes: [
      "Sube fotos de los boxes",
      "Define rango de tarifas por servicio",
    ],
  },
};

// ============================================================
// 5. NEGOCIO RECIÉN REGISTRADO — placeholder al 0%
// ============================================================
const MN_NUEVO = {
  perfil: {
    portada: null,
    galeria: [null, null, null, null],
    descripcionCorta: "",
    descripcionLarga: "",
    horarios: DIAS.reduce((acc, d) => { acc[d] = { abierto: false, franjas: [] }; return acc; }, {}),
    precio: null,
    atributos: {
      vista: [], ambiente: [], clima: [], accesibilidad: [],
      mascotas: [], conectividad: [], dieta: [], reglas: [],
    },
    redes: { instagram: "", facebook: "", sitio: "" },
    direccion: "",
    maps: "",
  },
  salud: {
    completo: 0,
    pendientes: [
      "Pon nombre y descripción del negocio",
      "Sube una foto de portada",
      "Carga tus mesas / habitaciones / canchas / profesionales",
      "Configura horarios de atención",
      "Marca los atributos que te describen",
    ],
  },
};

// ============================================================
// EXPORT global
// ============================================================
const MI_NEGOCIO = {
  sazon: MN_SAZON,
  catleya: MN_CATLEYA,
  ellago: MN_ELLAGO,
  sonrisa: MN_SONRISA,
  nuevo: MN_NUEVO,
};

// 5to negocio que se inserta en ESTABS
const ESTAB_NUEVO = {
  id: "nuevo",
  vertical: "mesas", // arrancará como bar/restaurante, pero el wizard pregunta
  name: "Mi nuevo bar",
  city: "Pereira",
  address: "—",
  short: "??",
  plan: "Free",
  hero: null,
  descripcion: "Recién registrado · esperando primer setup",
  whatsapp: "+57 ___ ___ ____",
  stars: 0,
  nuevo: true,
};

// Catálogo de servicios para Sonrisa Caribe (Mi Negocio recursos)
const SERVICIOS_SONRISA = [
  { id: "sv1", nombre: "Limpieza dental",     duracion: 60,  precio: 195000, pros: ["pr1"],           recursos: ["b1", "b2"], activo: true },
  { id: "sv2", nombre: "Diagnóstico inicial", duracion: 45,  precio: 0,      pros: ["pr1"],           recursos: ["b1", "b2", "b3"], activo: true },
  { id: "sv3", nombre: "Endodoncia molar",    duracion: 120, precio: 480000, pros: ["pr2"],           recursos: ["b2"], activo: true },
  { id: "sv4", nombre: "Implante dental",     duracion: 90,  precio: 1850000, pros: ["pr2"],          recursos: ["b2", "b3"], activo: true },
  { id: "sv5", nombre: "Control ortodoncia",  duracion: 30,  precio: 165000, pros: ["pr3"],           recursos: ["b3"], activo: true },
  { id: "sv6", nombre: "Brackets estéticos",  duracion: 90,  precio: 280000, pros: ["pr3"],           recursos: ["b3"], activo: true },
  { id: "sv7", nombre: "Blanqueamiento",      duracion: 60,  precio: 350000, pros: ["pr1", "pr3"],    recursos: ["b1"], activo: true },
];

// Tipos de habitación (para Catleya, vertical habitaciones)
const TIPOS_HAB = [
  { id: "estandar", nombre: "Estándar",            tarifa: 240000, capacidad: 2, amenities: ["WiFi", "AC", "TV", "Caja fuerte"], foto: "assets-b2b/hotel.jpg", habs: ["101", "102", "103"] },
  { id: "doble",    nombre: "Doble",               tarifa: 320000, capacidad: 4, amenities: ["WiFi", "AC", "TV", "Mini-bar"],     foto: null, habs: ["201", "202", "203"] },
  { id: "suite",    nombre: "Suite",               tarifa: 480000, capacidad: 4, amenities: ["WiFi", "AC", "TV", "Jacuzzi", "Vista río"], foto: null, habs: ["301", "302"] },
  { id: "dorm",     nombre: "Dormitorio compartido", tarifa: 75000,  capacidad: 8, amenities: ["WiFi", "Lockers", "Baño compartido"], foto: null, habs: ["D1", "D2", "D3", "D4"] },
];

// Atributos extra de canchas para ellago
const CANCHAS_ATTR = {
  C1: { superficie: "Césped sintético FIFA", techada: false, iluminacion: true,  tarifaHora: 95000 },
  C2: { superficie: "Césped sintético FIFA", techada: false, iluminacion: true,  tarifaHora: 95000 },
  C3: { superficie: "Cristal pádel",         techada: true,  iluminacion: true,  tarifaHora: 60000 },
  C4: { superficie: "Cristal pádel",         techada: true,  iluminacion: true,  tarifaHora: 60000 },
  C5: { superficie: "Cemento pulido",        techada: true,  iluminacion: true,  tarifaHora: 55000 },
  C6: { superficie: "Cemento pulido",        techada: false, iluminacion: true,  tarifaHora: 55000 },
};

// Atributos extra de mesas para sazon
const MESAS_ATTR = {
  T1: { atributos: ["redonda", "ventana"], activa: true },
  T2: { atributos: ["cuadrada", "ventana"], activa: true },
  T3: { atributos: ["cuadrada", "central"], activa: true },
  T4: { atributos: ["redonda grande", "central"], activa: true },
  T5: { atributos: ["alta", "terraza"], activa: true },
  T6: { atributos: ["cuadrada", "terraza"], activa: true },
  T7: { atributos: ["ovalada", "privado", "8 sillas"], activa: true },
  T8: { atributos: ["cuadrada", "central"], activa: true },
  T9: { atributos: ["alta", "barra"], activa: false }, // archivada por mantenimiento
};

Object.assign(window, {
  MI_NEGOCIO, ESTAB_NUEVO, ATTR_GROUPS, DIAS,
  SERVICIOS_SONRISA, TIPOS_HAB, CANCHAS_ATTR, MESAS_ATTR,
});

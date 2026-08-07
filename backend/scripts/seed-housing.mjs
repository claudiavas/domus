// Seed v3 de Domus: lista estatica de ciudades espanolas, ~120 viviendas variadas,
// 10 usuarios ficticios con avatar, fotos reales de casas e interiores.
// Target API and demo owner are provided via environment variables
const API = process.env.SEED_API_URL || 'http://localhost:8000';
const DEMO_PASSWORD = process.env.SEED_USER_PASSWORD || 'DomusDemo' + '2026!'; // shared password of the fictional demo users
const OWNER_ID = process.env.SEED_OWNER_ID || null; // optional: existing user that also publishes listings

// RNG determinista para poder re-ejecutar con los mismos resultados
function mulberry32(a) { return function() { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(42);
const pick = arr => arr[Math.floor(rnd() * arr.length)];
const chance = p => rnd() < p;
const between = (min, max) => Math.round(min + rnd() * (max - min));

// ---------- 1. FOTOS: pool de Unsplash verificado ----------
const EXTERIOR_IDS = [
  '1564013799919-ab600027ffc6', '1600585154340-be6161a56a0c', '1600596542815-ffad4c1539a9',
  '1580587771525-78b9dba3b914', '1568605114967-8130f3a36994', '1570129477492-45c003edd2be',
  '1583608205776-bfd35f0d9f83', '1512917774080-9991f1c4c750', '1523217582562-09d0def993a6',
  '1494526585095-c41746248156', '1600047509807-ba8f99d2cdde', '1600047509358-9dc75507daeb',
  '1600607687939-ce8a6c25118c', '1600210492486-724fe5c67fb0',
];
const INTERIOR_IDS = [
  '1600566753190-17f0baa2a6c3', '1600607687920-4e2a09cf159d', '1600566753086-00f18fb6b3ea',
  '1600585154526-990dced4db0d', '1600573472592-401b489a3cdc', '1502672260266-1c1ef2d93688',
  '1522708323590-d24dbb6b0267', '1502005229762-cf1b2da7c5d6', '1493809842364-78817add7ffb',
  '1484154218962-a197022b5858', '1556912998-c57cc6b63cd7', '1556909212-d5b604d0c90d',
  '1584622650111-993a426fbf0a', '1552321554-5fefe8c9ef14', '1560448204-e02f11c3d0e2',
  '1560185007-cde436f6a4d0', '1560185127-6ed189bf02f4', '1560448075-bb485b067938',
  '1493663284031-b7e3aefcae8e', '1505691938895-1758d7feb511', '1513584684374-8bab748fbf90',
  '1554995207-c18c203602cb', '1600585152220-90363fe7e115', '1598928506311-c55ded91a20c',
  '1600566752355-35792bedcfea', '1600210491369-e753d80a41f3', '1600607688969-a5bfcd646154',
  '1600607688066-890987f18a86', '1600121848594-d8644e57abab',
];
const url = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;

async function verifyPool(ids) {
  const ok = [];
  for (const id of ids) {
    try {
      const r = await fetch(url(id), { method: 'HEAD' });
      if (r.ok) ok.push(id); else console.log(`  foto descartada (${r.status}): ${id}`);
    } catch { console.log(`  foto descartada (error red): ${id}`); }
  }
  return ok;
}

// ---------- 2. GEO: lista estatica de ciudades espanolas ----------
// Cada entrada: [provincia, municipio, lat, lng, peso]. Cubre las 52 capitales
// (>=1 vivienda por provincia) mas algunas ciudades grandes no capitales.
const CITY_TABLE = [
  ['Alava', 'Vitoria-Gasteiz', 42.8467, -2.6716, 1],
  ['Albacete', 'Albacete', 38.9943, -1.8585, 1],
  ['Alicante', 'Alicante', 38.3452, -0.4810, 3],
  ['Almeria', 'Almeria', 36.8340, -2.4637, 1],
  ['Avila', 'Avila', 40.6565, -4.6818, 1],
  ['Badajoz', 'Badajoz', 38.8794, -6.9707, 1],
  ['Baleares', 'Palma', 39.5696, 2.6502, 2],
  ['Barcelona', 'Barcelona', 41.3874, 2.1686, 5],
  ['Burgos', 'Burgos', 42.3439, -3.6969, 1],
  ['Caceres', 'Caceres', 39.4753, -6.3723, 1],
  ['Cadiz', 'Cadiz', 36.5271, -6.2886, 1],
  ['Castellon', 'Castello de la Plana', 39.9864, -0.0513, 1],
  ['Ciudad Real', 'Ciudad Real', 38.9848, -3.9274, 1],
  ['Cordoba', 'Cordoba', 37.8882, -4.7794, 1],
  ['A Coruna', 'A Coruna', 43.3623, -8.4115, 1],
  ['Cuenca', 'Cuenca', 40.0704, -2.1374, 1],
  ['Girona', 'Girona', 41.9794, 2.8214, 1],
  ['Granada', 'Granada', 37.1773, -3.5986, 1],
  ['Guadalajara', 'Guadalajara', 40.6337, -3.1674, 1],
  ['Guipuzcoa', 'Donostia-San Sebastian', 43.3183, -1.9812, 1],
  ['Huelva', 'Huelva', 37.2614, -6.9447, 1],
  ['Huesca', 'Huesca', 42.1401, -0.4089, 1],
  ['Jaen', 'Jaen', 37.7796, -3.7849, 1],
  ['Leon', 'Leon', 42.5987, -5.5671, 1],
  ['Lleida', 'Lleida', 41.6176, 0.6200, 1],
  ['La Rioja', 'Logrono', 42.4627, -2.4450, 1],
  ['Lugo', 'Lugo', 43.0121, -7.5559, 1],
  ['Madrid', 'Madrid', 40.4168, -3.7038, 6],
  ['Malaga', 'Malaga', 36.7213, -4.4214, 3],
  ['Murcia', 'Murcia', 37.9922, -1.1307, 1],
  ['Navarra', 'Pamplona', 42.8125, -1.6458, 1],
  ['Ourense', 'Ourense', 42.3358, -7.8639, 1],
  ['Asturias', 'Oviedo', 43.3619, -5.8494, 1],
  ['Palencia', 'Palencia', 42.0096, -4.5288, 1],
  ['Las Palmas', 'Las Palmas de Gran Canaria', 28.1235, -15.4363, 1],
  ['Pontevedra', 'Pontevedra', 42.4310, -8.6444, 1],
  ['Salamanca', 'Salamanca', 40.9701, -5.6635, 1],
  ['Santa Cruz de Tenerife', 'Santa Cruz de Tenerife', 28.4636, -16.2518, 1],
  ['Cantabria', 'Santander', 43.4623, -3.8100, 1],
  ['Segovia', 'Segovia', 40.9429, -4.1088, 1],
  ['Sevilla', 'Sevilla', 37.3891, -5.9845, 3],
  ['Soria', 'Soria', 41.7666, -2.4790, 1],
  ['Tarragona', 'Tarragona', 41.1189, 1.2445, 1],
  ['Teruel', 'Teruel', 40.3440, -1.1069, 1],
  ['Toledo', 'Toledo', 39.8628, -4.0273, 1],
  ['Valencia', 'Valencia', 39.4699, -0.3763, 4],
  ['Valladolid', 'Valladolid', 41.6523, -4.7245, 1],
  ['Vizcaya', 'Bilbao', 43.2630, -2.9350, 1],
  ['Zamora', 'Zamora', 41.5036, -5.7440, 1],
  ['Zaragoza', 'Zaragoza', 41.6488, -0.8891, 3],
  ['Ceuta', 'Ceuta', 35.8894, -5.3213, 1],
  ['Melilla', 'Melilla', 35.2923, -2.9381, 1],
  // ciudades grandes que no son capital de provincia
  ['Madrid', 'Alcala de Henares', 40.4820, -3.3635, 2],
  ['Barcelona', 'Badalona', 41.4500, 2.2474, 2],
  ['Valencia', 'Gandia', 38.9680, -0.1800, 2],
  ['Alicante', 'Benidorm', 38.5342, -0.1314, 2],
  ['Malaga', 'Marbella', 36.5101, -4.8825, 2],
];

// Barrios/zonas conocidas para dar variedad a los titulos; el resto usa el municipio.
const DISTRICTS = {
  Madrid: ['Chamberi', 'Salamanca', 'Retiro', 'Malasana', 'Chamartin'],
  Barcelona: ['Eixample', 'Gracia', 'Sarria', 'Poblenou', 'Sants'],
  Valencia: ['Ruzafa', 'El Carmen', 'Benimaclet', 'Campanar'],
  Sevilla: ['Triana', 'Nervion', 'Los Remedios', 'Santa Cruz'],
  Malaga: ['El Perchel', 'Pedregalejo', 'Teatinos'],
  Zaragoza: ['Delicias', 'Actur', 'Casco Historico'],
  Bilbao: ['Indautxu', 'Deusto', 'Casco Viejo'],
};

// Precio medio por m2 (compra) segun provincia; el resto usa el valor por defecto.
const PRICE_M2 = {
  Madrid: 4200, Barcelona: 4000, Baleares: 3800, Guipuzcoa: 3600, Vizcaya: 2900,
  Malaga: 3000, Valencia: 2300, Alicante: 2100, Sevilla: 2400, Zaragoza: 1900,
};

const CITIES = CITY_TABLE.map(([province, municipality, lat, lng, peso]) => ({
  province, municipality, lat, lng, peso,
  districts: DISTRICTS[municipality] || [],
}));

// ---------- 3. USUARIOS ficticios ----------
const USERS = [
  { name: 'Carmen', surname: 'García López', genero: 'women', img: 65, userType: 'Agent' },
  { name: 'Javier', surname: 'Martínez Ruiz', genero: 'men', img: 32, userType: 'Agent' },
  { name: 'Lucía', surname: 'Fernández Ortega', genero: 'women', img: 21, userType: 'Agent' },
  { name: 'Andrés', surname: 'Sánchez Molina', genero: 'men', img: 51, userType: 'Client' },
  { name: 'María', surname: 'Rodríguez Vega', genero: 'women', img: 47, userType: 'Client' },
  { name: 'Pablo', surname: 'Jiménez Castro', genero: 'men', img: 75, userType: 'Agent' },
  { name: 'Elena', surname: 'Navarro Gil', genero: 'women', img: 33, userType: 'Client' },
  { name: 'Diego', surname: 'Torres Herrera', genero: 'men', img: 12, userType: 'Agent' },
  { name: 'Sofía', surname: 'Ramos Delgado', genero: 'women', img: 57, userType: 'Client' },
  { name: 'Miguel', surname: 'Ibáñez Serrano', genero: 'men', img: 86, userType: 'Agent' },
];

const jwtId = token => JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString())._id;

async function createUsers() {
  const ids = [];
  for (const u of USERS) {
    const email = `${u.name.toLowerCase()}.${u.surname.split(' ')[0].toLowerCase()}@domus-demo.es`
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
    const reg = await fetch(`${API}/user/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: DEMO_PASSWORD, name: u.name, surname: u.surname }),
    });
    let id;
    if (reg.status === 201) {
      id = jwtId((await reg.json()).token);
    } else {
      // ya existe: buscarlo
      const q = await fetch(`${API}/user/?email=${encodeURIComponent(email)}`);
      const data = await q.json();
      id = Array.isArray(data) ? data[0]?._id : data?._id;
    }
    if (!id) { console.log(`❌ sin id para ${email}`); continue; }
    await fetch(`${API}/user/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profilePicture: `https://randomuser.me/api/portraits/${u.genero}/${u.img}.jpg`,
        userType: u.userType,
        telephone1: `6${between(10, 99)}${between(100, 999)}${between(100, 999)}`,
      }),
    });
    ids.push(id);
    console.log(`  usuario: ${u.name} ${u.surname} (${u.userType})`);
  }
  return ids;
}

// ---------- 4. Borrar viviendas anteriores ----------
async function wipeHousing() {
  const r = await fetch(`${API}/api/housing/`);
  if (!r.ok) return;
  const houses = await r.json();
  for (const h of houses) {
    await fetch(`${API}/api/housing/${h._id}/permanent`, { method: 'DELETE' });
  }
  console.log(`  borradas ${houses.length} viviendas previas`);
}


// ---------- 5. Generación de viviendas ----------
const TIPOS = [
  { v: 'apartment', peso: 50, label: 'Piso', gen: 'm' }, { v: 'house', peso: 15, label: 'Casa', gen: 'f' },
  { v: 'penthouse', peso: 10, label: 'Ático', gen: 'm' }, { v: 'duplex', peso: 10, label: 'Dúplex', gen: 'm' },
  { v: 'chalet', peso: 10, label: 'Chalet', gen: 'm' }, { v: 'other', peso: 5, label: 'Estudio', gen: 'm' },
];
const weighted = items => { const total = items.reduce((s, i) => s + i.peso, 0); let x = rnd() * total; for (const i of items) { x -= i.peso; if (x <= 0) return i; } return items[0]; };

const ADJ = [['luminoso','luminosa'], ['amplio','amplia'], ['reformado','reformada'], ['acogedor','acogedora'], ['espectacular','espectacular'], ['moderno','moderna'], ['coqueto','coqueta'], ['exclusivo','exclusiva'], ['impecable','impecable'], ['señorial','señorial']];
const EXTRAS_TXT = { pool: 'piscina', terrace: 'terraza', garden: 'jardín', elevator: 'ascensor', garages: 'garaje' };

function buildHouse(cities, userIds, exteriors, interiors, i) {
  const city = weighted(cities.map(c => ({ ...c, peso: c.peso })));
  const tipo = weighted(TIPOS);
  const trans = weighted([{ v: 'sale', peso: 55 }, { v: 'rent', peso: 35 }, { v: 'vacation_rentals', peso: 10 }]).v;
  const m2 = tipo.v === 'chalet' || tipo.v === 'house' ? between(110, 340) : tipo.v === 'other' ? between(38, 60) : between(55, 160);
  const rooms = Math.max(1, Math.min(6, Math.round(m2 / 45) + between(-1, 1)));
  const baths = Math.max(1, Math.min(4, Math.round(rooms / 2) + (chance(0.3) ? 1 : 0)));
  const priceM2 = PRICE_M2[city.province] || 2200;
  const price = trans === 'sale'
    ? Math.round(m2 * priceM2 * (0.75 + rnd() * 0.7) / 1000) * 1000
    : trans === 'rent' ? between(550, 3200) : between(400, 2800);
  const esPlanta = !['chalet', 'house'].includes(tipo.v);
  const district = city.districts.length && chance(0.7) ? pick(city.districts) : '';
  const zona = district || city.municipality;
  const feats = {
    closets: chance(0.6), airConditioned: chance(0.55), heating: chance(0.7),
    elevator: esPlanta ? chance(0.75) : false, outsideView: chance(0.6),
    garden: ['chalet', 'house'].includes(tipo.v) ? chance(0.8) : chance(0.1),
    pool: ['chalet'].includes(tipo.v) ? chance(0.7) : chance(0.15),
    terrace: chance(0.45), storage: chance(0.4), accessible: chance(0.3),
  };
  const garages = ['chalet', 'house'].includes(tipo.v) ? between(0, 3) : chance(0.3) ? 1 : 0;
  const extras = Object.entries(EXTRAS_TXT).filter(([k]) => (k === 'garages' ? garages > 0 : feats[k])).map(([, txt]) => txt).slice(0, 3);
  const adj = pick(ADJ)[tipo.gen === 'f' ? 1 : 0];
  const title = `${tipo.label} ${adj} en ${zona}`;
  const description = `${tipo.label} de ${m2} m² con ${rooms} ${rooms === 1 ? 'dormitorio' : 'dormitorios'} y ${baths} ${baths === 1 ? 'baño' : 'baños'} en ${zona}, ${city.municipality}.` +
    (extras.length ? ` Cuenta con ${extras.join(', ')}.` : '') +
    (trans === 'rent' ? ' Disponible para entrar a vivir.' : trans === 'vacation_rentals' ? ' Ideal para tus vacaciones.' : ' Una oportunidad única en la zona.');
  const nImgs = between(3, 5);
  const primeraExterior = ['chalet', 'house', 'penthouse'].includes(tipo.v) || chance(0.3);
  const images = [];
  if (primeraExterior) images.push(url(pick(exteriors)));
  while (images.length < nImgs) {
    const cand = url(pick(interiors));
    if (!images.includes(cand)) images.push(cand);
  }
  return {
    userId: pick(userIds),
    type: tipo.v, transaction: trans, country: 'Spain', currency: 'EUR', status: 'active',
    // dispersión de ~±2km para que no se apilen los pins
    coordinates: {
      lat: city.lat + (rnd() - 0.5) * 0.04,
      lng: city.lng + (rnd() - 0.5) * 0.05,
    },
    province: city.province, municipality: city.municipality,
    population: city.municipality, neighborhood: district, zipCode: '',
    squareMeters: m2, price, rooms, baths, garages,
    floorLevel: esPlanta ? pick(['top_floor', 'intermediate_floor', 'ground_floor']) : 'ground_floor',
    floorNumber: esPlanta ? between(1, 9) : undefined,
    facing: pick(['north', 'south', 'east', 'west']),
    propertyAge: pick(['new', 'up_to_5 years', '6_to_10 years', '11_to_20 years', 'more_than_20 years']),
    condition: pick(['new', 'good_condition', 'good_condition', 'to_renovate']),
    furnished: pick(['unfurnished', 'semifurnished', 'furnished']),
    kitchenEquipment: pick(['standard_equipment', 'semi_equipped', 'fully_equipped']),
    ...feats, showRealEstateLogo: false, images, title, description,
  };
}

// ---------- MAIN ----------
console.log('1/4 Verificando fotos...');
const exteriors = await verifyPool(EXTERIOR_IDS);
const interiors = await verifyPool(INTERIOR_IDS);
console.log(`  ${exteriors.length} exteriores, ${interiors.length} interiores válidas`);

const cities = CITIES;

console.log('2/4 Creando usuarios...');
const userIds = await createUsers();
if (OWNER_ID) {
  await fetch(`${API}/user/${OWNER_ID}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userType: 'Agent' }),
  });
}
if (OWNER_ID) userIds.push(OWNER_ID);

console.log('3/4 Borrando viviendas anteriores...');
await wipeHousing();

const TOTAL = Math.max(120, cities.length + 40);
console.log(`4/4 Creando ${TOTAL} viviendas (≥1 por provincia, ${cities.length} ciudades)...`);
let ok = 0, fail = 0;
for (let i = 0; i < TOTAL; i++) {
  // las primeras N garantizan una vivienda en cada ciudad/provincia
  const ciudadFija = i < cities.length ? cities[i] : null;
  const h = buildHouse(ciudadFija ? [ciudadFija] : cities, userIds, exteriors, interiors, i);
  const r = await fetch(`${API}/api/housing`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(h) });
  if (r.ok) ok++; else { fail++; console.log(`  ❌ ${h.title}: ${(await r.text()).substring(0, 100)}`); }
}
console.log(`\n✅ ${ok} viviendas creadas, ${fail} fallidas, ${userIds.length} publicadores`);

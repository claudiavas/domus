// Seed v2 de Domus: geo real de geoapi.es, ~60 viviendas variadas,
// 10 usuarios ficticios con avatar, fotos reales de casas e interiores.
const API = 'https://domus-backend-production-fb5e.up.railway.app';
const GEOKEY = 'eb280e481fbc76bc3be11e0e4b108687b76439c4d70beb2fbab3d7e56d772760';
const CLAUDIA_ID = '6a725a0469d5e51b52436bba'; // perfil real claudia.vasquez.as@gmail.com

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

// ---------- 2. GEO desde geoapi.es (los mismos objetos que usa el frontend) ----------
const CITIES = [
  { cpro: '28', cmum: '079', peso: 6 }, // Madrid
  { cpro: '28', cmum: '005', peso: 2 }, // Alcalá de Henares
  { cpro: '08', cmum: '019', peso: 5 }, // Barcelona
  { cpro: '08', cmum: '015', peso: 2 }, // Badalona
  { cpro: '46', cmum: '250', peso: 4 }, // València
  { cpro: '46', cmum: '131', peso: 2 }, // Gandia
  { cpro: '03', cmum: '014', peso: 3 }, // Alacant
  { cpro: '03', cmum: '031', peso: 2 }, // Benidorm
  { cpro: '41', cmum: '091', peso: 3 }, // Sevilla
  { cpro: '29', cmum: '067', peso: 3 }, // Málaga
  { cpro: '29', cmum: '069', peso: 2 }, // Marbella
  { cpro: '50', cmum: '297', peso: 3 }, // Zaragoza
];

async function geo(path) {
  const r = await fetch(`https://apiv1.geoapi.es/${path}&type=JSON&key=${GEOKEY}&sandbox=0`);
  const j = await r.json();
  return j.data || [];
}

async function loadGeo() {
  const provinces = await geo('provincias?');
  const provByCpro = Object.fromEntries(provinces.map(p => [p.CPRO, p]));
  const out = [];
  for (const c of CITIES) {
    const munis = await geo(`municipios?CPRO=${c.cpro}`);
    const muni = munis.find(m => m.CMUM === c.cmum);
    if (!muni) { console.log(`⚠️ municipio no encontrado ${c.cpro}/${c.cmum}`); continue; }
    const pobs = await geo(`poblaciones?CPRO=${c.cpro}&CMUM=${c.cmum}`);
    const pob = pobs[0] || {};
    let nucleos = [];
    if (pob.NENTSI50) {
      nucleos = (await geo(`nucleos?CPRO=${c.cpro}&CMUM=${c.cmum}&NENTSI50=${encodeURIComponent(pob.NENTSI50)}`)).filter(n => !/DISEMINADO/i.test(n.NNUCLE50 || ""));
    }
    out.push({ ...c, province: provByCpro[c.cpro], municipality: muni, population: pob, nucleos });
    console.log(`  geo ok: ${muni.DMUN} (${nucleos.length} núcleos)`);
  }
  return out;
}

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
      body: JSON.stringify({ email, password: 'DomusDemo2026!', name: u.name, surname: u.surname }),
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
  const priceM2 = { '28': 4200, '08': 4000, '46': 2300, '03': 2100, '41': 2400, '29': 3000, '50': 1900 }[city.cpro] || 2200;
  const price = trans === 'sale'
    ? Math.round(m2 * priceM2 * (0.75 + rnd() * 0.7) / 1000) * 1000
    : trans === 'rent' ? between(550, 3200) : between(400, 2800);
  const esPlanta = !['chalet', 'house'].includes(tipo.v);
  const nucleo = city.nucleos.length ? pick(city.nucleos) : null;
  const zona = nucleo?.NNUCLE50 || city.municipality.DMUN;
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
  const description = `${tipo.label} de ${m2} m² con ${rooms} ${rooms === 1 ? 'dormitorio' : 'dormitorios'} y ${baths} ${baths === 1 ? 'baño' : 'baños'} en ${zona}, ${city.municipality.DMUN}.` +
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
    province: city.province, municipality: city.municipality,
    population: city.population, neighborhood: nucleo || {}, zipCode: {},
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
console.log('1/5 Verificando fotos...');
const exteriors = await verifyPool(EXTERIOR_IDS);
const interiors = await verifyPool(INTERIOR_IDS);
console.log(`  ${exteriors.length} exteriores, ${interiors.length} interiores válidas`);

console.log('2/5 Cargando geografía de geoapi.es...');
const cities = await loadGeo();

console.log('3/5 Creando usuarios...');
const userIds = await createUsers();
await fetch(`${API}/user/${CLAUDIA_ID}`, {
  method: 'PUT', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ profilePicture: 'https://claudiavasquez.dev/images/profile.jpg', userType: 'Agent' }),
});
console.log('  avatar de Claudia actualizado');
userIds.push(CLAUDIA_ID); // Claudia también publica alguna

console.log('4/5 Borrando viviendas anteriores...');
await wipeHousing();

console.log('5/5 Creando 60 viviendas...');
let ok = 0, fail = 0;
for (let i = 0; i < 60; i++) {
  const h = buildHouse(cities, userIds, exteriors, interiors, i);
  const r = await fetch(`${API}/api/housing`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(h) });
  if (r.ok) ok++; else { fail++; console.log(`  ❌ ${h.title}: ${(await r.text()).substring(0, 100)}`); }
}
console.log(`\n✅ ${ok} viviendas creadas, ${fail} fallidas, ${userIds.length} publicadores`);

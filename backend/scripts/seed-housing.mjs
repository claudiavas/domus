// Siembra viviendas ficticias en Domus vía API pública
const API = 'https://domus-backend-production-fb5e.up.railway.app/api/housing';
const USER_ID = '6a725a4e69d5e51b52436bbd'; // usuario test.claudia@example.com

const geo = {
  madrid:    { province: { PRO: 'Madrid', CPRO: '28' },    municipality: { DMUN: 'Madrid', CMUM: '079' },    population: { NENTSI: 'Madrid', CUN: '0790000' } },
  barcelona: { province: { PRO: 'Barcelona', CPRO: '08' }, municipality: { DMUN: 'Barcelona', CMUM: '019' }, population: { NENTSI: 'Barcelona', CUN: '0190000' } },
  valencia:  { province: { PRO: 'Valencia', CPRO: '46' },  municipality: { DMUN: 'València', CMUM: '250' },  population: { NENTSI: 'València', CUN: '2500000' } },
  alicante:  { province: { PRO: 'Alicante', CPRO: '03' },  municipality: { DMUN: 'Alacant', CMUM: '014' },   population: { NENTSI: 'Alacant', CUN: '0140000' } },
  sevilla:   { province: { PRO: 'Sevilla', CPRO: '41' },   municipality: { DMUN: 'Sevilla', CMUM: '091' },   population: { NENTSI: 'Sevilla', CUN: '0910000' } },
};

const houses = [
  { g: 'madrid', barrio: 'Malasaña', type: 'apartment', transaction: 'sale', price: 385000, squareMeters: 78, rooms: 2, baths: 1, title: 'Luminoso piso reformado en Malasaña', description: 'Piso totalmente reformado con cocina abierta, techos altos y balcón a calle tranquila. A dos minutos del metro Tribunal.', floorLevel: 'intermediate_floor', floorNumber: 3, facing: 'south', propertyAge: 'more_than_20 years', condition: 'good_condition', furnished: 'semifurnished', kitchenEquipment: 'fully_equipped', closets: true, airConditioned: true, heating: true, elevator: true, outsideView: true },
  { g: 'madrid', barrio: 'Chamberí', type: 'penthouse', transaction: 'sale', price: 720000, squareMeters: 110, rooms: 3, baths: 2, garages: 1, title: 'Ático con terraza de 30m² en Chamberí', description: 'Ático exterior con terraza orientada al oeste, dos baños completos y plaza de garaje incluida.', floorLevel: 'top_floor', floorNumber: 6, facing: 'west', propertyAge: '11_to_20 years', condition: 'good_condition', furnished: 'unfurnished', kitchenEquipment: 'fully_equipped', terrace: true, elevator: true, airConditioned: true, heating: true, storage: true },
  { g: 'madrid', barrio: 'Lavapiés', type: 'apartment', transaction: 'rent', price: 1250, squareMeters: 62, rooms: 1, baths: 1, title: 'Loft de diseño en Lavapiés', description: 'Loft amueblado con mucho carácter, ideal para profesionales. Disponible desde ya.', floorLevel: 'ground_floor', propertyAge: 'more_than_20 years', condition: 'good_condition', furnished: 'furnished', kitchenEquipment: 'fully_equipped', airConditioned: true, heating: true },
  { g: 'barcelona', barrio: 'Gràcia', type: 'apartment', transaction: 'sale', price: 445000, squareMeters: 85, rooms: 3, baths: 2, title: 'Piso modernista en Vila de Gràcia', description: 'Finca regia con elementos originales: suelos hidráulicos, molduras y balcón catalán.', floorLevel: 'intermediate_floor', floorNumber: 2, facing: 'east', propertyAge: 'more_than_20 years', condition: 'to_renovate', furnished: 'unfurnished', kitchenEquipment: 'standard_equipment', outsideView: true, elevator: false },
  { g: 'barcelona', barrio: 'Poblenou', type: 'duplex', transaction: 'rent', price: 2100, squareMeters: 120, rooms: 3, baths: 2, garages: 1, title: 'Dúplex nuevo junto a la playa en Poblenou', description: 'Obra nueva a 5 minutos andando de la Mar Bella. Terraza, garaje y piscina comunitaria.', floorLevel: 'top_floor', floorNumber: 4, facing: 'south', propertyAge: 'new', condition: 'new', furnished: 'furnished', kitchenEquipment: 'fully_equipped', pool: true, terrace: true, elevator: true, airConditioned: true, heating: true, accessible: true },
  { g: 'valencia', barrio: 'Ruzafa', type: 'apartment', transaction: 'sale', price: 265000, squareMeters: 90, rooms: 3, baths: 1, title: 'Amplio piso en el corazón de Ruzafa', description: 'Tres habitaciones exteriores en la zona más viva de València. Edificio con ascensor.', floorLevel: 'intermediate_floor', floorNumber: 4, facing: 'east', propertyAge: 'more_than_20 years', condition: 'good_condition', furnished: 'unfurnished', kitchenEquipment: 'semi_equipped', elevator: true, outsideView: true, closets: true },
  { g: 'valencia', barrio: 'El Cabanyal', type: 'house', transaction: 'sale', price: 320000, squareMeters: 140, rooms: 4, baths: 2, title: 'Casa de pueblo rehabilitada en El Cabanyal', description: 'Casa típica valenciana con azulejos originales, patio interior y terraza en cubierta.', floorLevel: 'ground_floor', propertyAge: 'more_than_20 years', condition: 'good_condition', furnished: 'semifurnished', kitchenEquipment: 'fully_equipped', terrace: true, garden: false, heating: true },
  { g: 'alicante', barrio: 'Playa de San Juan', type: 'chalet', transaction: 'vacation_rentals', price: 1800, squareMeters: 180, rooms: 4, baths: 3, garages: 2, title: 'Chalet con piscina cerca de Playa San Juan', description: 'Chalet independiente con jardín, piscina privada y barbacoa. Perfecto para vacaciones en familia.', propertyAge: '6_to_10 years', condition: 'good_condition', furnished: 'furnished', kitchenEquipment: 'fully_equipped', pool: true, garden: true, terrace: true, airConditioned: true, storage: true, accessible: true },
  { g: 'alicante', barrio: 'Centro', type: 'apartment', transaction: 'rent', price: 850, squareMeters: 70, rooms: 2, baths: 1, title: 'Piso céntrico a 5 minutos de la Explanada', description: 'Piso amueblado en pleno centro de Alacant, junto al mercado central.', floorLevel: 'intermediate_floor', floorNumber: 2, facing: 'north', propertyAge: '11_to_20 years', condition: 'good_condition', furnished: 'furnished', kitchenEquipment: 'semi_equipped', elevator: true, heating: false, airConditioned: true },
  { g: 'sevilla', barrio: 'Triana', type: 'apartment', transaction: 'sale', price: 298000, squareMeters: 95, rooms: 3, baths: 2, title: 'Piso con vistas al Guadalquivir en Triana', description: 'Exterior con vistas al río y a la calle Betis. Tres dormitorios, dos baños y trastero.', floorLevel: 'intermediate_floor', floorNumber: 5, facing: 'east', propertyAge: '11_to_20 years', condition: 'good_condition', furnished: 'unfurnished', kitchenEquipment: 'fully_equipped', elevator: true, outsideView: true, storage: true, airConditioned: true },
];

let ok = 0, fail = 0;
for (let i = 0; i < houses.length; i++) {
  const { g, barrio, ...h } = houses[i];
  const body = {
    userId: USER_ID,
    ...geo[g],
    neighborhood: { NNUCLE: barrio },
    zipCode: {},
    country: 'Spain',
    currency: 'EUR',
    status: 'active',
    showRealEstateLogo: false,
    images: [1, 2, 3].map(n => `https://picsum.photos/seed/domus${i}${n}/800/600`),
    ...h,
  };
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (res.ok) { ok++; console.log(`✅ ${h.title}`); }
  else { fail++; console.log(`❌ ${h.title}: ${res.status} ${(await res.text()).substring(0, 120)}`); }
}
console.log(`\n${ok} creadas, ${fail} fallidas`);

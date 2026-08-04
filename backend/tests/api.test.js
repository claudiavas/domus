// Tests de integración de la API de Domus.
// Usan una MongoDB en memoria: no tocan la base de datos real.
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

jest.setTimeout(120000); // la primera ejecución descarga el binario de MongoDB

let mongod;
let app;
let mongoose;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  // Las variables de entorno deben estar listas ANTES de requerir la app,
  // porque mongo/index.js y userModel.js las leen al cargarse
  process.env.MONGO_URL = mongod.getUri();
  process.env.JWT_SECRET = 'secreto-de-tests';
  app = require('../app');
  mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    await new Promise((resolve) => mongoose.connection.once('open', resolve));
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

const usuario = {
  email: 'test@domus.es',
  password: 'Secreta123!',
  name: 'Ana',
  surname: 'Prueba',
};

describe('Usuarios: registro y login', () => {
  test('el registro devuelve 201 y un token JWT', async () => {
    const res = await request(app).post('/user/register').send(usuario);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.token.split('.')).toHaveLength(3);
  });

  test('no permite registrar dos veces el mismo email', async () => {
    const res = await request(app).post('/user/register').send(usuario);
    expect(res.status).toBe(400);
    expect(res.body.error.result).toMatch(/Ya existe/i);
  });

  test('el login con credenciales correctas devuelve token y datos del usuario', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({ email: usuario.email, password: usuario.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(usuario.email);
  });

  test('el login con password incorrecto devuelve 400', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({ email: usuario.email, password: 'incorrecta' });
    expect(res.status).toBe(400);
  });
});

describe('Viviendas', () => {
  test('sin viviendas, el listado devuelve 200 con array vacío', async () => {
    const res = await request(app).get('/api/housing/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('crear una vivienda y recuperarla con el filtro de activas', async () => {
    const login = await request(app)
      .post('/user/login')
      .send({ email: usuario.email, password: usuario.password });
    const userId = login.body.user._id;

    const vivienda = {
      userId,
      type: 'apartment',
      transaction: 'sale',
      country: 'Spain',
      currency: 'EUR',
      province: { PRO: 'Madrid', CPRO: '28' },
      municipality: { DMUN50: 'MADRID', CMUM: '079' },
      population: { NENTSI50: 'MADRID' },
      neighborhood: {},
      squareMeters: 90,
      price: 300000,
      rooms: 3,
      baths: 2,
      status: 'active',
      title: 'Piso de prueba en Madrid',
    };

    const creada = await request(app).post('/api/housing/').send(vivienda);
    expect(creada.status).toBe(200);
    expect(creada.body.house.title).toBe(vivienda.title);
    expect(creada.body.house.user._id).toBe(userId);

    const listado = await request(app).get('/api/housing/?status=active');
    expect(listado.status).toBe(200);
    expect(listado.body).toHaveLength(1);
    expect(listado.body[0].province.CPRO).toBe('28');
  });

  test('el filtro por status no devuelve viviendas de otro estado', async () => {
    const res = await request(app).get('/api/housing/?status=rented');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('Requerimientos', () => {
  test('sin requerimientos, el listado devuelve 200 con array vacío', async () => {
    const res = await request(app).get('/api/request/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('crear un requerimiento y verlo en el listado', async () => {
    const login = await request(app)
      .post('/user/login')
      .send({ email: usuario.email, password: usuario.password });

    const req = {
      userId: login.body.user._id,
      transaction: 'sale',
      community: { CCOM: '13' },
      province: { PRO: 'Madrid', CPRO: '28' },
      rooms: 2,
      minPrice: 100000,
      maxPrice: 400000,
      currency: 'EUR',
      title: 'Búsqueda en Madrid',
    };

    const creado = await request(app).post('/api/request/').send(req);
    expect(creado.status).toBe(200);

    const listado = await request(app).get('/api/request/');
    expect(listado.status).toBe(200);
    expect(listado.body).toHaveLength(1);
    expect(listado.body[0].title).toBe('Búsqueda en Madrid');
  });
});

const request = require('supertest');
const app = require('../app');
const Animal = require('../models/animalModel');
const mongoose = require('mongoose');
const { Types } = require('mongoose');

beforeAll(async () => {
  await Animal.deleteMany({});
  await Animal.create([
    {
      name: 'Lion',
      species: 'Panthera leo',
      habitat: 'Savanna',
      extinct: false
    },
    {
      name: 'Woolly Mammoth',
      species: 'Mammuthus primigenius',
      habitat: 'Tundra',
      extinct: true
    }
  ]);
});

afterAll(async () => {
  await Animal.deleteMany({});
  await mongoose.connection.close();
});

describe('GET /api/animal', () => {
  it('should return all animals', async () => {
    const res = await request(app).get('/api/animal');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('name', 'Lion');
    expect(res.body[1]).toHaveProperty('name', 'Woolly Mammoth');
  });
});

describe('GET /api/animal/:animalId', () => {
  it('should return a 400 for invalid ID format', async () => {
    const res = await request(app).get('/api/animal/invalidIdFormat');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid animal ID format.');
  });

  it('should return a 404 if the animal is not found', async () => {
    const validNonExistentId = new Types.ObjectId();
    const res = await request(app).get(`/api/animal/${validNonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Animal not found.');
  });
});

const request = require('supertest');
const { Types } = require('mongoose');
const app = require('../app');
const Zoo = require('../models/zooModel');

jest.setTimeout(100000);

describe('GET /api/zoo/:animalId', () => {
  it('should return a 400 for invalid ID format', async () => {
    const res = await request(app).get('/api/zoo/invalidIdFormat');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid animal ID format.');
  });

  it('should return a 404 if the animal is not found', async () => {
    const validNonExistentId = new Types.ObjectId();
    const res = await request(app).get(`/api/zoo/${validNonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Animal not found in inventory.');
  });

  it('should return a 200 and the animal data if the animal is found', async () => {
    const mockAnimal = await Zoo.create({
      animalId: new Types.ObjectId(),
      location: 'Africa Exhibit'
    });

    const res = await request(app).get(`/api/zoo/${mockAnimal.animalId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('location', 'Africa Exhibit');

    await Zoo.findByIdAndDelete(mockAnimal._id);
  });
});

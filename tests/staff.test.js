const request = require('supertest');
const app = require('../app');
const Staff = require('../models/staffModel');
const mongoose = require('mongoose');

beforeAll(async () => {
  await Staff.deleteMany({});
  await Staff.create([
    {
      staffId: 'STF001',
      name: 'John Doe',
      position: 'Manager',
      department: 'Sales'
    },
    {
      staffId: 'STF002',
      name: 'Jane Smith',
      position: 'Team Lead',
      department: 'Marketing'
    }
  ]);
});

afterAll(async () => {
  await Staff.deleteMany({});
  await mongoose.connection.close();
});

describe('GET /api/staff/:staffId', () => {
  it('should return a staff member by staffId', async () => {
    const res = await request(app).get('/api/staff/STF001');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('staffId', 'STF001');
    expect(res.body).toHaveProperty('name', 'John Doe');
    expect(res.body).toHaveProperty('position', 'Manager');
    expect(res.body).toHaveProperty('department', 'Sales');
  });

  it('should return a 404 if the staff member is not found', async () => {
    const res = await request(app).get('/api/staff/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Staff not found');
  });
});

describe('GET /api/staff', () => {
  it('should return all staff members', async () => {
    const res = await request(app).get('/api/staff');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should return an empty array if no staff members are found', async () => {
    await Staff.deleteMany({});
    const res = await request(app).get('/api/staff');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

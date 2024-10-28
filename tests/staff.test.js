const request = require('supertest');
const app = require('../app');
const Staff = require('../models/staffModel');
const mongoose = require('mongoose');

jest.setTimeout(100000);

beforeAll(async () => {
  await Staff.deleteMany({});
  await Staff.create([
    {
      staffId: 'STF001',
      name: 'John Doe',
      position: 'Manager',
      department: 'Sales',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      hireDate: '2022-01-01'
    },
    {
      staffId: 'STF002',
      name: 'Jane Smith',
      position: 'Team Lead',
      department: 'Marketing',
      email: 'jane.smith@example.com',
      phone: '987-654-3210',
      hireDate: '2023-05-15'
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
    expect(res.body).toHaveProperty('email', 'john.doe@example.com');
    expect(res.body).toHaveProperty('phone', '123-456-7890');
    expect(res.body).toHaveProperty('hireDate');
    expect(res.body.hireDate.split('T')[0]).toBe('2022-01-01');
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

    expect(res.body[0]).toHaveProperty('email');
    expect(res.body[0]).toHaveProperty('phone');
    expect(res.body[0]).toHaveProperty('hireDate');
    expect(res.body[1]).toHaveProperty('email');
    expect(res.body[1]).toHaveProperty('phone');
    expect(res.body[1]).toHaveProperty('hireDate');
  });

  it('should return an empty array if no staff members are found', async () => {
    await Staff.deleteMany({});
    const res = await request(app).get('/api/staff');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

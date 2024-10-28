const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');
const mongoose = require('mongoose');

jest.setTimeout(100000);

beforeAll(async () => {
  await User.deleteMany({});
  await User.create([
    {
      username: 'user1',
      email: 'user1@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin'
    },
    {
      username: 'user2',
      email: 'user2@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'user'
    }
  ]);
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('GET /api/user/:username', () => {
  it('should return a user by username', async () => {
    const res = await request(app).get('/api/user/user1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', 'user1');
    expect(res.body).toHaveProperty('email', 'user1@example.com');
    expect(res.body).toHaveProperty('firstName', 'John');
    expect(res.body).toHaveProperty('lastName', 'Doe');
    expect(res.body).toHaveProperty('role', 'admin');
  });

  it('should return a 404 if the user is not found', async () => {
    const res = await request(app).get('/api/user/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found');
  });
});

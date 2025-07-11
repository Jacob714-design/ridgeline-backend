import request from 'supertest';
import { app, prisma } from '../server';
import bcrypt from 'bcryptjs';

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'CONTRACTOR',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toMatchObject({
        name: 'Test User',
        email: 'test@example.com',
        role: 'CONTRACTOR',
      });
    });

    it('should return 409 for duplicate email', async () => {
      await prisma.user.create({
        data: {
          name: 'Existing User',
          email: 'test@example.com',
          passwordHash: await bcrypt.hash('password', 10),
          role: 'CONTRACTOR',
        },
      });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'CONTRACTOR',
        });

      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: await bcrypt.hash('password123', 10),
          role: 'CONTRACTOR',
        },
      });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
    });
  });
});
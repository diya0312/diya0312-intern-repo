import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { exportJWK, generateKeyPair, SignJWT, type KeyLike } from 'jose';
import request from 'supertest';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { TasksModule } from '../src/tasks/tasks.module';

const AUDIENCE = 'https://focusbear-rbac-api';
const ROLES_CLAIM = 'https://diya0312.github.io/roles';

describe('API tests with Supertest (e2e)', () => {
  let app: INestApplication;
  let jwksServer: Server;
  let issuer: string;
  let privateKey: KeyLike;

  // Signs a test JWT the same way Auth0 would (RS256 + kid), using a local test key.
  const createTestToken = (roles: string[], key: KeyLike = privateKey) =>
    new SignJWT({ [ROLES_CLAIM]: roles })
      .setProtectedHeader({ alg: 'RS256', kid: 'test-key' })
      .setIssuer(issuer)
      .setAudience(AUDIENCE)
      .setSubject('test-user')
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(key);

  beforeAll(async () => {
    // A tiny local server stands in for Auth0's /.well-known/jwks.json endpoint.
    const keys = await generateKeyPair('RS256');
    privateKey = keys.privateKey;
    const publicJwk = { ...(await exportJWK(keys.publicKey)), kid: 'test-key', alg: 'RS256' };

    jwksServer = createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ keys: [publicJwk] }));
    });
    await new Promise<void>((resolve) => jwksServer.listen(0, '127.0.0.1', resolve));
    issuer = `http://127.0.0.1:${(jwksServer.address() as AddressInfo).port}/`;

    // The real Auth0RolesGuard reads these when it is created.
    process.env.AUTH0_ISSUER_URL = issuer;
    process.env.AUTH0_AUDIENCE = AUDIENCE;

    const moduleRef = await Test.createTestingModule({
      imports: [TasksModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true })); // same as main.ts
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    await new Promise((resolve) => jwksServer?.close(resolve));
  });

  describe('GET endpoints', () => {
    it('GET /tasks returns 200 and the task list', async () => {
      const res = await request(app.getHttpServer()).get('/tasks').expect(200);

      expect(res.body).toEqual([
        { id: 1, title: 'Learn NestJS modules' },
        { id: 2, title: 'Understand dependency injection' },
      ]);
    });

    it('GET /tasks/1 returns 200 and a single task', async () => {
      await request(app.getHttpServer())
        .get('/tasks/1')
        .expect(200)
        .expect({ id: 1, title: 'Learn NestJS modules' });
    });

    it('GET /tasks/abc returns 400 because the id is not a number', async () => {
      const res = await request(app.getHttpServer()).get('/tasks/abc').expect(400);

      expect(res.body.message).toBe('Validation failed (numeric string is expected)');
    });
  });

  describe('POST /tasks with validation', () => {
    it('creates a task when the body is valid (201)', async () => {
      const res = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Write API tests' })
        .expect(201);

      expect(res.body).toEqual({ id: 3, title: 'Write API tests' });
    });

    it('rejects an empty title with 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: '' })
        .expect(400);

      expect(res.body.message).toContain('title should not be empty');
    });

    it('rejects a non-string title with 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 123 })
        .expect(400);

      expect(res.body.message).toContain('title must be a string');
    });
  });

  describe('Authentication with a test JWT (GET /admin)', () => {
    it('returns 401 when no token is sent', async () => {
      const res = await request(app.getHttpServer()).get('/admin').expect(401);

      expect(res.body.message).toBe('A valid Bearer access token is required.');
    });

    it('returns 200 when a valid test JWT has the admin role', async () => {
      const token = await createTestToken(['admin']);

      await request(app.getHttpServer())
        .get('/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect({ message: 'Welcome, admin!' });
    });

    it('returns 403 when the test JWT is valid but has no admin role', async () => {
      const token = await createTestToken(['user']);

      await request(app.getHttpServer())
        .get('/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('returns 401 when the token is signed with an unknown key', async () => {
      const { privateKey: otherKey } = await generateKeyPair('RS256');
      const token = await createTestToken(['admin'], otherKey);

      await request(app.getHttpServer())
        .get('/admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });
  });
});

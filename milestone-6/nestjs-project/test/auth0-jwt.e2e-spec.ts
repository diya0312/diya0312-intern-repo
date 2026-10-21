import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { exportJWK, generateKeyPair, SignJWT, type KeyLike } from 'jose';
import request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';

const AUDIENCE = 'https://focusbear-rbac-api';

describe('Auth0 JWT authentication with Passport + jwks-rsa (e2e)', () => {
  let app: INestApplication;
  let jwksServer: Server;
  let issuer: string;
  let privateKey: KeyLike;
  let jwksRequests = 0;

  const signToken = (
    claims: Record<string, unknown>,
    options: { key?: KeyLike; audience?: string; expiresIn?: string } = {},
  ) =>
    new SignJWT(claims)
      .setProtectedHeader({ alg: 'RS256', kid: 'test-key' })
      .setIssuer(issuer)
      .setAudience(options.audience ?? AUDIENCE)
      .setSubject('auth0|test-user-123')
      .setIssuedAt()
      .setExpirationTime(options.expiresIn ?? '5m')
      .sign(options.key ?? privateKey);

  beforeAll(async () => {
    // Local stand-in for https://<tenant>.auth0.com/.well-known/jwks.json
    const keys = await generateKeyPair('RS256');
    privateKey = keys.privateKey;
    const jwk = { ...(await exportJWK(keys.publicKey)), kid: 'test-key', alg: 'RS256', use: 'sig' };

    jwksServer = createServer((req, res) => {
      jwksRequests += 1;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ keys: [jwk] }));
    });
    await new Promise<void>((resolve) => jwksServer.listen(0, '127.0.0.1', resolve));
    issuer = `http://127.0.0.1:${(jwksServer.address() as AddressInfo).port}/`;

    process.env.AUTH0_ISSUER_URL = issuer;
    process.env.AUTH0_AUDIENCE = AUDIENCE;

    const moduleRef = await Test.createTestingModule({ imports: [AuthModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    await new Promise((resolve) => jwksServer?.close(resolve));
  });

  it('GET /auth/public works without a token', async () => {
    await request(app.getHttpServer())
      .get('/auth/public')
      .expect(200)
      .expect({ message: 'Anyone can see this.' });
  });

  it('GET /auth/profile returns 401 without a token', async () => {
    await request(app.getHttpServer()).get('/auth/profile').expect(401);
  });

  it('GET /auth/profile returns the user for a valid token', async () => {
    const token = await signToken({ permissions: ['read:tasks'] });

    const res = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toEqual({
      message: 'You are authenticated.',
      user: { userId: 'auth0|test-user-123', permissions: ['read:tasks'] },
    });
    expect(jwksRequests).toBeGreaterThan(0); // the public key really came from the JWKS endpoint
  });

  it('rejects a token signed with a different private key (401)', async () => {
    const { privateKey: attackerKey } = await generateKeyPair('RS256');
    const token = await signToken({}, { key: attackerKey });

    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('rejects a token for a different API audience (401)', async () => {
    const token = await signToken({}, { audience: 'https://some-other-api' });

    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('rejects an expired token (401)', async () => {
    const token = await signToken({}, { expiresIn: '-1m' });

    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});

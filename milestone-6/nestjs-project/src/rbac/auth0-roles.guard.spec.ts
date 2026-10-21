import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { exportJWK, generateKeyPair, SignJWT, type KeyLike } from 'jose';
import { Auth0RolesGuard } from './auth0-roles.guard';
import { Roles } from './roles.decorator';

const AUDIENCE = 'https://focusbear-rbac-api';
const ROLES_CLAIM = 'https://diya0312.github.io/roles';

class AdminOnlyController {
  @Roles('admin')
  adminRoute() {}

  publicRoute() {}
}

describe('Auth0RolesGuard', () => {
  let jwksServer: Server;
  let issuer: string;
  let privateKey: KeyLike;

  const contextFor = (handler: () => void, authorization?: string) =>
    ({
      getHandler: () => handler,
      getClass: () => AdminOnlyController,
      switchToHttp: () => ({ getRequest: () => ({ headers: { authorization } }) }),
    }) as unknown as ExecutionContext;

  const tokenWithRoles = (roles: unknown) =>
    new SignJWT({ [ROLES_CLAIM]: roles })
      .setProtectedHeader({ alg: 'RS256', kid: 'test-key' })
      .setIssuer(`${issuer}/`) // the guard adds the trailing slash, like Auth0 issuers have
      .setAudience(AUDIENCE)
      .setExpirationTime('5m')
      .sign(privateKey);

  beforeAll(async () => {
    const keys = await generateKeyPair('RS256');
    privateKey = keys.privateKey;
    const jwk = { ...(await exportJWK(keys.publicKey)), kid: 'test-key', alg: 'RS256' };
    jwksServer = createServer((_req, res) => res.end(JSON.stringify({ keys: [jwk] })));
    await new Promise<void>((resolve) => jwksServer.listen(0, '127.0.0.1', resolve));
    issuer = `http://127.0.0.1:${(jwksServer.address() as AddressInfo).port}`; // no trailing slash on purpose
  });

  afterAll(async () => {
    await new Promise((resolve) => jwksServer.close(resolve));
  });

  beforeEach(() => {
    process.env.AUTH0_ISSUER_URL = issuer;
    process.env.AUTH0_AUDIENCE = AUDIENCE;
  });

  const adminRoute = AdminOnlyController.prototype.adminRoute;
  const publicRoute = AdminOnlyController.prototype.publicRoute;

  it('rejects a request with no Bearer token (401)', async () => {
    await expect(new Auth0RolesGuard().canActivate(contextFor(adminRoute))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws a configuration error when Auth0 settings are missing', async () => {
    delete process.env.AUTH0_ISSUER_URL;

    await expect(
      new Auth0RolesGuard().canActivate(contextFor(adminRoute, 'Bearer abc')),
    ).rejects.toThrow('AUTH0_ISSUER_URL and AUTH0_AUDIENCE must be configured.');
  });

  it('rejects a token that cannot be verified (401)', async () => {
    await expect(
      new Auth0RolesGuard().canActivate(contextFor(adminRoute, 'Bearer not-a-real-jwt')),
    ).rejects.toThrow('The access token is invalid or expired.');
  });

  it('rejects a valid token without the admin role (403)', async () => {
    const token = await tokenWithRoles(['user']);

    await expect(
      new Auth0RolesGuard().canActivate(contextFor(adminRoute, `Bearer ${token}`)),
    ).rejects.toThrow(ForbiddenException);
  });

  it('treats a roles claim that is not a list as no roles (403)', async () => {
    const token = await tokenWithRoles('admin');

    await expect(
      new Auth0RolesGuard().canActivate(contextFor(adminRoute, `Bearer ${token}`)),
    ).rejects.toThrow(ForbiddenException);
  });

  it('allows a valid token that has the admin role', async () => {
    const token = await tokenWithRoles(['admin']);

    await expect(
      new Auth0RolesGuard().canActivate(contextFor(adminRoute, `Bearer ${token}`)),
    ).resolves.toBe(true);
  });

  it('allows any valid token when the route needs no roles', async () => {
    const token = await tokenWithRoles([]);

    await expect(
      new Auth0RolesGuard().canActivate(contextFor(publicRoute, `Bearer ${token}`)),
    ).resolves.toBe(true);
  });
});

import type { Request } from 'express';
import { AuthController } from './auth.controller';
import { auth0Issuer, JwtStrategy } from './jwt.strategy';

describe('Auth0 JWT auth', () => {
  const originalIssuer = process.env.AUTH0_ISSUER_URL;

  afterEach(() => {
    process.env.AUTH0_ISSUER_URL = originalIssuer;
  });

  describe('auth0Issuer()', () => {
    it('adds the trailing slash Auth0 issuers use', () => {
      process.env.AUTH0_ISSUER_URL = 'https://tenant.au.auth0.com';
      expect(auth0Issuer()).toBe('https://tenant.au.auth0.com/');
    });

    it('keeps an issuer that already ends with a slash', () => {
      process.env.AUTH0_ISSUER_URL = 'https://tenant.au.auth0.com/';
      expect(auth0Issuer()).toBe('https://tenant.au.auth0.com/');
    });

    it('uses a clearly invalid placeholder when Auth0 is not configured', () => {
      delete process.env.AUTH0_ISSUER_URL;
      expect(auth0Issuer()).toBe('https://auth0-not-configured.invalid/');
    });
  });

  describe('JwtStrategy.validate()', () => {
    const strategy = new JwtStrategy();

    it('maps the verified token payload to the request user', () => {
      expect(strategy.validate({ sub: 'auth0|abc', permissions: ['read:tasks'] })).toEqual({
        userId: 'auth0|abc',
        permissions: ['read:tasks'],
      });
    });

    it('defaults permissions to an empty list', () => {
      expect(strategy.validate({ sub: 'auth0|abc' }).permissions).toEqual([]);
    });
  });

  describe('AuthController', () => {
    const controller = new AuthController();

    it('getPublic() returns the public message', () => {
      expect(controller.getPublic()).toEqual({ message: 'Anyone can see this.' });
    });

    it('getProfile() returns the user that the guard attached', () => {
      const user = { userId: 'auth0|abc', permissions: [] };

      expect(controller.getProfile({ user } as unknown as Request)).toEqual({
        message: 'You are authenticated.',
        user,
      });
    });
  });
});

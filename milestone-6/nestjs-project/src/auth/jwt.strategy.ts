import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

export type Auth0User = {
  userId: string;
  permissions: string[];
};

type Auth0Payload = {
  sub: string;
  permissions?: string[];
};

// Auth0 issuers always end with a slash, e.g. https://my-tenant.au.auth0.com/
export const auth0Issuer = () => {
  const issuer = process.env.AUTH0_ISSUER_URL ?? 'https://auth0-not-configured.invalid/';
  return issuer.endsWith('/') ? issuer : `${issuer}/`;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'auth0-jwt') {
  constructor() {
    super({
      // Read the token from "Authorization: Bearer <token>".
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwks-rsa downloads Auth0's public keys and picks the one matching the token's "kid".
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: `${auth0Issuer()}.well-known/jwks.json`,
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
      }),
      issuer: auth0Issuer(),
      audience: process.env.AUTH0_AUDIENCE,
      algorithms: ['RS256'],
    });
  }

  // Runs only after the signature, issuer, audience and expiry have been verified.
  validate(payload: Auth0Payload): Auth0User {
    return {
      userId: payload.sub,
      permissions: payload.permissions ?? [],
    };
  }
}

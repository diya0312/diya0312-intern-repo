import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  createRemoteJWKSet,
  jwtVerify,
  type JWTPayload,
} from 'jose';
import type { Request } from 'express';
import { ROLES_KEY } from './roles.decorator';

const ROLES_CLAIM = 'https://diya0312.github.io/roles';

@Injectable()
export class Auth0RolesGuard implements CanActivate {
  private readonly issuer: string | undefined;
  private readonly audience: string | undefined;
  private readonly jwks:
    | ReturnType<typeof createRemoteJWKSet>
    | undefined;

  constructor() {
    const configuredIssuer = process.env.AUTH0_ISSUER_URL;
    this.audience = process.env.AUTH0_AUDIENCE;

    if (configuredIssuer) {
      this.issuer = configuredIssuer.endsWith('/')
        ? configuredIssuer
        : `${configuredIssuer}/`;

      this.jwks = createRemoteJWKSet(
        new URL('.well-known/jwks.json', this.issuer),
      );
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handlerRoles = Reflect.getMetadata(
      ROLES_KEY,
      context.getHandler(),
    ) as string[] | undefined;

    const classRoles = Reflect.getMetadata(
      ROLES_KEY,
      context.getClass(),
    ) as string[] | undefined;

    const requiredRoles = handlerRoles ?? classRoles ?? [];
    const request = context.switchToHttp().getRequest<Request>();

    const match = request.headers.authorization?.match(
      /^Bearer\s+(.+)$/i,
    );
    const token = match?.[1];

    if (!token) {
      throw new UnauthorizedException(
        'A valid Bearer access token is required.',
      );
    }

    if (!this.issuer || !this.audience || !this.jwks) {
      throw new Error(
        'AUTH0_ISSUER_URL and AUTH0_AUDIENCE must be configured.',
      );
    }

    let payload: JWTPayload;

    try {
      const verified = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
        audience: this.audience,
      });
      payload = verified.payload;
    } catch {
      throw new UnauthorizedException(
        'The access token is invalid or expired.',
      );
    }

    const roleClaim = payload[ROLES_CLAIM];
    const userRoles = Array.isArray(roleClaim)
      ? roleClaim.filter(
          (role): role is string => typeof role === 'string',
        )
      : [];

    if (!requiredRoles.every((role) => userRoles.includes(role))) {
      throw new ForbiddenException(
        'You do not have the required role.',
      );
    }

    return true;
  }
}

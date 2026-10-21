import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Protects a route: only requests with a valid Auth0 access token get through.
@Injectable()
export class JwtAuthGuard extends AuthGuard('auth0-jwt') {}

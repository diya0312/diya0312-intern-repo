import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  @Get('public')
  getPublic() {
    return { message: 'Anyone can see this.' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() request: Request) {
    // request.user is whatever JwtStrategy.validate() returned.
    return { message: 'You are authenticated.', user: request.user };
  }
}

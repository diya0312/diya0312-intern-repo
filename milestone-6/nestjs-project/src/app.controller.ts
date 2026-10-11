import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth0RolesGuard } from './rbac/auth0-roles.guard';
import { Roles } from './rbac/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('admin')
  @UseGuards(Auth0RolesGuard)
  @Roles('admin')
  getAdminMessage() {
    return { message: 'Welcome, admin!' };
  }
}

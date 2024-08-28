import {
  Request,
  Controller,
  Get,
  Post,
  Render,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Render('home')
  handleHomePage() {
    const appPort = this.configService.get<string>('APP_PORT');
    const message = this.appService.getWelcomeMessage();
    return {
      message,
      appPort,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}

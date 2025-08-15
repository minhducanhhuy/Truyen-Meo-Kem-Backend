import { Body, Controller, Patch, Post } from '@nestjs/common';
import { Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Google login redirect endpoint
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleRedirect() {
    // Passport sẽ tự redirect sang Discord OAuth2
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/redirect')
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req.user);
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordLogin() {
    // Passport sẽ tự redirect sang Discord OAuth2
  }

  @Get('discord/redirect')
  @UseGuards(AuthGuard('discord'))
  async discordRedirect(@Req() req) {
    return this.authService.discordLogin(req.user);
  }
}

import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { SessionData } from 'src/@types/sessionData';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(200)
  async register(@Body() body: registerDto) {
    const userData = await this.authService.register(body);
    return {
      id: userData.id,
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: loginDto) {
    const loginData = await this.authService.login(body);
    return loginData;
  }

  @Get('me')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getMe(@Session() session: SessionData) {
    const userData = await this.authService.getMyData(session.sub);
    return userData;
  }
}

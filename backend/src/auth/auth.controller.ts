import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateMeDto } from './dto/update-me.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(ThrottlerGuard)
  @Throttle({
    default: {
      ttl: 60_000,
      limit: Number(process.env.AUTH_RATE_LIMIT_PER_MINUTE ?? 10),
    },
  })
  @HttpCode(201)
  register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.authService.register(dto, req);
  }

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle({
    default: {
      ttl: 60_000,
      limit: Number(process.env.AUTH_RATE_LIMIT_PER_MINUTE ?? 10),
    },
  })
  @HttpCode(200)
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, req);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }

  @UseGuards(SessionAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return this.authService.me(req);
  }

  @UseGuards(SessionAuthGuard)
  @Patch('me')
  updateMe(@Body() dto: UpdateMeDto, @Req() req: Request) {
    return this.authService.updateMe(dto, req);
  }
}

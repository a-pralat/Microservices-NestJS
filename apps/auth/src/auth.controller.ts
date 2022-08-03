import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { User } from './users/schemas/user.schema';
import { GetUser } from './users/decorators/get-user.decorator';
import { Response } from 'express';
import { MessagePattern } from '@nestjs/microservices';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('login')
  async login(
    @GetUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @UseGuards(JwtGuard)
  @MessagePattern('validate_user')
  async validateUser(@GetUser() user: User) {
    return user;
  }
}

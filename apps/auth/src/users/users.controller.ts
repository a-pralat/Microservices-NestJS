import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/create-user.request.dto';
import {Body, Controller, Post} from '@nestjs/common';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserRequestDto) {
    return this.usersService.createUser(dto);
  }
}

import { UsersRepository } from './users.repository';
import { CreateUserRequestDto } from './dto/create-user.request.dto';
import { User } from './schemas/user.schema';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserRequestDto): Promise<User> {
    await this.validateCreateUserRequestDto(dto);

    return await this.usersRepository.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    });
  }

  private async validateCreateUserRequestDto(request: CreateUserRequestDto) {
    let user: User;
    try {
      user = await this.usersRepository.findOne({
        email: request.email,
      });
    } catch (err) {}

    if (user) {
      //TODO: enum errors
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async validateUser(email: string, password: string) {
    let user: User;
    let passwordIsValid: boolean
    try {
      user = await this.usersRepository.findOne({email});
      passwordIsValid = await bcrypt.compare(password, user.password);
    } catch (error) {}
    if (!passwordIsValid) {
      //TODO: enum errors
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  async getUser(getUserArguments: Partial<User>) {
    return await this.usersRepository.findOne(getUserArguments);
  }
}

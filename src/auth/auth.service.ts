import {
  BadRequestException,
  Injectable,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtservice: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.userService.findOneByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is wrong');
    }

    const payload = { email: user.email, role: user.role };

    const token = await this.jwtservice.signAsync(payload);

    return {
      token,
      email,
    };
  }

  async register({ name, email, password }: RegisterDto) {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('User already exist');
    }

    await this.userService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 10),
    });
    return {
      name,
      email,
    };
  }

  async profile({ email, role }: { email: string; role: string }) {
    // if (role !== 'admin') {
    //   throw new UnauthorizedException('You are not authorize to enter');
    // }
    return await this.userService.findOneByEmail(email);
  }
}

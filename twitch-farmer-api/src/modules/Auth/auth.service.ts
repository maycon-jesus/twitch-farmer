import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword, hashPassword } from 'src/utils/crypt';
import { UsersService } from '../Users/users.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(data: registerDto) {
    const passwordHash = hashPassword(data.password);
    const userData = await this.usersService.create({
      ...data,
      password: passwordHash,
    });
    return userData;
  }

  async login(data: loginDto) {
    const userData = await this.usersService.getByEmail(data.email);
    if (!userData) throw new HttpException('Email ou senha incorretos', 401);

    const isPasswordCorrect = comparePassword(data.password, userData.password);
    if (!isPasswordCorrect)
      throw new HttpException('Email ou senha incorretos', 401);

    const token = this.jwtService.sign(
      {},
      {
        subject: userData.id.toString(),
        expiresIn: '365d',
        issuer: 'Maycon Jesus',
      },
    );

    return {
      access_token: token,
    };
  }

  async getMyData(userId: number) {
    const userData = await this.usersService.getById(userId);
    return {
      firstName: userData.firstName,
      lastName: userData.lastName,
      id: userData.id,
    };
  }
}

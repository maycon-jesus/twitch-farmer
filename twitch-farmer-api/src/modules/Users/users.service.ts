import { createUserDto } from './dto/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private users: Repository<UserEntity>,
  ) {}

  async getById(userId: number) {
    const user = await this.users.findOne({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.users.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async create(data: createUserDto) {
    const userExists = await this.getByEmail(data.email);
    if (userExists)
      throw new HttpException('ja existe um usuário com esse email', 400);

    const userCreated = await this.users.insert(data);
    const nUserId = userCreated.identifiers[0];

    if (!nUserId)
      throw new HttpException('Usuário não foi criado no banco de dados', 500);

    const user = await this.getById(nUserId.id);

    return user;
  }
}

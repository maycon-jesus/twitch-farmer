import { Controller, Get, UseGuards } from '@nestjs/common';
import { MicroServiceGuard } from 'src/guards/microservice.guard';
import { UsersService } from '../Users/users.service';

@Controller('/private/users')
@UseGuards(MicroServiceGuard)
export class UsersPrivateController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    const allUsers = await this.usersService.find();

    return allUsers;
  }
}

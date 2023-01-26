import { UsersModule } from './../Users/users.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

const jwtModule = JwtModule.register({
  secret: process.env.JWT_SECRET,
});

@Module({
  imports: [jwtModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}

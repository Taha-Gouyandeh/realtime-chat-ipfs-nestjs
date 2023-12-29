import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret:
        'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMzgzNjI3NCwiaWF0IjoxNzAzODM2Mjc0fQ._jk9bDxvcmAjNqzyCyL8dmqOGM5TY3In5WrNKo5PGgI',
      signOptions: { expiresIn: '15d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

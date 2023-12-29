import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user_repo: Repository<User>,
  ) {}

  async findUser(user_name: string) {
    const duplicateUser = await this.user_repo.find({
      where: { user_name: user_name },
    });
    if (duplicateUser) {
      return { data: duplicateUser[0] };
    } else {
      return { data: undefined };
    }
  }

  async create(createUserDto: CreateUserDto) {
    const duplicateUser = await this.findUser(createUserDto.username);

    if (duplicateUser?.data?.id) {
      throw new HttpException(
        { message: 'your user name is already exist' },
        422,
      );
    }

    const password = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.user_repo.create({
      user_name: createUserDto.username,
      password: password,
    });

    return await this.user_repo
      .save(user)
      .then(() => {
        return { data: { password: undefined, ...user } };
      })
      .catch((err) => {
        throw new HttpException({ message: err }, 422);
      });
  }

  async login(createUserDto: CreateUserDto) {
    const duplicateUser = await this.findUser(createUserDto.username);

    if (duplicateUser?.data?.id) {
      const isPasswordMatch = await bcrypt.compare(
        createUserDto.password,
        duplicateUser.data.password + '',
      );

      if (isPasswordMatch) {
      } else {
        throw new HttpException({ message: 'your password is wrong' }, 422);
      }
    } else {
      throw new HttpException(
        { message: "your user dos{'}ent exist please register first" },
        422,
      );
    }
  }

  async findAll(page: number, limit: number, user_name: string) {
    const skip = (page - 1) * limit;
    const data = await this.user_repo.find({
      skip,
      take: limit,
      where: { user_name: Like(`%${user_name}%`) },
    });
    const total = await this.user_repo.count();
    return { total: total, current_page: page, per_page: limit, data: data };
  }

  async findOne(id: string) {
    return await this.user_repo.findOne({ where: { id: id } });
  }
}

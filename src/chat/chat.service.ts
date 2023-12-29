import { HttpException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Chat } from './entities/chat.entity';
import { UserService } from '../user/user.service';
import * as IPFS from 'ipfs-http-client';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  private ipfs;

  constructor(
    @InjectRepository(Chat)
    private readonly chat_repo: Repository<Chat>,
    @InjectRepository(User)
    private readonly user_repo: Repository<User>,
    private readonly user_service: UserService,
    private readonly jwt_service: JwtService,
  ) {
    this.ipfs = IPFS.create({
      host: 'localhost',
      port: 5001,
      protocol: 'http',
    });
  }

  async create(
    authUser: { id: string; username: string },
    createChatDto: CreateChatDto,
  ) {
    const user = await this.user_service.findOne(authUser.id);

    const chat = new Chat();

    chat.user = user;
    chat.ipfsId = await this.storeJsonData(createChatDto.message);

    return await this.chat_repo
      .save(chat)
      .then(() => {
        return chat;
      })
      .catch((err) => {
        throw new HttpException({ message: err }, 400);
      });
  }

  async findAll(authUser: { id: string; username: string }) {
    const user = await this.user_service.findOne(authUser.id);

    const data = await this.chat_repo.find({
      where: { user: user },
    });

    return {
      data: data,
    };
  }

  async findOne(authUser: { id: string; username: string }, id: string) {
    const user = await this.user_service.findOne(authUser.id);

    const data = await this.chat_repo.findOne({
      where: { user: user, id: id },
    });
    return await this.getJsonData(data.ipfsId);
  }

  async storeJsonData(data: any): Promise<string> {
    const result = await this.ipfs.add(Buffer.from(JSON.stringify(data)));
    return result.cid.toString();
  }

  async getJsonData(cid: string): Promise<any> {
    const chunks = [];
    for await (const chunk of this.ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    const jsonData = Buffer.concat(chunks).toString();
    return JSON.parse(jsonData);
  }
}

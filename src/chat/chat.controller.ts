import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() request, @Body() createChatDto: CreateChatDto) {
    return this.chatService.create(request.user, createChatDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() request) {
    return this.chatService.findAll(request.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Request() request, @Param('id') id: string) {
    return this.chatService.findOne(request.user, id);
  }
}

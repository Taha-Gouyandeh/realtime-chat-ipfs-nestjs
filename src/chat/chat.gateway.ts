import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseGuards, Request } from '@nestjs/common';
import { JwtSWGuard } from '../jwt-auth/jwt-sw.guard';

@WebSocketGateway(8005, { cors: '*:*' })
export class ChatGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('message')
  @UseGuards(JwtSWGuard)
  handleMessage(
    @Request() request,
    @MessageBody() message: { text: string },
  ): void {
    const user = request.user;
    const { text } = message;

    this.server.emit('message', {
      username: user.username,
      userId: user.id,
      text,
    });
  }
}

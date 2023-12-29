import { IsArray } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  message: {
    username: string;
    userId: string;
    text: string;
  }[];
}

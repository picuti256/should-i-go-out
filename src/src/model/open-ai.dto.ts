import { IsNotEmpty, IsString } from 'class-validator';

export class UserInputDTO {
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class ChatAnswerOutputDTO {
  @IsString()
  aiMessage: string;
}

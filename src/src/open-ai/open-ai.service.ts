import { Injectable } from '@nestjs/common';
import Config from '../configs/config';
import { UserInputDTO } from '../model/open-ai.dto';

@Injectable()
export class OpenAiService {
  private readonly apiKey = Config.openApiKey;

  //   async askQuestion(question: UserInputDTO): Promise<any> {}
}

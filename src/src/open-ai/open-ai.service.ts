import { Injectable } from '@nestjs/common';
import Config from '../configs/config';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class OpenAiService {
  private readonly openAiClient: ChatOpenAI;

  constructor() {
    const apiKey = Config.openApiKey;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    this.openAiClient = new ChatOpenAI({ apiKey });
  }

  async createChatCompletion(prompt: string): Promise<string> {
    try {
      const response = await this.openAiClient.completionWithRetry({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });
      const choice = response.choices[0];
      if (choice && choice.message && choice.message.content) {
        return choice.message.content.trim();
      } else {
        throw new Error('Invalid response from OpenAI API');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate chat completion');
    }
  }
}

import { Injectable } from '@nestjs/common';
import Config from '../configs/config';
import OpenAI from 'openai';
import { WeatherApiService } from '../weather-api/weather-api.service';
import logger from '../utils/logger.util';

@Injectable()
export class OpenAiService {
  private readonly openAiClient: any;
  private assistantId: string;
  private threadId: string;
  private runId: string;

  constructor(private readonly weatherService: WeatherApiService) {
    const apiKey = Config.openApiKey;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    this.openAiClient = new OpenAI({
      apiKey: apiKey,
    });
  }

  async createWeatherAssistant(): Promise<void> {
    const assistant = await this.openAiClient.beta.assistants.create({
      model: 'gpt-3.5-turbo',
      name: 'Jarvis',
      instructions:
        'You are a weather bot. Use the provided functions to answer questions.',
      tools: [
        {
          type: 'function',
          function: {
            name: 'getCurrentTemperature',
            description: 'Get the current temperature for a specific location',
            parameters: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'The city and state, e.g., San Francisco, CA',
                },
                unit: {
                  type: 'string',
                  enum: ['Celsius', 'Fahrenheit'],
                  description:
                    "The temperature unit to use. Infer this from the user's location.",
                },
              },
              required: ['location', 'unit'],
            },
          },
        },
        {
          type: 'function',
          function: {
            name: 'getRainProbability',
            description: 'Get the probability of rain for a specific location',
            parameters: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'The city ${city}',
                },
              },
              required: ['location'],
            },
          },
        },
      ],
    });
    this.assistantId = assistant.id;
    console.log('Assistant created:', assistant);
  }

  async createThread(weatherData: any): Promise<void> {
    const thread = await this.openAiClient.beta.threads.create();
    this.threadId = thread.id;
    await this.openAiClient.beta.threads.messages.create(this.threadId, {
      role: 'user',
      content: `Given the weather data: ${JSON.stringify(
        weatherData,
      )}, should I go outside? Here are the rules: The temperature must be less than 25 degrees Celsius, air humidity must be less than 80%, rain has to be 0, and the wind is less than 5. If i should stay, recommend me an movie, if i should go outside, tell me what i can do, like go to the mall or get some icecreams`,
    });
    console.log('Thread created:', thread);
  }

  async initiateRun(): Promise<string> {
    try {
      const run = await this.openAiClient.beta.threads.runs.createAndPoll(
        this.threadId,
        { assistant_id: this.assistantId },
      );
      console.log('Run initiated:', run);
      return (this.runId = run);
    } catch (err) {
      logger.error(err);
    }
  }

  async handleToolOutputs(run: any): Promise<any> {
    const toolOutputs = await Promise.all(
      run.required_action.submit_tool_outputs.tool_calls.map(async (tool) => {
        if (tool.function.name === 'getCurrentTemperature') {
          const location = tool.parameters.location;
          const temperature = await this.weatherService.getTemperature(
            location,
          );
          return {
            tool_call_id: tool.id,
            output: temperature.toString(),
          };
        } else if (tool.function.name === 'getRainProbability') {
          const location = tool.parameters.location;
          const rainProbability = await this.weatherService.getRainProbability(
            location,
          );
          return {
            tool_call_id: tool.id,
            output: rainProbability,
          };
        }
        return null;
      }),
    );

    const filteredToolOutputs = toolOutputs.filter(Boolean);

    if (filteredToolOutputs.length > 0) {
      run = await this.openAiClient.beta.threads.runs.submitToolOutputsAndPoll(
        this.threadId,
        run.id,
        { tool_outputs: filteredToolOutputs },
      );
      console.log('Tool outputs submitted successfully.');
    } else {
      console.log('No tool outputs to submit.');
    }

    return this.handleRunStatus(run);
  }

  async handleRunStatus(run: any): Promise<any> {
    if (run.status === 'completed') {
      const messages = await this.openAiClient.beta.threads.messages.list(
        this.threadId,
      );
      console.log('Messages:', messages.data);
      return messages.data;
    } else if (run.status === 'requires_action') {
      console.log('Run status requires action.');
      return this.handleToolOutputs(run);
    } else if (run.status === 'in_progress') {
      console.log('Run is still in progress...');
      return this.openAiClient.beta.threads.runs.poll(this.threadId, run.id);
    } else {
      console.error('Run did not complete:', run);
    }
  }

  async getChatResponse(weatherData: any): Promise<any> {
    await this.createThread(weatherData);
    const run = await this.initiateRun();

    return this.handleRunStatus(run);
  }
}

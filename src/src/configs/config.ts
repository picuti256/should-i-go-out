import * as dotenv from 'dotenv';

dotenv.config();

export default class Config {
  public static readonly port = process.env.PORT || '3030';
  public static readonly openApiKey = process.env.OPENAI_API_KEY || '';
}

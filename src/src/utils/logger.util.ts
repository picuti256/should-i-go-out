import pino, { Logger } from 'pino';

const logger: Logger<never> = pino();

export default logger;

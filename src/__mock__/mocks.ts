import { ServiceApi } from '../types';
import { Logger } from 'pino';

export const serviceApi = {
  flows: {
    createOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    readByQuery: jest.fn(() => []),
  },
  operations: {
    createOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    readByQuery: jest.fn(() => []),
  },
} as unknown as ServiceApi;

export const logger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
} as unknown as Logger;

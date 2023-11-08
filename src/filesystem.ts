import path from 'path';
import { ENV } from './env';
import fs from 'fs/promises';

const filesPath = path.resolve(ENV.FLOW_SYNC_PATH);
export const flowsFile = path.join(filesPath, 'flows.json');
export const operationsFile = path.join(filesPath, 'operations.json');

export const checkPath = async () => {
    return await fs.access(filesPath);
};

export const readFromFs = async <T = any>(path: string): Promise<T> => {
    const json = await fs.readFile(path, 'utf-8');
    return JSON.parse(json);
};

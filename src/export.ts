import fs from 'fs/promises';
import { ServiceApi } from './types';
import { OptionValues } from '@commander-js/extra-typings';
import { checkPath, flowsFile, operationsFile } from './filesystem';
import { Logger } from 'pino';

const serialize = (obj: any) => JSON.stringify(obj, null, 2);

export const exportToFilesystem = async (
  { flows, operations }: ServiceApi,
  options: OptionValues,
  logger: Logger
) => {
  await checkPath();

  const status = options.includeInactive
    ? ['active', 'inactive']
    : ['active'];

  const flowsQuery = {
    filter: { status: { _in: status } },
    limit:  -1
  };

  const rawFlows = await flows.readByQuery(flowsQuery);
  logger.debug(`Writing ${rawFlows.length} flows to the file system ...`);
  await fs.writeFile(flowsFile, serialize(rawFlows));

  const flowIds = rawFlows.map((flow) => flow.id);
  const operationsQuery = {
    filter: { flow: { _in: flowIds } },
    limit:  -1
  };

  const rawOperations = await operations.readByQuery(operationsQuery);
  logger.debug(
    `Writing ${rawOperations.length} operations to the file system ...`
  );
  await fs.writeFile(operationsFile, serialize(rawOperations));
};

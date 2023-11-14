import { SchemaOverview } from '@directus/types';
import { ServiceApi } from './types';

export const getServiceApi = (
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  { FlowsService, OperationsService }: any,
  schema: SchemaOverview
): ServiceApi => {
  const flows = new FlowsService({ schema });
  const operations = new OperationsService({ schema });

  return { flows, operations };
};

import { SchemaOverview } from '@directus/types';
import { ServiceApi } from './types';

export const getServiceApi = (
  { FlowsService, OperationsService }: any,
  schema: SchemaOverview
): ServiceApi => {
  const flows = new FlowsService({ schema });
  const operations = new OperationsService({ schema });

  return { flows, operations };
};

import 'dotenv/config';
import { ServiceApi } from './types';
import { OptionValues } from '@commander-js/extra-typings';
import { FlowRaw, OperationRaw, PrimaryKey } from '@directus/types';
import { checkPath, flowsFile, operationsFile, readFromFs } from './filesystem';
import { Logger } from 'pino';
import { getArrayFromCsv } from './csv';

export const getFlowOperations = async (flowId: PrimaryKey) => {
    const operations: OperationRaw[] = (await readFromFs(operationsFile)) || [];

    return operations.filter((operation) => operation.flow === flowId);
};

export const processFlow = async (
    flow: FlowRaw,
    { flows, operations }: ServiceApi,
    options: OptionValues,
    logger: Logger
) => {
    const { id, operation } = flow;

    if (options.importIds) {
        const importIds = getArrayFromCsv(options.importIds);
        if (importIds.length > 0 && !importIds.includes(id)) {
            logger.debug(
                `Flow '${id}' is not included in '${importIds}', skipping ...`
            );
            return;
        } else {
            logger.debug(
                `Flow '${id}' is included in import list, importing ...`
            );
        }
    } else {
        logger.debug(`Importing flow '${id}' ...`);
    }

    if (options.overwrite) {
        logger.debug(`Deleting flow...`);
        await flows.deleteOne(id);
    }

    flow.operation = null;
    flow.operations = [];
    flow.user_created = options.userId ? String(options.userId) : '';

    await flows.createOne(flow);

    const flowOperations = await getFlowOperations(id);
    for (const operation of flowOperations) {
        logger.debug(`Importing operation '${operation.id}' ...`);
        if (options.overwrite) {
            logger.debug(`Deleting operation...`);
            const { id } = operation;
            await operations.deleteOne(id);
        }

        const operationClone: OperationRaw = { ...operation };
        operationClone.user_created = options.userId
            ? String(options.userId)
            : '';
        operationClone.resolve = null;
        operationClone.reject = null;

        await operations.createOne(operationClone);
        logger.debug(`Operation ${operation.id} imported!`);
    }

    for (const operation of flowOperations) {
        const { id, resolve, reject } = operation;
        await operations.updateOne(id, { resolve, reject });
    }

    await flows.updateOne(id, { operation });
    logger.debug(`Flow ${id} imported!`);
};

export const importFromFilesystem = async (
    api: ServiceApi,
    options: OptionValues,
    logger: Logger
) => {
    await checkPath();

    const flows: FlowRaw[] = await readFromFs(flowsFile);
    logger.debug(`Found ${flows.length} flows to import in filesystem`);

    for (const flow of flows) {
        await processFlow(flow, api, options, logger);
    }
};

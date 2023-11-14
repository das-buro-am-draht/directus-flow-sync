import { getFlowOperations, processFlow } from './import';
import { readFromFs } from './filesystem';
import { FlowRaw } from '@directus/types';
import { logger, serviceApi } from './__mock__/mocks';

jest.mock('./filesystem');

const mockReadFromFs = readFromFs as jest.MockedFunction<typeof readFromFs>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('import', () => {
  describe('getFlowOperations', () => {
    it('should return operations with matching flow id', async () => {
      mockReadFromFs.mockReturnValue(
        Promise.resolve([{ flow: '12345' }, { flow: '67890' }])
      );
      const actual = await getFlowOperations('12345');

      expect(actual).toHaveLength(1);
    });

    it('should return empty array if flow id does not match', async () => {
      mockReadFromFs.mockReturnValue(
        Promise.resolve([{ flow: '12345' }, { flow: '67890' }])
      );
      const actual = await getFlowOperations('11111');

      expect(actual).toHaveLength(0);
    });

    it('should return empty array if operations file is empty', async () => {
      mockReadFromFs.mockReturnValue(Promise.resolve([]));
      const actual = await getFlowOperations('12345');

      expect(actual).toHaveLength(0);
    });

    it('should return empty array if operations file is missing', async () => {
      mockReadFromFs.mockReturnValue(Promise.resolve(null));
      const actual = await getFlowOperations('12345');

      expect(actual).toHaveLength(0);
    });
  });

  describe('processFlow', () => {
    it('should not create flow if importIds is set and flow is not included', async () => {
      await processFlow(
        { id: '10000', operation: null } as FlowRaw,
        serviceApi,
        { importIds: '12345' },
        logger
      );

      expect(serviceApi.flows.createOne).toHaveBeenCalledTimes(0);
    });

    it('should create flow if importIds is set and flow is included', async () => {
      await processFlow(
        { id: '12345', operation: null } as FlowRaw,
        serviceApi,
        { importIds: '12345' },
        logger
      );

      expect(serviceApi.flows.createOne).toHaveBeenCalledTimes(1);
    });

    it('should create flow if importIds is not set', async () => {
      await processFlow(
        { id: '12345', operation: null } as FlowRaw,
        serviceApi,
        {},
        logger
      );

      expect(serviceApi.flows.createOne).toHaveBeenCalledTimes(1);
    });

    it('should delete flow if overwrite is set to true', async () => {
      await processFlow(
        { id: '12345', operation: null } as FlowRaw,
        serviceApi,
        { overwrite: true },
        logger
      );

      expect(serviceApi.flows.deleteOne).toHaveBeenCalledTimes(1);
    });

    it('should not delete flow if overwrite is not set', async () => {
      await processFlow(
        { id: '12345', operation: null } as FlowRaw,
        serviceApi,
        {},
        logger
      );

      expect(serviceApi.flows.deleteOne).toHaveBeenCalledTimes(0);
    });

    it('should not delete flow if overwrite is set to false', async () => {
      await processFlow(
        { id: '12345', operation: null } as FlowRaw,
        serviceApi,
        { overwrite: false },
        logger
      );

      expect(serviceApi.flows.deleteOne).toHaveBeenCalledTimes(0);
    });

    it('should process all flow operations', async () => {
      mockReadFromFs.mockReturnValue(
        Promise.resolve([{ flow: '12345' }, { flow: '12345' }])
      );

      await processFlow(
        { id: '12345', operation: null } as FlowRaw,
        serviceApi,
        {},
        logger
      );

      expect(serviceApi.operations.createOne).toHaveBeenCalledTimes(2);
    });

    it('should delete operation if overwrite is set to true', async () => {
      mockReadFromFs.mockReturnValue(
        Promise.resolve([{ flow: '12345' }, { flow: '12345' }])
      );

      await processFlow(
        { id: '12345', operation: null } as FlowRaw,
        serviceApi,
        { overwrite: true },
        logger
      );

      expect(serviceApi.operations.deleteOne).toHaveBeenCalledTimes(2);
    });

    it('should not delete operation if overwrite is not set', async () => {
      mockReadFromFs.mockReturnValue(
        Promise.resolve([{ flow: '12345' }, { flow: '12345' }])
      );

      await processFlow(
        { id: '12345', operation: null } as FlowRaw,
        serviceApi,
        {},
        logger
      );

      expect(serviceApi.operations.deleteOne).toHaveBeenCalledTimes(0);
    });

    it('should not delete operation if overwrite is set to false', async () => {
      mockReadFromFs.mockReturnValue(
        Promise.resolve([{ flow: '12345' }, { flow: '12345' }])
      );

      await processFlow(
        { id: '12345', operation: null } as FlowRaw,
        serviceApi,
        { overwrite: false },
        logger
      );

      expect(serviceApi.operations.deleteOne).toHaveBeenCalledTimes(0);
    });

    it('should create flow with operation id set to null', async () => {
      await processFlow(
        { id: '12345', operation: 'abc' } as FlowRaw,
        serviceApi,
        { overwrite: false },
        logger
      );

      expect(serviceApi.flows.createOne).toHaveBeenCalledWith({
        id: '12345',
        operation: null,
        operations: [],
        user_created: '',
      });
    });

    it('should create flow with user_created if userId is set', async () => {
      await processFlow(
        { id: '12345', operation: 'abc' } as FlowRaw,
        serviceApi,
        { userId: '55555' },
        logger
      );

      expect(serviceApi.flows.createOne).toHaveBeenCalledWith({
        id: '12345',
        operation: null,
        operations: [],
        user_created: '55555',
      });
    });

    it('should create operation with resolve and reject set to null', async () => {
      mockReadFromFs.mockReturnValue(
        Promise.resolve([{ flow: '12345' }, { flow: '12345' }])
      );

      await processFlow(
        { id: '12345', operation: null } as FlowRaw,
        serviceApi,
        {},
        logger
      );

      expect(serviceApi.operations.createOne).toHaveBeenCalledWith({
        flow: '12345',
        reject: null,
        resolve: null,
        user_created: '',
      });
    });

    it('should create operation with user_created if userId is set', async () => {
      mockReadFromFs.mockReturnValue(
        Promise.resolve([{ flow: '12345' }, { flow: '12345' }])
      );

      await processFlow(
        { id: '12345', operation: null } as FlowRaw,
        serviceApi,
        { userId: '55555' },
        logger
      );

      expect(serviceApi.operations.createOne).toHaveBeenCalledWith({
        flow: '12345',
        user_created: '55555',
        reject: null,
        resolve: null,
      });
    });

    it('should update flow with start operation id', async () => {
      mockReadFromFs.mockReturnValue(
        Promise.resolve([{ flow: '12345' }])
      );

      await processFlow(
        { id: '12345', operation: '11111' } as FlowRaw,
        serviceApi,
        {},
        logger
      );

      expect(serviceApi.flows.updateOne).toHaveBeenCalledWith('12345', {
        operation: '11111',
      });
    });

    it('should update operation with resolve and reject ids', async () => {
      mockReadFromFs.mockReturnValue(
        Promise.resolve([
          {
            id: '11111',
            flow: '12345',
            resolve: 'aaaaa',
            reject: 'bbbbb',
          },
        ])
      );

      await processFlow(
        { id: '12345', operation: null } as FlowRaw,
        serviceApi,
        {},
        logger
      );

      expect(serviceApi.operations.updateOne).toHaveBeenCalledWith(
        '11111',
        {
          resolve: 'aaaaa',
          reject: 'bbbbb',
        }
      );
    });
  });
});

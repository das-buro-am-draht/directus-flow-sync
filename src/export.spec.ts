import { exportToFilesystem } from './export';
import { logger, serviceApi } from './__mock__/mocks';

jest.mock('./filesystem');
jest.mock('fs/promises');

describe('export', () => {
    describe('exportToFilesystem', () => {
        it('should query active and inactive flows when includeInactive is set', async () => {
            await exportToFilesystem(
                serviceApi,
                { includeInactive: true },
                logger
            );

            expect(serviceApi.flows.readByQuery).toHaveBeenCalledWith({
                filter: { status: { _in: ['active', 'inactive'] } },
                limit: -1,
            });
        });

        it('should query active flows only when includeInactive is not set', async () => {
            await exportToFilesystem(serviceApi, {}, logger);

            expect(serviceApi.flows.readByQuery).toHaveBeenCalledWith({
                filter: { status: { _in: ['active'] } },
                limit: -1,
            });
        });
    });
});

import { HookExtensionContext, InitHandler } from '@directus/types';
import { Command, OptionValues } from '@commander-js/extra-typings';
import { getServiceApi } from './service';
import { exportToFilesystem } from './export';
import { importFromFilesystem } from './import';
import { Logger } from 'pino';

export const createInitHandler =
    (context: HookExtensionContext): InitHandler =>
      async (meta) => {
        const { logger, getSchema, services } = context;

        const serviceApi = getServiceApi(services, await getSchema());

        const program = meta.program as Command;
        const cli = program.command('flow');

        cli.command('import')
          .description(
            'Sync flows and operations from the filesystem to the DB'
          )
          .option(
            '-u, --user-id <uuid>',
            'uuid of the importing directus user'
          )
          .option(
            '-o, --overwrite',
            'overwrite existing flows and operations'
          )
          .option(
            '-i, --import-ids <ids>',
            'coma separated list of flow ids to import'
          )
          .action(async (options: OptionValues) => {
            logger.info('Importing flows and operations ...');

            try {
              await importFromFilesystem(
                serviceApi,
                options,
                logger as Logger
              );

              logger.info('Flows and operations written to DB!');
              process.exit(0);
            } catch (err: any) {
              logger.error(err);
              process.exit(1);
            }
          });

        cli.command('export')
          .description(
            'Sync flows and operations from the DB to the filesystem'
          )
          .option('-i, --include-inactive', 'Include inactive flows')
          .action(async (options) => {
            logger.info('Exporting flows and operations ...');

            try {
              await exportToFilesystem(
                serviceApi,
                options,
                logger as Logger
              );

              logger.info('Flows and operations written to filesystem!');
              process.exit(0);
            } catch (err: any) {
              logger.error(err);
              process.exit(1);
            }
          });
      };

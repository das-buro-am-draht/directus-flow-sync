import { defineHook } from '@directus/extensions-sdk';
import { createInitHandler } from './handler';

export default defineHook(({ init }, context) => {
    init('cli.before', createInitHandler(context));
});

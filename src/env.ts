import { z } from 'zod';

const schema = z.object({
  FLOW_SYNC_PATH: z
    .string()
    .startsWith('./')
    .default('./extensions/hooks/flow-sync/config'),
});

export const ENV = schema.parse(process.env);

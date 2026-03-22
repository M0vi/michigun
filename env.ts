import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    LOADER_SCRIPT: z
      .string()
      .min(10, 'LOADER_SCRIPT parece inválido'),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  },
  experimental__runtimeEnv: {},
})
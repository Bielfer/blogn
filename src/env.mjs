import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    FIREBASE_SERVICE_ACCOUNT: z.string().min(1),
    VERCEL_TOKEN: z.string().min(1),
    VERCEL_PROJECT_ID: z.string().min(1),
    CLOUDFLARE_ZONE_ID: z.string().min(1),
    CLOUDFLARE_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_API_KEY: z.string().min(1),
    NEXT_PUBLIC_AUTH_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_STORAGE_BUCKET: z.string().min(1),
    NEXT_PUBLIC_MESSAGING_SENDER_ID: z.string().min(1),
    NEXT_PUBLIC_APP_ID: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    NEXT_PUBLIC_AUTH_DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    NEXT_PUBLIC_STORAGE_BUCKET: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    NEXT_PUBLIC_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID,
    FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    VERCEL_TOKEN: process.env.VERCEL_TOKEN,
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
    CLOUDFLARE_ZONE_ID: process.env.CLOUDFLARE_ZONE_ID,
    CLOUDFLARE_API_KEY: process.env.CLOUDFLARE_API_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

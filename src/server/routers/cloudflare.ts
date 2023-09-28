import { router, privateProcedure } from '~/server/trpc';
import { z } from 'zod';
import { tryCatch } from '~/lib/helpers/try-catch';
import { env } from '~/env.mjs';
import { TRPCError } from '@trpc/server';

export const cloudflareRouter = router({
  addDomain: privateProcedure
    .input(z.object({ subdomain: z.string() }))
    .mutation(async ({ input }) => {
      const [res, error] = await tryCatch(
        fetch(
          `https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/dns_records`,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Email': 'bielfer18@gmail.com',
              'X-Auth-Key': env.CLOUDFLARE_API_KEY,
            },
            body: JSON.stringify({
              name: `${input.subdomain}.blogn.io`,
              type: 'CNAME',
              content: 'cname.vercel-dns.com',
              proxied: true,
            }),
            method: 'POST',
          }
        )
      );

      if (error || !res)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          cause: error,
        });

      return {
        message: 'Subdomain created on cloudflare',
      };
    }),
});

export type CloudflareRouter = typeof cloudflareRouter;

import { router, privateProcedure } from '~/server/trpc';
import { z } from 'zod';
import { tryCatch } from '~/lib/helpers/try-catch';
import { env } from '~/env.mjs';
import { TRPCError } from '@trpc/server';

export const vercelRouter = router({
  checkDomain: privateProcedure
    .input(z.object({ domain: z.string() }))
    .mutation(async ({ input }) => {
      const { domain } = input;

      const [res, error] = await tryCatch(
        fetch(`https://api.vercel.com/v6/domains/${domain}/config`, {
          headers: {
            Authorization: `Bearer ${env.VERCEL_TOKEN}`,
          },
          method: 'get',
        })
      );

      if (error || !res)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: error });

      const [data, errorParsing]: [
        {
          configuredBy?: ('CNAME' | 'A' | 'http') | null;
          acceptedChallenges?: ('dns-01' | 'http-01')[];
          misconfigured: boolean;
        },
        any
      ] = await tryCatch(res.json());

      if (errorParsing)
        throw new TRPCError({ code: 'BAD_REQUEST', cause: errorParsing });

      return {
        ...data,
        isConfigured: !!data.configuredBy && !data.misconfigured,
      };
    }),
});

export type VercelRouter = typeof vercelRouter;

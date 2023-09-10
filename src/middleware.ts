import { authMiddleware } from '@clerk/nextjs';
import { paths } from './lib/constants/paths';

export default authMiddleware({
  publicRoutes: ['/(api|trpc)(.*)', paths.home, paths.newPost],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

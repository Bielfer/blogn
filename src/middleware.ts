import { authMiddleware } from '@clerk/nextjs';
import { paths } from './constants/paths';

export default authMiddleware({
  publicRoutes: [paths.home, paths.newPost],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

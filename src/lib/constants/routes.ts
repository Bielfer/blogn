export const routes = {
  appHome: '/',
  appPosts: '/posts',
  appNewPost: '/posts/new',
  appSignIn: '/sign-in',
  appSignUp: '/sign-up',
} as const;

export const dashboardRoutes = [
  { name: 'Posts', href: routes.appPosts },
] as const;

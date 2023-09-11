export const routes = {
  appHome: '/',
  appPosts: '/posts',
  appPostEditor: '/posts/editor',
  appSignIn: '/sign-in',
  appSignUp: '/sign-up',
} as const;

export const dashboardRoutes = [
  { name: 'Posts', href: routes.appPosts },
] as const;

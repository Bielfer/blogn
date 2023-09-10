export const routes = {
  home: '/',
  posts: '/posts',
  newPost: '/posts/new',
  signIn: '/sign-in',
  signUp: '/sign-up',
} as const;

export const dashboardRoutes = [{ name: 'Posts', href: routes.posts }] as const;

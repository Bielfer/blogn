export const routes = {
  appHome: '/',
  appPosts: '/posts',
  appPostEdit: (postId: string) => `/posts/${postId}`,
  appSignIn: '/sign-in',
  appSignUp: '/sign-up',
} as const;

export const dashboardRoutes = [
  { name: 'Posts', href: routes.appPosts },
] as const;

export const routes = {
  appHome: '/',
  appPosts: '/posts',
  appPostEdit: (postId: string) => `/posts/${postId}`,
  appSignIn: '/sign-in',
  appSignUp: '/sign-up',
  appBlogsNew: '/blogs/new',
  appBlogsNewFirst: '/blogs/new/first',
  appBlogsSettings: '/blogs/settings',
} as const;

export const dashboardRoutes = [
  { name: 'Posts', href: routes.appPosts },
  { name: 'Settings', href: routes.appBlogsSettings },
] as const;

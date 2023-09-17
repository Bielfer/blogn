export const routes = {
  appHome: '/',
  appPosts: '/posts',
  appPostEdit: (postId: string) => `/posts/${postId}`,
  appSignIn: '/sign-in',
  appSignUp: '/sign-up',
  appBlogsNew: '/blogs/new',
  appBlogsNewFirst: '/blogs/new/first',
  appBlogsSettings: '/blogs/settings',
  appCategories: '/categories',
  appCategoriesNew: '/categories/new',
  appCategoriesEdit: (categoryId: string) => `/categories/${categoryId}`,
} as const;

export const dashboardRoutes = [
  { name: 'Posts', href: routes.appPosts },
  { name: 'Categories', href: routes.appCategories },
  { name: 'Settings', href: routes.appBlogsSettings },
] as const;

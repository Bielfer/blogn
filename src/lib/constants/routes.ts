export const routes = {
  appHome: '/',
  appPosts: '/posts',
  appPostEdit: (postId: string) => `/posts/${postId}`,
  appSignIn: '/sign-in',
  appSignUp: '/sign-up',
  appBlogsNew: '/blogs/new',
  appBlogsNewFirst: '/blogs/new/first',
  appBlogsSettings: '/blogs/settings',
  appBlogsSettingsDomains: '/blogs/settings/domains',
  appBlogsSettingsDomainsEdit: '/blogs/settings/domains/edit',
  appCategories: '/categories',
  appCategoriesNew: '/categories/new',
  appCategoriesEdit: (categoryId: string) => `/categories/${categoryId}`,
  blogHome: '/',
  blogPost: (postId: string) => `/${postId}`,
  blogCategories: (categoryName: string) => `/categories/${categoryName}`,
} as const;

export const dashboardRoutes = [
  { name: 'Posts', href: routes.appPosts },
  { name: 'Categories', href: routes.appCategories },
  { name: 'Settings', href: routes.appBlogsSettings },
] as const;

export const settingsRoutes = [
  { name: 'General', href: routes.appBlogsSettings },
  { name: 'Domains', href: routes.appBlogsSettingsDomains },
];

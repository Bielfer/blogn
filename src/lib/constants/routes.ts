export const routes = {
  appHome: '/',
  appFeatures: '#features',
  appPricing: '#pricing',
  appPosts: '/posts',
  appPostEdit: (postId: string) => `/posts/${postId}`,
  appSignIn: '/sign-in',
  appSignUp: '/sign-up',
  appBlogsNew: '/blogs/new',
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

export const blogPosts = {
  domainSetup: 'https://blog.blogn.io/how-to-set-up-your-own-domain-on-blogn',
};

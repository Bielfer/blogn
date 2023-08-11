const paths = {
  home: '/',
  posts: '/posts',
  newPost: '/posts/new',
  signIn: '/sign-in',
  signUp: '/sign-up',
} as const;

export const dashboardPaths = [{ name: 'Posts', href: paths.posts }];

export { paths };

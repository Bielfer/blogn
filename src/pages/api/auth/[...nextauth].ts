/* eslint @typescript-eslint/no-unsafe-assignment:off */
import NextAuth from 'next-auth';
import { authOptions } from '~/server/auth';

export default NextAuth(authOptions);

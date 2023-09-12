/* eslint @typescript-eslint/no-unused-vars:off */
import { db } from '~/services/firebase/admin';
import { collections } from '../constants/firebase';

export const getPostById = (id: string) =>
  db.collection(collections.posts).doc(id).get();

import { db } from '~/services/firebase/admin';
import { collections } from '../constants/firebase';

export const getPostById = (id: string) =>
  db.collection(collections.posts).doc(id).get();

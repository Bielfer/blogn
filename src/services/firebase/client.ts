import { getApps, initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  setPersistence,
  inMemoryPersistence,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { env } from '~/env.mjs';

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_API_KEY,
  authDomain: env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_APP_ID,
};

export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
setPersistence(auth, inMemoryPersistence);

export const googleProvider = new GoogleAuthProvider();

export const storage = getStorage(app);

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { env } from '~/env.mjs';

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(JSON.parse(env.FIREBASE_SERVICE_ACCOUNT)),
        storageBucket: env.NEXT_PUBLIC_STORAGE_BUCKET,
      })
    : getApps()[0]!;

export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app).bucket();

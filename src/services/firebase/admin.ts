import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { env } from '~/env.mjs';

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(JSON.parse(env.FIREBASE_SERVICE_ACCOUNT)),
      })
    : getApps()[0]!;

export const db = getFirestore(app);

export const auth = getAuth(app);

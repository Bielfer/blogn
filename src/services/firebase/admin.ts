import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { env } from "~/env.mjs";

if (getApps().length === 0)
  initializeApp({
    credential: cert(JSON.parse(env.FIREBASE_SERVICE_ACCOUNT)),
  });

export const db = getFirestore();

export const auth = getAuth();

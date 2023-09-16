/* eslint @typescript-eslint/ban-ts-comment:off */
import {
  type CollectionReference,
  type DocumentData,
} from 'firebase-admin/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '~/services/firebase/client';
import { type ObjectValues } from '~/types/core';
import { type BaseDocument } from '~/types/firebase';
import { type bucketPaths } from '../constants/firebase';
import { v4 as uuidv4 } from 'uuid';

export const conditionalWheres = (
  docRef: CollectionReference<DocumentData>,
  wheres: [string, FirebaseFirestore.WhereFilterOp, any][]
) => {
  let conditionalDocRef:
    | FirebaseFirestore.Query<DocumentData>
    | CollectionReference<DocumentData> = docRef;

  for (const [key, condition, value] of wheres) {
    if (!value) continue;

    conditionalDocRef = conditionalDocRef.where(key, condition, value);
  }

  return conditionalDocRef as FirebaseFirestore.Query<DocumentData>;
};

export const formatDocument = <T>(
  snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
) => {
  const formattedDocument = {
    ...snapshot.data(),
    id: snapshot.id,
    createdAt: snapshot.createTime?.toDate(),
    updatedAt: snapshot.updateTime?.toDate(),
  } as BaseDocument<T>;

  for (const [key, value] of Object.entries(formattedDocument)) {
    if (isTimestamp(value)) {
      // @ts-ignore
      formattedDocument[key as keyof typeof formattedDocument] = (
        formattedDocument[
          key as keyof typeof formattedDocument
        ] as unknown as FirebaseFirestore.Timestamp
      ).toDate();
    }
  }

  return formattedDocument;
};

export const snapshotToArray = <T>(
  snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
) => {
  const docs: BaseDocument<T>[] = [];

  snapshot.forEach((doc) => docs.push(formatDocument<T>(doc)));

  return docs;
};

export const isTimestamp = (timestamp: any) =>
  typeof timestamp === 'object' &&
  (('seconds' in timestamp && 'nanoseconds' in timestamp) ||
    ('_seconds' in timestamp && '_nanoseconds' in timestamp));

export const uploadFile = async (
  file: Blob,
  path: ObjectValues<typeof bucketPaths>
) => {
  const storageRef = ref(storage, `${path}/${uuidv4()}`);

  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  return { url };
};

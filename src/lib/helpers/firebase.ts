/* eslint @typescript-eslint/ban-ts-comment:off */
import {
  type CollectionReference,
  type DocumentData,
} from 'firebase-admin/firestore';
import { type BaseDocument } from '~/types/firebase';
import { tryCatch } from './try-catch';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '~/services/firebase/client';

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

export const uploadFile = async ({
  signedUrl,
  file,
  fileName,
}: {
  signedUrl?: string | null;
  file: Blob;
  fileName?: string;
}) => {
  if (!signedUrl) return null;

  const [, error] = await tryCatch(
    fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    })
  );

  if (error) return null;

  const [downloadUrl, errorDownloadUrl] = await tryCatch(
    getDownloadURL(ref(storage, fileName))
  );

  if (errorDownloadUrl || !downloadUrl) return null;

  return downloadUrl;
};

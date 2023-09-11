import {
  type CollectionReference,
  type DocumentData,
} from 'firebase-admin/firestore';
import { type BaseDocument } from '~/types/firebase';

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
  return {
    ...snapshot.data(),
    id: snapshot.id,
    createdAt: snapshot.createTime?.toDate(),
    updatedAt: snapshot.updateTime?.toDate(),
  } as BaseDocument<T>;
};

export const snapshotToArray = <T>(
  snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
) => {
  const docs: BaseDocument<T>[] = [];

  snapshot.forEach((doc) => docs.push(formatDocument<T>(doc)));

  return docs;
};

export const keyRemover = <Obj extends object, Key extends keyof Obj>(
  obj: Obj,
  keys: Key[]
) => {
  const objCopy = { ...obj };

  for (const key of keys) {
    delete objCopy[key];
  }

  return objCopy as Omit<Obj, Key>;
};

export const keyPicker = <Obj extends object, Key extends keyof Obj>(
  obj: Obj,
  keys: Key[]
) => {
  const objCopy = {} as Record<Key, Obj[Key]>;

  for (const key of keys) {
    objCopy[key] = obj[key];
  }

  return objCopy;
};

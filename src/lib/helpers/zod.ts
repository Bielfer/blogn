import { z } from 'zod';

export const zodValidator =
  <T extends z.ZodTypeAny>(schema: T) =>
  (values: Record<string, any>) => {
    const valuesCopy = { ...values };

    Object.entries(valuesCopy).forEach(([key, value]) => {
      if (value === '') valuesCopy[key] = undefined;
    });

    const parse = schema.safeParse(valuesCopy);

    if (parse.success) return {};

    const { fieldErrors } = parse.error.flatten();
    const errors: Record<string, any> = {};

    Object.keys(fieldErrors).forEach((errorKey) => {
      errors[errorKey] = fieldErrors[errorKey]?.[0];
    });

    return errors;
  };

export const getCreateSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) =>
  schema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const getUpdateSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) =>
  schema
    .omit({
      createdAt: true,
      updatedAt: true,
    })
    .partial()
    .extend({ id: z.string() });

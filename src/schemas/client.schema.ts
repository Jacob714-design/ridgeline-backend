import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1).max(100),
  address: z.string().min(1).max(500),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/),
  email: z.string().email(),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
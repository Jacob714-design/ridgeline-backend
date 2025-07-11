import { z } from 'zod';
import { ClaimStatus } from '@prisma/client';

export const createClaimSchema = z.object({
  clientId: z.string(),
  insuranceCompany: z.string().min(1).max(100),
  claimNumber: z.string().min(1).max(50),
  status: z.nativeEnum(ClaimStatus).optional(),
});

export const updateClaimSchema = z.object({
  insuranceCompany: z.string().min(1).max(100).optional(),
  status: z.nativeEnum(ClaimStatus).optional(),
});

export type CreateClaimInput = z.infer<typeof createClaimSchema>;
export type UpdateClaimInput = z.infer<typeof updateClaimSchema>;
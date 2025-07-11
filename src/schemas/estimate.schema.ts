import { z } from 'zod';

export const estimateLineItemSchema = z.object({
  description: z.string().min(1),
  unitPrice: z.number().positive(),
  quantity: z.number().positive(),
  codeRef: z.string().optional(),
  manufacturerRef: z.string().optional(),
  approvalProbability: z.number().min(0).max(1).optional(),
});

export const generateEstimateSchema = z.object({
  specsSelected: z.array(z.string()),
  codeInfo: z.object({
    jurisdiction: z.string(),
    codes: z.array(z.string()),
  }),
  missingTrades: z.array(z.string()).optional(),
});

export const updateLineItemSchema = estimateLineItemSchema.partial();

export type EstimateLineItemInput = z.infer<typeof estimateLineItemSchema>;
export type GenerateEstimateInput = z.infer<typeof generateEstimateSchema>;
export type UpdateLineItemInput = z.infer<typeof updateLineItemSchema>;
import { z } from "zod";

// ═══════════════════════════════════════════════════
// ENTITIES — what the backend RETURNS
// Match backend response shapes exactly
// ═══════════════════════════════════════════════════

export type Service = {
  id: string;
  name: string;
  description: string | null;
  durationMins: number;
  price: number;
  buffer: number;
  isActive: boolean;
};

// ═══════════════════════════════════════════════════
// ZOD SCHEMAS — for forms (input validation)
// ═══════════════════════════════════════════════════

// Service form (matches backend ServiceDto exactly — durationMins, not duration)
export const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  durationMins: z.number().min(1, "Duration is required"),
  price: z.number().min(1, "Price is required"),
  buffer: z.number().min(0),
  isActive: z.boolean(),
});

export type ServiceFormInputs = z.infer<typeof serviceSchema>;

import { z } from "zod";

/**
 * Zod schema for creating a credential.
 * - name: string, max 30 chars
 * - value: string, max 500 chars
 */
export const createCredentialSchema = z.object({
  name: z.string().max(30),
  value: z.string().max(500),
});

/**
 * Type for createCredentialSchema
 */
export type CreateCredentialSchemaType = z.infer<typeof createCredentialSchema>;

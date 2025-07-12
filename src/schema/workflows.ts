import { z } from "zod";

/**
 * Zod schema for creating a workflow.
 * - name: string, max 50 chars
 * - description: string, max 80 chars, optional
 */
export const createWorkflowSchema = z.object({
  name: z.string().max(50),
  description: z.string().max(80).optional(),
});

/**
 * Type for createWorkflowSchema
 */
export type CreateWorkflowSchemaType = z.infer<typeof createWorkflowSchema>;

/**
 * Zod schema for duplicating a workflow (extends createWorkflowSchema with workflowId).
 */
export const duplicateWorkflowSchema = createWorkflowSchema.extend({
  workflowId: z.string(),
});

/**
 * Type for duplicateWorkflowSchema
 */
export type DuplicateWorkflowSchemaType = z.infer<
  typeof duplicateWorkflowSchema
>;

import prisma from "src/lib/prisma";
import { WorkflowVersion } from "@prisma/client";

export async function getWorkflowVersions(
  workflowId: string,
): Promise<WorkflowVersion[]> {
  return prisma.workflowVersion.findMany({
    where: { workflowId },
    orderBy: { version: "desc" },
  });
}

"use server";

import { calculateWorkflowCost } from "src/lib/helper";
import prisma from "src/lib/prisma";
import { AppNode, TaskType, WorkflowStatus } from "src/lib/types";
import { createWorkflowNode } from "src/lib/workflow/create-workflow-node";
import { flowToExecutionPlan } from "src/lib/workflow/execution-plan";
import {
  createWorkflowSchema,
  CreateWorkflowSchemaType,
  DuplicateWorkflowSchemaType,
} from "src/schema/workflows";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import parser from "cron-parser";

export async function getWorkflowsForUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }
  return prisma.workflow.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createWorkflow(form: CreateWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const initWorkflow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };
  initWorkflow.nodes.push(createWorkflowNode(TaskType.LAUNCH_BROWSER));
  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initWorkflow),
      ...data,
    },
  });
  if (!result) {
    throw new Error("Failed to create workflow");
  }

  redirect(`/app/workflow/editor/${result.id}`);
}

export async function deleteWorkflow(workflowId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await prisma.workflow.delete({
    where: {
      userId,
      id: workflowId,
    },
  });

  revalidatePath("/app/workflow");
}

export async function updateWorkFlow({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const workflow = await prisma.workflow.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not draft");
  }

  await prisma.workflow.update({
    data: {
      definition,
    },
    where: {
      id,
      userId,
    },
  });
  revalidatePath("/app/workflow");
}

export async function getWorkflowExecutionWithPhases(executionId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return prisma.workflowExecution.findUnique({
    where: { id: executionId, userId },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
}

export async function getWorkflowPhaseDetails(phaseId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: {
        userId,
      },
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });
}

export async function getWorkflowExecutions(workflowId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return await prisma.workflowExecution.findMany({
    where: {
      workflowId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function publishWorkflow({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }
  console.log("[publishWorkflow] userId:", userId, "workflowId:", id);
  const workflow = await prisma.workflow.findFirst({
    where: {
      id,
      userId,
    },
    include: { versions: true },
  });
  console.log(
    "[publishWorkflow] found workflow:",
    workflow?.id,
    workflow?.status,
  );
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not draft");
  }
  const flow = JSON.parse(flowDefinition);
  const result = flowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("Flow definition not valid");
  }
  if (!result.executionPlan) {
    throw new Error("Something went wrong, No execution plan generated");
  }
  const creditsCost = calculateWorkflowCost(flow.nodes);
  // Find the next version number
  const nextVersion =
    (workflow.versions.length > 0
      ? Math.max(...workflow.versions.map((v) => v.version))
      : 0) + 1;
  // Create WorkflowVersion
  const versionRecord = await prisma.workflowVersion.create({
    data: {
      workflowId: id,
      version: nextVersion,
      definition: flowDefinition,
    },
  });
  // Update Workflow with publishedVersionId and status
  await prisma.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      status: WorkflowStatus.PUBLISHED,
      publishedVersionId: versionRecord.id,
    },
  });
  const updated = await prisma.workflow.findUnique({ where: { id, userId } });

  revalidatePath(`/app/workflow/editor/${id}`);
}

export async function unPublishWorkflow(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }
  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("Workflow is not published");
  }
  await prisma.workflow.update({
    where: {
      id: workflow.id,
      userId,
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
      publishedVersionId: null,
    },
  });
  //const updated = await prisma.workflow.findUnique({ where: { id, userId } });

  revalidatePath(`/app/workflow/editor/${id}`);
}

export async function updateWorkFlowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    const interval = parser.parse(cron);
    await prisma.workflow.update({
      where: {
        id,
        userId,
      },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error: any) {
    console.error(error.message);
    throw new Error("Invalid cron expression");
  }
  revalidatePath("/app/workflow");
}

export async function removeWorkflowSchedule(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }
  await prisma.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      cron: null,
      nextRunAt: null,
    },
  });
  revalidatePath("/app/workflow");
}

export async function duplicateWorkflow(form: DuplicateWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const sourceWorkflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: form.workflowId,
    },
  });

  if (!sourceWorkflow) {
    throw new Error("Workflow not found");
  }

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      name: data.name,
      description: data.description,
      definition: sourceWorkflow.definition as string,
    },
  });
  if (!result) {
    throw new Error("Failed to duplicate workflow");
  }

  redirect("/app/workflow/editor/" + result.id);
}

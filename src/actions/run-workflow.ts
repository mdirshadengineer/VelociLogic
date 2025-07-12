"use server";

import prisma from "src/lib/prisma";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus,
} from "src/lib/types";
import { executeWorkflow } from "src/lib/workflow/execute-workflow";
import { flowToExecutionPlan } from "src/lib/workflow/execution-plan";
import { TaskRegistry } from "src/lib/workflow/task/registry";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function runWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("You must be signed in to execute a workflow.");

  const { workflowId, flowDefinition } = form;
  if (!workflowId) throw new Error("No workflowId provided.");

  // Find the workflow for this user and id (allow both DRAFT and PUBLISHED)
  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId, userId },
  });
  if (!workflow) throw new Error("Workflow not found or access denied.");

  let executionPlan: WorkflowExecutionPlan;
  let workflowDefinition = flowDefinition;

  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error("No execution plan found in published workflow.");
    }
    executionPlan = JSON.parse(workflow.executionPlan);
    workflowDefinition = workflow.definition as string;
  } else if (workflow.status === WorkflowStatus.DRAFT) {
    if (!flowDefinition) {
      throw new Error("No flow definition provided for draft workflow.");
    }
    const flow = JSON.parse(flowDefinition);
    const result = flowToExecutionPlan(flow.nodes, flow.edges);
    if (result.error) throw new Error("Flow definition is not valid.");
    if (!result.executionPlan) throw new Error("No execution plan generated.");
    executionPlan = result.executionPlan;
  } else {
    throw new Error("Workflow must be either PUBLISHED or DRAFT to execute.");
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) =>
          phase.nodes.flatMap((node) => ({
            userId,
            status: ExecutionPhaseStatus.CREATED,
            number: phase.phase,
            node: JSON.stringify(node),
            name: TaskRegistry[node.data.type].label,
          })),
        ),
      },
    },
    select: { id: true, phases: true },
  });

  if (!execution) throw new Error("Workflow execution could not be created.");

  // Start execution in background
  executeWorkflow(execution.id);

  redirect(`/app/workflow/runs/${workflowId}/${execution.id}`);
}

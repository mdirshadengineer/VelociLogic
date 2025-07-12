import "server-only";
import prisma from "../prisma";
import {
  AppNode,
  Enviornment,
  ExecutionEnviornment,
  ExecutionPhaseStatus,
  LogCollector,
  TaskParamType,
  WorkflowExecutionStatus,
} from "../types";
import { ExecutionPhase } from "@prisma/client";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { createLogCollector } from "src/lib/log";

/**
 * Executes a workflow by running all its phases in order.
 * Handles initialization, phase execution, and cleanup.
 * @param executionId - The workflow execution ID
 * @param nextRunAt - Optional next run time for scheduling
 */
export async function executeWorkflow(executionId: string, nextRunAt?: Date) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });
  if (!execution) {
    throw new Error("Execution not found");
  }
  const edges = JSON.parse(execution.definition as string).edges as Edge[];
  const enviornment: Enviornment = { phases: {} };
  await initializeWorkflowExecution(
    executionId,
    execution.workflowId,
    nextRunAt,
  );
  await initializePhaseStatues(execution);
  let executionFailed = false;
  let creditsConsumed = 0;
  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(
      phase,
      enviornment,
      edges,
      execution.userId,
    );
    creditsConsumed += phaseExecution.creditsConsumed;
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }
  await finalizeWorkflowExecution(
    executionId,
    executionFailed,
    creditsConsumed,
  );
  await cleanupEnviornment(enviornment);
}

/**
 * Initializes workflow execution and updates workflow status.
 */
async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
  nextRunAt?: Date,
) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: { startedAt: new Date(), status: WorkflowExecutionStatus.RUNNING },
  });
  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
      ...(nextRunAt && { nextRunAt }),
    },
  });
}

/**
 * Sets all phases to PENDING status at the start of execution.
 */
async function initializePhaseStatues(execution: any) {
  await prisma.executionPhase.updateMany({
    where: { id: { in: execution.phases.map((phase: any) => phase.id) } },
    data: { status: ExecutionPhaseStatus.PENDING },
  });
}

/**
 * Finalizes workflow execution, updating status and credits.
 */
async function finalizeWorkflowExecution(
  executionId: string,
  executionFailed: boolean,
  creditsConsumed: number,
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });
}

/**
 * Executes a single workflow phase, handling credits and logging.
 */
async function executeWorkflowPhase(
  phase: ExecutionPhase,
  enviornment: Enviornment,
  edges: Edge[],
  userId: string,
) {
  const startedAt = new Date();
  const logCollector = createLogCollector();
  const node = JSON.parse(phase.node) as AppNode;
  setupEnviornmentForPhase(node, enviornment, edges);
  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(enviornment.phases[node.id].inputs),
    },
  });
  const creditsRequired = TaskRegistry[node.data.type].credits;
  let success = await decrementCredits(userId, creditsRequired, logCollector);
  const creditsConsumed = success ? creditsRequired : 0;
  if (success) {
    // Only execute phase if credits are available and deducted
    success = await executePhase(phase, node, enviornment, logCollector);
  }
  const outputs = enviornment.phases[node.id].outputs;
  await finalizePhase(
    phase.id,
    success,
    outputs,
    creditsConsumed,
    logCollector,
  );
  return { success, creditsConsumed };
}

/**
 * Finalizes a phase, updating status, outputs, credits, and logs.
 */
async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: Record<string, string>,
  creditsConsumed: number,
  logCollector: LogCollector,
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;
  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            timestamp: log.timeStamp,
            logLevel: log.level,
          })),
        },
      },
    },
  });
}

/**
 * Executes the logic for a single phase using the appropriate executor.
 */
async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  enviornment: Enviornment,
  logCollector: LogCollector,
): Promise<boolean> {
  const runFc = ExecutorRegistry[node.data.type];
  if (!runFc) {
    logCollector.error(`Executor not found for ${node.data.type}`);
    return false;
  }
  const executionEnviornment: ExecutionEnviornment<any> =
    createExecutionEnviornment(node, enviornment, logCollector);
  return await runFc(executionEnviornment);
}

/**
 * Sets up the environment for a phase, wiring up inputs from user or previous nodes.
 */
function setupEnviornmentForPhase(
  node: AppNode,
  enviornment: Enviornment,
  edges: Edge[],
) {
  enviornment.phases[node.id] = { inputs: {}, outputs: {} };
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSE_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      enviornment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }
    // Input value comes from output of previous node
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name,
    );
    if (!connectedEdge) {
      console.error(
        "Missing edge for input ",
        input.name,
        " node.id: ",
        node.id,
      );
    }
    const outputValue =
      enviornment.phases[connectedEdge!.source].outputs[
        connectedEdge!.sourceHandle!
      ];
    enviornment.phases[node.id].inputs[input.name] = outputValue;
  }
}

/**
 * Creates the execution environment object for a phase.
 */
function createExecutionEnviornment(
  node: AppNode,
  enviornment: Enviornment,
  logCollector: LogCollector,
): ExecutionEnviornment<any> {
  return {
    getInput: (name: string) => enviornment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) => {
      enviornment.phases[node.id].outputs[name] = value;
    },
    getBrowser: () => enviornment.browser,
    setBrowser: (browser: Browser) => {
      enviornment.browser = browser;
    },
    setPage: (page: Page) => (enviornment.page = page),
    getPage: () => enviornment.page,
    log: logCollector,
  };
}

/**
 * Cleans up the environment, closing the browser if open.
 */
async function cleanupEnviornment(enviornment: Enviornment) {
  if (enviornment.browser) {
    await enviornment.browser.close().catch((err) => {
      console.log("Cannot close browser, reason:", err);
    });
  }
}

/**
 * Attempts to decrement user credits. Returns true if successful, false if insufficient balance.
 */
async function decrementCredits(
  userId: string,
  amount: number,
  logCollector: LogCollector,
) {
  try {
    await prisma.userBalance.update({
      where: {
        userId,
        credits: {
          gte: amount,
        },
      },
      data: {
        credits: { decrement: amount },
      },
    });
    return true;
  } catch (error) {
    logCollector.error("Insufficient balance");
    return false;
  }
}

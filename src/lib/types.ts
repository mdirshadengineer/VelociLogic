import React from "react";
import { Node } from "@xyflow/react";
import { LucideProps } from "lucide-react";
import { Browser, Page } from "puppeteer";

/**
 * Workflow status values.
 */
export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

/**
 * Supported workflow task types.
 */
export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
  FILL_INPUT = "FILL_INPUT",
  CLICK_ELEMENT = "CLICK_ELEMENT",
  WAIT_FOR_ELEMENT = "WAIT_FOR_ELEMENT",
  DELIVER_VIA_WEBHOOK = "DELIVER_VIA_WEBHOOK",
  EXTRACT_DATA_WITH_AI = "EXTRACT_DATA_WITH_AI",
  READ_PROPERTY_FROM_JSON = "READ_PROPERTY_FROM_JSON",
  ADD_PROPERTY_TO_JSON = "ADD_PROPERTY_TO_JSON",
  NAVIGATE_URL = "NAVIGATE_URL",
  SCROLL_TO_ELEMENT = "SCROLL_TO_ELEMENT",
  EXECUTE_JAVASCRIPT = "EXECUTE_JAVASCRIPT",
  CODE_BLOCK = "CODE_BLOCK",
}

/**
 * Supported parameter types for tasks.
 */
export enum TaskParamType {
  STRING = "STRING",
  BROWSE_INSTANCE = "BROWSE_INSTANCE",
  SELECT = "SELECT",
  CREDENTIAL = "CREDENTIAL",
}

/**
 * Validation errors for flow to execution plan.
 */
export enum FlowToExecutionPlanValidationError {
  NO_ENTRY = "NO_ENTRY",
  INVALID_INPUTS = "INVALID_INPUTS",
}

/**
 * Workflow execution status values.
 */
export enum WorkflowExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

/**
 * Status values for execution phases.
 */
export enum ExecutionPhaseStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CREATED = "CREATED",
}

/**
 * Workflow execution trigger types.
 */
export enum WorkflowExecutionTrigger {
  MANUAL = "MANUAL",
  CRON = "CRON",
}

/**
 * Data for a workflow node.
 */
export interface AppNodeData {
  [key: string]: any;
  type: TaskType;
  inputs: Record<string, string>;
}

/**
 * A node in the workflow graph.
 */
export interface AppNode extends Node {
  data: AppNodeData;
}

/**
 * Parameter definition for a workflow task.
 */
export interface TaskParam {
  name: string;
  type: TaskParamType;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  [key: string]: any;
}

/**
 * Props for a parameter input component.
 */
export interface ParamProps {
  param: TaskParam;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
  disabled?: boolean;
}

/**
 * Definition for a workflow task.
 */
export type WorkflowTask = {
  label: string;
  icon: React.FC<LucideProps>;
  type: TaskType;
  isEntryPoint?: boolean;
  inputs: TaskParam[];
  outputs: TaskParam[];
  credits: number;
};

/**
 * A phase in the workflow execution plan.
 */
export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
};

/**
 * The workflow execution plan (array of phases).
 */
export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

/**
 * Missing inputs for a node.
 */
export type AppNodeMissingInputs = {
  nodeId: string;
  inputs: string[];
};

/**
 * Environment for workflow execution.
 */
export type Enviornment = {
  browser?: Browser;
  page?: Page;
  phases: {
    [key: string]: {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    };
  };
};

/**
 * Supported log levels.
 */
export const LogLevels = ["info", "error"] as const;
export type LogLevel = (typeof LogLevels)[number];

/**
 * Log entry type.
 */
export type Log = { message: string; level: LogLevel; timeStamp: Date };

/**
 * Function signature for logging.
 */
export type LogFunction = (message: string) => void;

/**
 * Log collector interface.
 */
export type LogCollector = {
  getAll(): Log[];
} & {
  [key in LogLevel]: LogFunction;
};

/**
 * Execution environment for a workflow task.
 */
export type ExecutionEnviornment<T extends WorkflowTask> = {
  getInput(name: T["inputs"][number]["name"]): string;
  setOutput(name: T["outputs"][number]["name"], value: string): void;
  getBrowser(): Browser | undefined;
  setBrowser(browser: Browser): void;
  setPage(page: Page): void;
  getPage(): Page | undefined;
  log: LogCollector;
};

/**
 * Period type for analytics.
 */
export type Period = {
  year: number;
  month: number;
};

/**
 * Workflow execution type stats.
 */
export type WorkflowExecutionType = Record<
  string,
  {
    success: number;
    failed: number;
  }
>;

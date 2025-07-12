import React from "react";
import { WorkflowExecutionStatus } from "src/lib/types";
import { cn } from "shared/lib/utils";

const indicatorColors: Record<WorkflowExecutionStatus, string> = {
  COMPLETED: "bg-emerald-600",
  PENDING: "bg-slate-400",
  RUNNING: "bg-yellow-400",
  FAILED: "bg-red-400",
};

interface ExecutionStatusIndicatorProps {
  status: WorkflowExecutionStatus;
}

function ExecutionStatusIndicator({ status }: ExecutionStatusIndicatorProps) {
  return (
    <div
      className={cn("w-2 h-2 rounded-full bg-red-600", indicatorColors[status])}
    />
  );
}

export default ExecutionStatusIndicator;

const labelColors: Record<WorkflowExecutionStatus, string> = {
  COMPLETED: "text-emerald-600",
  PENDING: "text-slate-400",
  RUNNING: "text-yellow-400",
  FAILED: "text-red-400",
};

interface ExecutionStatusLabelProps {
  status: WorkflowExecutionStatus;
}

export function ExecutionStatusLabel({ status }: ExecutionStatusLabelProps) {
  return (
    <span className={cn("lowercase font-semibold", labelColors[status])}>
      {status}
    </span>
  );
}

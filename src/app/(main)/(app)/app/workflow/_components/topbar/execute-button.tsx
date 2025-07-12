"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { Button } from "shared/ui/button";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";
import useExecutionPlan from "src/hooks/use-execution-plan";
import { runWorkflow } from "src/actions/run-workflow";

interface ExecuteButtonProps {
  workflowId: string;
  disabled?: boolean;
}

/**
 * Button to execute the current workflow in the visual editor.
 * Generates the execution plan and triggers the run mutation.
 * @param workflowId - The ID of the workflow to execute
 * @param disabled - Whether the button is disabled
 */
function ExecuteButton({ workflowId, disabled = false }: ExecuteButtonProps) {
  const generateExecutionPlan = useExecutionPlan();
  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.success("Execution Started", { id: "flow-execution" });
    },
    onError: (error: any) => {
      const message =
        error?.message ||
        (typeof error === "string"
          ? error
          : "Something went wrong with execute button.");
      toast.error(message, { id: "flow-execution" });
    },
  });

  const { toObject } = useReactFlow();

  const handleExecute = () => {
    const plan = generateExecutionPlan();
    if (!plan) return;
    toast.success("Starting execution...", { id: "flow-execution" });
    mutation.mutate({
      workflowId,
      flowDefinition: JSON.stringify(toObject()),
    });
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={disabled || mutation.isError}
      onClick={handleExecute}
    >
      <PlayIcon size={16} className="stroke-orange-400" /> Execute
    </Button>
  );
}

export default ExecuteButton;

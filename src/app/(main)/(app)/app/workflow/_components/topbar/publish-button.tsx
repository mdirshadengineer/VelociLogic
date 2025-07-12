"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { Button } from "shared/ui/button";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import useExecutionPlan from "src/hooks/use-execution-plan";
import { publishWorkflow } from "src/actions/workflows";

interface PublishButtonProps {
  workflowId: string;
  disabled?: boolean;
}

/**
 * Button to publish the current workflow in the visual editor.
 * Generates the execution plan and triggers the publish mutation.
 * @param workflowId - The ID of the workflow to publish
 * @param disabled - Whether the button is disabled
 */
function PublishButton({ workflowId, disabled = false }: PublishButtonProps) {
  const generateExecutionPlan = useExecutionPlan();
  const mutation = useMutation({
    mutationFn: publishWorkflow,
    onSuccess: () => {
      toast.success("Workflow published", { id: workflowId });
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Something went wrong with publish button",
        { id: workflowId },
      );
    },
  });

  const { toObject } = useReactFlow();

  const handlePublish = () => {
    const plan = generateExecutionPlan();
    if (!plan) return;
    toast.loading("Publishing workflow...", { id: workflowId });
    mutation.mutate({
      id: workflowId,
      flowDefinition: JSON.stringify(toObject()),
    });
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={disabled || mutation.isError}
      onClick={handlePublish}
    >
      <UploadIcon size={16} className="stroke-green-400" /> Publish
    </Button>
  );
}

export default PublishButton;

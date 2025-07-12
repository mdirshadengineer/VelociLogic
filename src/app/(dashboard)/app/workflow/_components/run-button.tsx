"use client";

import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";
import { runWorkflow } from "src/actions/run-workflow";
import { Button } from "shared/ui/button";

/**
 * Button component to trigger running a workflow.
 * Handles mutation, feedback, and error reporting.
 * @param workflowId - The ID of the workflow to run
 */
function RunButton({ workflowId }: { workflowId: string }) {
  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.success("Workflow started", { id: workflowId });
    },
    onError: (error: any) => {
      toast.error(
        error.message || "Something went wrong with running workflow ",
        { id: workflowId },
      );
    },
  });

  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="flex items-center gap-2"
      onClick={() => {
        toast.success("Scheduling run...", { id: workflowId });
        mutation.mutate({
          workflowId,
        });
      }}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  );
}

export default RunButton;

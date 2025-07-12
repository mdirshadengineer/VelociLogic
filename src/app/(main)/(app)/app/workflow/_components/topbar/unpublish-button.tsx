"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "shared/ui/button";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import { unPublishWorkflow } from "src/actions/workflows";

interface UnPublishButtonProps {
  workflowId: string;
}

/**
 * Button to unpublish a workflow in the visual editor.
 * Triggers the unpublish mutation and provides feedback.
 * @param workflowId - The ID of the workflow to unpublish
 */
function UnPublishButton({ workflowId }: UnPublishButtonProps) {
  const mutation = useMutation({
    mutationFn: unPublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow unpublished", { id: workflowId });
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Something went wrong with unpublish button",
        { id: workflowId },
      );
    },
  });

  const handleUnpublish = () => {
    toast.loading("Unpublishing workflow...", { id: workflowId });
    mutation.mutate(workflowId);
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={mutation.isError}
      onClick={handleUnpublish}
    >
      <DownloadIcon size={16} className="stroke-orange-500" /> Unpublish
    </Button>
  );
}

export default UnPublishButton;

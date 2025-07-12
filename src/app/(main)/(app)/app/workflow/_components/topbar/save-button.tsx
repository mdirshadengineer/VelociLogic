"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { Button } from "shared/ui/button";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { updateWorkFlow } from "src/actions/workflows";

interface SaveButtonProps {
  workflowId: string;
  initialDefinition: string;
  disabled?: boolean;
}

/**
 * Button to save the current workflow definition in the visual editor.
 * Detects changes and enables save only when there are unsaved changes.
 * @param workflowId - The ID of the workflow to save
 * @param initialDefinition - The initial workflow definition for change detection
 * @param disabled - Whether the button is disabled
 */
function SaveButton({
  workflowId,
  initialDefinition,
  disabled = false,
}: SaveButtonProps) {
  const { toObject } = useReactFlow();
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const checkChanges = () => {
      const currentDef = JSON.stringify(toObject());
      setHasChanges(currentDef !== initialDefinition);
    };
    const interval = setInterval(checkChanges, 500);
    return () => clearInterval(interval);
  }, [toObject, initialDefinition]);

  const saveMutation = useMutation({
    mutationFn: updateWorkFlow,
    onSuccess: () => {
      toast.success("Flow saved successfully", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "save-workflow" });
    },
  });

  const handleSave = () => {
    const workflowDef = JSON.stringify(toObject());
    toast.loading("Saving Workflow", { id: "save-workflow" });
    saveMutation.mutate({
      id: workflowId,
      definition: workflowDef,
    });
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleSave}
      disabled={disabled || saveMutation.isPending || !hasChanges}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
}

export default SaveButton;

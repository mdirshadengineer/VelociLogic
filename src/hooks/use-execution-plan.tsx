import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import useFlowValidation from "./use-flow-validation";
import {
  AppNode,
  AppNodeMissingInputs,
  FlowToExecutionPlanValidationError,
} from "src/lib/types";
import { flowToExecutionPlan } from "src/lib/workflow/execution-plan";

/**
 * Hook to generate an execution plan from the current flow state.
 * Handles validation errors and displays user-friendly toasts.
 */
const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { clearErrors, setInvalidInputs } = useFlowValidation();

  const handleError = useCallback(
    (error: {
      type: FlowToExecutionPlanValidationError;
      invalidElements?: AppNodeMissingInputs[];
    }) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationError.NO_ENTRY:
          toast.error("No entry point found");
          break;
        case FlowToExecutionPlanValidationError.INVALID_INPUTS:
          toast.error("Not all input values are set");
          setInvalidInputs(error.invalidElements!);
          break;
        default:
          toast.error(`[Execution Plan Error] ${error.type}`);
          break;
      }
    },
    [setInvalidInputs],
  );

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = flowToExecutionPlan(
      nodes as AppNode[],
      edges,
    );
    if (error) {
      handleError(error);
      return null;
    }
    clearErrors();
    return executionPlan;
  }, [toObject, handleError, clearErrors]);

  return generateExecutionPlan;
};

export default useExecutionPlan;

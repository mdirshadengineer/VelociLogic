import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { AppNodeMissingInputs } from "src/lib/types";

/**
 * Context type for managing invalid workflow node inputs and validation errors.
 */
type FlowValidationContext = {
  invalidInputs: AppNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearErrors: () => void;
};

/**
 * React context for workflow flow validation, providing invalid input state and error clearing.
 */
export const FlowValidationContext =
  createContext<FlowValidationContext | null>(null);

/**
 * Provider for FlowValidationContext, manages invalid input state and exposes error clearing.
 */
export function FlowValidationContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>(
    [],
  );

  const clearErrors = () => setInvalidInputs([]);

  return (
    <FlowValidationContext.Provider
      value={{ invalidInputs, setInvalidInputs, clearErrors }}
    >
      {children}
    </FlowValidationContext.Provider>
  );
}

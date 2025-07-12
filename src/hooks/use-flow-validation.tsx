import { useContext } from "react";
import { FlowValidationContext } from "src/context/flow-validation-context";

/**
 * Custom hook to access the FlowValidationContext.
 * Throws if used outside the provider.
 */
export default function useFlowValidation() {
  const context = useContext(FlowValidationContext);
  if (!context) {
    throw new Error(
      "useFlowValidation must be used within a FlowValidationContextProvider",
    );
  }
  return context;
}

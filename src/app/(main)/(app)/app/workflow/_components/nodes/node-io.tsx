import React from "react";

interface NodeIOProps {
  children: React.ReactNode;
}

/**
 * Wrapper for node input/output sections, adds vertical spacing and dividers.
 * @param children - The input or output elements to render
 */
function NodeIO({ children }: NodeIOProps) {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

export default NodeIO;

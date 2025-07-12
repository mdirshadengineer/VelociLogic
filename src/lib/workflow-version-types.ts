import { WorkflowVersion } from "@prisma/client";

/**
 * Props for a workflow version selector component.
 * @property workflowId - The workflow's unique identifier
 * @property selectedVersion - The currently selected version number
 * @property onSelect - Callback when a version is selected
 * @property versions - List of available workflow versions
 */
export type WorkflowVersionSelectorProps = {
  workflowId: string;
  selectedVersion: number;
  onSelect: (version: number) => void;
  versions: WorkflowVersion[];
};

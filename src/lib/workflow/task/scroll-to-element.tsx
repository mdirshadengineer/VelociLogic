import { TaskParamType, TaskType, WorkflowTask } from "src/lib/types";
import { LucideProps, MouseIcon } from "lucide-react";

/**
 * ScrollToElementTask
 * Defines a workflow task for scrolling to a DOM element.
 * - Inputs: Web page instance, selector
 * - Outputs: Web page instance
 * - Credits: 1
 */
export const ScrollToElementTask = {
  type: TaskType.SCROLL_TO_ELEMENT,
  label: "Scroll to element",
  icon: (props: LucideProps) => (
    <MouseIcon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSE_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSE_INSTANCE,
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;

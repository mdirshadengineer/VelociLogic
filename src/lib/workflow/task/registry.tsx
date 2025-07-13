// Task registry for mapping TaskType to their implementation and metadata.
import { TaskParamType, TaskType, WorkflowTask } from "src/lib/types";
import { LaunchBrowserTask } from "./launch-browser";
import { PageToHtmlTask } from "./page-to-html";
import { ExtractTextFromElementTask } from "./extract-text-from-element";
import { FillInputTask } from "./fill-input";
import { ClickElementTask } from "./click-element";
import { WaitForElementTask } from "./wait-for-element";
import { DeliverViaWebHookTask } from "./deliver-via-webhook";
import { ExtractDataWithAiTask } from "./extract-data-with-ai";
import { ReadPropertyFromJsonTask } from "./read-property-from-json";
import { AddPropertyToJsonTask } from "./add-property-to-json";
import { NavigateUrlTask } from "./navigate-url";
import { ScrollToElementTask } from "./scroll-to-element";
import { CodeIcon } from "lucide-react";

/**
 * Registry mapping each TaskType to its corresponding WorkflowTask implementation.
 * Ensures type safety and centralizes task definitions for workflow execution.
 */
type Registry = {
  [key in TaskType]: WorkflowTask & { type: key };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebHookTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAiTask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
  NAVIGATE_URL: NavigateUrlTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask,
  EXECUTE_JAVASCRIPT: {
    type: TaskType.EXECUTE_JAVASCRIPT,
    label: "Execute JavaScript",
    icon: (props) => <CodeIcon {...props} />,
    isEntryPoint: false,
    inputs: [
      {
        name: "JavaScript Code",
        type: TaskParamType.STRING,
        required: true,
      },
    ],
    outputs: [],
    credits: 1,
  },
  CODE_BLOCK: {
    type: TaskType.CODE_BLOCK,
    label: "Code Block",
    icon: (props) => <CodeIcon {...props} />,
    isEntryPoint: false,
    inputs: [
      {
        name: "Code",
        type: TaskParamType.STRING,
        required: true,
      },
    ],
    outputs: [],
    credits: 1,
  },
};

// Executor registry for mapping TaskType to their executor functions.
import { ExecutionEnviornment, TaskType, WorkflowTask } from "src/lib/types";

import { AddPropertyToJsonExecutor } from "./add-property-to-json-executor";
import { ClickElementExecutor } from "./click-element-executor";
import { DeviverViaWebHookExecutor } from "./deliver-via-webhook-executor";
import { ExtractDataWithAiExecutor } from "./extract-data-with-ai-executor";
import { ExtractTextFromElementExecutor } from "./extract-text-from-element-executor";
import { FillInputExecutor } from "./fill-input-extractor";
import { LaunchBrowserExecutor } from "./launch-browser-executor";
import { NavigateUrlExecutor } from "./navigate-url-executor";
import { PageToHtmlExecutor } from "./page-to-html-executor";
import { ReadPropertyFromJsonExecutor } from "./read-property-from-json-executor";
import { ScrollToElementExecutor } from "./scroll-to-element-executor";
import { WaitForElementExecutor } from "./wait-for-element-executor";

/**
 * Type for executor functions, which run a workflow task in a given environment.
 */
type ExecutorFunction<T extends WorkflowTask> = (
  enviornment: ExecutionEnviornment<T>,
) => Promise<boolean>;

/**
 * Registry mapping each TaskType to its corresponding executor function.
 * Ensures type safety and centralizes executor definitions for workflow execution.
 */
type RegistryType = {
  [key in TaskType]: ExecutorFunction<WorkflowTask & { type: key }>;
};

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeviverViaWebHookExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAiExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
  NAVIGATE_URL: NavigateUrlExecutor,
  SCROLL_TO_ELEMENT: ScrollToElementExecutor,
};

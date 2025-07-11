import { ExecutionEnviornment, TaskType, WorkflowTask } from "src/lib/types";
import { LaunchBrowserExecutor } from "./launch-browser-executor";
import { AddPropertyToJsonExecutor } from "./add-property-to-json-executor";
import { ClickElementExecutor } from "./click-element-executor";
import { DeviverViaWebHookExecutor } from "./deliver-via-webhook-executor";
import { ExtractDataWithAiExecutor } from "./extract-data-with-ai-executor";
import { PageToHtmlExecutor } from "./page-to-html-executor";
import { ExtractTextFromElementExecutor } from "./extract-text-from-element-executor";
import { FillInputExecutor } from "./fill-input-extractor";
import { WaitForElementExecutor } from "./wait-for-element-executor";
import { ReadPropertyFromJsonExecutor } from "./read-property-from-json-executor";
import { NavigateUrlExecutor } from "./navigate-url-executor";
import { ScrollToElementExecutor } from "./scroll-to-element-executor";

type ExecutorFunction<T extends WorkflowTask> = (
  enviornment: ExecutionEnviornment<T>
) => Promise<boolean>;

type RegistryType = {
  [key in TaskType]: ExecutorFunction<WorkflowTask & { type: key }>;
};

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor, // Placeholder for PAGE_TO_HTML executor
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor, // Placeholder for EXTRACT_TEXT_FROM_ELEMENT executor
  FILL_INPUT: FillInputExecutor, // Placeholder for FILL_INPUT executor
  WAIT_FOR_ELEMENT: WaitForElementExecutor, // Placeholder for WAIT_FOR_ELEMENT executor
  DELIVER_VIA_WEBHOOK: DeviverViaWebHookExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAiExecutor, // Placeholder for EXTRACT_DATA_WITH_AI executor
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor, // Placeholder for READ_PROPERTY_FROM_JSON executor
  NAVIGATE_URL: NavigateUrlExecutor, // Placeholder for NAVIGATE_URL executor
  SCROLL_TO_ELEMENT: ScrollToElementExecutor, // Placeholder
};

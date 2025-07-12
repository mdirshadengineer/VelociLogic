import { ExecutionEnviornment } from "src/lib/types";
import { ClickElementTask } from "../task/click-element";

export async function ClickElementExecutor(
  enviornment: ExecutionEnviornment<typeof ClickElementTask>,
): Promise<boolean> {
  try {
    const selector = enviornment.getInput("Selector");
    if (!selector) {
      enviornment.log.error("input -> selector is not defined");
      return false;
    }

    await enviornment.getPage()!.click(selector);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}

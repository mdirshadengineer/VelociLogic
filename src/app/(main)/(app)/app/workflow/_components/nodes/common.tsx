import { TaskParamType } from "src/lib/types";

/**
 * Maps TaskParamType to a Tailwind color class for node handles.
 */
export const ColorForHandle: Record<TaskParamType, string> = {
  BROWSE_INSTANCE: "!bg-sky-400",
  STRING: "!bg-amber-400",
  SELECT: "!bg-rose-400",
  CREDENTIAL: "!bg-tea-400",
};

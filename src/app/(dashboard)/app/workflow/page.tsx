import { Calendar } from "lucide-react";
import CreateWorkflowDialog from "./_components/create-workflow-dialog";
import { Suspense } from "react";
import UserWorkflowSkeleton from "./_components/user-workflow-skeleton";
import UserWorkflows from "./_components/user-workflow";

/** Tell Next.js to execute this file on every request so `new Date()` is always current. */
export const dynamic = "force-dynamic"; //  ⟶ disables static optimisation / caches

/** Utility ─ keeps logic outside the component for clarity */
function getFormattedDate() {
  const now = new Date();

  const day = now.getDate(); // 5
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    now,
  ); // Sat
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(now); // July

  return { day, weekday, month };
}
export default async function WorkflowDashboardPage() {
  const { day, weekday, month } = getFormattedDate();

  return (
    <div id="workflow-dashboard" className="w-full h-full">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-gray-100 p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <section id="">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between  rounded-full px-4 py-2 w-fit gap-6">
              {/* Left Date */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center w-[64px] h-[64px] ring-1 ring-gray-300 dark:ring-gray-800 justify-center rounded-full">
                  <span className="text-2xl font-bold">{day}</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {weekday},
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {month}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-300" />

              {/* Button + Icon */}
              <div className="flex items-center gap-2">
                <button className="bg-[#EB5E28] text-white rounded-full px-4 py-2 flex items-center gap-2 hover:bg-[#d44f1e] transition-all">
                  Show my Tasks
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button className="ring-1 ring-gray-300 dark:ring-gray-800 rounded-full p-4">
                  <Calendar className="h-5 w-5 text-gray-800 dark:text-white" />
                </button>
              </div>
            </div>
            <div>
              {/* Workflow Create button */}
              <CreateWorkflowDialog />
            </div>
          </div>
        </section>
        <section id="">
          <div>
            <div className="h-full py-6">
              {/* Show workflow list */}
              <Suspense fallback={<UserWorkflowSkeleton />}>
                <UserWorkflows />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

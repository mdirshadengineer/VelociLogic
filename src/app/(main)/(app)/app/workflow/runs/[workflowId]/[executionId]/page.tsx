import { getWorkflowExecutionWithPhases } from "src/actions/workflows";

import { Topbar } from "../../../_components/topbar";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import ExecutionViewer from "./_components/execution-viewer";

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await getWorkflowExecutionWithPhases(executionId);

  if (!workflowExecution) {
    return <div>No Found</div>;
  }

  return <ExecutionViewer initialData={workflowExecution} />;
}

export async function ExecutionViewerPage({
  params,
}: {
  params: { executionId: string; workflowId: string };
}) {
  const { workflowId, executionId } = await params;
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        workflowId={workflowId}
        title="Workflow run details"
        subtitle={`Execution Id: ${executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
}

export default ExecutionViewerPage;
import React, { Suspense } from "react";
import prisma from "src/lib/prisma";
import { getWorkflowExecutionWithPhases } from "src/actions/workflows";
import { Topbar } from "../../../_components/topbar";
import { Loader2Icon } from "lucide-react";
import ExecutionViewer from "./_components/execution-viewer";

interface ExecutionViewerWrapperProps {
  executionId: string;
}

async function ExecutionViewerWrapper({
  executionId,
}: ExecutionViewerWrapperProps) {
  const workflowExecution = await getWorkflowExecutionWithPhases(executionId);
  if (!workflowExecution) return <div>Not Found</div>;
  return <ExecutionViewer initialData={workflowExecution} />;
}

interface ExecutionViewerPageProps {
  params: Promise<{ workflowId: string; executionId: string }>;
}

export default async function ExecutionViewerPage({
  params,
}: ExecutionViewerPageProps) {
  const { workflowId, executionId } = await params;
  const versions = await prisma.workflowVersion.findMany({
    where: { workflowId },
    orderBy: { version: "desc" },
  });
  const initialDefinition = versions[0]
    ? typeof versions[0].definition === "string"
      ? versions[0].definition
      : JSON.stringify(versions[0].definition)
    : "";

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        workflowId={workflowId}
        title="Workflow run details"
        subtitle={`Execution Id: ${executionId}`}
        hideButtons
        versions={versions}
        initialDefinition={initialDefinition}
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

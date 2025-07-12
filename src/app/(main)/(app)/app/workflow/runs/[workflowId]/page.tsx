import React, { Suspense } from "react";
import prisma from "src/lib/prisma";
import { getWorkflowExecutions } from "src/actions/workflows";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { Topbar } from "../../_components/topbar";
import ExecutionsTable from "./_components/executions-table";
import { WorkflowVersion } from "@prisma/client";

interface ExecutionsTableWrapperProps {
  workflowId: string;
}

async function ExecutionsTableWrapper({
  workflowId,
}: ExecutionsTableWrapperProps) {
  const executions = await getWorkflowExecutions(workflowId);
  if (!executions) return <div>No executions found</div>;
  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this workflow
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container py-6 w-full">
      <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  );
}

interface ExecutionsPageProps {
  params: Promise<{ workflowId: string }>;
}

export default async function ExecutionsPage({ params }: ExecutionsPageProps) {
  const { workflowId } = await params;
  const versions: WorkflowVersion[] = await prisma.workflowVersion.findMany({
    where: { workflowId },
    orderBy: { version: "desc" },
  });
  const initialDefinition = versions[0]
    ? typeof versions[0].definition === "string"
      ? versions[0].definition
      : JSON.stringify(versions[0].definition)
    : "";

  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        workflowId={workflowId}
        hideButtons
        title="All runs"
        subtitle="List of all your workflows run"
        versions={versions}
        initialDefinition={initialDefinition}
      />
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Loader2Icon size={30} className="animate-spin stroke-primary" />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  );
}

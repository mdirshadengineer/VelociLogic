import React from "react";
import { getWorkflowsForUser } from "src/actions/workflows";
import { AlertCircle, InboxIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "shared/ui/alert";
import CreateWorkflowDialog from "./create-workflow-dialog";
import WorkflowCard from "./workflow-card";

/**
 * Async component to display the user's workflows.
 * Handles loading, empty, and error states.
 */
async function UserWorkflows() {
  const workflows = await getWorkflowsForUser();
  if (!workflows) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later
        </AlertDescription>
      </Alert>
    );
  }
  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center">
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <InboxIcon size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflow created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkflowDialog triggeredText="Create your first workflow" />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      {workflows.map((workflow) => (
        <WorkflowCard workflow={workflow} key={workflow.id} />
      ))}
    </div>
  );
}

export default UserWorkflows;

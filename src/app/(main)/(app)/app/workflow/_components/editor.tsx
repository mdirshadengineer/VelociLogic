"use client";

import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Workflow, WorkflowVersion } from "@prisma/client";
import { Topbar } from "./topbar";
import FlowEditor from "./workflow-editor";
import { FlowValidationContextProvider } from "src/context/flow-validation-context";
import { WorkflowStatus } from "src/lib/types";
import TaskMenu from "./task-menu";

interface EditorProps {
  workflow: Workflow;
  versions: WorkflowVersion[];
}

/**
 * Main editor component for the workflow visual builder.
 * Wraps the editor in context providers and renders the topbar, task menu, and flow editor.
 * @param workflow - The workflow object to edit
 * @param versions - List of workflow versions
 */
function Editor({ workflow, versions }: EditorProps) {
  const isPublished = workflow.status === WorkflowStatus.PUBLISHED;
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <Topbar
            title="Workflow editor"
            subtitle={workflow.name}
            workflowId={workflow.id}
            isPublished={isPublished}
            versions={versions}
            initialDefinition={workflow.definition as string}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} isPublished={isPublished} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
}

export default Editor;

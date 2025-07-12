"use client";

import React, { Fragment } from "react";
import { useRouter } from "next/navigation";
import TooltipWrapper from "shared/tooltip-wrapper";
import { Button } from "shared/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import SaveButton from "./save-button";
import ExecuteButton from "./execute-button";
import NavigationTabs from "./navigation-tabs";
import PublishButton from "./publish-button";
import UnPublishButton from "./unpublish-button";
import { WorkflowVersionSelector } from "./workflow-version-selector";
import { WorkflowVersion } from "@prisma/client";

interface TopbarProps {
  title: string;
  subtitle?: string;
  workflowId: string;
  hideButtons?: boolean;
  isPublished?: boolean;
  versions: WorkflowVersion[];
  initialDefinition: string;
}

/**
 * Topbar component for the workflow editor, including navigation, actions, and version selector.
 * @param title - The workflow title
 * @param subtitle - Optional subtitle
 * @param workflowId - The workflow's unique ID
 * @param hideButtons - Whether to hide action buttons
 * @param isPublished - Whether the workflow is published
 * @param versions - List of workflow versions
 * @param initialDefinition - Initial workflow definition
 */
function Topbar({
  title,
  subtitle,
  workflowId,
  hideButtons = false,
  isPublished = false,
  versions = [],
  initialDefinition,
}: TopbarProps) {
  const router = useRouter();
  React.useEffect(() => {
    if (
      versions.length > 0 &&
      !versions.some((v) => v.workflowId === workflowId)
    ) {
      console.warn(
        `[Topbar] workflowId (${workflowId}) does not match any version.workflowId. Possible executionId mixup.`,
      );
    }
  }, [workflowId, versions]);

  const [selectedVersion, setSelectedVersion] = React.useState<number>(() =>
    Array.isArray(versions) && versions.length > 0 ? versions[0].version : 0,
  );

  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeftIcon size={30} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate text-ellipsis">
              {subtitle} - {workflowId}
            </p>
          )}
        </div>
      </div>
      <NavigationTabs workflowId={workflowId} />
      <div className="flex gap-1 flex-1 justify-end">
        {!hideButtons && (
          <Fragment>
            <ExecuteButton
              workflowId={workflowId}
              disabled={isPublished === false && versions.length === 0}
            />
            {isPublished && <UnPublishButton workflowId={workflowId} />}
            {!isPublished && (
              <Fragment>
                <SaveButton
                  workflowId={workflowId}
                  initialDefinition={initialDefinition}
                  disabled={isPublished}
                />
                <PublishButton workflowId={workflowId} disabled={isPublished} />
              </Fragment>
            )}
            <WorkflowVersionSelector
              workflowId={workflowId}
              selectedVersion={selectedVersion}
              onSelect={setSelectedVersion}
              versions={versions}
            />
          </Fragment>
        )}
      </div>
    </header>
  );
}

export { Topbar };

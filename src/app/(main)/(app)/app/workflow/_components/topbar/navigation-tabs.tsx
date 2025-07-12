"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "shared/ui/tabs";

interface NavigationTabsProps {
  workflowId: string;
}

/**
 * Navigation tabs for switching between workflow editor and runs views.
 * @param workflowId - The workflow's unique ID
 */
function NavigationTabs({ workflowId }: NavigationTabsProps) {
  const pathname = usePathname();
  const activeValue = pathname.split("/")[3];

  return (
    <Tabs className="w-[400px]" value={activeValue}>
      <TabsList className="grid w-full grid-cols-2">
        <Link href={`/app/workflow/editor/${workflowId}`}>
          <TabsTrigger value="editor" className="w-full">
            Editor
          </TabsTrigger>
        </Link>
        <Link href={`/app/workflow/runs/${workflowId}`}>
          <TabsTrigger value="runs" className="w-full">
            Runs
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}

export default NavigationTabs;

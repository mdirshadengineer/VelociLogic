"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavigationTabs({ workflowId }: { workflowId: string }) {
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

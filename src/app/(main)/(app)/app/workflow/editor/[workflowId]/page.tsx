import React from "react";
import prisma from "src/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Editor from "../../_components/editor";

interface WorkflowEditorPageProps {
  params: Promise<{ workflowId: string }>;
}

export default async function WorkflowEditorPage({
  params,
}: WorkflowEditorPageProps) {
  const { workflowId } = await params;
  const { userId } = await auth();

  if (!userId) return <div>Unauthenticated</div>;

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId, userId },
    include: { publishedVersion: true },
  });

  if (!workflow) return <div>Workflow not found</div>;

  const workflowData = workflow.publishedVersion
    ? { ...workflow, ...workflow.publishedVersion, id: workflow.id }
    : workflow;

  const versions = await prisma.workflowVersion.findMany({
    where: { workflowId },
    orderBy: { version: "desc" },
  });
  console.log("Workflow Versions:", versions);

  return <Editor workflow={workflowData} versions={versions} />;
}

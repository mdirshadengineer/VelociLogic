import { notFound, redirect } from "next/navigation";

// We will also show the stats in this module config page

export const modulesRegistry = [
  {
    slug: "process-orchestration",
    label: "Process Orchestration",
    icon: "🔄",
    load: () =>
      import("src/modules/process-orchestration").then((m) => m.ProcessOrchestrationDashboard),
  },
  {
    slug: "form-builder",
    label: "Form Builder",
    icon: "📝",
    load: () =>
      import("src/modules/form-builder").then((m) => m.FormBuilderDashboard),
  }
];

export default async function StudioModuleConfigPage({
  params,
  searchParams
}: {
  params: Promise<{ module: string; }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { module } = await params;
  console.log("Search Params:", await searchParams);
  console.log("Module:", module);
  if (!module) return notFound();
  const mod = modulesRegistry.find((m) => m.slug === module);
  if (!mod) return notFound()
  const ModuleComponent = await mod.load();

  return (
    <div>
      <ModuleComponent />
    </div>
  );
}

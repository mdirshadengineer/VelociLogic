import { notFound } from "next/navigation";

// have to place load data mechanism here
// We will also show the stats in this module config page
export const modulesRegistry = [
  {
    slug: "process-orchestration",
    label: "Process Orchestration",
    icon: "🔄",
    load: () =>
      import("src/modules/process-orchestration").then(
        (m) => m.ProcessOrchestrationModule
      ),
    loadData: (id: string) => {
      return "a2d8a232-e31c-4709-af41-cbcc0bb775af"
    }
  },
  {
    slug: "form-builder",
    label: "Form Builder",
    icon: "📝",
    load: () =>
      import("src/modules/form-builder").then((m) => m.FormBuilderModule),
  },
];

export default async function StudioModulePage({
  params,
  searchParams,
}: {
  params: Promise<{ module: string; entityId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const routeParams = await params;
  const queryParameters = await searchParams;
  if (!routeParams.module) return notFound();
  const mod = modulesRegistry.find((m) => m.slug === routeParams.module);

  console.log("Module:", mod);

  if (!mod) return notFound();

  const ModuleComponent = await mod.load();

  return (
    <div>
      <ModuleComponent
        params={routeParams}
        searchParams={queryParameters}
      />
    </div>
  );
}

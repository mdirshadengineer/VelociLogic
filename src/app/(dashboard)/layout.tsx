import { DashboardAppLayout } from "./_components/dashboard-sidebar";

/**
 * Layout for the dashboard section, wraps content in DashboardAppLayout.
 * @param children - The dashboard content to render
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="dashboard-app-layout">
      <DashboardAppLayout>{children}</DashboardAppLayout>
    </div>
  );
}

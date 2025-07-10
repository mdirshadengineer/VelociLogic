import { DashboardAppLayout } from "./_components/dashboard-sidebar";

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

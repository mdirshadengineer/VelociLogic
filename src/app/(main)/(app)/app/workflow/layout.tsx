import Logo from "shared/logo";
import { ModeToggle } from "shared/theme-toggle";
import { Separator } from "shared/ui/separator";

interface WorkflowLayoutProps {
  children: React.ReactNode;
}

export default function WorkflowLayout({ children }: WorkflowLayoutProps) {
  return (
    <div className="flex flex-col w-full h-screen">
      {children}
      <Separator />
      <footer className="flex items-center justify-between p-2">
        <Logo iconSize={16} fontSize="text-xl" />
        <ModeToggle />
      </footer>
    </div>
  );
}

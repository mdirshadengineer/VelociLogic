export default function StudioParentLayout({ children }: {children: React.ReactNode}) {
  // This component will render the studio layout with a header
  return (
    <div id="app-studio-layout">
      {children}
      {/* Include a search popup mechanism */}
    </div>
  );
}
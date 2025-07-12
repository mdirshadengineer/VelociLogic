import React from "react";

interface MainAppLayoutProps {
  children: React.ReactNode;
}

export default function MainAppLayout({ children }: MainAppLayoutProps) {
  return (
    <div id="main-app-layout">
      {/* Global Header */}
      {children}
    </div>
  );
}

import React from "react";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="main-app-layout">
      {/* Global Header */}
      {children}
    </div>
  );
}

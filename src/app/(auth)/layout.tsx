import type { FC, ReactNode } from "react";

/**
 * Layout component for authentication pages.
 * Centers content vertically and horizontally with padding.
 */
type LayoutProps = { children: ReactNode };

const AuthLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen gap-4 flex items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;

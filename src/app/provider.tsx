"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
import { ThemeProvider } from "src/theme/theme-provider";
import NextTopLoader from "nextjs-toploader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type RootProvidersProps = {
  children: ReactNode;
};

const RootProviders: FC<RootProvidersProps> = (props) => {
  const [queryClient, setQueryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="#10b981" showSpinner={false} />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {props.children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default RootProviders;

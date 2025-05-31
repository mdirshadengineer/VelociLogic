import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "src/app/globals.css";

import { ClerkProvider } from "@clerk/nextjs"
import RootProviders from "./provider";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ['700']
});


export const metadata: Metadata = {
  title: "VelociLogic",
  description: "Automate. Innovate. Elevate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/sign-in"} appearance={{
      elements: {
        formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm !shadow-none"
      }
    }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${figtree.variable} antialiased`}
        >
          <RootProviders>
            <main>
              {children}
            </main>
          </RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}

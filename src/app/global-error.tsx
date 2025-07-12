"use client";

import type NextError from "next/error";
import { Alert, AlertTitle, AlertDescription } from "shared/ui/alert";
import { Button } from "shared/ui/button";
import { Card } from "shared/ui/card";
import { Badge } from "shared/ui/badge";
import { AlertTriangle } from "lucide-react";

// Global error boundary for the entire app
// This page is shown for any uncaught error in the app tree

type GlobalErrorProperties = {
  readonly error: NextError & { digest?: string };
  readonly reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalErrorProperties) => {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full p-8 shadow-xl border border-destructive/30 bg-card flex flex-col items-center">
          <Alert variant="destructive" className="mb-6 w-full">
            <AlertTriangle className="text-destructive" />
            <AlertTitle>Application Error</AlertTitle>
            <AlertDescription>
              Sorry, something went wrong. This error was caught by the global
              error boundary.
              <br />
              Please try again or contact support if the problem persists.
            </AlertDescription>
          </Alert>
          <div className="mb-4 w-full">
            <Badge variant="destructive" className="mb-2">
              Error
            </Badge>
            <div className="text-sm text-muted-foreground break-all">
              {"message" in error ? (error as any).message : "Unknown error"}
            </div>
            {error?.digest && (
              <div className="text-xs text-muted-foreground mt-2 opacity-70">
                Error reference:{" "}
                <span className="font-mono">{error.digest}</span>
              </div>
            )}
          </div>
          <Button
            variant="default"
            onClick={() => reset()}
            className="w-full mt-2"
          >
            Try again
          </Button>
        </Card>
      </body>
    </html>
  );
};

export default GlobalError;

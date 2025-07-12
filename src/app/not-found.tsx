import type { NextPage } from "next";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { Card } from "shared/ui/card";
import { Button } from "shared/ui/button";
import { Badge } from "shared/ui/badge";

const NotFoundPage: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-lg w-full p-10 shadow-xl border border-muted bg-card flex flex-col items-center">
        <Badge variant="secondary" className="mb-4 px-3 py-1 text-base">
          <Search className="mr-2 h-4 w-4" /> 404 Not Found
        </Badge>
        <h1 className="mb-2 text-5xl font-bold text-primary">Page Not Found</h1>
        <p className="mb-6 max-w-md text-muted-foreground text-center">
          Don&apos;t worry, even the best data sometimes gets lost in the
          Internet.
          <br />
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild variant="default" className="w-full max-w-xs mb-2">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <footer className="mt-8 text-center text-xs text-muted-foreground w-full">
          If you believe this is an error, please contact our support team.
        </footer>
      </Card>
    </div>
  );
};

export default NotFoundPage;

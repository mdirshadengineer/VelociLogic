import React from "react";
import { Skeleton } from "shared/ui/skeleton";

/**
 * Skeleton loader for user workflow cards.
 * Renders placeholder skeletons while workflows are loading.
 */
function UserWorkflowSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}

export default UserWorkflowSkeleton;

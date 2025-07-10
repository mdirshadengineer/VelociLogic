import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    return redirect("/app");
  }
  return (
    <div>
      {/* Show content which should be visible to not logged in users */}
      Landing page
    </div>
  );
}

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware((auth, request) => {
  try {
    if (!isPublicRoute(request)) {
      auth.protect();
    }
  } catch (err: any) {
    // Handle NEXT_REDIRECT or other errors gracefully
    if (err && err.message && err.message.includes("NEXT_REDIRECT")) {
      // Let Next.js handle the redirect
      throw err;
    }
    // Optionally log or handle other errors
    return new Response("Authentication error", { status: 401 });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

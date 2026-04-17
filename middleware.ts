import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/book(.*)",
  "/api/webhooks(.*)",
  "/invite/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Redirect authenticated users on "/" to onboarding
  // if (userId && pathname === "/") {
  //   return NextResponse.redirect(new URL("/onboarding", req.url));
  // }

  if (isPublicRoute(req)) return;

  if (!userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // TODO: After building GET /api/me endpoint
  // Check onboardingComplete flag here
  // If false → redirect to /onboarding
  // If true + on /onboarding → redirect to /dashboard
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

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
  const pathname = req.nextUrl.pathname;

  // Public routes — exit early, no auth check needed
  if (isPublicRoute(req)) return;

  const { userId, getToken } = await auth();

  // Not logged in — redirect, no API call needed
  if (!userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const token = await getToken();

  try {
    // Use native fetch — axios is not Edge Runtime compatible
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    const data = await res.json();

    // Rule 1: OWNER + onboarding incomplete
    if (data.role === "OWNER" && !data.onboardingComplete) {
      if (pathname !== "/onboarding") {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
      return;
    }

    // Rule 2: STAFF + profile incomplete
    if (data.role !== "OWNER" && !data.profileComplete) {
      if (pathname !== "/profile/setup") {
        return NextResponse.redirect(new URL("/profile/setup", req.url));
      }
      return;
    }

    // Rule 3: User is fully set up — block them from setup pages
    if (pathname === "/onboarding" || pathname === "/profile/setup") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return;
  } catch {
    // Backend unreachable (not started yet, deploying, etc.) — let the request through
    // The client-side API calls will handle auth errors themselves
    return;
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

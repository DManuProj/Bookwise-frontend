import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import axios from "axios";
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
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Rule 1: OWNER + onboarding incomplete
    if (res.data.role === "OWNER" && !res.data.onboardingComplete) {
      if (pathname !== "/onboarding") {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
      return; // they're on /onboarding, let them stay
    }

    // Rule 2: STAFF + profile incomplet
    if (res.data.role !== "OWNER" && !res.data.profileComplete) {
      if (pathname !== "/profile/setup") {
        return NextResponse.redirect(new URL("/profile/setup", req.url));
      }
      return; // they're on /onboarding, let them stay
    }

    // Rule 3: User is fully set up — block them from setup pages
    if (pathname === "/onboarding" || pathname === "/profile/setup") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return;
  } catch (error) {
    console.error("Middleware /api/me failed:", error);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

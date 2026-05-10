"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SignUpButton, SignInButton, useUser, useClerk } from "@clerk/nextjs";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  LogOut,
  UserCircle,
} from "lucide-react";
import type { Invitation } from "@/types";

const getHoursLeft = (expiresAt: string): number =>
  Math.max(
    0,
    Math.floor((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)),
  );

type Props = {
  invite: Invitation;
  token: string;
};

const InviteAcceptActions = ({ invite, token }: Props) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  const hoursLeft = getHoursLeft(invite.expiresAt);
  const isUrgent = hoursLeft < 6;

  const acceptUrl = `/invite/${token}/accept`;

  return (
    <>
      {/* Expiry */}
      {isUrgent ? (
        <Alert className="bg-amber-500/5 border-amber-500/20 mb-5 py-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
            This invitation expires in{" "}
            <span className="font-semibold">{hoursLeft} hours</span>. Accept
            soon!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex items-center gap-1.5 justify-center mb-5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Expires in{" "}
            <span className="font-medium text-foreground">
              {hoursLeft} hours
            </span>
          </p>
        </div>
      )}

      {/* Accept area — branches on Clerk session */}
      {!isLoaded ? (
        <Skeleton className="h-11 w-full rounded-xl" />
      ) : isSignedIn ? (
        <div className="space-y-3">
          <Alert className="bg-blue-500/5 border-blue-500/20 py-3">
            <UserCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
              You're signed in as{" "}
              <span className="font-semibold">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
              . To accept this invitation, please sign out and use the email it
              was sent to.
            </AlertDescription>
          </Alert>

          <Button
            variant="outline"
            className="w-full rounded-xl h-11 text-sm font-semibold"
            onClick={() => signOut({ redirectUrl: window.location.pathname })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <SignUpButton mode="modal" forceRedirectUrl={acceptUrl}>
            <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl h-11 shadow-sm shadow-brand-500/20 text-sm font-semibold">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Accept Invitation
            </Button>
          </SignUpButton>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <SignInButton mode="modal" forceRedirectUrl={acceptUrl}>
              <button className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
                Sign in instead
              </button>
            </SignInButton>
          </p>
        </div>
      )}

      <Separator className="my-5" />

      <p className="text-center text-xs text-muted-foreground">
        Not expecting this invitation?{" "}
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          Ignore it
        </Link>
      </p>
    </>
  );
};

export default InviteAcceptActions;

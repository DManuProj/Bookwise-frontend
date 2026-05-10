"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useAcceptInvitation } from "@/hooks/api/useInvitation";
import InviteShell from "@/components/invite/InviteShell";
import InviteCard from "@/components/invite/InviteCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, AlertTriangle } from "lucide-react";
import { showErrorToast } from "@/lib/errors";

const InviteAcceptPage = () => {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const {
    mutate: acceptInvitation,
    isPending,
    isError,
    error,
  } = useAcceptInvitation();

  const hasAccepted = useRef(false);

  useEffect(() => {
    if (hasAccepted.current) return;
    if (!isLoaded) return;

    // No Clerk user — nothing to accept with. Send back to invite page.
    if (!user) {
      router.replace(`/invite/${token}`);
      return;
    }

    hasAccepted.current = true;

    acceptInvitation(
      { token, clerkId: user.id },
      {
        onSuccess: () => router.push("/profile/setup"),
      },
    );
  }, [isLoaded, user, token, acceptInvitation, router, signOut]);

  const handleBackNavigation = async () => {
    await signOut({ redirectUrl: `/invite/${token}` });
  };

  // Error state — permanent failure, send them back to the invite page
  if (isError) {
    const message =
      (error as any)?.response?.data?.message ||
      "Something went wrong while accepting your invitation.";

    return (
      <InviteShell>
        <InviteCard accent="red">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">
              Couldn't Accept Invitation
            </h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {message}
            </p>
            <Button
              className="w-full rounded-xl h-11 text-sm font-semibold"
              onClick={() => handleBackNavigation()}
            >
              Back to Invitation
            </Button>
          </div>
        </InviteCard>
      </InviteShell>
    );
  }

  // Loading / accepting state
  return (
    <InviteShell>
      <InviteCard accent="brand">
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-7 w-7 text-brand-500 animate-spin" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            Accepting your invitation
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {!isLoaded || !user
              ? "Setting up your account..."
              : isPending
                ? "Adding you to the team..."
                : "Just a moment..."}
          </p>
        </div>
      </InviteCard>
    </InviteShell>
  );
};

export default InviteAcceptPage;

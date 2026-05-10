"use client";

import { useParams } from "next/navigation";
import { useInvitation } from "@/hooks/api/useInvitation";
import InviteShell from "@/components/invite/InviteShell";
import InviteCard from "@/components/invite/InviteCard";
import InviteValidState from "@/components/invite/InviteValidState";
import InviteExpiredState from "@/components/invite/InviteExpiredState";
import InviteUsedState from "@/components/invite/InviteUsedState";
import InviteInvalidState from "@/components/invite/InviteInvalidState";
import { Skeleton } from "@/components/ui/skeleton";

const InviteSkeleton = () => (
  <InviteShell>
    <InviteCard accent="brand">
      <div className="flex flex-col items-center mb-6">
        <Skeleton className="h-16 w-16 rounded-2xl mb-4" />
        <Skeleton className="h-3.5 w-32 mb-2" />
        <Skeleton className="h-7 w-48 mb-3" />
        <Skeleton className="h-6 w-20 rounded-full mb-3" />
        <Skeleton className="h-3 w-56" />
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="h-px flex-1 bg-border" />
        <Skeleton className="h-3 w-32" />
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="rounded-xl bg-muted/30 border border-border p-4 mb-5">
        <Skeleton className="h-3 w-40 mb-3" />
        <div className="space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Skeleton className="h-6 w-6 rounded-lg shrink-0" />
              <Skeleton className="h-4 flex-1 max-w-[220px]" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mb-5">
        <Skeleton className="h-3.5 w-36" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-11 w-full rounded-xl" />
        <div className="flex justify-center">
          <Skeleton className="h-3 w-44" />
        </div>
      </div>
    </InviteCard>
  </InviteShell>
);

const InvitePage = () => {
  const { token } = useParams<{ token: string }>();
  const { data: invite, isPending, isError } = useInvitation(token);

  if (isPending) return <InviteSkeleton />;
  if (isError || !invite) return <InviteInvalidState />;

  switch (invite.status) {
    case "EXPIRED":
    case "CANCELLED":
      return <InviteExpiredState invite={invite} />;
    case "ACCEPTED":
      return <InviteUsedState invite={invite} />;
    case "PENDING":
    case "RESENT":
      return <InviteValidState invite={invite} token={token} />;
    default:
      return <InviteInvalidState />;
  }
};

export default InvitePage;

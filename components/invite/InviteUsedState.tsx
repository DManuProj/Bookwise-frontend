import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LayoutDashboard } from "lucide-react";
import InviteShell from "@/components/invite/InviteShell";
import InviteCard from "@/components/invite/InviteCard";
import type { Invitation } from "@/types";

type Props = { invite: Invitation };

const InviteUsedState = ({ invite }: Props) => (
  <InviteShell>
    <InviteCard accent="blue">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-7 w-7 text-blue-500" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">
          Already Joined
        </h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          You've already accepted this invitation and joined{" "}
          <span className="font-semibold text-foreground">
            {invite.businessName}
          </span>
          . Head to your dashboard to get started.
        </p>
        <Button
          className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-sm shadow-blue-500/20"
          asChild
        >
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </InviteCard>
  </InviteShell>
);

export default InviteUsedState;

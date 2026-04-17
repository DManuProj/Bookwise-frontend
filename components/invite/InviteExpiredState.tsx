import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import InviteShell from "@/components/invite/InviteShell";
import InviteCard from "@/components/invite/InviteCard";
import type { Invitation } from "@/types";

type Props = { invite: Invitation };

const InviteExpiredState = ({ invite }: Props) => (
  <InviteShell>
    <InviteCard accent="amber">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-7 w-7 text-amber-500" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">
          Invitation Expired
        </h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          This invitation to join{" "}
          <span className="font-semibold text-foreground">
            {invite.businessName}
          </span>{" "}
          has expired. Please ask{" "}
          <span className="font-semibold text-foreground">
            {invite.invitedBy}
          </span>{" "}
          to send you a new invitation.
        </p>
        <Alert className="bg-amber-500/5 border-amber-500/20 text-left mb-6">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
            Invitations expire after 48 hours for security reasons.
          </AlertDescription>
        </Alert>
        <Button variant="outline" className="w-full rounded-xl" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </InviteCard>
  </InviteShell>
);

export default InviteExpiredState;

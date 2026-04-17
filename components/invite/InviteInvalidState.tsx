import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import InviteShell from "@/components/invite/InviteShell";
import InviteCard from "@/components/invite/InviteCard";

const InviteInvalidState = () => (
  <InviteShell>
    <InviteCard accent="red">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-7 w-7 text-destructive" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">
          Invalid Invitation
        </h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          This invitation link is invalid or doesn't exist. Please check the
          link in your email or ask your business owner to resend the
          invitation.
        </p>
        <Button variant="outline" className="w-full rounded-xl" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </InviteCard>
  </InviteShell>
);

export default InviteInvalidState;

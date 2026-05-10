"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  useDeleteOrganisation,
  useOrganisation,
} from "@/hooks/api/useOrganisation";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const SettingsDangerZone = () => {
  const { data: org } = useOrganisation();
  const { mutate: deleteOrg, isPending } = useDeleteOrganisation();
  const { signOut } = useClerk(); // from @clerk/nextjs
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [input, setInput] = useState("");

  const isMatch = input === org?.name;

  const handleDelete = async () => {
    if (!isMatch) return;

    deleteOrg(undefined, {
      onSuccess: async () => {
        await signOut(); // Sign out the user after deletion
        router.push("/"); // Redirect to homepage or login page
      },
    });
  };

  return (
    <>
      <Card className="border-destructive/30 dark:border-destructive/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h2 className="text-base font-semibold text-destructive">
              Danger Zone
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Permanent actions that cannot be undone.
          </p>

          <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Delete Organisation
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently delete your business, all bookings, staff and data.
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="rounded-xl shrink-0 ml-4"
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <DialogTitle className="text-lg font-bold text-destructive">
                Delete Organisation
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              This will permanently delete{" "}
              <span className="font-semibold text-foreground">{org?.name}</span>{" "}
              and all associated data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="p-3 rounded-xl bg-destructive/8 border border-destructive/20">
              <p className="text-xs text-destructive font-medium">
                This will delete:
              </p>
              <ul className="text-xs text-destructive/80 mt-1 space-y-0.5 list-disc list-inside">
                <li>All bookings and customer data</li>
                <li>All services and working hours</li>
                <li>All staff accounts and invitations</li>
                <li>Your booking page</li>
              </ul>
            </div>

            <div>
              <p className="text-sm text-foreground mb-2">
                Type{" "}
                <span className="font-mono font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded">
                  {org?.name}
                </span>{" "}
                to confirm:
              </p>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={org?.name}
                className={isMatch ? "border-destructive" : ""}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => {
                setConfirmOpen(false);
                setInput("");
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-xl disabled:opacity-50"
              onClick={handleDelete}
              disabled={!isMatch || isPending || !org}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Organisation"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingsDangerZone;

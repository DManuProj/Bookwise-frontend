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
      <Card className="rounded-2xl border-destructive/30 dark:border-destructive/20">
        <CardContent className="p-6">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold tracking-tight text-destructive">
              Danger Zone
            </h2>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">
            Permanent actions that cannot be undone.
          </p>

          <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Delete Organisation
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Permanently delete your business, all bookings, staff and data.
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="ml-4 shrink-0 rounded-xl"
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl p-0">
          <DialogHeader className="border-b border-border px-6 pb-4 pt-6">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <DialogTitle className="text-lg font-bold tracking-tight text-destructive">
                Delete Organisation
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              This will permanently delete{" "}
              <span className="font-semibold text-foreground">{org?.name}</span>{" "}
              and all associated data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3">
              <p className="text-xs font-medium text-destructive">
                This will delete:
              </p>
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs text-destructive/80">
                <li>All bookings and customer data</li>
                <li>All services and working hours</li>
                <li>All staff accounts and invitations</li>
                <li>Your booking page</li>
              </ul>
            </div>

            <div>
              <p className="mb-2 text-sm text-foreground">
                Type{" "}
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono font-semibold text-foreground">
                  {org?.name}
                </span>{" "}
                to confirm:
              </p>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={org?.name}
                className={`h-11 rounded-xl ${isMatch ? "border-destructive" : ""}`}
              />
            </div>
          </div>

          <div className="flex gap-3 border-t border-border px-6 py-4">
            <Button
              variant="outline"
              className="h-11 flex-1 rounded-xl"
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
              className="h-11 flex-1 rounded-xl disabled:opacity-50"
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

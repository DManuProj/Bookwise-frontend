"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Check,
  LayoutDashboard,
  ExternalLink,
  Sparkles,
  Mail,
} from "lucide-react";

/* ── Types ── */
type Props = {
  slug: string;
  businessName: string;
  staffCount: number;
};

/* ── Component ── */
const OnboardingDone = ({ slug, businessName, staffCount }: Props) => {
  const [copied, setCopied] = useState(false);

  const bookingUrl = `https://bookwise.ai/book/${slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-6">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="relative inline-flex mb-6">
          <div className="w-20 h-20 rounded-full bg-brand-500/15 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-brand-500" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-foreground mb-3">
          You&apos;re all set! 🎉
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          <span className="font-semibold text-foreground">{businessName}</span>{" "}
          is ready to take bookings. Your AI receptionist is online and waiting
          for your first customer.
        </p>

        {/* Booking link card */}
        <Card className="mb-6 text-left">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Your Booking Page
            </p>

            <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-4 py-3 mb-3">
              <span className="text-sm text-foreground flex-1 truncate font-mono">
                {bookingUrl}
              </span>
              <button
                onClick={handleCopy}
                className="text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400 transition-colors shrink-0"
                aria-label="Copy booking URL"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-brand-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {copied
                ? "✓ Copied to clipboard!"
                : "Share this link with your customers"}
            </p>
          </CardContent>
        </Card>

        {/* Staff invitation note */}
        {staffCount > 0 && (
          <Alert className="mb-6 bg-blue-500/5 border-blue-500/20 text-left">
            <Mail className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
              Invitation emails are being sent to{" "}
              <span className="font-semibold text-foreground">
                {staffCount} staff member{staffCount > 1 ? "s" : ""}
              </span>
              . They can join your workspace by clicking the link in their
              email.
            </AlertDescription>
          </Alert>
        )}

        <Separator className="mb-6" />

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20"
            asChild
          >
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full rounded-xl"
            asChild
          >
            <Link href={`/book/${slug}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Booking Page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDone;

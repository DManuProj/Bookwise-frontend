"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCurrencyByCode } from "@/lib/countries";
import {
  ArrowLeft,
  Pencil,
  Building2,
  Clock,
  Users,
  CheckCircle2,
  Loader2,
  User,
  Handshake,
} from "lucide-react";
import { OnboardingData } from "@/types";

/* ── Types ── */
type Props = {
  formData: OnboardingData;
  onEdit: (step: 1 | 2 | 3 | 4) => void;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
};

/* ── Helpers ── */
const formatTime = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const suffix = h < 12 ? "AM" : "PM";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
};

const DAY_LABELS: Record<string, string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

/* ── Section header ── */
const SectionHeader = ({
  icon: Icon,
  title,
  onEdit,
}: {
  icon: React.ElementType;
  title: string;
  onEdit: () => void;
}) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
      </div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
    </div>
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onEdit}
      className="h-8 px-3 text-sm text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-500/8"
    >
      <Pencil className="h-3.5 w-3.5 mr-1.5" />
      Edit
    </Button>
  </div>
);

/* ── Row item ── */
const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-2.5">
    <span className="text-sm text-muted-foreground shrink-0 w-32">{label}</span>
    <span className="text-sm text-foreground text-right">{value}</span>
  </div>
);

/* ── Component ── */
const OnboardingReview = ({
  formData,
  onEdit,
  onConfirm,
  onBack,
  isSubmitting,
}: Props) => {
  const { businessInfo, businessHours, staffData, services } = formData;
  const currency = getCurrencyByCode(businessInfo?.currency ?? "");

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Review your setup
        </h1>
        <p className="text-muted-foreground">
          Check everything looks right before we create your account.
        </p>
      </div>

      <div className="space-y-4">
        {/* ── Section 1: Business Info ── */}
        <Card className="border border-brand-500/25 dark:border-brand-500/15">
          <CardContent className="px-6 py-3 ">
            <SectionHeader
              icon={Building2}
              title="Business Info"
              onEdit={() => onEdit(1)}
            />

            {businessInfo ? (
              <>
                {/* Logo + name */}
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
                  <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center shrink-0 overflow-hidden border border-brand-500/20">
                    {businessInfo.logo ? (
                      <img
                        src={URL.createObjectURL(businessInfo.logo)}
                        alt="logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                        {businessInfo.businessName.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground mb-1">
                      {businessInfo.businessName}
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-sm bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0"
                    >
                      {businessInfo.businessType}
                    </Badge>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  <Row
                    label="Booking URL"
                    value={
                      <span className="font-mono text-sm text-brand-600 dark:text-brand-400">
                        bookwise.ai/book/{businessInfo.slug}
                      </span>
                    }
                  />
                  <Row label="Phone" value={businessInfo.phone} />
                  <Row label="Country" value={businessInfo.country} />
                  <Row
                    label="Currency"
                    value={
                      currency
                        ? `${currency.symbol} ${currency.name} (${currency.code})`
                        : businessInfo.currency
                    }
                  />
                  {businessInfo.description && (
                    <Row label="Description" value={businessInfo.description} />
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Not filled yet</p>
            )}
          </CardContent>
        </Card>

        {/* ── Section 2: Working Hours ── */}
        <Card className="border border-brand-500/25 dark:border-brand-500/15">
          <CardContent className="px-6 py-3 ">
            <SectionHeader
              icon={Clock}
              title="Working Hours"
              onEdit={() => onEdit(2)}
            />

            {businessHours ? (
              <div className="space-y-0.5">
                {businessHours.workingHours.map((row) => (
                  <div
                    key={row.day}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm font-medium text-foreground w-28">
                      {DAY_LABELS[row.day]}
                    </span>
                    {row.isOpen ? (
                      <span className="text-sm text-muted-foreground">
                        {formatTime(row.openTime)} — {formatTime(row.closeTime)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground/50">
                        Closed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not filled yet</p>
            )}
          </CardContent>
        </Card>

        {/* ── Section 3: Staff ── */}
        <Card className="border border-brand-500/25 dark:border-brand-500/15">
          <CardContent className="px-6 py-3 ">
            <SectionHeader icon={Users} title="Team" onEdit={() => onEdit(3)} />

            {staffData && staffData.staff.length > 0 ? (
              <div className="space-y-4">
                {staffData.staff.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {member.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-sm bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0 capitalize"
                    >
                      {member.isOwner ? "Owner" : member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No staff added — you can add team members later from your
                dashboard.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Section 4: Services ── */}
        <Card className="border border-brand-500/25 dark:border-brand-500/15">
          <CardContent className="px-6 py-3 ">
            <SectionHeader
              icon={Handshake}
              title="Services"
              onEdit={() => onEdit(4)}
            />

            {services && services.services.length > 0 ? (
              <div className="space-y-4">
                {services.services.map((svc, i) => (
                  <div key={i}>
                    {i > 0 && <Separator className="mb-4" />}

                    {/* Name + price */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className=" font-semibold ">{svc.name}</p>
                      <span className=" font-semibold text-brand-600 dark:text-brand-400 shrink-0">
                        {currency?.symbol ?? ""}
                        {svc.price}
                      </span>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {svc.duration >= 60
                          ? `${svc.duration / 60}h`
                          : `${svc.duration}m`}
                      </span>
                      {svc.buffer > 0 && (
                        <span className="text-sm text-muted-foreground">
                          +{svc.buffer}m buffer
                        </span>
                      )}
                      {svc.description && (
                        <span className="text-sm text-muted-foreground truncate max-w-xs">
                          {svc.description}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No services added yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating your account...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirm & Complete
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingReview;

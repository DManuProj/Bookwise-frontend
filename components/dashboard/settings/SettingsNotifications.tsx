"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Mail, MessageSquare } from "lucide-react";
import SettingsCard from "@/components/dashboard/settings/SettingsCard";

type NotifSetting = {
  id: string;
  label: string;
  desc: string;
  email: boolean;
  sms: boolean;
};

const INITIAL: NotifSetting[] = [
  {
    id: "new_booking",
    label: "New booking",
    desc: "When a customer makes a new booking",
    email: true,
    sms: true,
  },
  {
    id: "confirmed",
    label: "Booking confirmed",
    desc: "When a booking is confirmed",
    email: true,
    sms: true,
  },
  {
    id: "cancelled",
    label: "Booking cancelled",
    desc: "When a booking is cancelled",
    email: true,
    sms: false,
  },
  {
    id: "reminder",
    label: "Booking reminder",
    desc: "24 hours before an appointment",
    email: true,
    sms: true,
  },
  {
    id: "no_show",
    label: "No-show marked",
    desc: "When a customer doesn't show up",
    email: false,
    sms: false,
  },
  {
    id: "staff_request",
    label: "Staff removal request",
    desc: "When staff requests removal from a booking",
    email: true,
    sms: false,
  },
];

const SettingsNotifications = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState<NotifSetting[]>(INITIAL);
  const [draft, setDraft] = useState<NotifSetting[]>(INITIAL);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const toggle = (id: string, channel: "email" | "sms") =>
    setDraft((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [channel]: !s[channel] } : s)),
    );

  const handleCancel = () => {
    setDraft(saved);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // TODO: PUT /api/organisation/notifications
      await new Promise((res) => setTimeout(res, 800));
      setSaved(draft);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const display = isEditing ? draft : saved;

  return (
    <SettingsCard
      title="Notifications"
      description="Choose which notifications you receive and how"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {/* Channel headers */}
      <div className="flex items-center mb-2 px-1">
        <div className="flex-1" />
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 w-16 justify-center">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              Email
            </span>
          </div>
          <div className="flex items-center gap-1 w-16 justify-center">
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              SMS
            </span>
          </div>
        </div>
      </div>

      <div>
        {display.map((s, i) => (
          <div
            key={s.id}
            className={`flex items-center px-2 py-3.5 transition-colors ${
              i < display.length - 1 ? "border-b border-border" : ""
            } ${isEditing ? "hover:bg-muted/20 rounded-lg" : ""}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <div className="w-16 flex justify-center">
                <Switch
                  checked={s.email}
                  disabled={!isEditing}
                  onCheckedChange={() => toggle(s.id, "email")}
                />
              </div>
              <div className="w-16 flex justify-center">
                <Switch
                  checked={s.sms}
                  disabled={!isEditing}
                  onCheckedChange={() => toggle(s.id, "sms")}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SettingsCard>
  );
};

export default SettingsNotifications;

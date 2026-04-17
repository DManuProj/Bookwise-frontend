"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import {
  CalendarIcon,
  Loader2,
  CheckCircle2,
  User,
  Phone,
  Mail,
  Scissors,
  Users,
  Clock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Zod schema ── */
const newBookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Enter a valid email address"),
  customerPhone: z.string().min(7, "Enter a valid phone number"),
  serviceId: z.string().min(1, "Please select a service"),
  staffId: z.string().min(1, "Please select a staff member"),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, "Please select a time slot"),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof newBookingSchema>;

/* ── Placeholder data — replace with API calls ── */
const SERVICES = [
  { id: "s1", name: "Haircut", duration: 45 },
  { id: "s2", name: "Deep Tissue Massage", duration: 60 },
  { id: "s3", name: "Manicure", duration: 30 },
  { id: "s4", name: "Swedish Massage", duration: 60 },
  { id: "s5", name: "Beard Trim", duration: 20 },
  { id: "s6", name: "Facial", duration: 60 },
];

const STAFF = [
  { id: "st1", name: "James", role: "Admin" },
  { id: "st2", name: "Anna", role: "Member" },
  { id: "st3", name: "You", role: "Owner" },
];

const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
];

/* ── Types ── */
type Props = {
  open: boolean;
  onClose: () => void;
};

/* ── Component ── */
const NewBookingModal = ({ open, onClose }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [time, setTime] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(newBookingSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      serviceId: "",
      staffId: "",
      time: "",
      note: "",
    },
  });

  const selectedDate = watch("date");
  const selectedService = SERVICES.find((s) => s.id === serviceId);

  /* ── Reset on close ── */
  const handleClose = () => {
    reset();
    setServiceId("");
    setStaffId("");
    setTime("");
    onClose();
  };

  /* ── Submit ── */
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: POST /api/bookings
      console.log("New booking:", values);
      await new Promise((res) => setTimeout(res, 1200));
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl! w-full p-0 gap-0 overflow-hidden">
        {/* Fixed header — never scrolls */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <DialogTitle className="text-xl font-bold">New Booking</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a manual booking. Customer will receive a confirmation.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content — only this area scrolls */}
        <div className=" -mx-3 overflow-y-auto no-scrollbar! max-h-[70vh] flex-1 px-10! py-5 space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* ── Customer details ── */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Customer Details
              </p>
              <div className="space-y-3">
                {/* Name */}
                <Field>
                  <FieldLabel>Full Name *</FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="e.g. Sarah Johnson"
                      className="pl-9 "
                      aria-invalid={!!errors.customerName}
                      {...register("customerName")}
                    />
                  </div>
                  <FieldError errors={[errors.customerName]} />
                </Field>

                {/* Email + Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel>Email *</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        type="email"
                        placeholder="sarah@email.com"
                        className="pl-9 "
                        aria-invalid={!!errors.customerEmail}
                        {...register("customerEmail")}
                      />
                    </div>
                    <FieldError errors={[errors.customerEmail]} />
                  </Field>

                  <Field>
                    <FieldLabel>Phone *</FieldLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        type="tel"
                        placeholder="+1 555 0101"
                        className="pl-9  "
                        aria-invalid={!!errors.customerPhone}
                        {...register("customerPhone")}
                      />
                    </div>
                    <FieldError errors={[errors.customerPhone]} />
                  </Field>
                </div>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* ── Appointment details ── */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Appointment Details
              </p>
              <div className="space-y-3">
                {/* Service */}
                <Field>
                  <FieldLabel>Service *</FieldLabel>
                  <Select
                    value={serviceId}
                    onValueChange={(val) => {
                      setServiceId(val);
                      setValue("serviceId", val, { shouldValidate: true });
                    }}
                  >
                    <SelectTrigger aria-invalid={!!errors.serviceId}>
                      <div className="flex items-center gap-2">
                        <Scissors className="h-4 w-4 text-muted-foreground shrink-0" />
                        <SelectValue placeholder="Select a service" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          <div className="flex items-center justify-between w-full gap-4">
                            <span>{s.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {s.duration}min
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedService && (
                    <p className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      Duration: {selectedService.duration} minutes
                    </p>
                  )}
                  <FieldError errors={[errors.serviceId]} />
                </Field>

                {/* Staff */}
                <Field>
                  <FieldLabel>Staff Member *</FieldLabel>
                  <Select
                    value={staffId}
                    onValueChange={(val) => {
                      setStaffId(val);
                      setValue("staffId", val, { shouldValidate: true });
                    }}
                  >
                    <SelectTrigger aria-invalid={!!errors.staffId}>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                        <SelectValue placeholder="Select a staff member" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          <div className="flex items-center gap-2">
                            <span>{s.name}</span>
                            <span className="text-xs text-muted-foreground">
                              — {s.role}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.staffId]} />
                </Field>

                {/* Date */}
                <Field>
                  <FieldLabel>Date *</FieldLabel>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "flex h-11 w-full items-center gap-2 rounded-md border px-3 text-sm text-left transition-colors",
                          "border-gray-300 dark:border-teal-500/30 bg-transparent",
                          "hover:border-gray-400 dark:hover:border-teal-400",
                          errors.date ? "border-destructive" : "",
                        )}
                      >
                        <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        {selectedDate ? (
                          <span className="text-foreground">
                            {format(selectedDate, "EEEE, MMMM d, yyyy")}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Pick a date
                          </span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date) {
                            setValue("date", date, { shouldValidate: true });
                            setCalendarOpen(false);
                            setTime("");
                            setValue("time", "");
                          }
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldError errors={[errors.date]} />
                </Field>

                {/* Time slots */}
                {selectedDate && (
                  <Field>
                    <FieldLabel>Time Slot *</FieldLabel>
                    <FieldDescription>
                      Available slots for {format(selectedDate, "MMM d")}
                    </FieldDescription>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setTime(slot);
                            setValue("time", slot, { shouldValidate: true });
                          }}
                          className={cn(
                            "h-9 rounded-lg text-xs font-medium border transition-all duration-150",
                            time === slot
                              ? "bg-brand-500 border-brand-500 text-white shadow-sm shadow-brand-500/20"
                              : "border-border text-muted-foreground hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400",
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    {errors.time && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.time.message}
                      </p>
                    )}
                  </Field>
                )}

                {/* Note */}
                <Field>
                  <FieldLabel>Note</FieldLabel>
                  <FieldDescription>Optional internal note</FieldDescription>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Textarea
                      placeholder="Any special requests or notes..."
                      className="resize-none h-20 text-sm pl-9"
                      {...register("note")}
                    />
                  </div>
                </Field>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed footer — never scrolls */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Create Booking
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewBookingModal;

"use client";

import { useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  ChevronsUpDown,
  UserPlus,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Booking,
  Customer,
  DashboardBookingInputs,
  dashboardBookingSchema,
  dashboardEditBookingSchema,
} from "@/types";
import { useServices } from "@/hooks/api/useServices";
import { useStaff } from "@/hooks/api/useStaff";
import {
  useBookingSlots,
  useCreateBooking,
  useEditBooking,
} from "@/hooks/api/useBookings";
import { useCustomers } from "@/hooks/api/useCustomers";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";

const combineDateTime = (date: Date, timeSlot: string): string => {
  const [time, period] = timeSlot.split(" ");
  const [h, m] = time.split(":").map(Number);
  const hours =
    period === "PM" && h !== 12 ? h + 12 : period === "AM" && h === 12 ? 0 : h;
  const result = new Date(date);
  result.setHours(hours, m, 0, 0);
  return result.toISOString();
};

// Shared trigger styling for the popover/combobox buttons (tokens, not raw gray/teal)
const triggerClass =
  "flex h-11 w-full items-center gap-2 rounded-xl border border-input bg-transparent px-3 text-left text-sm transition-colors hover:border-brand-500/40 hover:bg-brand-500/[0.04]";

const NewBookingModal = ({
  open,
  onClose,
  booking = null,
}: {
  open: boolean;
  onClose: () => void;
  booking?: Booking | null;
}) => {
  const isEdit = !!booking;

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [mode, setMode] = useState<"pick" | "new">("pick");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [pickerError, setPickerError] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const { data: services, isPending: servicesLoading } = useServices();
  const { data: staffData, isPending: staffLoading } = useStaff();
  const { data: customers, isPending: customersLoading } = useCustomers({
    search: debouncedSearch,
    limit: 10,
  });

  const { mutate: createBooking, isPending: isCreating } = useCreateBooking();
  const { mutate: editBooking, isPending: isEditing } = useEditBooking();
  const isSubmitting = isEdit ? isEditing : isCreating;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DashboardBookingInputs>({
    resolver: (isEdit
      ? zodResolver(dashboardEditBookingSchema)
      : zodResolver(
          dashboardBookingSchema,
        )) as Resolver<DashboardBookingInputs>,
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
  const watchedServiceId = watch("serviceId");
  const watchedStaffId = watch("staffId");
  const watchedTime = watch("time");

  const dateParam = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const selectedService = services?.find((s) => s.id === watchedServiceId);

  useEffect(() => {
    if (booking && open) {
      const d = new Date(booking.startAt);
      const h = d.getHours();
      const m = d.getMinutes();
      const hour12 = h % 12 || 12;
      const period = h >= 12 ? "PM" : "AM";
      const timeSlot = `${hour12}:${String(m).padStart(2, "0")} ${period}`;
      reset({
        customerName: booking.customer?.name ?? "Customer",
        customerEmail: booking.customer?.email ?? "customer@bookwise.io",
        customerPhone: booking.customer?.phone ?? "0000000",
        serviceId: booking.serviceId,
        staffId: booking.userId ?? booking.user?.id ?? "",
        date: d,
        time: timeSlot,
        note: booking.note ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.id, open]);

  const { data: slots, isPending: slotsLoading } = useBookingSlots(
    watchedServiceId,
    watchedStaffId,
    dateParam,
    booking?.id,
  );

  const handlePickCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setPickerError("");
    setValue("customerName", customer.name);
    setValue("customerEmail", customer.email);
    setValue("customerPhone", customer.phone);
  };

  const handleSwitchToNew = () => {
    setMode("new");
    setSelectedCustomer(null);
    setSearch("");
    setPickerError("");
    setValue("customerName", "");
    setValue("customerEmail", "");
    setValue("customerPhone", "");
  };

  const handleSwitchToPick = () => {
    setMode("pick");
    setPickerError("");
    setValue("customerName", "");
    setValue("customerEmail", "");
    setValue("customerPhone", "");
  };

  const handleClose = () => {
    reset({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      serviceId: "",
      staffId: "",
      time: "",
      note: "",
    });
    setMode("pick");
    setComboboxOpen(false);
    setSearch("");
    setSelectedCustomer(null);
    setPickerError("");
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEdit && mode === "pick" && !selectedCustomer) {
      setPickerError("Please select a customer or switch to add a new one.");
      return;
    }
    handleSubmit(onSubmit)(e);
  };

  const onSubmit = (values: DashboardBookingInputs) => {
    if (isEdit && booking) {
      editBooking(
        {
          id: booking.id,
          serviceId: values.serviceId,
          staffId: values.staffId,
          startAt: combineDateTime(values.date, values.time),
          note: values.note,
        },
        { onSuccess: () => handleClose() },
      );
    } else {
      createBooking(
        {
          serviceId: values.serviceId,
          staffId: values.staffId,
          startAt: combineDateTime(values.date, values.time),
          note: values.note,
          ...(mode === "pick" && selectedCustomer
            ? { customerId: selectedCustomer.id }
            : {
                customer: {
                  name: values.customerName,
                  email: values.customerEmail,
                  phone: values.customerPhone,
                },
              }),
        },
        { onSuccess: () => handleClose() },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="w-full max-w-xl! gap-0 overflow-hidden rounded-2xl p-0">
        {/* Fixed header */}
        <DialogHeader className="shrink-0 border-b border-border px-6 pb-4 pt-6">
          <DialogTitle className="text-xl font-bold tracking-tight">
            {isEdit ? (
              <span className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Pencil className="h-4.5 w-4.5" />
                </span>
                Edit Booking
              </span>
            ) : (
              <span className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/30">
                  <CalendarIcon className="h-4.5 w-4.5" />
                </span>
                New Booking
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEdit
              ? "Update the appointment details below."
              : "Create a manual booking. Customer will receive a confirmation."}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="no-scrollbar! -mx-3 max-h-[70vh] flex-1 space-y-5 overflow-y-auto px-10! py-5">
          <form
            id="new-booking-form"
            onSubmit={handleFormSubmit}
            className="space-y-5"
          >
            {/* Customer details — hidden in edit mode */}
            {!isEdit && (
              <>
                <div>
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <User className="h-3.5 w-3.5 text-brand-500" />
                    Customer Details
                  </p>
                  <div className="space-y-3">
                    {mode === "pick" ? (
                      <>
                        {/* Customer combobox */}
                        <Field>
                          <FieldLabel>Search Customer *</FieldLabel>
                          <Popover
                            open={comboboxOpen}
                            onOpenChange={setComboboxOpen}
                          >
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                role="combobox"
                                aria-expanded={comboboxOpen}
                                className={cn(
                                  triggerClass,
                                  "justify-between",
                                  pickerError && "border-destructive",
                                )}
                              >
                                {selectedCustomer ? (
                                  <span className="truncate text-foreground">
                                    {selectedCustomer.name}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    Search by name, email, or phone...
                                  </span>
                                )}
                                <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-(--radix-popover-trigger-width) p-0"
                              align="start"
                            >
                              <Command shouldFilter={false}>
                                <CommandInput
                                  placeholder="Type name, email, or phone..."
                                  value={search}
                                  onValueChange={setSearch}
                                />
                                <CommandList>
                                  {customersLoading && (
                                    <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                                      <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                                      Searching...
                                    </div>
                                  )}
                                  {!customersLoading &&
                                    customers?.data.length === 0 && (
                                      <CommandEmpty>
                                        No customers found.
                                      </CommandEmpty>
                                    )}
                                  {!customersLoading &&
                                    customers?.data?.map((c) => (
                                      <CommandItem
                                        key={c.id}
                                        value={c.id}
                                        onSelect={() => {
                                          handlePickCustomer(c);
                                          setComboboxOpen(false);
                                        }}
                                      >
                                        <div>
                                          <p className="font-medium">
                                            {c.name}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {c.email} · {c.phone}
                                          </p>
                                        </div>
                                      </CommandItem>
                                    ))}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {pickerError && (
                            <p className="mt-1 text-xs text-destructive">
                              {pickerError}
                            </p>
                          )}
                        </Field>

                        {/* Read-only email/phone after selection */}
                        {selectedCustomer && (
                          <div className="grid grid-cols-2 gap-3 rounded-xl border border-brand-500/20 bg-brand-500/[0.05] p-3 dark:bg-brand-500/10">
                            <Field>
                              <FieldLabel>Email</FieldLabel>
                              <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  readOnly
                                  value={selectedCustomer.email}
                                  className="cursor-default rounded-lg bg-card/60 pl-9"
                                />
                              </div>
                            </Field>
                            <Field>
                              <FieldLabel>Phone</FieldLabel>
                              <div className="relative">
                                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  readOnly
                                  value={selectedCustomer.phone}
                                  className="cursor-default rounded-lg bg-card/60 pl-9"
                                />
                              </div>
                            </Field>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleSwitchToNew}
                          className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          Add as new customer
                        </button>
                      </>
                    ) : (
                      <>
                        <Field>
                          <FieldLabel>Full Name *</FieldLabel>
                          <div className="group relative">
                            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-500" />
                            <Input
                              placeholder="e.g. Sarah Johnson"
                              className="h-11 rounded-xl pl-9"
                              aria-invalid={!!errors.customerName}
                              {...register("customerName")}
                            />
                          </div>
                          <FieldError errors={[errors.customerName]} />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                          <Field>
                            <FieldLabel>Email *</FieldLabel>
                            <div className="group relative">
                              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-500" />
                              <Input
                                type="email"
                                placeholder="sarah@email.com"
                                className="h-11 rounded-xl pl-9"
                                aria-invalid={!!errors.customerEmail}
                                {...register("customerEmail")}
                              />
                            </div>
                            <FieldError errors={[errors.customerEmail]} />
                          </Field>

                          <Field>
                            <FieldLabel>Phone *</FieldLabel>
                            <div className="group relative">
                              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-500" />
                              <Input
                                type="tel"
                                placeholder="+1 555 0101"
                                className="h-11 rounded-xl pl-9"
                                aria-invalid={!!errors.customerPhone}
                                {...register("customerPhone")}
                              />
                            </div>
                            <FieldError errors={[errors.customerPhone]} />
                          </Field>
                        </div>

                        <button
                          type="button"
                          onClick={handleSwitchToPick}
                          className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          Pick existing customer
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-px bg-border" />
              </>
            )}

            {/* Appointment details */}
            <div>
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <CalendarIcon className="h-3.5 w-3.5 text-brand-500" />
                Appointment Details
              </p>
              <div className="space-y-3">
                {/* Service */}
                <Field>
                  <FieldLabel>Service *</FieldLabel>
                  <Select
                    disabled={servicesLoading}
                    value={watchedServiceId}
                    onValueChange={(val) =>
                      setValue("serviceId", val, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger
                      aria-invalid={!!errors.serviceId}
                      className="h-11 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <Scissors className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <SelectValue placeholder="Select a service" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {services?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          <div className="flex w-full items-center justify-between gap-4">
                            <span>{s.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {s.durationMins}min
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedService && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400">
                      <Clock className="h-3 w-3" />
                      Duration: {selectedService.durationMins} minutes
                    </p>
                  )}
                  <FieldError errors={[errors.serviceId]} />
                </Field>

                {/* Staff */}
                <Field>
                  <FieldLabel>Staff Member *</FieldLabel>
                  <Select
                    disabled={staffLoading}
                    value={watchedStaffId}
                    onValueChange={(val) =>
                      setValue("staffId", val, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger
                      aria-invalid={!!errors.staffId}
                      className="h-11 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <SelectValue placeholder="Select a staff member" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {staffData?.users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.firstName} {u.lastName}
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
                          triggerClass,
                          errors.date && "border-destructive",
                        )}
                      >
                        <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
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
                            setValue("time", "");
                            setCalendarOpen(false);
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
                      {watchedStaffId
                        ? `Available slots for ${format(selectedDate, "MMM d")}`
                        : "Assign a staff member to see available slots"}
                    </FieldDescription>
                    <div className="mt-1 grid grid-cols-4 gap-2">
                      {!watchedStaffId ? (
                        <div className="col-span-4 py-4 text-center text-sm text-muted-foreground">
                          {isEdit
                            ? "This booking has no staff assigned. Please select a staff member above."
                            : "Select a staff member to see available slots."}
                        </div>
                      ) : slotsLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                          <Skeleton key={i} className="h-10 rounded-xl" />
                        ))
                      ) : !slots || slots.length === 0 ? (
                        <div className="col-span-4 py-4 text-center text-sm text-muted-foreground">
                          No slots available. Try a different date or staff
                          member.
                        </div>
                      ) : (
                        slots.map((slot) => {
                          const [h, m] = slot.split(":").map(Number);
                          const hour12 = h % 12 || 12;
                          const period = h >= 12 ? "PM" : "AM";
                          const display = `${hour12}:${String(m).padStart(2, "0")} ${period}`;

                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() =>
                                setValue("time", display, {
                                  shouldValidate: true,
                                })
                              }
                              className={cn(
                                "h-10 rounded-xl border text-xs font-semibold transition-all duration-150",
                                watchedTime === display
                                  ? "border-brand-500 bg-primary text-primary-foreground shadow-md shadow-brand-500/25"
                                  : "border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-brand-500/40 hover:bg-brand-500/[0.06] hover:text-brand-600 dark:hover:text-brand-400",
                              )}
                            >
                              {display}
                            </button>
                          );
                        })
                      )}
                    </div>
                    {errors.time && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.time.message}
                      </p>
                    )}
                  </Field>
                )}

                {/* Note */}
                <Field>
                  <FieldLabel>Note</FieldLabel>
                  <FieldDescription>Optional internal note</FieldDescription>
                  <div className="group relative">
                    <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-brand-500" />
                    <Textarea
                      placeholder="Any special requests or notes..."
                      className="h-20 resize-none rounded-xl pl-9 text-sm"
                      {...register("note")}
                    />
                  </div>
                </Field>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed footer */}
        <div className="flex shrink-0 gap-3 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-xl"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="new-booking-form"
            disabled={isSubmitting}
            className="h-11 flex-1 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {isEdit ? "Save Changes" : "Create Booking"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewBookingModal;

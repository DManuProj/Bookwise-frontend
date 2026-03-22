import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-md border px-2.5 py-1 text-base outline-none transition-all",

        "border-gray-300 bg-transparent",
        "focus-visible:border-gray-500",

        "dark:border-teal-500/30 dark:bg-input/30",
        "dark:focus-visible:border-teal-400",

        "aria-invalid:border-red-500",
        "aria-invalid:focus-visible:border-red-600",
        "aria-invalid:ring-2 aria-invalid:ring-red-500/20",

        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

        // Text
        "placeholder:text-muted-foreground md:text-sm",

        className,
      )}
      {...props}
    />
  );
}

export { Input };

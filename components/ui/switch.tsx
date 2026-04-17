// "use client";

// import * as React from "react";
// import { Switch as SwitchPrimitive } from "radix-ui";
// import { cn } from "@/lib/utils";

// function Switch({
//   className,
//   ...props
// }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
//   return (
//     <SwitchPrimitive.Root
//       data-slot="switch"
//       className={cn(
//         // Track size — wider and taller so thumb has room to slide
//         "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full group",
//         "border-2 border-transparent outline-none",
//         "transition-colors duration-200 ease-in-out",
//         "cursor-pointer",
//         // Track colors
//         "[&[data-state='checked']]:bg-brand-500",
//         "[&[data-state='unchecked']]:bg-slate-300 dark:[&[data-state='unchecked']]:bg-slate-600",
//         // Focus
//         "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
//         // Disabled
//         "data-disabled:cursor-not-allowed data-disabled:opacity-50",
//         className,
//       )}
//       {...props}
//     >
//       <SwitchPrimitive.Thumb
//         data-slot="switch-thumb"
//         className={cn(
//           // Thumb size
//           "block h-5 w-5 rounded-full",
//           // Thumb color — always white
//           "bg-white shadow-md",
//           // Sliding animation
//           "transition-transform duration-200 ease-in-out",
//           "group-data-[state='checked']:translate-x-5",
//           "group-data-[state='unchecked']:translate-x-0",
//           "pointer-events-none",
//         )}
//       />
//     </SwitchPrimitive.Root>
//   );
// }

// export { Switch };
"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Track shape and size
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
        "border-2 border-transparent",
        "outline-none transition-colors duration-200",
        // Track color — checked vs unchecked
        "data-[state=checked]:bg-brand-500",
        "data-[state=unchecked]:bg-slate-300",
        "dark:data-[state=unchecked]:bg-slate-600",
        // Focus ring
        "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          // Thumb size — must be smaller than track
          "block h-5 w-5 rounded-full",
          // Always white thumb
          "bg-white shadow-md",
          // Transition
          "pointer-events-none transition-transform duration-200",
          // Position — checked slides right, unchecked stays left
          "data-[state=checked]:translate-x-5",
          "data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };

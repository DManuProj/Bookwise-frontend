import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
  href?: string;
  compact?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 28, text: "text-lg" },
  md: { icon: 34, text: "text-xl" },
  lg: { icon: 42, text: "text-2xl" },
};

const Logo = ({
  variant = "dark",
  size = "md",
  asLink = false,
  href = "/",
  compact = false,
  className,
}: LogoProps) => {
  const { icon, text } = sizes[size];
  const textColor = variant === "light" ? "text-white" : "text-slate-900";

  const content = (
    <>
      <div
        className="relative flex items-center justify-center rounded-xl bg-brand-500 transition-colors group-hover:bg-brand-600"
        style={{ width: icon, height: icon }}
      >
        <svg
          width={icon * 0.58}
          height={icon * 0.58}
          viewBox="0 0 20 20"
          fill="none"
        >
          <rect
            x="2"
            y="4"
            width="16"
            height="14"
            rx="2.5"
            fill="white"
            fillOpacity="0.25"
          />
          <rect
            x="2"
            y="4"
            width="16"
            height="14"
            rx="2.5"
            stroke="white"
            strokeWidth="1.5"
          />
          <path d="M2 8h16" stroke="white" strokeWidth="1.5" />
          <rect x="6" y="2" width="2" height="4" rx="1" fill="white" />
          <rect x="12" y="2" width="2" height="4" rx="1" fill="white" />
          <circle cx="7" cy="12" r="1" fill="white" />
          <circle cx="10" cy="12" r="1.5" fill="white" />
          <circle cx="13" cy="12" r="1" fill="white" />
        </svg>

        <div className="absolute inset-0 rounded-xl bg-brand-400 opacity-0 blur-sm transition-opacity group-hover:opacity-20" />
      </div>

      {!compact && (
        <span className={cn("font-bold tracking-tight", text, textColor)}>
          Book<span className="text-brand-500">Wise</span>
        </span>
      )}
    </>
  );

  if (asLink) {
    return (
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-2.5 overflow-hidden",
          compact && "justify-center",
          className,
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-2.5 overflow-hidden",
        compact && "justify-center",
        className,
      )}
    >
      {content}
    </div>
  );
};

export default Logo;

import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
  href?: string;
}

const sizes = {
  sm: { icon: 28, text: "text-lg" },
  md: { icon: 34, text: "text-xl" },
  lg: { icon: 42, text: "text-2xl" },
};

const Logo = ({
  variant = "dark",
  size = "md",
  asLink = true,
  href = "/",
}: LogoProps) => {
  const { icon, text } = sizes[size];
  const textColor = variant === "light" ? "text-white" : "text-slate-900";
  const Wrapper = asLink ? Link : "div";
  return (
    <Wrapper
      {...(asLink ? { href } : {})}
      className="flex items-center gap-2.5 group"
    >
      {/* Icon mark */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-brand-500 group-hover:bg-brand-600 transition-colors"
        style={{ width: icon, height: icon }}
      >
        {/* Calendar base */}
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
          {/* Voice waveform dots */}
          <circle cx="7" cy="12" r="1" fill="white" />
          <circle cx="10" cy="12" r="1.5" fill="white" />
          <circle cx="13" cy="12" r="1" fill="white" />
        </svg>

        {/* Glow */}
        <div className="absolute inset-0 rounded-xl bg-brand-400 opacity-0 group-hover:opacity-20 blur-sm transition-opacity" />
      </div>

      {/* Wordmark */}
      <span className={`font-bold tracking-tight ${text} text-white`}>
        Book<span className="text-brand-500">Wise</span>
      </span>
    </Wrapper>
  );
};

export default Logo;

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Ambient brand glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[12%] h-64 w-64 rounded-full bg-brand-500/[0.06] blur-3xl" />

      {/* Logo */}
      <div className="relative mb-12 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/30">
          <CalendarDays className="h-4 w-4" />
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">
          Book<span className="text-brand-500">wise</span>
        </span>
      </div>

      {/* 404 */}
      <p className="relative mb-6 select-none bg-gradient-to-b from-brand-500/30 to-brand-500/5 bg-clip-text text-[7rem] font-black leading-none text-transparent">
        404
      </p>

      {/* Heading */}
      <h1 className="relative mb-3 text-2xl font-bold tracking-tight text-foreground">
        Page not found
      </h1>

      {/* Subtext */}
      <p className="relative mb-8 max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>

      {/* Buttons */}
      <div className="relative flex items-center gap-3">
        <Button
          variant="outline"
          className="h-11 rounded-xl"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Button
          className="group h-11 gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 hover:-translate-y-0.5"
          asChild
        >
          <Link href="/">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

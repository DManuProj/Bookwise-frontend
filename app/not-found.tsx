import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Home, ArrowLeft } from "lucide-react";

const NotFound = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
    {/* Logo */}
    <div className="flex items-center gap-2 mb-12">
      <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
        <Calendar className="h-4 w-4 text-white" />
      </div>
      <span className="text-lg font-bold text-foreground">
        Book<span className="text-brand-500">wise</span>
      </span>
    </div>

    {/* 404 */}
    <p className="text-8xl font-black text-brand-500/20 leading-none mb-6 select-none">
      404
    </p>

    {/* Heading */}
    <h1 className="text-2xl font-bold text-foreground mb-3">Page not found</h1>

    {/* Subtext */}
    <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-8">
      The page you're looking for doesn't exist or may have been moved.
    </p>

    {/* Buttons */}
    <div className="flex items-center gap-3">
      <Button variant="outline" className="rounded-xl gap-2" asChild>
        <Link href="javascript:history.back()">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Link>
      </Button>
      <Button
        className="rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-brand-500/20 gap-2"
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

export default NotFound;

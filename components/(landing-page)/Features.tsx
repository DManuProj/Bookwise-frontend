import Container from "@/components/shared/Container";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mic,
  Calendar,
  Users,
  Bell,
  BarChart3,
  Globe,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Calendar",
    description:
      "Visual calendar with real-time availability. Block time off, set buffer minutes and manage bookings at a glance.",
    iconBg: "bg-brand-500/10",
    iconColor: "text-brand-600 dark:text-brand-400",
  },
  {
    icon: Users,
    title: "Staff Management",
    description:
      "Add staff members, assign services to each person and set individual working hours and days off.",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Bell,
    title: "Auto Reminders",
    description:
      "Automated email and SMS reminders sent before every appointment. Reduce no-shows by up to 60%.",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description:
      "Track bookings, popular services, staff performance and customer return rates — all in one clean dashboard.",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
];

const cardBase =
  "group card-surface rounded-2xl cursor-default transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/10";

const Features = () => {
  return (
    <section id="features" className="py-24 bg-section">
      <Container>
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
            <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
              Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Everything your business needs
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            One platform. Voice AI, smart scheduling, and zero missed bookings.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured — Voice AI (spans 2 cols on lg) */}
          <Card className="group relative overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-brand-500/5 to-transparent dark:from-brand-500/20 dark:via-brand-500/8 cursor-default transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/15 md:col-span-2 lg:col-span-2">
            {/* glow */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
            <CardContent className="relative p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30">
                  <Mic className="h-6 w-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500" />
                  </span>
                  <span className="text-brand-700 dark:text-brand-300 text-[11px] font-bold tracking-wide">
                    LIVE
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-3">
                Voice AI Receptionist
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                Customers visit your booking page, click talk to AI, and speak
                naturally. The AI checks availability and books instantly — no
                human needed, 24 hours a day.
              </p>
            </CardContent>
          </Card>

          {/* Standard feature cards */}
          {features.map(
            ({ icon: Icon, title, description, iconBg, iconColor }) => (
              <Card key={title} className={cardBase}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${iconBg} mb-4 transition-transform duration-200 group-hover:scale-110`}
                  >
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ),
          )}

          {/* Wide footer card — Public Booking Page */}
          <div className="group md:col-span-2 lg:col-span-2 pb-1">
            <Card className="relative overflow-hidden rounded-2xl card-surface cursor-default transition-all duration-200 group-hover:-translate-y-1 group-hover:border-brand-500/30 group-hover:shadow-lg group-hover:shadow-brand-500/10 h-full">
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 h-full">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand-500/10 shrink-0 transition-transform duration-200 group-hover:scale-110">
                  <Globe className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1.5">
                    Public Booking Page
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your own booking page at bookwise.ai/book/yourname. Share
                    the link — no website required.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 border border-border text-sm font-medium text-muted-foreground group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                  <span className="font-mono text-xs">
                    bookwise.ai/book/you
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Features;

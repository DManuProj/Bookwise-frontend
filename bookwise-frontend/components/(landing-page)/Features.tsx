import Container from "@/components/shared/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mic, Calendar, Users, Bell, BarChart3, Globe } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice AI Receptionist",
    description:
      "Customers speak naturally and the AI understands, checks availability and books instantly — no human needed.",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
    hoverBorder: "hover:border-violet-200 dark:hover:border-violet-500/30",
  },
  {
    icon: Calendar,
    title: "Smart Calendar",
    description:
      "Visual calendar with real-time availability. Block time off, set buffer minutes and manage bookings at a glance.",
    iconBg: "bg-brand-500/10",
    iconColor: "text-brand-600 dark:text-brand-400",
    hoverBorder: "hover:border-brand-200 dark:hover:border-brand-500/30",
  },
  {
    icon: Users,
    title: "Staff Management",
    description:
      "Add staff members, assign services to each person and set individual working hours and days off.",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    hoverBorder: "hover:border-blue-200 dark:hover:border-blue-500/30",
  },
  {
    icon: Bell,
    title: "Auto Reminders",
    description:
      "Automated email and SMS reminders sent before every appointment. Reduce no-shows by up to 60%.",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    hoverBorder: "hover:border-amber-200 dark:hover:border-amber-500/30",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description:
      "Track bookings, revenue trends, popular services and staff performance — all in one clean dashboard.",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-600 dark:text-rose-400",
    hoverBorder: "hover:border-rose-200 dark:hover:border-rose-500/30",
  },
  {
    icon: Globe,
    title: "Public Booking Page",
    description:
      "Your own booking page at bookwise.ai/book/yourname. Share the link — no website required.",
    iconBg: "bg-brand-500/10",
    iconColor: "text-brand-600 dark:text-brand-400",
    hoverBorder: "hover:border-brand-200 dark:hover:border-brand-500/30",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-section">
      <Container>
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
            <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
              Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything your business needs
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            One platform. Voice AI, smart scheduling, and zero missed bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(
            ({
              icon: Icon,
              title,
              description,
              iconBg,
              iconColor,
              hoverBorder,
            }) => (
              <Card
                key={title}
                className={`group card-surface rounded-2xl ${hoverBorder} cursor-default`}
              >
                <CardContent className="px-6  flex flex-col ">
                  <div className="flex  items-center gap-3">
                    <div
                      className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${iconBg} mb-4`}
                    >
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {title}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      </Container>
    </section>
  );
};

export default Features;

import Container from "@/components/shared/Container";
import { UserPlus, Share2, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your account",
    description:
      "Sign up, set your business hours, add your services and configure your team. Takes less than 5 minutes.",
  },
  {
    number: "02",
    icon: Share2,
    title: "Share your booking page",
    description:
      "Get your unique link instantly. Add it to your Instagram bio, WhatsApp, or embed it on your website.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "AI handles the rest",
    description:
      "Customers talk to your AI assistant online or book manually. The AI handles the conversation, creates the booking and sends confirmation — all automatically.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-section">
      <Container>
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
            <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
              How It Works
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Up and running in minutes
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Three simple steps to automate your bookings forever.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <div
                key={number}
                className="group relative card-surface rounded-2xl p-8 pt-9 transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/10"
              >
                {/* Ghost numeral */}
                <span className="pointer-events-none absolute top-4 right-6 text-6xl font-black leading-none text-brand-500/10 dark:text-brand-500/15 select-none">
                  {number}
                </span>

                {/* Icon node — sits on the connector line */}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30 mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                  <span className="absolute -bottom-1.5 -right-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-card border border-brand-500/30 text-[11px] font-bold text-brand-600 dark:text-brand-300 shadow-sm">
                    {number.replace("0", "")}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;

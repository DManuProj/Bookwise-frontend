import Container from "@/components/shared/Container";
import { UserPlus, Share2, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your account",
    description:
      "Sign up, set your business hours, add your services and configure your team. Takes less than 5 minutes.",
    color: "text-brand-600 dark:text-brand-400",
    bg: "bg-brand-500/10",
    border: "border-brand-500/20 ",
    numberColor: "text-brand-500",
  },
  {
    number: "02",
    icon: Share2,
    title: "Share your booking page",
    description:
      "Get your unique link instantly. Add it to your Instagram bio, WhatsApp, or embed it on your website.",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20 ",
    numberColor: "text-violet-500",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "AI handles the rest",
    description:
      "Customers talk to your AI assistant online or book manually. The AI handles the conversation, creates the booking and sends confirmation — all automatically.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    numberColor: "text-amber-500",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-section">
      <Container>
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
            <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
              How It Works
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Up and running in minutes
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Three simple steps to automate your bookings forever.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div
            className="hidden lg:block absolute top-16  left-1/2 -translate-x-1/2 w-2/3 h-px
            bg-linear-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {steps.map(
              ({
                number,
                icon: Icon,
                title,
                description,
                color,
                bg,
                border,
                numberColor,
              }) => (
                <div
                  key={number}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Number left, Icon right */}
                  <div className="relative mb-6 w-full flex flex-col-reverse gap-2 items-center justify-center px-2">
                    {/* Number — visible, colored, no opacity fade */}
                    <span
                      className={`text-5xl font-black ${numberColor} dark:opacity-40 leading-none`}
                    >
                      {number}
                    </span>

                    {/* Icon — solid bg, no transparency */}
                    <div
                      className={`w-16 h-16 rounded-2xl ${bg}  border ${border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      style={{ backdropFilter: "none" }}
                    >
                      <Icon className={`h-7 w-7 ${color}`} />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;

import Container from "@/components/shared/Container";
import { Mic, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoiceDemoCard from "@/components/(landing-page)/VoiceDemoCard";

const capabilities = [
  "Answers in your business name and language",
  "Checks real-time staff availability instantly",
  "Books, reschedules and cancels appointments",
  "Sends booking confirmation to the customer",
  "Handles multiple bookings simultaneously",
];

const VoiceDemo = () => {
  return (
    <section id="voice-demo" className="py-24 bg-section overflow-hidden">
      <Container>
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 mb-4">
            <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
              Voice AI
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hear it in action
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            See exactly how your customers experience booking with Bookwise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Voice demo card */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-0 bg-brand-500 opacity-15 blur-3xl rounded-3xl" />
            <VoiceDemoCard />
          </div>

          {/* Capabilities */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Your AI receptionist never sleeps
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Available 24 hours a day, 7 days a week. Your customers always get
              a response — even at 2am on a Sunday.
            </p>
            <ul className="space-y-4 mb-10">
              {capabilities.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="bg-brand-500 hover:bg-brand-600 text-white px-8 rounded-xl shadow-lg shadow-brand-500/25"
            >
              <Mic className="mr-2 h-4 w-4" />
              Try Voice Demo
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default VoiceDemo;

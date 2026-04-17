import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Zap } from "lucide-react";

const CTA = () => {
  return (
    <section className="bg-section py-24">
      <Container>
        <div
          className="relative rounded-3xl overflow-hidden px-8 py-16 md:py-20 text-center"
          style={{
            background:
              "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
          }}
        >
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full opacity-[0.06]" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full opacity-[0.06]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full opacity-[0.03]" />
            {/* Extra depth for dark mode */}
            <div className="absolute inset-0 dark:bg-black/20" />
          </div>

          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 mb-6">
            <Zap className="h-3.5 w-3.5 text-white" />
            <span className="text-white text-xs font-semibold uppercase tracking-wider">
              Get Started Today
            </span>
          </div>

          {/* Heading */}
          <h2 className="relative text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Start booking smarter today
          </h2>

          {/* Subtext */}
          <p className="relative text-lg text-white/85 max-w-xl mx-auto mb-10 leading-relaxed">
            Join 500+ businesses already using Bookwise. Free to start. No
            credit card required.
          </p>

          {/* CTA Button */}
          <div className="relative">
            <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
              <Button
                size="lg"
                className="bg-white text-brand-600 hover:bg-white/90 px-10 py-6 text-base font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignUpButton>
          </div>

          <p className="relative text-white/60 text-sm mt-5">
            Setup takes less than 5 minutes
          </p>
        </div>
      </Container>
    </section>
  );
};

export default CTA;

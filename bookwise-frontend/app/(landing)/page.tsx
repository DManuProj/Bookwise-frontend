import CTA from "@/components/(landing-page)/CTA";
import FAQ from "@/components/(landing-page)/FAQ";
import Features from "@/components/(landing-page)/Features";
import Hero from "@/components/(landing-page)/Hero";
import HowItWorks from "@/components/(landing-page)/HowItWorks";
import LogoStrip from "@/components/(landing-page)/LogoStrip";
import Pricing from "@/components/(landing-page)/Pricing";
import Testimonials from "@/components/(landing-page)/Testimonials";
import VoiceDemo from "@/components/(landing-page)/VoiceDemo";

const HomePage = () => {
  return (
    <>
      <Hero />
      <LogoStrip />
      <Features />
      <HowItWorks />
      <VoiceDemo />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
};

export default HomePage;

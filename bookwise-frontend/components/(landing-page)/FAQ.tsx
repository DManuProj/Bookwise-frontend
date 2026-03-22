"use client";

import { useState } from "react";
import Container from "@/components/shared/Container";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Do my customers need to download an app?",
    answer:
      "No. Customers book through your public booking page in any browser, or by calling your AI voice number. No app, no account, no friction.",
  },
  {
    question: "What if I don't have a website?",
    answer:
      "You don't need one. Bookwise gives you a public booking page at bookwise.ai/book/yourname that you can share anywhere — Instagram bio, WhatsApp, QR code on your door.",
  },
  {
    question: "Can I use this if I work alone with no staff?",
    answer:
      "Absolutely. Many solo operators use Bookwise. You are the only staff member and the AI books directly with you. The Starter plan is completely free for this.",
  },
  {
    question: "How does the voice AI actually work?",
    answer:
      "When a customer calls your Bookwise number, our AI answers in your business name, understands natural speech, checks your real-time availability and books the appointment — all without any human involvement.",
  },
  {
    question: "What happens when a customer calls outside business hours?",
    answer:
      "The AI still answers and lets the customer know your hours. It can take a message or offer the next available slot when you reopen — you decide the behaviour in your settings.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, no contracts and no cancellation fees. You can downgrade or cancel from your dashboard at any time. Your data remains accessible for 30 days after cancellation.",
  },
  {
    question: "Is my customer data safe?",
    answer:
      "Yes. All data is encrypted at rest and in transit. We are GDPR compliant and never sell or share your customer data with third parties.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most businesses are fully set up in under 10 minutes. You add your services, set your hours and your booking page is live immediately.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="bg-section py-24">
      <Container>
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
            <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
              FAQ
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know before getting started.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map(({ question, answer }, i) => (
            <div
              key={i}
              className={`card-surface rounded-xl overflow-hidden transition-all duration-200 ${
                openIndex === i
                  ? "border-brand-500/40 shadow-sm shadow-brand-500/10"
                  : "card-hover"
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4 hover:bg-muted/40 transition-colors"
              >
                <span className="text-sm font-semibold text-foreground">
                  {question}
                </span>
                <span
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    openIndex === i
                      ? "bg-brand-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {openIndex === i ? (
                    <Minus className="h-3 w-3" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                </span>
              </button>

              {openIndex === i && (
                <div className="px-6 pb-5 border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FAQ;

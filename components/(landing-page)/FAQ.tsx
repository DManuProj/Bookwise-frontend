"use client";

import { useState } from "react";
import Container from "@/components/shared/Container";
import { Plus, MessageCircle } from "lucide-react";

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
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know before getting started.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map(({ question, answer }, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-xl border transition-all duration-200 ${
                  isOpen
                    ? "bg-card border-brand-500/40 shadow-md shadow-brand-500/10"
                    : "card-surface hover:border-brand-500/30 hover:shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                >
                  <span
                    className={`text-[15px] font-semibold transition-colors ${
                      isOpen
                        ? "text-brand-700 dark:text-brand-300"
                        : "text-foreground"
                    }`}
                  >
                    {question}
                  </span>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-brand-500 text-white rotate-45 shadow-sm shadow-brand-500/40"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </button>

                {/* Smooth height-animated panel */}
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="max-w-3xl mx-auto mt-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-brand-500/20 bg-brand-500/5 px-7 py-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-xl bg-brand-500/10 shrink-0">
                <MessageCircle className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Still have questions?
                </p>
                <p className="text-sm text-muted-foreground">
                  Our team usually replies within a few hours.
                </p>
              </div>
            </div>
            <a
              href="mailto:support@bookwise.ai"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-brand-600 transition-colors shrink-0"
            >
              Contact supports
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FAQ;

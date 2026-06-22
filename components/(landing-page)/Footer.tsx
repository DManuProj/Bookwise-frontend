"use client";

import Container from "@/components/shared/Container";
import Logo from "@/components/shared/Logo";
import Link from "next/link";
import { Twitter, Linkedin, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

const Footer = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  return (
    <footer className="bg-footer relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

      <Container>
        {/* Newsletter row */}
        <div className="relative py-12 border-b border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1.5">
              Stay in the loop
            </h3>
            <p className="text-sm text-slate-400">
              Product updates and booking tips. No spam, unsubscribe anytime.
            </p>
          </div>
          <form className="flex w-full md:w-auto items-center gap-2.5">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="flex-1 md:w-64 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500/50 focus:bg-white/10 transition-colors"
            />
            <button
              type="submit"
              className="h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-brand-600 transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Main links */}
        <div className="relative py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Logo asLink href="/" variant={isDark ? "light" : "dark"} />
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
              AI-powered booking for service businesses. Let your receptionist
              work 24/7 so you never miss a customer again.
            </p>

            {/* Status pill */}
            <div className="inline-flex items-center gap-2 mt-6 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
              </span>
              <span className="text-xs font-medium text-brand-300">
                All systems operational
              </span>
            </div>

            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-500/20 hover:border-brand-500/30 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-slate-400 hover:text-brand-300 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className="relative border-t border-white/5">
        <Container>
          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Bookwise. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {[
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Cookies", href: "/cookies" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;

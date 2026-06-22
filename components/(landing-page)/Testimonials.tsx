import Container from "@/components/shared/Container";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah K.",
    role: "Salon Owner",
    avatar: "SK",
    avatarBg: "bg-violet-500",
    rating: 5,
    text: "Bookwise saved me 3 hours every single day. My customers love talking to the AI and I never miss a booking anymore. Best investment I've made for my salon.",
  },
  {
    name: "James T.",
    role: "Personal Trainer",
    avatar: "JT",
    avatarBg: "bg-brand-500",
    rating: 5,
    text: "I went from 20% no-shows to almost zero after turning on the reminders. The voice AI handles everything while I'm with clients. Absolutely game changing.",
  },
  {
    name: "Priya M.",
    role: "Therapist",
    avatar: "PM",
    avatarBg: "bg-amber-500",
    rating: 5,
    text: "Set it up in 20 minutes. My clients genuinely think I have a full-time receptionist. The AI is so natural and books correctly every single time.",
  },
  {
    name: "David R.",
    role: "Barbershop Owner",
    avatar: "DR",
    avatarBg: "bg-blue-500",
    rating: 5,
    text: "Three staff members, 80+ bookings a week and zero scheduling conflicts. Bookwise manages everything. I don't know how we operated without it.",
  },
  {
    name: "Anika S.",
    role: "Spa Manager",
    avatar: "AS",
    avatarBg: "bg-rose-500",
    rating: 5,
    text: "Our customers call at all hours. Bookwise answers every single time and books perfectly. Our revenue went up 30% in the first month alone.",
  },
  {
    name: "Tom W.",
    role: "Physio Clinic",
    avatar: "TW",
    avatarBg: "bg-teal-500",
    rating: 5,
    text: "GDPR compliant, reliable and incredibly easy to set up. Our entire front desk workflow is now automated. The team can finally focus on patients.",
  },
];

// First testimonial is featured (spans 2 columns with a larger quote).
const [featured, ...rest] = testimonials;

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-section">
      <Container>
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
            <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Loved by service businesses
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join hundreds of businesses already saving time with Bookwise.
          </p>
        </div>

        {/* Rating summary */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            <strong className="text-foreground font-bold">4.9/5</strong> from
            500+ businesses
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured card — spans 2 cols */}
          <div className="group relative overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-brand-500/5 to-transparent dark:from-brand-500/20 dark:via-brand-500/8 p-8 md:col-span-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/15">
            <div className="absolute -top-12 -right-8 w-48 h-48 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
            <Quote className="relative h-9 w-9 text-brand-500/40 mb-4" />
            <div className="relative flex items-center gap-0.5 mb-4">
              {[...Array(featured.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="relative text-lg md:text-xl text-foreground leading-relaxed font-medium mb-6 text-pretty max-w-2xl">
              &quot;{featured.text}&quot;
            </p>
            <div className="relative flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-full ${featured.avatarBg} flex items-center justify-center shrink-0 ring-2 ring-card`}
              >
                <span className="text-white text-sm font-bold">
                  {featured.avatar}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {featured.name}
                </p>
                <p className="text-xs text-muted-foreground">{featured.role}</p>
              </div>
            </div>
          </div>

          {/* Standard cards */}
          {rest.map(({ name, role, avatar, avatarBg, rating, text }) => (
            <div
              key={name}
              className="group card-surface rounded-2xl p-6 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/10"
            >
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                &quot;{text}&quot;
              </p>
              <div className="pt-4 border-t border-border flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center shrink-0 ring-2 ring-card`}
                >
                  <span className="text-white text-xs font-bold">{avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {name}
                  </p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;

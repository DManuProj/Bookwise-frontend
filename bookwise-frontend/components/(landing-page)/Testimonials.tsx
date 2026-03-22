// import Container from "@/components/shared/Container";
// import { Star } from "lucide-react";

// const testimonials = [
//   {
//     name: "Sarah K.",
//     role: "Salon Owner",
//     avatar: "SK",
//     avatarBg: "bg-violet-500",
//     rating: 5,
//     text: "Bookwise saved me 3 hours every single day. My customers love talking to the AI and I never miss a booking anymore. Best investment I've made for my salon.",
//   },
//   {
//     name: "James T.",
//     role: "Personal Trainer",
//     avatar: "JT",
//     avatarBg: "bg-brand-500",
//     rating: 5,
//     text: "I went from 20% no-shows to almost zero after turning on the reminders. The voice AI handles everything while I'm with clients. Absolutely game changing.",
//   },
//   {
//     name: "Priya M.",
//     role: "Therapist",
//     avatar: "PM",
//     avatarBg: "bg-amber-500",
//     rating: 5,
//     text: "Set it up in 20 minutes. My clients genuinely think I have a full-time receptionist. The AI is so natural and books correctly every single time.",
//   },
//   {
//     name: "David R.",
//     role: "Barbershop Owner",
//     avatar: "DR",
//     avatarBg: "bg-blue-500",
//     rating: 5,
//     text: "Three staff members, 80+ bookings a week and zero scheduling conflicts. Bookwise manages everything. I don't know how we operated without it.",
//   },
//   {
//     name: "Anika S.",
//     role: "Spa Manager",
//     avatar: "AS",
//     avatarBg: "bg-rose-500",
//     rating: 5,
//     text: "Our customers call at all hours. Bookwise answers every single time and books perfectly. Our revenue went up 30% in the first month alone.",
//   },
//   {
//     name: "Tom W.",
//     role: "Physio Clinic",
//     avatar: "TW",
//     avatarBg: "bg-teal-500",
//     rating: 5,
//     text: "GDPR compliant, reliable and incredibly easy to set up. Our entire front desk workflow is now automated. The team can finally focus on patients.",
//   },
// ];

// const Testimonials = () => {
//   return (
//     <section id="testimonials" className="py-24 bg-section">
//       <Container>
//         {/* Header */}
//         <div className="max-w-2xl mx-auto text-center mb-16">
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
//             <span className="text-brand-600 text-xs font-semibold uppercase tracking-wider">
//               Testimonials
//             </span>
//           </div>
//           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
//             Loved by service businesses
//           </h2>
//           <p className="text-lg text-slate-500 leading-relaxed">
//             Join hundreds of businesses already saving time with Bookwise.
//           </p>
//         </div>

//         {/* Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {testimonials.map(
//             ({ name, role, avatar, avatarBg, rating, text }) => (
//               <div
//                 key={name}
//                 className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300"
//               >
//                 {/* Stars */}
//                 <div className="flex items-center gap-0.5 mb-4">
//                   {[...Array(rating)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className="h-4 w-4 fill-amber-400 text-amber-400"
//                     />
//                   ))}
//                 </div>

//                 {/* Text */}
//                 <p className="text-sm text-slate-600 leading-relaxed mb-6">
//                   &quot;{text}&quot;
//                 </p>

//                 {/* Author */}
//                 <div className="flex items-center gap-3">
//                   <div
//                     className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center shrink-0`}
//                   >
//                     <span className="text-white text-xs font-bold">
//                       {avatar}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-slate-900">
//                       {name}
//                     </p>
//                     <p className="text-xs text-slate-400">{role}</p>
//                   </div>
//                 </div>
//               </div>
//             ),
//           )}
//         </div>
//       </Container>
//     </section>
//   );
// };

// export default Testimonials;
import Container from "@/components/shared/Container";
import { Star } from "lucide-react";

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

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-section">
      <Container>
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
            <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by service businesses
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join hundreds of businesses already saving time with Bookwise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(
            ({ name, role, avatar, avatarBg, rating, text }) => (
              <div
                key={name}
                className="card-surface card-hover rounded-2xl p-6"
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  &quot;{text}&quot;
                </p>
                <div className="pt-4 border-t border-border flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center shrink-0`}
                  >
                    <span className="text-white text-xs font-bold">
                      {avatar}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {name}
                    </p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;

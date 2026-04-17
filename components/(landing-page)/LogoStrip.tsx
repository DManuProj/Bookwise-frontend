// import Container from "@/components/shared/Container";
// import {
//   Scissors,
//   Dumbbell,
//   Heart,
//   Briefcase,
//   Sparkles,
//   Home,
//   Stethoscope,
//   GraduationCap,
// } from "lucide-react";

// const industries = [
//   { label: "Salons", icon: Scissors },
//   { label: "Gyms", icon: Dumbbell },
//   { label: "Clinics", icon: Stethoscope },
//   { label: "Consultants", icon: Briefcase },
//   { label: "Spas", icon: Sparkles },
//   { label: "Therapists", icon: Heart },
//   { label: "Home Services", icon: Home },
//   { label: "Tutors", icon: GraduationCap },
// ];

// const LogoStrip = () => {
//   return (
//     <section className="bg-section border-y border-brand-100 dark:border-white/5 py-14">
//       <Container>
//         <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-10">
//           Trusted by businesses across these industries
//         </p>

//         <div className="flex flex-wrap items-center justify-center gap-3">
//           {industries.map(({ label, icon: Icon }) => (
//             <div
//               key={label}
//               className="flex items-center gap-2.5 px-5 py-2.5 rounded-full cursor-default
//                 border border-brand-200 bg-white/70 text-slate-500
//                 hover:border-brand-400 hover:bg-brand-500/8 hover:text-brand-700
//                 dark:border-white/8 dark:bg-white/4 dark:text-slate-400
//                 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/8 dark:hover:text-brand-400
//                 transition-all duration-200 group"
//             >
//               <Icon className="h-4 w-4 transition-colors" />
//               <span className="text-sm font-medium transition-colors">
//                 {label}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Stats */}
//         <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
//           {[
//             { value: "500+", label: "Businesses" },
//             { value: "50K+", label: "Bookings Made" },
//             { value: "98%", label: "Customer Satisfaction" },
//             { value: "3 hrs", label: "Saved Per Day" },
//           ].map(({ value, label }) => (
//             <div key={label} className="text-center">
//               <p className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
//                 {value}
//               </p>
//               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
//                 {label}
//               </p>
//             </div>
//           ))}
//         </div>
//       </Container>
//     </section>
//   );
// };

// export default LogoStrip;
import Container from "@/components/shared/Container";
import {
  Scissors,
  Dumbbell,
  Heart,
  Briefcase,
  Sparkles,
  Home,
  Stethoscope,
  GraduationCap,
} from "lucide-react";

const industries = [
  { label: "Salons", icon: Scissors },
  { label: "Gyms", icon: Dumbbell },
  { label: "Clinics", icon: Stethoscope },
  { label: "Consultants", icon: Briefcase },
  { label: "Spas", icon: Sparkles },
  { label: "Therapists", icon: Heart },
  { label: "Home Services", icon: Home },
  { label: "Tutors", icon: GraduationCap },
];

const LogoStrip = () => {
  return (
    <section className="bg-section  py-14  ">
      {/* <div
        className="hidden lg:block absolute top-16  left-1/2 -translate-x-1/2 w-2/3 h-px
            bg-linear-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"
      /> */}

      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-10">
          Trusted by businesses across these industries
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {industries.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full cursor-default
                border border-slate-200 dark:border-white/8
                bg-white dark:bg-white/4
                text-slate-500 dark:text-slate-400
                hover:border-brand-400 dark:hover:border-brand-500/40
                hover:bg-brand-50 dark:hover:bg-brand-500/8
                hover:text-brand-700 dark:hover:text-brand-400
                transition-all duration-200"
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "500+", label: "Businesses" },
            { value: "50K+", label: "Bookings Made" },
            { value: "98%", label: "Customer Satisfaction" },
            { value: "3 hrs", label: "Saved Per Day" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                {value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default LogoStrip;

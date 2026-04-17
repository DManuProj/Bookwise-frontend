// import Container from "@/components/shared/Container";
// import { Mic, CheckCircle2, PhoneCall } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const capabilities = [
//   "Answers in your business name and language",
//   "Checks real-time staff availability instantly",
//   "Books, reschedules and cancels appointments",
//   "Sends booking confirmation to the customer",
//   "Handles multiple bookings simultaneously",
// ];

// const conversation = [
//   { from: "customer", text: "Hi, I'd like to book a massage for Sunday" },
//   {
//     from: "ai",
//     text: "Of course! We have 11am and 2pm available on Sunday. Which works for you?",
//   },
//   { from: "customer", text: "2pm please, for about an hour" },
//   {
//     from: "ai",
//     text: "Perfect — 2pm with Maya on Sunday. Can I get your name and number?",
//   },
//   { from: "customer", text: "Sarah, 0771 234 567" },
//   {
//     from: "ai",
//     text: "✅ Booked! You'll receive a booking confirmation shortly, Sarah.",
//   },
// ];
// const VoiceDemo = () => {
//   return (
//     <section id="voice-demo" className="py-24 overflow-hidden">
//       <Container>
//         {/* Header */}
//         <div className="max-w-2xl mx-auto text-center mb-16">
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 mb-4">
//             <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">
//               Voice AI
//             </span>
//           </div>
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
//             Hear it in action
//           </h2>
//           <p className="text-lg text-slate-400 leading-relaxed">
//             See exactly how your customers experience booking with Bookwise.
//           </p>
//         </div>

//         {/* Two column layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           {/* Left — Phone mockup */}
//           <div className="relative mx-auto w-full max-w-sm">
//             {/* Glow */}
//             <div className="absolute inset-0 bg-brand-500 opacity-15 blur-3xl rounded-3xl" />

//             {/* Phone card */}
//             <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-5 shadow-2xl">
//               {/* Phone header */}
//               <div className="flex items-center justify-between mb-5">
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
//                     <Mic className="h-4 w-4 text-brand-400" />
//                   </div>
//                   <div>
//                     <p className="text-white text-sm font-medium">
//                       AI Receptionist
//                     </p>
//                     <p className="text-slate-500 text-xs">Bookwise Voice</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/20 border border-brand-500/30">
//                   <PhoneCall className="h-3 w-3 text-brand-400" />
//                   <span className="text-brand-400 text-xs font-medium">
//                     Active
//                   </span>
//                 </div>
//               </div>

//               {/* Conversation */}
//               <div className="space-y-3 mb-5">
//                 {conversation.map((msg, i) => (
//                   <div
//                     key={i}
//                     className={`flex ${msg.from === "customer" ? "justify-end" : "justify-start"}`}
//                   >
//                     <div
//                       className={`px-3.5 py-2 rounded-2xl max-w-[85%] text-sm ${
//                         msg.from === "customer"
//                           ? "bg-slate-700/70 text-slate-200 rounded-tr-sm"
//                           : "bg-brand-500/20 border border-brand-500/20 text-slate-200 rounded-tl-sm"
//                       }`}
//                     >
//                       {msg.text}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Waveform */}
//               <div className="flex items-center gap-1 justify-center py-2">
//                 {[
//                   2, 4, 7, 5, 9, 6, 3, 8, 5, 4, 7, 4, 2, 5, 8, 4, 3, 6, 9, 4,
//                 ].map((h, i) => (
//                   <div
//                     key={i}
//                     className="bg-brand-500 rounded-full opacity-70"
//                     style={{ width: "3px", height: `${h * 2.5}px` }}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right — Capabilities */}
//           <div>
//             <h3 className="text-2xl font-bold text-white mb-3">
//               Your AI receptionist never sleeps
//             </h3>
//             <p className="text-slate-400 mb-8 leading-relaxed">
//               Available 24 hours a day, 7 days a week. Your customers always get
//               a response — even at 2am on a Sunday.
//             </p>

//             <ul className="space-y-4 mb-10">
//               {capabilities.map((item) => (
//                 <li key={item} className="flex items-start gap-3">
//                   <CheckCircle2 className="h-5 w-5 text-brand-500 mt-0.5 shrink-0" />
//                   <span className="text-slate-300 text-sm leading-relaxed">
//                     {item}
//                   </span>
//                 </li>
//               ))}
//             </ul>

//             <Button
//               size="lg"
//               className="bg-brand-500 hover:bg-brand-600 text-white px-8 rounded-xl"
//             >
//               <Mic className="mr-2 h-4 w-4" />
//               Try Voice Demo
//             </Button>
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// };

// export default VoiceDemo;
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

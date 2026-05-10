import { Organisation, OrgData } from "@/types";
import BookingFlow from "@/components/booking/BookingFlow";

const ORG_DATA: Organisation = {
  name: "Glow Beauty Studio",
  slug: "glow-beauty",
  description:
    "A luxury beauty studio specializing in skincare, nail art and relaxation treatments in the heart of the city.",
  phone: "+1 555 0200",
  address: "456 Park Ave, New York, NY 10022",
  logo: null,
  services: [
    {
      id: "s1",
      name: "Classic Facial",
      duration: 60,
      price: 75,
      buffer: 15,
      description: "Deep cleansing facial for radiant skin",
    },
    {
      id: "s2",
      name: "Gel Manicure",
      duration: 45,
      price: 45,
      buffer: 10,
      description: "Long-lasting gel polish with nail shaping",
    },
    {
      id: "s3",
      name: "Swedish Massage",
      duration: 60,
      price: 90,
      buffer: 15,
      description: "Full body relaxation massage",
    },
    {
      id: "s4",
      name: "Eyebrow Threading",
      duration: 15,
      price: 20,
      buffer: 5,
      description: "",
    },
    {
      id: "s5",
      name: "Lash Extensions",
      duration: 90,
      price: 120,
      buffer: 20,
      description: "Volume or classic lash sets",
    },
    {
      id: "s6",
      name: "Hot Stone Massage",
      duration: 75,
      price: 110,
      buffer: 15,
      description: "Heated stone therapy for deep relaxation",
    },
  ],
  staff: [
    { id: "st1", name: "Sophie", role: "OWNER", photo: null },
    { id: "st2", name: "Rachel", role: "MEMBER", photo: null },
    { id: "st3", name: "Mia", role: "MEMBER", photo: null },
  ],
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  return <BookingFlow org={ORG_DATA} />;
}

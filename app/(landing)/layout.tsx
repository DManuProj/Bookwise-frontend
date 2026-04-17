import Footer from "@/components/(landing-page)/Footer";
import Navbar from "@/components/(landing-page)/Navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="landing-bg min-h-screen">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;

import Footer from "@/components/(landing-page)/Footer";
import Navbar from "@/components/(landing-page)/Navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main
        className="pt-16 md:pt-20"
        // style={{
        //   background:
        //     "linear-gradient(135deg, #020617 0%, #0f172a 60%, #022c22 100%)",
        // }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MarketingLayout;

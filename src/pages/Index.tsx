import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import DisclaimerSection from "@/components/landing/DisclaimerSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <DisclaimerSection />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;

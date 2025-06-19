
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EnhancedAuthModal from "@/components/auth/EnhancedAuthModal";
import UserProfile from "@/components/UserProfile";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import QuickAccessNavigation from "@/components/home/QuickAccessNavigation";
import FeaturedDeals from "@/components/home/FeaturedDeals";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import { useState } from "react";

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <HeroSection />
      <StatsSection />
      <QuickAccessNavigation />
      <FeaturedDeals />
      <UpcomingEvents />
      <Testimonials />
      <CTASection 
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      <Footer />

      <EnhancedAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <UserProfile isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import Stats from "./components/Stats";
import HowItWorks from "./components/HowItWorks";
import TrustBadge from "./components/TrustBadge";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-800/5 backdrop-blur-3xl z-0" />
        <div
          className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-1000 ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <HeroSection />
          <Stats />
          <HowItWorks />
          <TrustBadge />
        </div>
      </div>
    </div>
  );
};

export default Home;

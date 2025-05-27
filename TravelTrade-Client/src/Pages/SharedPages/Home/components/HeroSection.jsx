import { useEffect, useState } from "react";
import { ChevronRight, Map, Plane, Shield, Star } from "lucide-react";

const HeroSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    { icon: <Star className="w-6 h-6" />, title: "Trusted Community", description: "Join thousands of verified users worldwide" },
    { icon: <Shield className="w-6 h-6" />, title: "Secure Payments", description: "Protected by our escrow system" },
    { icon: <Map className="w-6 h-6" />, title: "Global Reach", description: "Access to products from 100+ countries" },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
        {/* Left Column */}
        <div className="space-y-8">
          <h1 className="text-6xl font-bold text-blue-900 leading-tight">
            <span className="text-blue-600">Shop Globally.</span> Deliver Locally
          </h1>
          <p className="text-xl text-blue-800/80 max-w-xl">
            Break down borders with our global community of travelers. Get what you need from anywhere in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group bg-blue-800 text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3">
              <span>Start Shopping</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-xl font-medium hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 border-2 border-blue-800/20 bg-white/80 backdrop-blur-lg text-blue-800">
              <span>Become a Traveler</span>
              <Plane className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column - Animated Features */}
        <div className="relative h-[400px] hidden lg:block">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500
                ${index === activeFeature ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl border border-blue-100 shadow-xl w-full max-w-md transform hover:scale-105 transition-transform">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-800/10 rounded-lg text-blue-800">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">{feature.title}</h3>
                    <p className="text-blue-800/80">{feature.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

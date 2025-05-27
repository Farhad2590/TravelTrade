import { Globe, Package, Plane } from "lucide-react";
import { useEffect, useState } from "react";

const HowItWorks = () => {
      const [isVisible, setIsVisible] = useState(false);
      const [activeFeature, setActiveFeature] = useState(0);
    
    
      useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
          setActiveFeature((prev) => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
      }, []);
    const howItWorks = [
        {
          icon: <Globe className="w-8 h-8 text-blue-800" />,
          title: "Post Your Request",
          description: "Share what you need from abroad and set your budget",
        },
        {
          icon: <Plane className="w-8 h-8 text-blue-800" />,
          title: "Match with Travelers",
          description: "Connect with verified travelers heading your way",
        },
        {
          icon: <Package className="w-8 h-8 text-blue-800" />,
          title: "Secure Delivery",
          description: "Get your items delivered safely and securely",
        },
      ];
    
  return (
    <div className="py-20">
      <h2 className="text-4xl font-bold text-blue-900 text-center mb-16">
        How It <span className="text-blue-600">Works</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {howItWorks.map((step, index) => (
          <div
            key={index}
            className={`group relative ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 200}ms` }}
          >
            <div
              className="absolute inset-0 bg-blue-600 rounded-xl transform transition-transform 
                    group-hover:translate-x-2 group-hover:translate-y-2"
            ></div>
            <div
              className="relative bg-white p-8 rounded-xl border border-blue-100 transform transition-transform 
                    group-hover:-translate-x-1 group-hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-blue-800/10 rounded-lg flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                {step.title}
              </h3>
              <p className="text-blue-800/80">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;

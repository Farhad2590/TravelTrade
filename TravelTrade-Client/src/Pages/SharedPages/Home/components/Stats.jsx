import { Map, Star, Users } from "lucide-react";

const Stats = () => {
  const stats = [
    { number: "50K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "100+", label: "Countries", icon: <Map className="w-6 h-6" /> },
    { number: "99.9%", label: "Success Rate", icon: <Star className="w-6 h-6" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
      {stats.map((stat, index) => (
        <div key={index} className="relative group">
          <div className="absolute inset-0 bg-blue-600 rounded-xl transform transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
          <div className="relative bg-white p-6 rounded-xl border border-blue-100 transform transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-800/10 rounded-lg text-blue-800">{stat.icon}</div>
              <div>
                <div className="text-3xl font-bold text-blue-900">{stat.number}</div>
                <div className="text-blue-800/80">{stat.label}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;

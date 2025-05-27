import { Shield } from "lucide-react";


const TrustBadge = () => {
    return (
        <div className="py-20">
        <div className="relative group max-w-3xl mx-auto">
          <div
            className="absolute inset-0 bg-blue-600 rounded-xl transform transition-transform 
            group-hover:translate-x-2 group-hover:translate-y-2"
          ></div>
          <div
            className="relative bg-white p-8 rounded-xl border border-blue-100 transform transition-transform 
            group-hover:-translate-x-1 group-hover:-translate-y-1 text-center"
          >
            <div className="p-4 bg-blue-800/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Shield className="w-10 h-10 text-blue-800" />
            </div>
            <h3 className="text-3xl font-bold text-blue-900 mb-4">
              100% Secure Transactions
            </h3>
            <p className="text-blue-800/80 max-w-xl mx-auto">
              Every transaction is protected by our escrow system and
              verified traveler network. Your items and money are safe with
              us.
            </p>
          </div>
        </div>
      </div>
    );
};

export default TrustBadge;
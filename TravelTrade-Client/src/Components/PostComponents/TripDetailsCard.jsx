
import { formatDateTime } from '../../utils/dateFormatter';

const TripDetailsCard = ({ post }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-[#009ee2] p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Trip Information
        </h2>
        <p className="text-blue-100">
          {post.departureCity || "N/A"} to {post.arrivalCity || "N/A"}
        </p>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DepartureInfo post={post} />
          <ArrivalInfo post={post} />
        </div>
        
        <FlightInfo post={post} />
        <DeliveryInfo post={post} />
        <ContactInfo post={post} />
      </div>
    </div>
  );
};

const DepartureInfo = ({ post }) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h3 className="font-semibold text-[#009ee2] mb-3">Departure Details</h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600">City:</span>
        <span className="font-medium text-gray-800 capitalize">{post.departureCity || "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Airport:</span>
        <span className="font-medium text-gray-800">{post.departureAirport || "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Date & Time:</span>
        <span className="font-medium text-gray-800">{formatDateTime(post.departureDateTime)}</span>
      </div>
    </div>
  </div>
);

const ArrivalInfo = ({ post }) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h3 className="font-semibold text-[#009ee2] mb-3">Arrival Details</h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600">City:</span>
        <span className="font-medium text-gray-800 capitalize">{post.arrivalCity || "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Airport:</span>
        <span className="font-medium text-gray-800">{post.arrivalAirport || "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Date & Time:</span>
        <span className="font-medium text-gray-800">{formatDateTime(post.arrivalDateTime)}</span>
      </div>
    </div>
  </div>
);

const FlightInfo = ({ post }) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h3 className="font-semibold text-[#009ee2] mb-3">Flight Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex justify-between">
        <span className="text-gray-600">Airline:</span>
        <span className="font-medium text-gray-800 capitalize">{post.airline || "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Flight Number:</span>
        <span className="font-medium text-gray-800">{post.flightNumber || "N/A"}</span>
      </div>
    </div>
  </div>
);

const DeliveryInfo = ({ post }) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h3 className="font-semibold text-[#009ee2] mb-3">Delivery Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex justify-between">
        <span className="text-gray-600">Max Weight:</span>
        <span className="font-medium text-gray-800">{post.maxWeight || "N/A"} kg</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Restrictions:</span>
        <span className="font-medium text-gray-800">{post.restrictions || "None"}</span>
      </div>
      <div className="flex justify-between col-span-2">
        <span className="text-gray-600">Delivery Options:</span>
        <span className="font-medium text-gray-800 text-right">{post.deliveryOptions || "N/A"}</span>
      </div>
    </div>
  </div>
);

const ContactInfo = ({ post }) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h3 className="font-semibold text-[#009ee2] mb-3">Contact Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex justify-between">
        <span className="text-gray-600">Contact Method:</span>
        <span className="font-medium text-gray-800">{post.contactMethod || "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Response Time:</span>
        <span className="font-medium text-gray-800">{post.responseTime || "N/A"} hours</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Email:</span>
        <span className="font-medium text-gray-800">{post.email || "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Posted On:</span>
        <span className="font-medium text-gray-800">{formatDateTime(post.createdAt)}</span>
      </div>
    </div>
  </div>
);

export default TripDetailsCard;
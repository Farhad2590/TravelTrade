// InitialModal.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InitialModal = ({ onClose, postId }) => {
  const navigate = useNavigate();
  
  const handleOptionSelect = (type) => {
    navigate(`/post/${postId}/request/${type}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-[#009ee2] p-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Select Request Type
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <button
              onClick={() => handleOptionSelect('send')}
              className="w-full bg-blue-100 hover:bg-blue-200 transition text-blue-800 py-4 px-6 rounded-lg font-semibold text-lg border-2 border-blue-300"
            >
              I Will Send Parcel From Departure Destination
            </button>
            
            <button
              onClick={() => handleOptionSelect('bring')}
              className="w-full bg-green-100 hover:bg-green-200 transition text-green-800 py-4 px-6 rounded-lg font-semibold text-lg border-2 border-green-300"
            >
              I Have To Bring A Parcel From Departure Destination
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-500 hover:bg-gray-600 transition text-white py-3 px-6 rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialModal;
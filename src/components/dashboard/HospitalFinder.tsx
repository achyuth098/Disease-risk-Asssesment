
import React from 'react';
import { Hospital, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;
  specialties: string[];
}

interface HospitalFinderProps {
  pincode: string;
  setPincode: (value: string) => void;
  showHospitals: boolean;
  hospitals: Hospital[];
  onFindHospitals: () => void;
}

export const HospitalFinder: React.FC<HospitalFinderProps> = ({
  pincode,
  setPincode,
  showHospitals,
  hospitals,
  onFindHospitals,
}) => {
  return (
    <div className="bg-blue-50 p-6 rounded-lg mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Hospital className="h-5 w-5 mr-2 text-blue-500" />
        Find Hospitals Near You
      </h2>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-700">
            Enter your pincode to find nearby healthcare facilities
          </span>
        </div>
        
        <div className="flex gap-3">
          <Input 
            type="text" 
            placeholder="Enter your pincode" 
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            maxLength={6}
            className="bg-white"
          />
          <Button 
            onClick={onFindHospitals}
            className="whitespace-nowrap"
          >
            Find Hospitals
          </Button>
        </div>
        
        {showHospitals && (
          <div className="mt-4">
            <h4 className="font-medium mb-3">Nearby Hospitals & Clinics:</h4>
            <div className="space-y-3">
              {hospitals.map(hospital => (
                <div key={hospital.id} className="bg-white p-3 rounded-md border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{hospital.name}</h5>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {hospital.address}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">{hospital.distance}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {hospital.specialties.map((specialty, idx) => (
                      <span 
                        key={idx} 
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

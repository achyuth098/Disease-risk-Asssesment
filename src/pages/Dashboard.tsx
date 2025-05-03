
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { DiseaseSelection } from '@/components/dashboard/DiseaseSelection';
import { FileUpload } from '@/components/dashboard/FileUpload';
import { HospitalFinder } from '@/components/dashboard/HospitalFinder';

const Dashboard = () => {
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pincode, setPincode] = useState<string>('');
  const [showHospitals, setShowHospitals] = useState(false);
  const [hospitals, setHospitals] = useState<Array<{ id: string; name: string; address: string; distance: string; specialties: string[] }>>([]);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.success(`File uploaded: ${e.target.files[0].name}`);
    }
  };

  const handleStartAssessment = () => {
    if (!selectedDisease) {
      toast.error("Please select a disease for assessment");
      return;
    }
    
    navigate(`/assessment/${selectedDisease}`, { 
      state: { 
        disease: selectedDisease,
        fileName: file?.name,
        pincode: pincode // Pass pincode to be used for regional data
      } 
    });
  };

  const handleFindHospitals = () => {
    if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    const mockHospitals = [
      {
        id: '1',
        name: 'City General Hospital',
        address: `123 Health Ave, ${pincode}`,
        distance: '1.2 km',
        specialties: ['Cardiology', 'Endocrinology', 'General Medicine']
      },
      {
        id: '2',
        name: 'Community Medical Center',
        address: `456 Wellness Blvd, ${pincode}`,
        distance: '2.5 km',
        specialties: ['Nephrology', 'Diabetes Care', 'Internal Medicine']
      },
      {
        id: '3',
        name: 'Excellence Healthcare',
        address: `789 Care Street, ${pincode}`,
        distance: '3.8 km',
        specialties: ['Cardiology', 'Nephrology', 'Preventive Care']
      }
    ];

    setHospitals(mockHospitals);
    setShowHospitals(true);
    toast.success("Found nearby healthcare facilities");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const goToAdminDashboard = () => {
    navigate('/admin/dashboard');
    toast.success('Accessing Administrator Dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Health Risk Assessment</h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={goToAdminDashboard}>Admin Dashboard</Button>
          <Button variant="outline" onClick={handleSignOut}>Logout</Button>
        </div>
      </div>

      <DiseaseSelection 
        selectedDisease={selectedDisease}
        onDiseaseSelect={setSelectedDisease}
      />

      <FileUpload 
        file={file}
        onFileChange={handleFileChange}
      />

      <HospitalFinder 
        pincode={pincode}
        setPincode={setPincode}
        showHospitals={showHospitals}
        hospitals={hospitals}
        onFindHospitals={handleFindHospitals}
      />

      <div className="flex justify-center">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-md hover:shadow-lg"
          onClick={handleStartAssessment}
        >
          Start Assessment
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;

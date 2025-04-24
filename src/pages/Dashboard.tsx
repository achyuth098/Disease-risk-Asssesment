
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Heart, AlertCircle, Droplet, Activity, FileText, Upload, MapPin, Hospital } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pincode, setPincode] = useState<string>('');
  const [showHospitals, setShowHospitals] = useState(false);
  const [hospitals, setHospitals] = useState<Array<{ id: string; name: string; address: string; distance: string; specialties: string[] }>>([]);
  const navigate = useNavigate();

  const diseaseOptions = [
    { id: 'diabetes', name: 'Diabetes', icon: <Droplet className="h-6 w-6 text-red-500" />, color: 'border-red-200 hover:border-red-300' },
    { id: 'kidneyDisease', name: 'Kidney Disease', icon: <Activity className="h-6 w-6 text-purple-500" />, color: 'border-purple-200 hover:border-purple-300' },
    { id: 'heartDisease', name: 'Heart Disease', icon: <Heart className="h-6 w-6 text-pink-500" />, color: 'border-pink-200 hover:border-pink-300' },
  ];

  const handleDiseaseSelect = (diseaseId: string) => {
    setSelectedDisease(diseaseId);
  };

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
        fileName: file?.name
      } 
    });
  };

  const handleFindHospitals = () => {
    if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    // Mock data for nearby hospitals based on pincode
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Health Risk Assessment</h1>
        <Link to="/">
          <Button variant="outline">Logout</Button>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select a disease for assessment</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {diseaseOptions.map((disease) => (
            <Card 
              key={disease.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedDisease === disease.id 
                  ? 'border-2 border-primary shadow-md' 
                  : `border ${disease.color}`
              }`}
              onClick={() => handleDiseaseSelect(disease.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-2">
                  {disease.icon}
                </div>
                <CardTitle className="text-center">{disease.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-gray-500 pt-0">
                Assess your risk factors for {disease.name.toLowerCase()}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload medical reports (optional)</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-700">
              Upload your medical reports to improve assessment accuracy
            </span>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <Label 
              htmlFor="file-upload" 
              className="cursor-pointer bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
            >
              Browse Files
            </Label>
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {file && (
              <div className="mt-4 text-sm text-gray-700 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {file.name}
              </div>
            )}
          </div>
        </div>
      </div>

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
              onClick={handleFindHospitals}
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

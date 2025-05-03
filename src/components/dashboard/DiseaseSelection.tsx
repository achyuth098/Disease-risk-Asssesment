
import React from 'react';
import { Droplet, Activity, Heart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type DiseaseOption = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
};

interface DiseaseSelectionProps {
  selectedDisease: string | null;
  onDiseaseSelect: (diseaseId: string) => void;
}

const diseaseOptions: DiseaseOption[] = [
  { id: 'diabetes', name: 'Diabetes', icon: <Droplet className="h-6 w-6 text-red-500" />, color: 'border-red-200 hover:border-red-300' },
  { id: 'kidneyDisease', name: 'Kidney Disease', icon: <Activity className="h-6 w-6 text-purple-500" />, color: 'border-purple-200 hover:border-purple-300' },
  { id: 'heartDisease', name: 'Heart Disease', icon: <Heart className="h-6 w-6 text-pink-500" />, color: 'border-pink-200 hover:border-pink-300' },
];

export const DiseaseSelection: React.FC<DiseaseSelectionProps> = ({
  selectedDisease,
  onDiseaseSelect,
}) => {
  return (
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
            onClick={() => onDiseaseSelect(disease.id)}
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
  );
};


import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type RiskData = {
  high: number;
  moderate: number;
  low: number;
};

type DiseaseAnalysisCardProps = {
  title: string;
  icon: LucideIcon;
  riskData: RiskData;
  riskFactors: string[];
};

export const DiseaseAnalysisCard = ({ title, icon: Icon, riskData, riskFactors }: DiseaseAnalysisCardProps) => {
  // Calculate total patients
  const totalPatients = riskData.high + riskData.moderate + riskData.low;
  
  // Calculate percentages
  const highPercentage = totalPatients > 0 ? Math.round((riskData.high / totalPatients) * 100) : 0;
  const moderatePercentage = totalPatients > 0 ? Math.round((riskData.moderate / totalPatients) * 100) : 0;
  const lowPercentage = totalPatients > 0 ? Math.round((riskData.low / totalPatients) * 100) : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center pb-2">
        <Icon className="h-5 w-5 text-primary mr-2" />
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Assessment trends and risk levels
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">High Risk:</span>
            <div>
              <span className="text-sm">{riskData.high} patients</span>
              <span className="text-xs text-muted-foreground ml-2">({highPercentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${highPercentage}%` }}></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Moderate Risk:</span>
            <div>
              <span className="text-sm">{riskData.moderate} patients</span>
              <span className="text-xs text-muted-foreground ml-2">({moderatePercentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${moderatePercentage}%` }}></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Low Risk:</span>
            <div>
              <span className="text-sm">{riskData.low} patients</span>
              <span className="text-xs text-muted-foreground ml-2">({lowPercentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${lowPercentage}%` }}></div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Top Risk Factors</h4>
            <ol className="pl-5 text-sm list-decimal">
              {riskFactors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

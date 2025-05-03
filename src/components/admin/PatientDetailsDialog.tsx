
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssessmentType } from "@/lib/types";
import { Heart, Droplet, Activity, Calendar } from "lucide-react";

type PatientDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: AssessmentType | undefined;
  patientHistory: AssessmentType[];
};

export const PatientDetailsDialog = ({
  open,
  onOpenChange,
  assessment,
  patientHistory,
}: PatientDetailsDialogProps) => {
  if (!assessment) return null;

  // Helper to display disease icon
  const DiseaseIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'heartDisease':
        return <Heart className="h-5 w-5 text-pink-500" />;
      case 'diabetes':
        return <Droplet className="h-5 w-5 text-blue-500" />;
      case 'kidneyDisease':
        return <Activity className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  // Format answer values for display
  const formatAnswerValue = (value: any) => {
    if (typeof value === 'number') return value.toString();
    return value;
  };

  // Get question text from assessment type
  const getQuestionText = (questionId: string) => {
    const diseaseType = assessment.type;
    
    // These would normally come from a database
    if (diseaseType === 'diabetes') {
      const questions: Record<string, string> = {
        'd1': 'Age',
        'd2': 'Family history of diabetes',
        'd3': 'Weight (kg)',
        'd4': 'Height (cm)',
        'd5': 'Diet description'
      };
      return questions[questionId] || questionId;
    }
    
    if (diseaseType === 'heartDisease') {
      const questions: Record<string, string> = {
        'hd1': 'High blood pressure',
        'hd2': 'High cholesterol',
        'hd3': 'Family history of heart disease',
        'hd4': 'Physical activity level',
        'hd5': 'Stress level'
      };
      return questions[questionId] || questionId;
    }
    
    if (diseaseType === 'kidneyDisease') {
      const questions: Record<string, string> = {
        'kd1': 'High blood pressure',
        'kd2': 'Diabetes',
        'kd3': 'Family history of kidney disease',
        'kd4': 'Daily water intake',
        'kd5': 'Regular NSAID use'
      };
      return questions[questionId] || questionId;
    }
    
    return questionId;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <DiseaseIcon type={assessment.type} />
            Patient Assessment Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Tabs defaultValue="raw-data" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="raw-data">Assessment Data</TabsTrigger>
              <TabsTrigger value="history">Assessment History</TabsTrigger>
            </TabsList>

            <TabsContent value="raw-data" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Assessment Data</span>
                    <Badge className={
                      assessment.riskLevel === 'high' ? 'bg-red-500' : 
                      assessment.riskLevel === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                    }>
                      {assessment.riskLevel} Risk
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {assessment.date} | {assessment.region}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(assessment.answers).map(([questionId, value]) => (
                        <div key={questionId} className="border rounded-md p-4">
                          <div className="text-sm font-medium text-muted-foreground">
                            {getQuestionText(questionId)}
                          </div>
                          <div className="text-xl font-semibold mt-1">
                            {formatAnswerValue(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {assessment.type === 'diabetes' && assessment.answers.d3 && assessment.answers.d4 && (
                      <div className="border rounded-md p-4 mt-4">
                        <div className="text-sm font-medium text-muted-foreground">
                          Calculated BMI
                        </div>
                        <div className="text-xl font-semibold mt-1">
                          {Math.round((Number(assessment.answers.d3) / Math.pow(Number(assessment.answers.d4) / 100, 2)) * 10) / 10}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Assessment History
                  </CardTitle>
                  <CardDescription>
                    This patient has completed {patientHistory.length} assessment(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {patientHistory.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No assessment history available
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {patientHistory.map((hist) => (
                        <div key={hist.id} className="border rounded-md p-4 flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <DiseaseIcon type={hist.type} />
                              <span className="font-medium">
                                {hist.type === 'heartDisease' ? 'Heart Disease' : 
                                  hist.type === 'kidneyDisease' ? 'Kidney Disease' : 'Diabetes'} Assessment
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {hist.date} | {hist.region}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge className={
                              hist.riskLevel === 'high' ? 'bg-red-500' : 
                              hist.riskLevel === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                            }>
                              {hist.riskLevel} Risk
                            </Badge>
                            {hist.riskScore !== undefined && (
                              <div className="text-sm mt-1">
                                {hist.riskScore}%
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

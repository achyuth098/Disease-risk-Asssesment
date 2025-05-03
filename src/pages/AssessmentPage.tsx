import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, AlertCircle, Droplet, Activity, CheckCircle, ChevronRight, FileText, MapPin, Building } from "lucide-react";
import { toast } from "sonner";
import { getDiseaseInfo } from '@/lib/utils';
import { BlurCard } from '@/components/ui-custom/BlurCard';
import { AnimatedGradientText } from '@/components/ui-custom/AnimatedGradientText';
import { supabase } from '@/integrations/supabase/client';
import { useStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Question {
  id: string;
  question: string;
  type: 'input';
  min?: number;
  max?: number;
}

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;
  specialties: string[];
}

interface DiabetesPayload {
  hba1c: number;
  glucose: number;
  bmi: number;
  weight: number;
  height: number;
  systolic_bp: number;
  diastolic_bp: number;
  cholesterol: number;
  ldl: number;
  egfr: number;
  age: number;
}

interface CKDPayload {
  age: number;
  egfr: number;
  albumin_creatinine: number;
  glucose: number;
  hba1c: number;
  bmi: number;
  systolic_bp: number;
  diastolic_bp: number;
  encounter_count: number;
}

interface DemographicsFormProps {
  age: string;
  setAge: React.Dispatch<React.SetStateAction<string>>;
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  zipCode: string;
  setZipCode: React.Dispatch<React.SetStateAction<string>>;
  urbanRural: string;
  setUrbanRural: React.Dispatch<React.SetStateAction<string>>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const DemographicsForm: React.FC<DemographicsFormProps> = ({
  age,
  setAge,
  gender,
  setGender,
  zipCode,
  setZipCode,
  urbanRural,
  setUrbanRural,
  setAnswers,
  setCurrentStep,
}) => {
  const ageInputRef = useRef<HTMLInputElement>(null);

  const handleDemographicsComplete = () => {
    if (!age || isNaN(Number(age)) || Number(age) < 18 || Number(age) > 100) {
      toast.error("Please enter a valid age between 18 and 100");
      return;
    }
    if (!gender) {
      toast.error("Please select your gender");
      return;
    }
    if (!zipCode || zipCode.length < 5 || zipCode.length > 10) {
      toast.error("Please enter a valid zipcode/postal code");
      return;
    }
    if (!urbanRural) {
      toast.error("Please select your area type");
      return;
    }
    setAnswers(prev => ({
      ...prev,
      age,
      gender,
      zipCode,
      urbanRural
    }));
    setCurrentStep(1);
  };

  return (
    <BlurCard className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Demographic Information</h2>
      <p className="text-gray-600 mb-6">Please provide some basic information to help us with your assessment.</p>
      <div className="space-y-6">
        <div>
          <Label htmlFor="age">Age (18-100)</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            min={18}
            max={100}
            className="mt-1"
            ref={ageInputRef}
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <RadioGroup
            value={gender}
            onValueChange={setGender}
            className="mt-2 flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="gender-male" />
              <Label htmlFor="gender-male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="gender-female" />
              <Label htmlFor="gender-female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="gender-other" />
              <Label htmlFor="gender-other">Other</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="zipcode">Zipcode/Postal Code</Label>
          <Input
            id="zipcode"
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Enter your zipcode/postal code"
            className="mt-1"
            maxLength={10}
          />
        </div>
        <div>
          <Label htmlFor="area-type">Area Type</Label>
          <Select value={urbanRural} onValueChange={setUrbanRural}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your area type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urban">Urban</SelectItem>
              <SelectItem value="suburban">Suburban</SelectItem>
              <SelectItem value="rural">Rural</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="pt-4">
          <Button onClick={handleDemographicsComplete} className="w-full">
            Continue to Health Assessment
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </BlurCard>
  );
};

const AssessmentPage = () => {
  const { diseaseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { disease: string; fileName?: string } | null;
  const { user } = useAuth();
  const { addAssessment } = useStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [pincode, setPincode] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [showHospitals, setShowHospitals] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [urbanRural, setUrbanRural] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const disease = state?.disease || diseaseId || '';
  const fileName = state?.fileName || '';
  const diseaseInfo = getDiseaseInfo(disease);

  const diseaseIconMap: Record<string, JSX.Element> = {
    diabetes: <Droplet className="h-10 w-10 text-red-500" />,
    kidneyDisease: <Activity className="h-10 w-10 text-purple-500" />,
    heartDisease: <Heart className="h-10 w-10 text-pink-500" />,
  };

  const diabetesQuestions: Question[] = [
    { id: 'hba1c', question: 'What is your Hemoglobin A1c (%)?', type: 'input', min: 4, max: 15 },
    { id: 'glucose', question: 'What is your fasting glucose level (mg/dL)?', type: 'input', min: 50, max: 300 },
    { id: 'weight', question: 'What is your body weight (kg)?', type: 'input', min: 30, max: 200 },
    { id: 'height', question: 'What is your height (cm)?', type: 'input', min: 100, max: 250 },
    { id: 'systolic_bp', question: 'What is your systolic blood pressure (mm Hg)?', type: 'input', min: 80, max: 200 },
    { id: 'diastolic_bp', question: 'What is your diastolic blood pressure (mm Hg)?', type: 'input', min: 40, max: 120 },
    { id: 'cholesterol', question: 'What is your cholesterol level (mg/dL)?', type: 'input', min: 100, max: 400 },
    { id: 'ldl', question: 'What is your LDL cholesterol level (mg/dL)?', type: 'input', min: 50, max: 300 },
    { id: 'egfr', question: 'What is your eGFR (estimated kidney function)?', type: 'input', min: 15, max: 120 },
  ];

  const kidneyQuestions: Question[] = [
    { id: 'egfr', question: 'What is your eGFR (estimated kidney function)?', type: 'input', min: 15, max: 120 },
    { id: 'albumin_creatinine', question: 'What is your albumin-to-creatinine ratio (mg/g)?', type: 'input', min: 0, max: 3000 },
    { id: 'glucose', question: 'What is your fasting glucose level (mg/dL)?', type: 'input', min: 50, max: 300 },
    { id: 'hba1c', question: 'What is your Hemoglobin A1c (%)?', type: 'input', min: 4, max: 15 },
    { id: 'bmi', question: 'What is your Body Mass Index (BMI)?', type: 'input', min: 15, max: 50 },
    { id: 'systolic_bp', question: 'What is your systolic blood pressure (mm Hg)?', type: 'input', min: 80, max: 200 },
    { id: 'diastolic_bp', question: 'What is your diastolic blood pressure (mm Hg)?', type: 'input', min: 40, max: 120 },
    { id: 'encounter_count', question: 'How many medical encounters (e.g., hospital visits) have you had?', type: 'input', min: 0, max: 100 },
  ];

  const questions = disease === 'kidneyDisease' ? kidneyQuestions : diabetesQuestions;
  const currentQuestion = currentStep === 1 ? questions[currentQuestionIndex] : null;

  const calculateBMI = (weight: number, height: number): number => {
    const heightMeters = height / 100;
    return weight / (heightMeters * heightMeters);
  };

  const validatePayload = (payload: DiabetesPayload | CKDPayload): boolean => {
    return Object.entries(payload).every(([key, value]) => {
      if (value <= 0 && key !== 'encounter_count') {
        toast.error(`Please provide a valid positive value for ${key.replace('_', ' ')}`);
        return false;
      }
      return true;
    });
  };

  const parseRecommendations = (text: string): string[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const items = [];
    let currentItem = '';
    for (const line of lines) {
      if (/^\d+\./.test(line)) {
        if (currentItem) items.push(currentItem.trim());
        currentItem = line;
      } else {
        currentItem += ' ' + line;
      }
    }
    if (currentItem) items.push(currentItem.trim());
    return items.filter(item => !item.toLowerCase().includes('consult a healthcare professional')).slice(0, 7);
  };

  useEffect(() => {
    if (currentStep === 1 && currentQuestion && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestionIndex, currentStep]);

  const handleAnswer = async (questionId: string, value: string) => {
    if (currentQuestion) {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < (currentQuestion.min || 0) || numValue > (currentQuestion.max || Infinity)) {
        toast.error(`Please enter a valid number between ${currentQuestion.min || 0} and ${currentQuestion.max || 'any value'} for ${currentQuestion.question}`);
        return;
      }
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    }

    setTimeout(async () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        const finalAnswers = { ...answers, [questionId]: value };
        let payload: DiabetesPayload | CKDPayload;
        let endpoint: string;

        if (disease === 'kidneyDisease') {
          payload = {
            age: parseFloat(finalAnswers.age) || 0,
            egfr: parseFloat(finalAnswers.egfr) || 0,
            albumin_creatinine: parseFloat(finalAnswers.albumin_creatinine) || 0,
            glucose: parseFloat(finalAnswers.glucose) || 0,
            hba1c: parseFloat(finalAnswers.hba1c) || 0,
            bmi: parseFloat(finalAnswers.bmi) || 0,
            systolic_bp: parseFloat(finalAnswers.systolic_bp) || 0,
            diastolic_bp: parseFloat(finalAnswers.diastolic_bp) || 0,
            encounter_count: parseFloat(finalAnswers.encounter_count) || 0
          };
          endpoint = '/predict_kidney';
        } else {
          const weight = parseFloat(finalAnswers.weight) || 0;
          const height = parseFloat(finalAnswers.height) || 0;
          const bmi = height > 0 ? calculateBMI(weight, height) : 0;
          payload = {
            hba1c: parseFloat(finalAnswers.hba1c) || 0,
            glucose: parseFloat(finalAnswers.glucose) || 0,
            bmi,
            weight,
            height,
            systolic_bp: parseFloat(finalAnswers.systolic_bp) || 0,
            diastolic_bp: parseFloat(finalAnswers.diastolic_bp) || 0,
            cholesterol: parseFloat(finalAnswers.cholesterol) || 0,
            ldl: parseFloat(finalAnswers.ldl) || 0,
            egfr: parseFloat(finalAnswers.egfr) || 0,
            age: parseFloat(finalAnswers.age) || 0
          };
          endpoint = '/predict_diabetes';
        }

        // Enhanced validation to ensure no zero values for critical fields
        const requiredFields = disease === 'kidneyDisease'
          ? ['age', 'egfr', 'albumin_creatinine', 'glucose', 'hba1c', 'bmi', 'systolic_bp', 'diastolic_bp']
          : ['hba1c', 'glucose', 'weight', 'height', 'systolic_bp', 'diastolic_bp', 'cholesterol', 'ldl', 'egfr', 'age'];
        for (const field of requiredFields) {
          if ((payload as any)[field] <= 0) {
            toast.error(`Please provide a valid positive value for ${field.replace('_', ' ')}`);
            return;
          }
        }

        if (Object.values(payload).some(val => isNaN(val))) {
          toast.error("Please provide valid numeric values for all fields.");
          return;
        }

        console.log("Sending data:", JSON.stringify(payload));

        try {
          const predictResponse = await fetch(`http://localhost:8000${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (!predictResponse.ok) {
            const errorText = await predictResponse.text();
            throw new Error(`Prediction failed: ${predictResponse.status} - ${errorText}`);
          }

          const predictData = await predictResponse.json();
          console.log("Prediction response:", JSON.stringify(predictData));
          setRiskScore(Math.round(predictData.risk_percentage));

          const recommendationPayload = { disease, risk_score: predictData.risk_percentage, ...payload };
          const recommendationResponse = await fetch("http://localhost:8000/recommendations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recommendationPayload)
          });

          if (!recommendationResponse.ok) {
            const errorText = await recommendationResponse.text();
            throw new Error(`Recommendations failed: ${recommendationResponse.status} - ${errorText}`);
          }

          const recData = await recommendationResponse.json();
          console.log("Raw recommendations:", recData.recommendations);
          const parsedRecommendations = parseRecommendations(recData.recommendations[0] || '');
          setRecommendations(parsedRecommendations.length > 0 ? parsedRecommendations : ['No specific recommendations available.']);
          setIsCompleted(true);

          if (user) {
            try {
              const region = zipCode ? `${zipCode} (${urbanRural || 'Unknown Area Type'})` : "Unknown Location";
              const riskLevel = riskScore < 33 ? 'low' : riskScore < 66 ? 'moderate' : 'high';
              addAssessment({
                userId: user.id,
                type: disease as 'diabetes' | 'kidneyDisease',
                date: new Date().toISOString(),
                answers: finalAnswers,
                riskScore: riskScore,
                riskLevel: riskLevel,
                region: region,
                age: parseFloat(age) || 0,
                gender: gender as 'male' | 'female' | 'other',
                zipCode,
                urbanRural: urbanRural as 'urban' | 'suburban' | 'rural'
              });
              console.log("Assessment saved successfully");
            } catch (error) {
              console.error("Error saving assessment:", error);
            }
          }

          toast.success("Assessment completed!");
        } catch (err: any) {
          console.error("API error:", err.message);
          toast.error(`Error: ${err.message}`);
          setRiskScore(0);
        }
      }
    }, 500);
  };

  const handleFindHospitals = () => {
    const searchPincode = pincode || zipCode;
    if (!searchPincode || searchPincode.length < 5 || !/^\d+$/.test(searchPincode)) {
      toast.error("Please enter a valid zipcode/postal code");
      return;
    }

    const mockHospitals: Hospital[] = [
      { id: '1', name: 'City General Hospital', address: `123 Health Ave, ${searchPincode}`, distance: '1.2 km', specialties: ['Cardiology', 'Endocrinology', 'General Medicine'] },
      { id: '2', name: 'Community Medical Center', address: `456 Wellness Blvd, ${searchPincode}`, distance: '2.5 km', specialties: ['Nephrology', 'Diabetes Care', 'Internal Medicine'] },
      { id: '3', name: 'Excellence Healthcare', address: `789 Care Street, ${searchPincode}`, distance: '3.8 km', specialties: ['Cardiology', 'Nephrology', 'Preventive Care'] }
    ];

    setHospitals(mockHospitals);
    setShowHospitals(true);
    toast.success("Found nearby healthcare facilities");
  };

  const getRiskLevel = (score: number) => {
    if (score < 33) return { level: 'low', color: 'text-green-500', message: 'Low Risk' };
    if (score < 66) return { level: 'moderate', color: 'text-yellow-500', message: 'Moderate Risk' };
    return { level: 'high', color: 'text-red-500', message: 'High Risk' };
  };

  const riskInfo = getRiskLevel(riskScore);

  const renderHealthMetrics = () => {
    if (!currentQuestion) return null;
    return (
      <div className="mb-8">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <BlurCard className="max-w-3xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-6">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <p className="text-lg mb-8">{currentQuestion.question}</p>
          <div className="space-y-4">
            <Input
              type="number"
              step="any"
              min={currentQuestion.min}
              max={currentQuestion.max}
              placeholder="Enter a value"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
              ref={inputRef}
            />
          </div>
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                } else {
                  setCurrentStep(0);
                }
              }}
            >
              Previous
            </Button>
            <Button 
              onClick={() => handleAnswer(currentQuestion.id, answers[currentQuestion.id] || '')}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </BlurCard>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          {diseaseIconMap[disease] || <AlertCircle className="h-10 w-10 text-gray-500" />}
          <h1 className="text-3xl font-bold">{diseaseInfo.title} Assessment</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">{diseaseInfo.description}</p>
        {fileName && (
          <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-1" />
            <span>Uploaded document: {fileName}</span>
          </div>
        )}
      </div>
      {!isCompleted ? (
        <>
          {currentStep === 0 ? (
            <DemographicsForm
              age={age}
              setAge={setAge}
              gender={gender}
              setGender={setGender}
              zipCode={zipCode}
              setZipCode={setZipCode}
              urbanRural={urbanRural}
              setUrbanRural={setUrbanRural}
              setAnswers={setAnswers}
              setCurrentStep={setCurrentStep}
            />
          ) : (
            renderHealthMetrics()
          )}
        </>
      ) : (
        <div className="max-w-3xl mx-auto">
          <BlurCard className="text-center p-8">
            <div className="mb-6">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-2" />
              <h2 className="text-2xl font-bold mb-2">Assessment Complete</h2>
              <p className="text-gray-600">Based on your answers, we've analyzed your risk factors.</p>
            </div>
            <div className="mb-8">
              <div className="relative h-36 w-36 mx-auto">
                <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
                <div 
                  className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500"
                  style={{ transform: `rotate(${riskScore * 3.6}deg)`, transition: 'transform 1s ease-out' }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold">{Math.floor(riskScore)}%</span>
                  <span className={`text-sm font-medium ${riskInfo.color}`}>{riskInfo.message}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
              <h3 className="font-semibold mb-3">What this means:</h3>
              <p className="text-gray-700 mb-4">
                {riskInfo.level === 'low' && 'Your risk factors are relatively low. Continue maintaining a healthy lifestyle.'}
                {riskInfo.level === 'moderate' && 'You have some risk factors that should be monitored. Consider lifestyle adjustments.'}
                {riskInfo.level === 'high' && 'You have significant risk factors. We recommend consulting with a healthcare professional.'}
              </p>
              <h3 className="font-semibold mb-3">Health Recommendations:</h3>
              <ul className="text-gray-700 space-y-2 mb-4">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No recommendations available.</li>
                )}
              </ul>
              <p className="text-gray-600 text-sm italic">
                Disclaimer: These recommendations are general and educational. Always consult a healthcare professional for personalized advice.
              </p>
              <h3 className="font-semibold mb-3 mt-6">Next steps:</h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Review your results with a healthcare provider</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Make lifestyle adjustments based on recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Schedule regular check-ups to monitor your health</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                Find Healthcare Facilities Near You
              </h3>
              <div className="flex gap-3">
                <Input 
                  type="text" 
                  placeholder="Enter your zipcode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={10}
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
            <div className="mt-8 flex gap-4 justify-center">
              <Button
                variant="outline" 
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-blue-700"
                onClick={() => window.print()}
              >
                Print Results
              </Button>
            </div>
          </BlurCard>
        </div>
      )}
    </div>
  );
};

export default AssessmentPage;
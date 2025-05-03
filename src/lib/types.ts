<<<<<<< HEAD

=======
>>>>>>> teammate-repo/main
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'admin' | 'patient';
}

export type Disease = 'diabetes' | 'kidneyDisease' | 'heartDisease';

export type AssessmentType = {
  id: string;
  userId: string;
  type: Disease;
  date: string;
  answers: Record<string, any>;
  riskScore?: number;
  riskLevel?: 'low' | 'moderate' | 'high';
<<<<<<< HEAD
  region?: string; // Added region/pincode for geographic analysis
=======
  region: string; // Changed from optional to required
  // New demographic fields
  age?: number;
  gender?: 'male' | 'female' | 'other';
  zipCode?: string;
  urbanRural?: 'urban' | 'suburban' | 'rural';
>>>>>>> teammate-repo/main
}

export type Question = {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox';
  options?: Array<{
    value: string;
    label: string;
  }>;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

<<<<<<< HEAD
=======
export type InputType = {
  type: 'number' | 'text' | 'select';
  min?: number;
  max?: number;
  value: number | string;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

export type Feature = {
  id: string;
  feature: string;
  input: InputType;
}

>>>>>>> teammate-repo/main
export type QuestionsByDisease = Record<Disease, Question[]>;

export type Report = {
  id: string;
  userId: string;
  date: string;
  title: string;
  summary: string;
  diseaseType: Disease;
  riskLevel: 'low' | 'moderate' | 'high';
  riskScore: number;
  recommendations: string[];
  assessmentId: string;
}

export type AnalyticsSummary = {
  totalAssessments: number;
  assessmentsByRiskLevel: Record<string, number>;
  assessmentsByDisease: Record<string, number>;
  assessmentsByRegion: Record<string, number>;
  topRiskFactors: Array<{factor: string, count: number}>;
}
<<<<<<< HEAD
=======

export type SyntheaFeature = {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange?: {
    min: number;
    max: number;
  };
}

export type HealthMetrics = {
  hba1c: number;
  glucose: number;
  bmi: number;
  weight: number;
  height: number;
  systolicBp: number;
  diastolicBp: number;
  cholesterol: number;
  ldl: number;
  egfr: number;
  age?: number;
  gender?: string;
}

export type AdminFilters = {
  ageGroup: 'all' | '18-30' | '31-45' | '46-60' | '60+';
  gender: 'all' | 'male' | 'female';
  region: string;
  riskLevel: 'all' | 'low' | 'moderate' | 'high';
  diseaseType: 'all' | Disease;
}

export type AIQuery = {
  question: string;
  timestamp: string;
  response?: string;
}

export type AIInsight = {
  type: 'text' | 'stat' | 'chart';
  content: string | number;
  context?: string;
}
>>>>>>> teammate-repo/main

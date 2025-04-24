
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
  region?: string; // Added region/pincode for geographic analysis
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

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { User, AssessmentType, Report, Disease, AnalyticsSummary } from './types';

type StoreState = {
  user: User | null;
  assessments: AssessmentType[];
  reports: Report[];
  loading: boolean;
  error: string | null;
};

type StoreActions = {
  setUser: (user: User | null) => void;
  addAssessment: (assessment: Omit<AssessmentType, 'id'>) => string;
  getAssessmentById: (id: string) => AssessmentType | undefined;
  getAssessmentsByUserId: (userId: string) => AssessmentType[];
  addReport: (report: Omit<Report, 'id'>) => string;
  getReportById: (id: string) => Report | undefined;
  getReportsByUserId: (userId: string) => Report[];
  getAnalyticsSummary: () => AnalyticsSummary;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useStore = create<StoreState & StoreActions>((set, get) => ({
  user: null,
  assessments: [],
  reports: [],
  loading: false,
  error: null,

  setUser: (user) => set({ user }),

  addAssessment: (assessmentData) => {
    const id = uuidv4();
    const assessment = { ...assessmentData, id };
    set((state) => ({
      assessments: [...state.assessments, assessment as AssessmentType]
    }));
    return id;
  },

  getAssessmentById: (id) => {
    return get().assessments.find(assessment => assessment.id === id);
  },

  getAssessmentsByUserId: (userId) => {
    return get().assessments.filter(assessment => assessment.userId === userId);
  },

  addReport: (reportData) => {
    const id = uuidv4();
    const report = { ...reportData, id };
    set((state) => ({
      reports: [...state.reports, report as Report]
    }));
    return id;
  },

  getReportById: (id) => {
    return get().reports.find(report => report.id === id);
  },

  getReportsByUserId: (userId) => {
    return get().reports.filter(report => report.userId === userId);
  },

  getAnalyticsSummary: () => {
    const assessments = get().assessments;
    
    const totalAssessments = assessments.length;
    
    const assessmentsByRiskLevel = assessments.reduce((acc, assessment) => {
      const riskLevel = assessment.riskLevel || 'unknown';
      acc[riskLevel] = (acc[riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const assessmentsByDisease = assessments.reduce((acc, assessment) => {
      acc[assessment.type] = (acc[assessment.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const assessmentsByRegion = assessments.reduce((acc, assessment) => {
      const region = assessment.region || 'unknown';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topRiskFactors = [
      { factor: 'Smoking', count: Math.floor(totalAssessments * 0.3) },
      { factor: 'High Blood Pressure', count: Math.floor(totalAssessments * 0.4) },
      { factor: 'Lack of Exercise', count: Math.floor(totalAssessments * 0.5) },
      { factor: 'Poor Diet', count: Math.floor(totalAssessments * 0.35) },
      { factor: 'Family History', count: Math.floor(totalAssessments * 0.25) },
    ];
    
    return {
      totalAssessments,
      assessmentsByRiskLevel,
      assessmentsByDisease,
      assessmentsByRegion,
      topRiskFactors
    };
  },

  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error })
}));

export const generateMockData = () => {
  const userId = "user-123";
  const regions = ["110001", "400001", "600001", "700001", "560001"];
  
  const diabetesAssessment: AssessmentType = {
    id: uuidv4(),
    userId,
    type: "diabetes",
    date: new Date().toISOString(),
    answers: {
      q1: "40-60",
      q2: "yes",
      q3: "25-30",
      q4: "moderate",
      q5: "occasionally"
    },
    riskScore: 65,
    riskLevel: "moderate",
    region: regions[Math.floor(Math.random() * regions.length)]
  };

  const heartAssessment: AssessmentType = {
    id: uuidv4(),
    userId,
    type: "heartDisease",
    date: new Date().toISOString(),
    answers: {
      q1: "high",
      q2: "never",
      q3: "normal",
      q4: "yes",
      q5: "moderate"
    },
    riskScore: 45,
    riskLevel: "moderate",
    region: regions[Math.floor(Math.random() * regions.length)]
  };
  
  const extraAssessments: AssessmentType[] = Array.from({ length: 20 }, (_, i) => ({
    id: uuidv4(),
    userId: `user-${100 + i}`,
    type: ["diabetes", "heartDisease", "kidneyDisease"][Math.floor(Math.random() * 3)] as Disease,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    answers: {},
    riskScore: Math.floor(Math.random() * 100),
    riskLevel: ["low", "moderate", "high"][Math.floor(Math.random() * 3)] as "low" | "moderate" | "high",
    region: regions[Math.floor(Math.random() * regions.length)]
  }));

  return { diabetesAssessment, heartAssessment, extraAssessments };
};

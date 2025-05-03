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
  addAssessment: (assessment: Omit<AssessmentType, 'id'>) => string | null;
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
    // Validate location data (zipCode and urbanRural format)
    if (!assessmentData.region) {
      set({ error: 'Location data is missing' });
      return null;
    }
    
    // Expect region in format "zipCode (urbanRural)" or similar
    const regionPattern = /^\d+\s*\([^)]+\)$/; // Matches "12345 (urban)", "12345 (suburban)", etc.
    if (!regionPattern.test(assessmentData.region)) {
      set({ error: 'Location must be in "zipCode (areaType)" format' });
      return null;
    }
    
    const id = uuidv4();
    const assessment = { ...assessmentData, id };
    
    set((state) => ({
      assessments: [...state.assessments, assessment as AssessmentType],
      error: null
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
    
    // Calculate real risk factors based on assessment data
    const riskFactorCounts = new Map<string, number>();
    
    assessments.forEach(assessment => {
      if (assessment.answers) {
        // Extract key risk factors based on disease type
        if (assessment.type === 'diabetes') {
          if (assessment.answers.d2 === 'yes') riskFactorCounts.set('Family History', (riskFactorCounts.get('Family History') || 0) + 1);
          if (assessment.answers.d5 === 'unhealthy') riskFactorCounts.set('Poor Diet', (riskFactorCounts.get('Poor Diet') || 0) + 1);
          
          // Calculate BMI if height and weight are available
          if (assessment.answers.d3 && assessment.answers.d4) {
            const height = Number(assessment.answers.d4) / 100; // convert cm to m
            const weight = Number(assessment.answers.d3);
            const bmi = weight / (height * height);
            if (bmi > 30) riskFactorCounts.set('Obesity', (riskFactorCounts.get('Obesity') || 0) + 1);
          }
        }
        
        if (assessment.type === 'heartDisease') {
          if (assessment.answers.hd1 === 'yes') riskFactorCounts.set('Hypertension', (riskFactorCounts.get('Hypertension') || 0) + 1);
          if (assessment.answers.hd2 === 'yes') riskFactorCounts.set('High Cholesterol', (riskFactorCounts.get('High Cholesterol') || 0) + 1);
          if (assessment.answers.hd3 === 'yes') riskFactorCounts.set('Family History', (riskFactorCounts.get('Family History') || 0) + 1);
          if (assessment.answers.hd4 === 'sedentary') riskFactorCounts.set('Physical Inactivity', (riskFactorCounts.get('Physical Inactivity') || 0) + 1);
        }
        
        if (assessment.type === 'kidneyDisease') {
          if (assessment.answers.kd1 === 'yes') riskFactorCounts.set('Hypertension', (riskFactorCounts.get('Hypertension') || 0) + 1);
          if (assessment.answers.kd2 === 'yes') riskFactorCounts.set('Diabetes', (riskFactorCounts.get('Diabetes') || 0) + 1);
          if (assessment.answers.kd3 === 'yes') riskFactorCounts.set('Family History', (riskFactorCounts.get('Family History') || 0) + 1);
        }
        // Add age-based risk factor
        if (assessment.age > 60) {
          riskFactorCounts.set('Age > 60', (riskFactorCounts.get('Age > 60') || 0) + 1);
        }
      }
    });
    
    // Convert to array and sort by count
    const topRiskFactors = Array.from(riskFactorCounts.entries())
      .map(([factor, count]) => ({ factor, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      totalAssessments,
      assessmentsByRiskLevel,
      assessmentsByDisease,
      assessmentsByRegion,
      topRiskFactors: topRiskFactors.length > 0 ? topRiskFactors : [
        { factor: 'No data available', count: 0 }
      ]
    };
  },

  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error })
}));
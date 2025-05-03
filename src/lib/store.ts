<<<<<<< HEAD
=======

>>>>>>> teammate-repo/main
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
<<<<<<< HEAD
  addAssessment: (assessment: Omit<AssessmentType, 'id'>) => string;
=======
  addAssessment: (assessment: Omit<AssessmentType, 'id'>) => string | null;
>>>>>>> teammate-repo/main
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
<<<<<<< HEAD
    const id = uuidv4();
    const assessment = { ...assessmentData, id };
    set((state) => ({
      assessments: [...state.assessments, assessment as AssessmentType]
    }));
=======
    // Validate location data (city, state format for US)
    if (!assessmentData.region) {
      set({ error: 'Location data is missing' });
      return null;
    }
    
    const regionParts = assessmentData.region.split(',');
    if (regionParts.length !== 2 || !regionParts[0].trim() || !regionParts[1].trim()) {
      set({ error: 'Location must be in "City, State" format' });
      return null;
    }
    
    const id = uuidv4();
    const assessment = { ...assessmentData, id };
    
    set((state) => ({
      assessments: [...state.assessments, assessment as AssessmentType],
      error: null
    }));
    
>>>>>>> teammate-repo/main
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
    
<<<<<<< HEAD
    const topRiskFactors = [
      { factor: 'Smoking', count: Math.floor(totalAssessments * 0.3) },
      { factor: 'High Blood Pressure', count: Math.floor(totalAssessments * 0.4) },
      { factor: 'Lack of Exercise', count: Math.floor(totalAssessments * 0.5) },
      { factor: 'Poor Diet', count: Math.floor(totalAssessments * 0.35) },
      { factor: 'Family History', count: Math.floor(totalAssessments * 0.25) },
    ];
=======
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
      }
    });
    
    // Convert to array and sort by count
    const topRiskFactors = Array.from(riskFactorCounts.entries())
      .map(([factor, count]) => ({ factor, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
>>>>>>> teammate-repo/main
    
    return {
      totalAssessments,
      assessmentsByRiskLevel,
      assessmentsByDisease,
      assessmentsByRegion,
<<<<<<< HEAD
      topRiskFactors
=======
      topRiskFactors: topRiskFactors.length > 0 ? topRiskFactors : [
        { factor: 'No data available', count: 0 }
      ]
>>>>>>> teammate-repo/main
    };
  },

  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error })
}));
<<<<<<< HEAD

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
=======
>>>>>>> teammate-repo/main

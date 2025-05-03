<<<<<<< HEAD

import { User, AssessmentType, Report, Disease, QuestionsByDisease } from './types';
import { v4 as uuidv4 } from 'uuid';

// Mock current user
=======
import { User, AssessmentType, Report, Disease, QuestionsByDisease } from './types';
import { v4 as uuidv4 } from 'uuid';

// Mock current user (keeping this for development purposes)
>>>>>>> teammate-repo/main
export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/assets/avatar-placeholder.jpg'
};

<<<<<<< HEAD
// Mock assessment templates
=======
// Assessment question templates
>>>>>>> teammate-repo/main
export const questionsByDisease: QuestionsByDisease = {
  diabetes: [
    {
      id: 'd1',
      text: 'What is your age?',
      type: 'number',
      required: true,
      validation: {
        min: 18,
        max: 120
      }
    },
    {
      id: 'd2',
      text: 'Do you have a family history of diabetes?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ],
      required: true
    },
    {
      id: 'd3',
      text: 'What is your current weight in kg?',
      type: 'number',
      required: true
    },
    {
      id: 'd4',
      text: 'What is your height in cm?',
      type: 'number',
      required: true
    },
    {
      id: 'd5',
      text: 'How would you describe your diet?',
      type: 'select',
      options: [
        { value: 'healthy', label: 'Mostly healthy and balanced' },
        { value: 'moderate', label: 'Moderately healthy' },
        { value: 'unhealthy', label: 'Often unhealthy' }
      ],
      required: true
    }
  ],
  kidneyDisease: [
    {
      id: 'kd1',
      text: 'Do you have high blood pressure?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'unknown', label: 'I don\'t know' }
      ],
      required: true
    },
    {
      id: 'kd2',
      text: 'Do you have diabetes?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ],
      required: true
    },
    {
      id: 'kd3',
      text: 'Is there a history of kidney disease in your family?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ],
      required: true
    },
    {
      id: 'kd4',
      text: 'How many glasses of water do you drink daily?',
      type: 'select',
      options: [
        { value: 'less-than-4', label: 'Less than 4 glasses' },
        { value: '4-8', label: '4-8 glasses' },
        { value: 'more-than-8', label: 'More than 8 glasses' }
      ],
      required: true
    },
    {
      id: 'kd5',
      text: 'Do you regularly take non-steroidal anti-inflammatory drugs (NSAIDs)?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ],
      required: true
    }
  ],
  heartDisease: [
    {
      id: 'hd1',
      text: 'Do you have high blood pressure?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'unknown', label: 'I don\'t know' }
      ],
      required: true
    },
    {
      id: 'hd2',
      text: 'Do you have high cholesterol?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'unknown', label: 'I don\'t know' }
      ],
      required: true
    },
    {
      id: 'hd3',
      text: 'Is there a history of heart disease in your family?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ],
      required: true
    },
    {
      id: 'hd4',
      text: 'How would you describe your physical activity level?',
      type: 'select',
      options: [
        { value: 'sedentary', label: 'Sedentary (little to no exercise)' },
        { value: 'light', label: 'Light activity (1-3 days per week)' },
        { value: 'moderate', label: 'Moderate activity (3-5 days per week)' },
        { value: 'high', label: 'High activity (6-7 days per week)' }
      ],
      required: true
    },
    {
      id: 'hd5',
      text: 'What is your stress level on average?',
      type: 'select',
      options: [
        { value: 'low', label: 'Low stress' },
        { value: 'moderate', label: 'Moderate stress' },
        { value: 'high', label: 'High stress' }
      ],
      required: true
    }
  ]
};

<<<<<<< HEAD
// Mock assessments
export const mockAssessments: AssessmentType[] = [
  {
    id: '1',
    userId: '1',
    type: 'diabetes',
    date: '2023-05-15',
    answers: {
      'd1': 35,
      'd2': 'yes',
      'd3': 78,
      'd4': 175,
      'd5': 'moderate'
    },
    riskScore: 65,
    riskLevel: 'moderate'
  },
  {
    id: '2',
    userId: '1',
    type: 'heartDisease',
    date: '2023-06-10',
    answers: {
      'hd1': 'no',
      'hd2': 'yes',
      'hd3': 'yes',
      'hd4': 'light',
      'hd5': 'moderate'
    },
    riskScore: 48,
    riskLevel: 'moderate'
  }
];

// Mock reports
export const mockReports: Report[] = [
  {
    id: '1',
    userId: '1',
    date: '2023-05-15',
    title: 'Diabetes Risk Assessment',
    summary: 'Based on your responses, you have a moderate risk of developing type 2 diabetes.',
    diseaseType: 'diabetes',
    riskLevel: 'moderate',
    riskScore: 65,
    recommendations: [
      'Consider getting regular blood sugar tests',
      'Maintain a healthy diet low in processed sugars',
      'Engage in regular physical activity',
      'Monitor your weight and aim to maintain a healthy BMI'
    ],
    assessmentId: '1'
  },
  {
    id: '2',
    userId: '1',
    date: '2023-06-10',
    title: 'Heart Disease Risk Assessment',
    summary: 'Your assessment indicates a moderate risk of heart disease based on family history and cholesterol levels.',
    diseaseType: 'heartDisease',
    riskLevel: 'moderate',
    riskScore: 48,
    recommendations: [
      'Get your cholesterol levels checked regularly',
      'Consider a heart-healthy diet rich in vegetables and whole grains',
      'Increase physical activity to at least 150 minutes per week',
      'Monitor blood pressure regularly',
      'Avoid smoking and limit alcohol consumption'
    ],
    assessmentId: '2'
  }
];

// Mock risk calculation function
export const calculateRisk = (disease: Disease, answers: Record<string, any>): { score: number, level: 'low' | 'moderate' | 'high' } => {
  // This is a simplified mock risk calculation
=======
// Empty arrays for assessments and reports - no more mock data
export const mockAssessments: AssessmentType[] = [];
export const mockReports: Report[] = [];

// Risk calculation function - modified to validate US location
export const calculateRisk = (disease: Disease, answers: Record<string, any>): { score: number, level: 'low' | 'moderate' | 'high' } => {
  // This is a simplified risk calculation
>>>>>>> teammate-repo/main
  // In a real application, this would involve actual medical algorithms
  
  let score = 0;
  
  switch(disease) {
    case 'diabetes':
      // Age factor
      if (answers.d1 > 45) score += 30;
      else if (answers.d1 > 35) score += 20;
      else score += 10;
      
      // Family history
      if (answers.d2 === 'yes') score += 25;
      
      // Calculate BMI
      const height = answers.d4 / 100; // convert cm to m
      const bmi = answers.d3 / (height * height);
      
      if (bmi > 30) score += 25;
      else if (bmi > 25) score += 15;
      
      // Diet
      if (answers.d5 === 'unhealthy') score += 20;
      else if (answers.d5 === 'moderate') score += 10;
      break;
      
    case 'kidneyDisease':
      // Hypertension
      if (answers.kd1 === 'yes') score += 30;
      
      // Diabetes
      if (answers.kd2 === 'yes') score += 30;
      
      // Family history
      if (answers.kd3 === 'yes') score += 20;
      
      // Water intake
      if (answers.kd4 === 'less-than-4') score += 10;
      
      // NSAID use
      if (answers.kd5 === 'yes') score += 10;
      break;
      
    case 'heartDisease':
      // Hypertension
      if (answers.hd1 === 'yes') score += 25;
      
      // High cholesterol
      if (answers.hd2 === 'yes') score += 25;
      
      // Family history
      if (answers.hd3 === 'yes') score += 20;
      
      // Physical activity
      if (answers.hd4 === 'sedentary') score += 20;
      else if (answers.hd4 === 'light') score += 10;
      
      // Stress level
      if (answers.hd5 === 'high') score += 10;
      else if (answers.hd5 === 'moderate') score += 5;
      break;
  }
  
  // Determine risk level based on score
  let level: 'low' | 'moderate' | 'high';
  if (score < 30) level = 'low';
  else if (score < 60) level = 'moderate';
  else level = 'high';
  
  return { score, level };
};

// Generate report based on assessment
export const generateReport = (assessment: AssessmentType): Report => {
  const diseaseNames = {
    diabetes: 'Diabetes',
    kidneyDisease: 'Kidney Disease',
    heartDisease: 'Heart Disease'
  };
  
  const recommendations = {
    diabetes: {
      low: [
        'Maintain a healthy diet',
        'Stay physically active',
        'Have your blood sugar checked during regular health exams'
      ],
      moderate: [
        'Consider getting regular blood sugar tests',
        'Maintain a healthy diet low in processed sugars',
        'Engage in regular physical activity',
        'Monitor your weight and aim to maintain a healthy BMI'
      ],
      high: [
        'Consult with a healthcare provider as soon as possible',
        'Get your blood sugar levels tested',
        'Consider working with a dietitian to create a diabetes prevention meal plan',
        'Implement a regular exercise routine',
        'Monitor your weight and work towards a healthy BMI'
      ]
    },
    kidneyDisease: {
      low: [
        'Stay hydrated',
        'Maintain a healthy diet',
        'Exercise regularly'
      ],
      moderate: [
        'Monitor your blood pressure regularly',
        'Consider getting your kidney function tested',
        'Limit NSAIDs use',
        'Stay well-hydrated',
        'Follow a kidney-friendly diet if recommended by your doctor'
      ],
      high: [
        'Consult with a nephrologist (kidney specialist)',
        'Get comprehensive kidney function tests',
        'Carefully manage blood pressure and diabetes if present',
        'Follow a kidney-friendly diet',
        'Stay hydrated but consult your doctor about fluid intake'
      ]
    },
    heartDisease: {
      low: [
        'Maintain a heart-healthy diet',
        'Exercise regularly',
        'Avoid smoking'
      ],
      moderate: [
        'Get your cholesterol levels checked regularly',
        'Consider a heart-healthy diet rich in vegetables and whole grains',
        'Increase physical activity to at least 150 minutes per week',
        'Monitor blood pressure regularly',
        'Avoid smoking and limit alcohol consumption'
      ],
      high: [
        'Consult with a cardiologist as soon as possible',
        'Get a comprehensive cardiovascular evaluation',
        'Carefully manage blood pressure, cholesterol, and blood sugar',
        'Follow a heart-healthy diet under medical guidance',
        'Implement a supervised exercise program',
        'Consider stress management techniques'
      ]
    }
  };
  
  const summaries = {
    diabetes: {
      low: 'Your assessment indicates a low risk of developing type 2 diabetes. Continue maintaining a healthy lifestyle.',
      moderate: 'Based on your responses, you have a moderate risk of developing type 2 diabetes. Some lifestyle modifications may be beneficial.',
      high: 'Your assessment indicates a high risk of developing type 2 diabetes. We recommend consulting with a healthcare provider soon.'
    },
    kidneyDisease: {
      low: 'Your kidney disease risk appears to be low. Maintain good hydration and a healthy lifestyle.',
      moderate: 'Your assessment indicates a moderate risk of kidney disease. Some preventive measures may be beneficial.',
      high: 'Your responses indicate a high risk of kidney disease. We recommend seeking medical advice for evaluation.'
    },
    heartDisease: {
      low: 'Your heart disease risk appears to be low based on the information provided. Continue maintaining heart-healthy habits.',
      moderate: 'Your assessment indicates a moderate risk of heart disease based on several factors. Some lifestyle modifications could reduce your risk.',
      high: 'Based on your responses, you have a high risk of heart disease. We strongly recommend consulting with a healthcare provider soon.'
    }
  };
  
  const { type, riskLevel = 'low' } = assessment;
  
  return {
    id: uuidv4(),
    userId: assessment.userId,
    date: new Date().toISOString().split('T')[0],
    title: `${diseaseNames[type]} Risk Assessment`,
    summary: summaries[type][riskLevel],
    diseaseType: type,
    riskLevel: riskLevel,
    riskScore: assessment.riskScore || 0,
    recommendations: recommendations[type][riskLevel],
    assessmentId: assessment.id
  };
};

<<<<<<< HEAD
// Function to create a new assessment
export const createAssessment = (userId: string, type: Disease, answers: Record<string, any>): AssessmentType => {
  const { score, level } = calculateRisk(type, answers);
=======
// US State list for validation
const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 
  'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  'District of Columbia'
];

// Function to validate US location
const isValidUsLocation = (city: string, state: string): boolean => {
  // Check if the state is in the US states list (case-insensitive)
  return usStates.some(s => s.toLowerCase() === state.toLowerCase());
};

// Function to create a new assessment - updated to require US location
export const createAssessment = (
  userId: string, 
  type: Disease, 
  answers: Record<string, any>, 
  city: string = '',
  state: string = ''
): AssessmentType | null => {
  // Validate US location
  if (!city || !state || !isValidUsLocation(city, state)) {
    return null; // Return null if not a valid US location
  }
  
  const { score, level } = calculateRisk(type, answers);
  const region = `${city}, ${state}`;
>>>>>>> teammate-repo/main
  
  return {
    id: uuidv4(),
    userId,
    type,
    date: new Date().toISOString().split('T')[0],
    answers,
    riskScore: score,
<<<<<<< HEAD
    riskLevel: level
=======
    riskLevel: level,
    region
>>>>>>> teammate-repo/main
  };
};

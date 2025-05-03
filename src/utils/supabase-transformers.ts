
import { SupabaseAssessment, SupabaseProfile, SupabaseReport, AssessmentType, User, Report } from '@/lib/supabase-types';
import { Json } from '@/integrations/supabase/types';

export const transformAssessment = (item: any): AssessmentType => ({
  id: item.id,
  userId: item.user_id,
  type: item.type as any,
  date: item.date,
  answers: item.answers as Record<string, any>,
  riskScore: item.risk_score || 0,
  riskLevel: item.risk_level as any || 'low',
  region: item.region || 'Unknown',
  // Use optional chaining for potentially missing fields
  age: item.age ?? undefined,
  gender: item.gender as any ?? undefined,
  zipCode: item.zip_code ?? undefined,
  urbanRural: item.urban_rural as any ?? undefined
});

export const transformUser = (item: SupabaseProfile): User => ({
  id: item.id,
  name: item.name || 'Anonymous',
  email: item.email || 'no-email@example.com',
  avatar: item.avatar,
  role: item.role as any
});

export const transformReport = (item: SupabaseReport): Report => ({
  id: item.id,
  userId: item.user_id,
  date: item.date,
  title: item.title,
  summary: item.summary,
  diseaseType: item.disease_type as any,
  riskLevel: item.risk_level as any || 'low',
  riskScore: item.risk_score || 0,
  recommendations: Array.isArray(item.recommendations) 
    ? (item.recommendations as unknown as any[]).map(rec => String(rec))  // Convert each item to string
    : [],
  assessmentId: item.assessment_id || ''
});

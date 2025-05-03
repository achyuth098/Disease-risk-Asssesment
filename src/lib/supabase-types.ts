
import { Json } from '@/integrations/supabase/types';

export interface SupabaseAssessment {
  id: string;
  user_id: string;
  type: string;
  date: string;
  answers: Record<string, any>;
  risk_score: number | null;
  risk_level: string | null;
  region: string | null;
  // Make these fields optional to match the current database schema
  age?: number | null;
  gender?: string | null;
  zip_code?: string | null;
  urban_rural?: string | null;
}

export interface SupabaseProfile {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: string | null;
}

export interface SupabaseReport {
  id: string;
  user_id: string;
  date: string;
  title: string;
  summary: string;
  disease_type: string | null;
  risk_level: string | null;
  risk_score: number | null;
  recommendations: Json | null;
  assessment_id: string | null;
}

export interface FetchDataResult {
  assessments: AssessmentType[];
  users: User[];
  reports: Report[];
}

// Re-export types from lib/types.ts to avoid circular dependencies
import { AssessmentType, User, Report } from '@/lib/types';
export type { AssessmentType, User, Report };


import { useFetchSupabaseData } from './useFetchSupabaseData';
import { useSaveAssessment } from './useSaveAssessment';
import { useSaveReport } from './useSaveReport';

export const useSupabaseData = () => {
  const { assessments, users, reports, loading, error, refreshData } = useFetchSupabaseData();
  const { saveAssessment } = useSaveAssessment();
  const { saveReport } = useSaveReport();

  return { 
    assessments, 
    users, 
    reports, 
    loading, 
    error, 
    refreshData,
    saveAssessment,
    saveReport
  };
};

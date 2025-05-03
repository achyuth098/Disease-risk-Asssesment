
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Report } from '@/lib/supabase-types';

export const useSaveReport = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const saveReport = async (report: Omit<Report, 'id'>) => {
    setSaving(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          user_id: report.userId,
          date: report.date,
          title: report.title,
          summary: report.summary,
          disease_type: report.diseaseType,
          risk_level: report.riskLevel,
          risk_score: report.riskScore,
          recommendations: report.recommendations,
          assessment_id: report.assessmentId
        }])
        .select();
        
      if (error) throw error;
      
      // Handle the returned data
      if (data && data[0]) {
        const newReport: Report = {
          id: data[0].id,
          userId: data[0].user_id,
          date: data[0].date,
          title: data[0].title,
          summary: data[0].summary,
          diseaseType: data[0].disease_type as any,
          riskLevel: data[0].risk_level as any,
          riskScore: data[0].risk_score,
          recommendations: Array.isArray(data[0].recommendations) 
            ? (data[0].recommendations as unknown as any[]).map(rec => String(rec))
            : [],
          assessmentId: data[0].assessment_id || ''
        };
        
        toast({
          title: "Report saved",
          description: "Report has been saved to the database",
        });
        
        return newReport.id;
      }
      return null;
    } catch (err: any) {
      console.error('Error saving report:', err);
      setError(err.message || 'Failed to save report');
      toast({
        title: "Error saving report",
        description: err.message || 'Failed to save report to the database',
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  return { saveReport, saving, error };
};

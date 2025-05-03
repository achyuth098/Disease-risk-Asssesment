
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AssessmentType } from '@/lib/supabase-types';
import { transformAssessment } from '@/utils/supabase-transformers';

export const useSaveAssessment = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const saveAssessment = async (assessment: Omit<AssessmentType, 'id'>) => {
    setSaving(true);
    setError(null);
    
    try {
      // Get current user data to include with assessment
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('No user logged in. Please login first.');
      }
      
      const user = JSON.parse(userData);
      
      // Make sure we have a region
      const region = assessment.region || user.region || 'Unknown';
      
      const { data, error } = await supabase
        .from('assessments')
        .insert([{
          user_id: assessment.userId || user.id,
          type: assessment.type,
          date: assessment.date,
          answers: assessment.answers,
          risk_score: assessment.riskScore,
          risk_level: assessment.riskLevel,
          region: region,
          age: assessment.age || null,
          gender: assessment.gender || null,
          zip_code: assessment.zipCode || null,
          urban_rural: assessment.urbanRural || null
        }])
        .select();
        
      if (error) throw error;
      
      console.log('Assessment saved successfully:', data);
      
      // Transform the returned data
      if (data && data[0]) {
        const newAssessment = transformAssessment(data[0]);
        
        toast({
          title: "Assessment saved",
          description: "Assessment data has been saved to the database",
        });
        
        return newAssessment.id;
      }
      return null;
    } catch (err: any) {
      console.error('Error saving assessment:', err);
      setError(err.message || 'Failed to save assessment');
      toast({
        title: "Error saving assessment",
        description: err.message || 'Failed to save assessment to the database',
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  return { saveAssessment, saving, error };
};

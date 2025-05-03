
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { FetchDataResult } from '@/lib/supabase-types';
import { transformAssessment, transformUser, transformReport } from '@/utils/supabase-transformers';

export const useFetchSupabaseData = () => {
  const [assessments, setAssessments] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching fresh data from Supabase...');
      
      // Fetch assessments - use DESCENDING order by created_at to prioritize newest records
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (assessmentError) throw assessmentError;
      
      console.log('Assessments fetched:', assessmentData?.length || 0, 'records');
      console.log('First assessment data sample:', assessmentData && assessmentData.length > 0 ? assessmentData[0] : 'none');
      
      // Fetch user profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profileError) throw profileError;
      
      // Fetch reports
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (reportError) throw reportError;
      
      // Transform Supabase data to match our app types
      const transformedAssessments = (assessmentData || []).map(transformAssessment);
      const transformedUsers = (profileData || []).map(transformUser);
      const transformedReports = (reportData || []).map(transformReport);
      
      setAssessments(transformedAssessments);
      setUsers(transformedUsers);
      setReports(transformedReports);
      
      toast({
        title: "Data refreshed",
        description: `Loaded ${transformedAssessments.length} assessments from database`,
      });
      
      return { assessments: transformedAssessments, users: transformedUsers, reports: transformedReports };
    } catch (err: any) {
      console.error('Error fetching data from Supabase:', err);
      setError(err.message || 'Failed to fetch data');
      toast({
        title: "Error fetching data",
        description: err.message || 'Failed to fetch data from the database',
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up a subscription to listen for changes to the assessments table
  useEffect(() => {
    console.log("Setting up Supabase realtime subscription for assessments table");
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assessments' },
        (payload) => {
          console.log('Realtime update received:', payload);
          // Refresh data when changes are detected
          fetchData();
        }
      )
      .subscribe();
      
    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up Supabase realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  return { 
    assessments, 
    users, 
    reports, 
    loading, 
    error, 
    refreshData: fetchData 
  };
};

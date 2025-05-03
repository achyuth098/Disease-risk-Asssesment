
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Only run this after the loading state is false to avoid redirection race conditions
    if (!loading) {
      const patientUser = localStorage.getItem('user');
      
      if (!patientUser) {
        // If no patient user found, redirect to login
        navigate('/login');
        return;
      }
      
      setIsChecked(true);
    }
  }, [loading, navigate]);

  if (loading || !isChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-health-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

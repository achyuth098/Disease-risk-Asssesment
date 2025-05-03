
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (loading) return;
      
      try {
        // Check if admin user from localStorage
        const adminUser = localStorage.getItem('adminUser');
        
        if (adminUser) {
          setIsAdmin(true);
        } else {
          // If user exists but is not an admin, redirect to admin login
          navigate('/admin/login');
          return;
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [loading, navigate]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAdmin ? <>{children}</> : null;
};

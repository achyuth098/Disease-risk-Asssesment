
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user in localStorage (for when Supabase is disconnected)
    const storedUser = localStorage.getItem('user');
    const adminUser = localStorage.getItem('adminUser');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('User found in localStorage:', parsedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }
    } else if (adminUser) {
      try {
        const parsedAdmin = JSON.parse(adminUser);
        setUser(parsedAdmin);
        console.log('Admin user found in localStorage:', parsedAdmin);
      } catch (e) {
        console.error('Error parsing stored admin user:', e);
        localStorage.removeItem('adminUser');
      }
    } else {
      console.log('No user found in localStorage');
    }
    
    setLoading(false);
  }, []);

  const signOut = async () => {
    try {
      // In a connected app, we would call supabase.auth.signOut() here
      // But since Supabase is disconnected, we'll just clear local storage
      
      // Always clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('adminUser');
      setUser(null);
      setSession(null);
      
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Clear local storage anyway as a fallback
      localStorage.removeItem('user');
      localStorage.removeItem('adminUser');
      setUser(null);
      setSession(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlurCard } from "@/components/ui-custom/BlurCard";
import { AlertCircle, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user && localStorage.getItem('adminUser')) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simplified login validation
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isValidPassword = password.length >= 6;
      
      if (!isValidEmail || !isValidPassword) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Store mock admin session in localStorage for persistence
      const adminUser = { 
        email, 
        role: 'admin',
        id: 'admin-123'
      };
      
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      
      // Remove any patient user to avoid conflicts
      localStorage.removeItem('user');
      
      // Simulate successful login
      toast.success('Logged in as administrator');
      
      // Use a timeout to ensure the state is updated before redirecting
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 100);
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (user && localStorage.getItem('adminUser')) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-medium">
          <Shield className="h-5 w-5 text-primary" />
          <span>Admin Portal</span>
        </Link>
      </div>
      
      <BlurCard className="w-full max-w-md">
        <div className="flex flex-col space-y-6 p-6">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Administrator Login</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access the admin dashboard
            </p>
            {/* Demo credentials removed */}
          </div>
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In as Administrator'}
            </Button>
          </form>
          
          <div className="text-center text-sm">
            <Link to="/login" className="text-primary hover:text-primary/90 transition-colors">
              Return to Patient Login
            </Link>
          </div>
        </div>
      </BlurCard>
    </div>
  );
};

export default AdminLogin;

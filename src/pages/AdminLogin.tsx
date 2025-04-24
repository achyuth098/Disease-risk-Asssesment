
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlurCard } from "@/components/ui-custom/BlurCard";
import { login } from "@/lib/utils";
import { AlertCircle, Heart, UserCog } from "lucide-react";

// List of common personal email domains to be blocked
const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'mail.com',
  'zoho.com',
  'yandex.com',
  'gmx.com',
  'live.com',
  'msn.com'
];

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const isBusinessEmail = (email: string): boolean => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    
    // Check if the domain is in the list of personal email domains
    return !PERSONAL_EMAIL_DOMAINS.includes(domain);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate business email
    if (!isBusinessEmail(email)) {
      setError('Administrator access requires a business email domain');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would validate with a backend
      // For this demo, we're simulating login with a utility function
      const success = login(email, password);
      
      if (success) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Redirect admin users to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError('Invalid administrator credentials');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-health-50/50 to-white">
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-medium">
          <Heart className="h-5 w-5 text-health-600" />
          <span>HealthRisk</span>
        </Link>
      </div>
      
      <BlurCard className="w-full max-w-md">
        <div className="flex flex-col space-y-6 p-6">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-health-100 rounded-full">
                <UserCog className="h-8 w-8 text-health-600" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Administrator Login</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access the administrator dashboard
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Only business email domains are accepted for administrator access
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all duration-200 focus-visible:ring-health-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="text-xs text-health-600 hover:text-health-800 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-all duration-200 focus-visible:ring-health-500"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full health-gradient shadow-sm hover:shadow-md transition-shadow"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In as Administrator'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            Need an administrator account?{" "}
            <Link to="/admin/signup" className="text-health-600 hover:text-health-800 transition-colors">
              Sign up here
            </Link>
          </div>
          
          <div className="text-center text-xs text-muted-foreground">
            For administrator access, please contact your system administrator.
          </div>
        </div>
      </BlurCard>
    </div>
  );
};

export default AdminLogin;

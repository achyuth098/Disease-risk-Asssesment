
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlurCard } from "@/components/ui-custom/BlurCard";
import { AlertCircle, Heart, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');  // Added name field
  const [region, setRegion] = useState(''); // Added region field
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // If already logged in as a patient, redirect to dashboard
    if (user && localStorage.getItem('user')) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (isSignUp && !name) {
      setError('Please enter your name');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simplified login validation
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isValidPassword = password.length >= 6;
      
      if (!isValidEmail || !isValidPassword) {
        setError('Invalid email or password (minimum 6 characters)');
        setIsLoading(false);
        return;
      }

      // Store mock patient session in localStorage for persistence
      const patientUser = { 
        email,
        name: name || 'Patient User',
        region: region || 'Unknown',
        role: 'patient',
        id: `patient-${Math.random().toString(36).substring(2, 9)}`
      };
      
      localStorage.setItem('user', JSON.stringify(patientUser));
      
      // Simulate successful login
      toast.success(isSignUp ? 'Account created successfully' : 'Logged in successfully');
      
      // Use a timeout to ensure the state is updated before redirecting
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
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
                <User className="h-8 w-8 text-health-600" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {isSignUp ? 'Create an Account' : 'Patient Login'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSignUp 
                ? 'Sign up to start tracking your health risk assessments'
                : 'Sign in to access your health assessments'}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="transition-all duration-200 focus-visible:ring-health-500"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all duration-200 focus-visible:ring-health-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {!isSignUp && (
                  <Link to="#" className="text-xs text-health-600 hover:text-health-800 transition-colors">
                    Forgot password?
                  </Link>
                )}
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
            
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="region">Your Location (City, State)</Label>
                <Input
                  id="region"
                  type="text"
                  placeholder="New York, NY"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="transition-all duration-200 focus-visible:ring-health-500"
                />
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full health-gradient shadow-sm hover:shadow-md transition-shadow"
              disabled={isLoading}
            >
              {isLoading 
                ? 'Processing...' 
                : isSignUp 
                  ? 'Create Account' 
                  : 'Sign In as Patient'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button 
                  onClick={() => setIsSignUp(false)} 
                  className="text-health-600 hover:text-health-800 transition-colors"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button 
                  onClick={() => setIsSignUp(true)} 
                  className="text-health-600 hover:text-health-800 transition-colors"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
          
          <div className="mt-4 text-center text-sm">
            Are you an administrator?{" "}
            <Link to="/admin/login" className="text-health-600 hover:text-health-800 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </BlurCard>
    </div>
  );
};

export default Login;

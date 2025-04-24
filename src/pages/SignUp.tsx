
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlurCard } from "@/components/ui-custom/BlurCard";
import { signup } from "@/lib/utils";
import { AlertCircle, Heart } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would register with a backend
      // For this demo, we're simulating signup with a utility function
      const success = signup(name, email, password);
      
      if (success) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/dashboard');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during sign up. Please try again.');
      console.error('Signup error:', err);
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
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Sign up to start your health risk assessment
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="transition-all duration-200 focus-visible:ring-health-500"
              />
            </div>
            
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
              <Label htmlFor="password">Password</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="transition-all duration-200 focus-visible:ring-health-500"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full health-gradient shadow-sm hover:shadow-md transition-shadow"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-health-600 hover:text-health-800 transition-colors">
              Sign in
            </Link>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" className="hover:bg-gray-50">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button" className="hover:bg-gray-50">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M9.09 12c0-1.89.83-3.6 2.16-4.79-0.5-0.7-1.28-1.27-2.19-1.61-0.92-0.34-1.91-0.42-2.87-0.24C5.25 5.55 4.39 6.15 3.76 7c-0.636 0.85-0.975 1.87-0.975 2.93 0 1.06 0.34 2.08 0.975 2.93 0.634 0.85 1.5 1.44 2.46 1.64 0.95 0.19 1.95 0.11 2.87-0.23 0.92-0.34 1.69-0.9 2.19-1.61C9.92 15.6 9.09 13.89 9.09 12Z"
                  fill="#333"
                />
                <path
                  d="M19.07 17.49C20.15 16.91 21 16 21 14.57c0-1.37-0.8-2.37-2.13-3.03 0.19-0.58 0.3-1.19 0.3-1.81 0-3.08-2.49-5.54-5.55-5.54-3.06 0-5.55 2.5-5.55 5.54 0 3.08 2.49 5.54 5.55 5.54 0.96 0 1.93-0.25 2.76-0.7 0.93 0.57 2.13 1.77 2.69 2.92z"
                  fill="#333"
                />
              </svg>
              Apple
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link to="#" className="underline underline-offset-4 hover:text-health-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="underline underline-offset-4 hover:text-health-600">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </BlurCard>
    </div>
  );
};

export default SignUp;

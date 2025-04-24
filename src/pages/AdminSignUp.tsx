
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlurCard } from "@/components/ui-custom/BlurCard";
import { signup } from "@/lib/utils";
import { AlertCircle, Heart, UserCog } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Reuse the same list of personal email domains as in AdminLogin
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

const AdminSignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const isBusinessEmail = (email: string): boolean => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    
    // Check if the domain is not in the list of personal email domains
    return !PERSONAL_EMAIL_DOMAINS.includes(domain);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword || !companyName) {
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
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate business email
    if (!isBusinessEmail(email)) {
      setError('Administrator accounts require a business email domain');
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
        setShowSuccessDialog(true);
      } else {
        setError('Failed to create administrator account. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during sign up. Please try again.');
      console.error('Admin signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleContinueToLogin = () => {
    navigate('/admin/login');
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
            <h1 className="text-2xl font-semibold tracking-tight">Create Administrator Account</h1>
            <p className="text-sm text-muted-foreground">
              Sign up to access the HealthRisk administrative tools
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Only business email domains are accepted for administrator accounts
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
              <Label htmlFor="email">Business Email</Label>
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
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                type="text"
                placeholder="Your Company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
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
              {isLoading ? 'Creating account...' : 'Create Administrator Account'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/admin/login" className="text-health-600 hover:text-health-800 transition-colors">
              Sign in
            </Link>
          </div>
          
          <div className="text-center text-xs text-muted-foreground">
            For administrator access, please use your corporate email address.
          </div>
        </div>
      </BlurCard>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Administrator Account Created</DialogTitle>
            <DialogDescription>
              Your administrator account has been successfully created. You can now log in to access the administrative dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              className="health-gradient shadow-sm hover:shadow-md transition-shadow"
              onClick={handleContinueToLogin}
            >
              Continue to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSignUp;

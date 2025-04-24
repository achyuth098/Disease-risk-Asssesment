
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BlurCard } from "@/components/ui-custom/BlurCard";
import { AnimatedGradientText } from "@/components/ui-custom/AnimatedGradientText";
import { cn } from "@/lib/utils";
import { ArrowRight, Heart, Gauge, Shield, FileText, User, UserCog } from "lucide-react";

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}>
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-health-600" />
            <span className="font-medium text-xl">HealthRisk</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-health-600">
              Home
            </Link>
            <Link to="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-health-600">
              Features
            </Link>
            <Link to="#about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-health-600">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden md:inline-flex">
                  <User className="mr-1 h-4 w-4" /> Patient Login
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="outline" size="sm" className="hidden md:inline-flex">
                  <UserCog className="mr-1 h-4 w-4" /> Admin Login
                </Button>
              </Link>
            </div>
            <Link to="/signup">
              <Button size="sm" className="health-gradient shadow-md hover:shadow-lg transition-shadow">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-health-50/50 to-transparent pointer-events-none" />
        <div className="container py-20 md:py-32 flex flex-col items-center text-center">
          <div 
            className="w-16 h-16 mb-8 rounded-full bg-health-100 flex items-center justify-center animate-float"
          >
            <Heart className="h-8 w-8 text-health-600" />
          </div>
          
          <h1 className="max-w-3xl mx-auto animate-fade-in font-bold">
            Understand your <AnimatedGradientText>health risks</AnimatedGradientText> with professional assessment
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-muted-foreground text-lg animate-fade-in">
            Our advanced health assessment tool helps identify potential health risks and provides personalized recommendations for both patients and healthcare providers.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Link to="/signup">
              <Button size="lg" className="health-gradient shadow-md hover:shadow-lg transition-shadow">
                Patient Sign Up
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="outline" size="lg">
                  <User className="mr-1 h-4 w-4" /> Patient Login
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="outline" size="lg">
                  <UserCog className="mr-1 h-4 w-4" /> Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* For Patients & For Healthcare Providers Section */}
      <section className="py-16 bg-gradient-to-b from-white to-health-50/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BlurCard className="p-8">
              <h2 className="text-2xl font-bold mb-4">For Patients</h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-health-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Take personalized health risk assessments</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-health-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Receive tailored recommendations</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-health-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Track your health progress over time</span>
                </li>
              </ul>
              <Link to="/login">
                <Button className="w-full">
                  <User className="mr-2 h-4 w-4" /> Patient Login
                </Button>
              </Link>
            </BlurCard>
            
            <BlurCard className="p-8">
              <h2 className="text-2xl font-bold mb-4">For Healthcare Administrators</h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-health-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>View aggregated assessment data</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-health-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Analyze regional health trends</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-health-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Monitor risk levels across population groups</span>
                </li>
              </ul>
              <Link to="/admin/login">
                <Button className="w-full">
                  <UserCog className="mr-2 h-4 w-4" /> Admin Login
                </Button>
              </Link>
            </BlurCard>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-health-100 text-health-700 text-sm font-medium">
              Features
            </div>
            <h2 className="max-w-2xl">Comprehensive health risk assessment</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Our platform offers a comprehensive approach to health risk assessment, helping patients understand their risks and administrators analyze population health.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-start p-6 bg-white rounded-xl border shadow-sm hover-lift">
              <div className="w-12 h-12 rounded-full bg-health-100 flex items-center justify-center mb-4">
                <Gauge className="h-6 w-6 text-health-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Risk Assessment</h3>
              <p className="text-muted-foreground">
                Answer simple questions about health history, lifestyle, and habits to assess risk level for various conditions.
              </p>
            </div>
            
            <div className="flex flex-col items-start p-6 bg-white rounded-xl border shadow-sm hover-lift">
              <div className="w-12 h-12 rounded-full bg-health-100 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-health-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Detailed Reports</h3>
              <p className="text-muted-foreground">
                Receive comprehensive reports with risk analysis and personalized recommendations based on assessment results.
              </p>
            </div>
            
            <div className="flex flex-col items-start p-6 bg-white rounded-xl border shadow-sm hover-lift">
              <div className="w-12 h-12 rounded-full bg-health-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-health-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Administrative Analytics</h3>
              <p className="text-muted-foreground">
                Healthcare administrators can access population-level analytics to identify trends and make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-health-100 text-health-700 text-sm font-medium">
                About
              </div>
              <h2 className="max-w-xl">Making health assessment accessible to everyone</h2>
              <p className="mt-4 text-muted-foreground max-w-xl">
                Our platform is designed to make health risk assessment accessible, understandable, and actionable for both patients and healthcare professionals.
              </p>
              <p className="mt-4 text-muted-foreground max-w-xl">
                While our assessments provide valuable insights, they are not meant to replace professional medical advice. Always consult with healthcare providers for diagnosis and treatment.
              </p>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-health-100 rounded-2xl transform rotate-3"></div>
                <div className="absolute -inset-4 bg-health-200 rounded-2xl transform -rotate-3 opacity-70"></div>
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Doctor with patient"
                  className="relative rounded-xl shadow-lg w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-12 bg-gradient-to-b from-white to-health-50/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Heart className="h-5 w-5 text-health-600" />
              <span className="font-medium">HealthRisk</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <Link to="/" className="text-sm text-muted-foreground hover:text-health-600 text-center md:text-left">
                Home
              </Link>
              <Link to="#features" className="text-sm text-muted-foreground hover:text-health-600 text-center md:text-left">
                Features
              </Link>
              <Link to="#about" className="text-sm text-muted-foreground hover:text-health-600 text-center md:text-left">
                About
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-health-600 text-center md:text-left">
                Patient Login
              </Link>
              <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-health-600 text-center md:text-left">
                Admin Login
              </Link>
            </div>
            
            <div className="mt-4 md:mt-0">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} HealthRisk. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

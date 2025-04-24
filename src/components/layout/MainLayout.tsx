
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Home, User, BarChart, LogOut } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  pageTitle?: string;
  fullWidth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showBackButton = false, 
  pageTitle = "",
  fullWidth = false 
}) => {
  const location = useLocation();
  const isAuthenticated = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      
      {isAuthenticated && (
        <header className="sticky top-0 z-50 w-full border-b bg-white/75 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              {showBackButton && (
                <Button variant="ghost" size="icon" className="mr-2" asChild>
                  <Link to="/dashboard">
                    <ChevronLeft className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              <h1 className="text-lg font-medium">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground">
                  <User size={18} />
                </div>
              </Link>
            </div>
          </div>
        </header>
      )}
      
      <main className={cn(
        "flex-1 relative",
        fullWidth ? "w-full" : "container py-6 md:py-10 animate-fade-in"
      )}>
        {children}
      </main>
      
      {isAuthenticated && (
        <nav className="sticky bottom-0 border-t bg-white/75 backdrop-blur-lg">
          <div className="container">
            <div className="flex items-center justify-around py-2">
              <Link to="/dashboard" className="flex flex-col items-center p-2">
                <Home size={20} className={location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'} />
                <span className={cn(
                  "text-xs mt-1", 
                  location.pathname === '/dashboard' ? 'text-primary font-medium' : 'text-muted-foreground'
                )}>
                  Home
                </span>
              </Link>
              
              <Link to="/assessments" className="flex flex-col items-center p-2">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={location.pathname.includes('/assessment') ? 'text-primary' : 'text-muted-foreground'}
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span className={cn(
                  "text-xs mt-1", 
                  location.pathname.includes('/assessment') ? 'text-primary font-medium' : 'text-muted-foreground'
                )}>
                  Health
                </span>
              </Link>
              
              <Link to="/reports" className="flex flex-col items-center p-2">
                <BarChart size={20} className={location.pathname === '/reports' ? 'text-primary' : 'text-muted-foreground'} />
                <span className={cn(
                  "text-xs mt-1", 
                  location.pathname === '/reports' ? 'text-primary font-medium' : 'text-muted-foreground'
                )}>
                  Reports
                </span>
              </Link>
              
              <Link to="/login" className="flex flex-col items-center p-2">
                <LogOut size={20} className="text-muted-foreground" />
                <span className="text-xs mt-1 text-muted-foreground">
                  Logout
                </span>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default MainLayout;

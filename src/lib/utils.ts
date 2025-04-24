import React from 'react';
import { Heart, AlertCircle, Droplet, Activity } from "lucide-react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get disease information by id
export function getDiseaseInfo(diseaseId: string) {
  const diseaseInfo: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
    diabetes: {
      title: 'Diabetes',
      description: 'Assessment for diabetes risk factors and management recommendations.',
      icon: React.createElement(Droplet, { className: "text-red-500" }),
    },
    kidneyDisease: {
      title: 'Kidney Disease',
      description: 'Evaluate your kidney health and identify potential risk factors.',
      icon: React.createElement(Activity, { className: "text-purple-500" }),
    },
    heartDisease: {
      title: 'Heart Disease',
      description: 'Analyze your cardiovascular health and prevention strategies.',
      icon: React.createElement(Heart, { className: "text-pink-500" }),
    },
  };

  return (
    diseaseInfo[diseaseId] || {
      title: 'Health Assessment',
      description: 'Evaluate your health risk factors.',
      icon: React.createElement(AlertCircle, { className: "text-gray-500" }),
    }
  );
}

// Mock authentication functions
export const login = (email: string, password: string): boolean => {
  // In a real app, this would authenticate with a backend
  // For this demo, we're just checking if the email looks valid
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return isValidEmail && password.length >= 6;
};

export const signup = (name: string, email: string, password: string): boolean => {
  // In a real app, this would register the user with a backend
  // For this demo, we're just checking if the inputs look valid
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidName = name.length >= 2;
  return isValidEmail && isValidName && password.length >= 6;
};

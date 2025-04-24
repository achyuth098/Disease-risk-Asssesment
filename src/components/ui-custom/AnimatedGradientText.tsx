
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span 
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r from-health-600 to-health-800",
        "animate-pulse",
        className
      )}
    >
      {children}
    </span>
  );
}

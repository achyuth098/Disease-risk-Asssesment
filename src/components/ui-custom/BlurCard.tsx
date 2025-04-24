
import { cn } from "@/lib/utils";

interface BlurCardProps {
  children: React.ReactNode;
  className?: string;
}

export function BlurCard({ children, className }: BlurCardProps) {
  return (
    <div 
      className={cn(
        "rounded-2xl border border-white/20 bg-white/70 backdrop-blur-md p-6",
        "transition-all duration-300 hover:shadow-md",
        "animate-scale-in",
        className
      )}
    >
      {children}
    </div>
  );
}

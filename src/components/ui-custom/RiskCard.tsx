
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type RiskLevel = "low" | "moderate" | "high";

interface RiskCardProps {
  title: string;
  description?: string;
  riskLevel?: RiskLevel;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function RiskCard({ title, description, riskLevel = "low", icon, className, onClick }: RiskCardProps) {
  const navigate = useNavigate();
  
  const riskColors = {
    low: "bg-green-50 text-green-700 border-green-200",
    moderate: "bg-yellow-50 text-yellow-700 border-yellow-200",
    high: "bg-red-50 text-red-700 border-red-200"
  };
  
  const riskBadgeColors = {
    low: "bg-green-100 text-green-800",
    moderate: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <Card 
      className={cn(
        "border overflow-hidden transition-all hover:shadow-md cursor-pointer smooth-transition",
        "hover:-translate-y-1",
        riskColors[riskLevel],
        className
      )}
      onClick={handleClick}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {icon && <div className="text-health-600">{icon}</div>}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Badge className={cn("mt-2", riskBadgeColors[riskLevel])}>
          {riskLevel === "low" && "Low Risk"}
          {riskLevel === "moderate" && "Moderate Risk"}
          {riskLevel === "high" && "High Risk"}
        </Badge>
      </CardContent>
    </Card>
  );
}

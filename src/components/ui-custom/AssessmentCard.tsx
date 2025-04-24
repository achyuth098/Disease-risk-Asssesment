
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AssessmentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  className?: string;
}

export function AssessmentCard({ title, description, icon, route, className }: AssessmentCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-md transition-all border",
      "hover:border-health-200 hover:-translate-y-1",
      "cursor-pointer group",
      className
    )}>
      <CardHeader className="p-6 pb-0">
        <div className="w-12 h-12 rounded-full bg-health-100 flex items-center justify-center mb-4 group-hover:bg-health-200 transition-colors">
          <div className="text-health-600">
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <Link to={route}>
          <Button variant="ghost" className="p-0 text-health-600 hover:text-health-700 hover:bg-transparent">
            Start Assessment
            <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

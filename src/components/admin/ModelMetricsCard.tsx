
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CircleCheck, ChartLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ModelMetricsProps = {
  averageRisk: number;
  accuracy: number;
  auc: number;
};

export const ModelMetricsCard = ({ averageRisk, accuracy, auc }: ModelMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
          <ChartLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRisk}%</div>
          <p className="text-xs text-muted-foreground">Across all assessments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
          <CircleCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{accuracy}%</div>
            <Badge variant="secondary">High Confidence</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Based on validation data</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">AUC Score</CardTitle>
          <CircleCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{auc}</div>
            <Badge variant="secondary">Excellent</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Model performance metric</p>
        </CardContent>
      </Card>
    </div>
  );
};

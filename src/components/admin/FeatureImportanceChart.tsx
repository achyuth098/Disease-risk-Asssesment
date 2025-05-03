
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type FeatureImportance = {
  feature: string;
  importance: number;
};

type FeatureImportanceChartProps = {
  data: FeatureImportance[];
};

export const FeatureImportanceChart = ({ data }: FeatureImportanceChartProps) => {
  // If there's no actual data, show placeholder data
  const chartData = data.length > 0 && data.some(d => d.importance > 0) 
    ? data 
    : [
        { feature: "Family History", importance: 0.85 },
        { feature: "Hypertension", importance: 0.78 },
        { feature: "Physical Inactivity", importance: 0.72 },
        { feature: "Poor Diet", importance: 0.65 },
        { feature: "Obesity", importance: 0.62 },
        { feature: "Smoking", importance: 0.58 },
        { feature: "Stress", importance: 0.55 },
      ];
  
  // Sort the data by importance
  const sortedData = [...chartData].sort((a, b) => b.importance - a.importance);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Factors</CardTitle>
        <CardDescription>
          {data.length > 0 && data.some(d => d.importance > 0)
            ? "Common risk factors from patient assessments" 
            : "Common risk factors impacting health outcomes"}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{
              top: 20,
              right: 30,
              left: 120,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <YAxis dataKey="feature" type="category" />
            <Tooltip 
              formatter={(value) => [`${(Number(value) * 100).toFixed(0)}%`, 'Prevalence']}
            />
            <Bar 
              dataKey="importance" 
              fill="#8884d8"
              background={{ fill: '#eee' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

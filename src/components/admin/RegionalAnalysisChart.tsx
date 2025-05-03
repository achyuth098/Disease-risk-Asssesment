
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { MapPin } from "lucide-react";
import { AssessmentType } from '@/lib/types';

type RegionalData = {
  region: string;
  assessmentCount: number;
  averageRisk: number;
  highRiskCount: number;
  highRiskPercentage: number;
};

type RegionalAnalysisChartProps = {
  assessments: AssessmentType[];
};

export const RegionalAnalysisChart = ({ assessments }: RegionalAnalysisChartProps) => {
  const [viewType, setViewType] = useState<'count' | 'risk' | 'high-risk'>('count');

  // Process regional data
  const regionalDataMap = new Map<string, RegionalData>();
  
  assessments.forEach(assessment => {
    const region = assessment.region || 'Unknown';
    const existingData = regionalDataMap.get(region) || {
      region,
      assessmentCount: 0,
      averageRisk: 0,
      highRiskCount: 0,
      highRiskPercentage: 0
    };
    
    existingData.assessmentCount += 1;
    
    // Add to risk total
    if (assessment.riskScore) {
      existingData.averageRisk += assessment.riskScore;
    }
    
    // Count high risk assessments
    if (assessment.riskLevel === 'high') {
      existingData.highRiskCount += 1;
    }
    
    regionalDataMap.set(region, existingData);
  });
  
  // Calculate averages and percentages
  regionalDataMap.forEach(data => {
    data.averageRisk = Math.round(data.averageRisk / data.assessmentCount);
    data.highRiskPercentage = Math.round((data.highRiskCount / data.assessmentCount) * 100);
  });
  
  // Convert to array and sort by selected view
  let regionalData = Array.from(regionalDataMap.values());
  
  if (viewType === 'count') {
    regionalData.sort((a, b) => b.assessmentCount - a.assessmentCount);
  } else if (viewType === 'risk') {
    regionalData.sort((a, b) => b.averageRisk - a.averageRisk);
  } else {
    regionalData.sort((a, b) => b.highRiskPercentage - a.highRiskPercentage);
  }
  
  // Take top 10 regions
  regionalData = regionalData.slice(0, 10);
  
  // Get data based on selected view
  const getBarData = () => {
    if (viewType === 'count') {
      return regionalData.map(region => ({
        name: region.region,
        value: region.assessmentCount
      }));
    } else if (viewType === 'risk') {
      return regionalData.map(region => ({
        name: region.region,
        value: region.averageRisk
      }));
    } else {
      return regionalData.map(region => ({
        name: region.region,
        value: region.highRiskPercentage
      }));
    }
  };
  
  const data = getBarData();
  
  // Get color based on value and view type
  const getBarColor = (value: number) => {
    if (viewType === 'risk' || viewType === 'high-risk') {
      if (value > 66) return '#ef4444';
      if (value > 33) return '#f59e0b';
      return '#22c55e';
    }
    return '#6E59A5'; // Default color
  };
  
  // Get Y-axis label based on view type
  const getYAxisLabel = () => {
    if (viewType === 'count') return 'Number of Assessments';
    if (viewType === 'risk') return 'Average Risk Score (%)';
    return 'High Risk Percentage (%)';
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Regional Analysis
          </CardTitle>
          <CardDescription>
            Assessment distribution and risk levels by region
          </CardDescription>
        </div>
        <Select 
          value={viewType} 
          onValueChange={(value) => setViewType(value as 'count' | 'risk' | 'high-risk')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="count">Assessment Count</SelectItem>
            <SelectItem value="risk">Average Risk Score</SelectItem>
            <SelectItem value="high-risk">High Risk %</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[500px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 20,
              right: 50,
              left: 70,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              label={{ 
                value: getYAxisLabel(), 
                position: 'insideBottom', 
                offset: -5 
              }} 
            />
            <YAxis dataKey="name" type="category" />
            <Tooltip formatter={(value) => {
              if (viewType === 'count') return [`${value} assessments`, 'Count'];
              return [`${value}%`, viewType === 'risk' ? 'Avg Risk' : 'High Risk'];
            }} />
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
              ))}
              <LabelList dataKey="value" position="right" formatter={(value: number) => 
                viewType === 'count' ? value : `${value}%`
              } />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

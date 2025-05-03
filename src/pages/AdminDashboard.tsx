import { useState, useEffect } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, Droplet, Activity, Users, FileBarChart, MapPin, CalendarDays, Loader2, RefreshCw } from "lucide-react";
import { AnalyticsCard } from '@/components/admin/AnalyticsCard';
import { DiseaseAnalysisCard } from '@/components/admin/DiseaseAnalysisCard';
import { RecentAssessmentsTable } from '@/components/admin/RecentAssessmentsTable';
import { DashboardCharts, ChartData } from '@/components/admin/DashboardCharts';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { AIAnalystAgent } from '@/components/admin/AIAnalystAgent';
import { toast } from "sonner";

const AdminDashboard = () => {
  const { assessments, loading, error, refreshData } = useSupabaseData();
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Calculate risk factors based on assessment answers
  const calculateRiskFactors = () => {
    const riskFactorCounts = new Map<string, number>();
    
    assessments.forEach(assessment => {
      if (assessment.answers) {
        // Extract key risk factors based on disease type
        if (assessment.type === 'diabetes') {
          if (assessment.answers.d2 === 'yes') riskFactorCounts.set('Family History', (riskFactorCounts.get('Family History') || 0) + 1);
          if (assessment.answers.d5 === 'unhealthy') riskFactorCounts.set('Poor Diet', (riskFactorCounts.get('Poor Diet') || 0) + 1);
          
          // Calculate BMI if height and weight are available
          if (assessment.answers.d3 && assessment.answers.d4) {
            const height = parseFloat(String(assessment.answers.d4)) / 100; // convert cm to m
            const weight = parseFloat(String(assessment.answers.d3));
            const bmi = weight / (height * height);
            if (bmi > 30) riskFactorCounts.set('Obesity', (riskFactorCounts.get('Obesity') || 0) + 1);
          }
        }
        
        if (assessment.type === 'heartDisease') {
          if (assessment.answers.hd1 === 'yes') riskFactorCounts.set('Hypertension', (riskFactorCounts.get('Hypertension') || 0) + 1);
          if (assessment.answers.hd2 === 'yes') riskFactorCounts.set('High Cholesterol', (riskFactorCounts.get('High Cholesterol') || 0) + 1);
          if (assessment.answers.hd3 === 'yes') riskFactorCounts.set('Family History', (riskFactorCounts.get('Family History') || 0) + 1);
          if (assessment.answers.hd4 === 'sedentary') riskFactorCounts.set('Physical Inactivity', (riskFactorCounts.get('Physical Inactivity') || 0) + 1);
        }
        
        if (assessment.type === 'kidneyDisease') {
          if (assessment.answers.kd1 === 'yes') riskFactorCounts.set('Hypertension', (riskFactorCounts.get('Hypertension') || 0) + 1);
          if (assessment.answers.kd2 === 'yes') riskFactorCounts.set('Diabetes', (riskFactorCounts.get('Diabetes') || 0) + 1);
          if (assessment.answers.kd3 === 'yes') riskFactorCounts.set('Family History', (riskFactorCounts.get('Family History') || 0) + 1);
        }
      }
    });
    
    // Convert to array, calculate percentages and sort by count
    const totalAssessments = assessments.length;
    const riskFactors = Array.from(riskFactorCounts.entries())
      .map(([factor, count]) => ({
        feature: factor,
        importance: totalAssessments > 0 ? count / totalAssessments : 0
      }))
      .sort((a, b) => b.importance - a.importance);
    
    return riskFactors.length > 0 ? riskFactors : [];
  };
  
  const riskFactors = calculateRiskFactors();
  
  // Calculate the various chart data elements
  const riskLevelData = assessments.reduce((acc, assessment) => {
    const level = assessment.riskLevel || 'unknown';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const riskLevelChartData: ChartData[] = Object.entries(riskLevelData).map(([level, count]) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    value: Number(count)
  }));
  
  const diseaseData = assessments.reduce((acc, assessment) => {
    const disease = assessment.type;
    acc[disease] = (acc[disease] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const diseaseChartData: ChartData[] = Object.entries(diseaseData).map(([disease, count]) => ({
    name: disease === 'heartDisease' 
      ? 'Heart Disease' 
      : disease === 'kidneyDisease' 
        ? 'Kidney Disease' 
        : 'Diabetes',
    value: Number(count)
  }));

  const regionData = assessments.reduce((acc, assessment) => {
    const region = assessment.region || 'Unknown';
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const regionChartData: ChartData[] = Object.entries(regionData)
    .map(([region, count]) => ({
      name: region,
      value: Number(count)
    }))
    .sort((a, b) => b.value - a.value);

  // Handle refresh button click with improved error handling and user feedback
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      console.log("Manual refresh initiated");
      await refreshData();
      toast.success("Dashboard data refreshed successfully", {
        description: `${assessments.length} assessments loaded`
      });
    } catch (err) {
      console.error("Error refreshing data:", err);
      toast.error("Failed to refresh data", {
        description: "Please try again or contact support"
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Auto-refresh when the dashboard initially loads
  useEffect(() => {
    console.log("Admin dashboard mounted, refreshing data");
    refreshData().catch(err => {
      console.error("Error fetching initial data:", err);
    });
    
    // Set up periodic refresh
    const intervalId = setInterval(() => {
      console.log("Periodic refresh checking for new assessments");
      refreshData().catch(err => {
        console.error("Periodic refresh error:", err);
      });
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [refreshData]);

  if (loading && assessments.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-[80vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading patient data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Administrator Dashboard</h1>
          <p className="text-muted-foreground">Analytics and insights from patient risk assessments</p>
        </div>
        <div className="flex items-center gap-4">
          <Select 
            defaultValue="all"
            onValueChange={(value) => setTimeFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="flex gap-2 items-center"
          >
            {refreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Assessments"
          value={assessments.length}
          change={assessments.length > 0 ? "From Supabase database" : "No assessments yet"}
          icon={Users}
        />
        <AnalyticsCard
          title="High Risk Patients"
          value={assessments.filter(a => a.riskLevel === 'high').length}
          change="Based on actual assessments"
          icon={FileBarChart}
        />
        <AnalyticsCard
          title="Regions Covered"
          value={Object.keys(regionData).length}
          change={Object.keys(regionData).length > 0 ? "Distinct regions" : "No region data yet"}
          icon={MapPin}
        />
        <AnalyticsCard
          title="Assessments This Week"
          value={assessments.filter(a => {
            const assessmentDate = new Date(a.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return assessmentDate >= weekAgo;
          }).length}
          change="Past 7 days"
          icon={CalendarDays}
        />
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="diseases">Disease Trends</TabsTrigger>
          <TabsTrigger value="regions">Regional Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="space-y-6">
            <DashboardCharts
              riskLevelData={riskLevelChartData}
              diseaseData={diseaseChartData}
              regionData={regionChartData}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="diseases">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DiseaseAnalysisCard
              title="Heart Disease"
              icon={Heart}
              riskData={{
                high: assessments.filter(a => a.type === 'heartDisease' && a.riskLevel === 'high').length,
                moderate: assessments.filter(a => a.type === 'heartDisease' && a.riskLevel === 'moderate').length,
                low: assessments.filter(a => a.type === 'heartDisease' && a.riskLevel === 'low').length
              }}
              riskFactors={[
                'Hypertension',
                'High Cholesterol',
                'Family History',
                'Low Physical Activity'
              ]}
            />
            <DiseaseAnalysisCard
              title="Diabetes"
              icon={Droplet}
              riskData={{
                high: assessments.filter(a => a.type === 'diabetes' && a.riskLevel === 'high').length,
                moderate: assessments.filter(a => a.type === 'diabetes' && a.riskLevel === 'moderate').length,
                low: assessments.filter(a => a.type === 'diabetes' && a.riskLevel === 'low').length
              }}
              riskFactors={[
                'Obesity',
                'Family History',
                'Physical Inactivity',
                'Poor Diet'
              ]}
            />
            <DiseaseAnalysisCard
              title="Kidney Disease"
              icon={Activity}
              riskData={{
                high: assessments.filter(a => a.type === 'kidneyDisease' && a.riskLevel === 'high').length,
                moderate: assessments.filter(a => a.type === 'kidneyDisease' && a.riskLevel === 'moderate').length,
                low: assessments.filter(a => a.type === 'kidneyDisease' && a.riskLevel === 'low').length
              }}
              riskFactors={[
                'Hypertension',
                'Diabetes',
                'Family History',
                'Regular NSAID Use'
              ]}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="regions">
          <div className="space-y-6">
            <UserManagementTable assessments={assessments} />
          </div>
        </TabsContent>
      </Tabs>
      
      <RecentAssessmentsTable assessments={assessments} onRefresh={refreshData} />
      <AIAnalystAgent />
    </div>
  );
};

export default AdminDashboard;

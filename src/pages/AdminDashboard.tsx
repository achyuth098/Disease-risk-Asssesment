import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Heart, Droplet, Activity, Users, FileBarChart, MapPin, CalendarDays } from "lucide-react";
import { BarChart as BarChartIcon, PieChart as PieChartIcon, Map } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { generateMockData } from '@/lib/store';

const AdminDashboard = () => {
  const { assessments, reports, getAnalyticsSummary } = useStore();
  const [timeFilter, setTimeFilter] = useState<string>('all');

  // Load mock data for demonstration
  React.useEffect(() => {
    const { extraAssessments } = generateMockData();
    for (const assessment of extraAssessments) {
      useStore.getState().addAssessment(assessment);
    }
  }, []);

  const analytics = getAnalyticsSummary();
  
  // Prepare data for charts
  const riskLevelData = Object.entries(analytics.assessmentsByRiskLevel).map(([level, count]) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    value: count
  }));
  
  const diseaseData = Object.entries(analytics.assessmentsByDisease).map(([disease, count]) => ({
    name: disease === 'heartDisease' 
      ? 'Heart Disease' 
      : disease === 'kidneyDisease' 
        ? 'Kidney Disease' 
        : 'Diabetes',
    value: count
  }));
  
  const regionData = Object.entries(analytics.assessmentsByRegion)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([region, count]) => ({
      name: region,
      value: count
    }));
    
  const riskFactorsData = analytics.topRiskFactors.map(item => ({
    name: item.factor,
    value: item.count
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

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
          <Button variant="outline">Export Data</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assessments
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAssessments}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High Risk Patients
            </CardTitle>
            <FileBarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.assessmentsByRiskLevel.high || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Regions Covered
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(analytics.assessmentsByRegion).length}</div>
            <p className="text-xs text-muted-foreground">
              +5 new regions this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assessments This Week
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +18.1% from last week
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
          <TabsTrigger value="diseases">Disease Trends</TabsTrigger>
          <TabsTrigger value="risk-factors">Risk Factors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Level Distribution</CardTitle>
                <CardDescription>
                  Breakdown of assessments by risk level
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskLevelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Assessments by Disease Type</CardTitle>
                <CardDescription>
                  Number of assessments conducted per disease category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={diseaseData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Risk Factors</CardTitle>
              <CardDescription>
                Most common risk factors identified across all assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={riskFactorsData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>
                Assessment distribution by region (pincode)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>High Risk Regions</CardTitle>
              <CardDescription>
                Regions with the highest concentration of high-risk patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mumbai (400001)</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500">High Risk</Badge>
                    <span className="text-sm">32 patients</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Delhi (110001)</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500">High Risk</Badge>
                    <span className="text-sm">28 patients</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bangalore (560001)</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500">Moderate Risk</Badge>
                    <span className="text-sm">24 patients</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Chennai (600001)</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500">Moderate Risk</Badge>
                    <span className="text-sm">22 patients</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Kolkata (700001)</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500">Low Risk</Badge>
                    <span className="text-sm">18 patients</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="diseases" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center pb-2">
                <Heart className="h-5 w-5 text-pink-600 mr-2" />
                <div>
                  <CardTitle>Heart Disease</CardTitle>
                  <CardDescription>
                    Assessment trends and risk levels
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">High Risk:</span>
                    <span className="text-sm">{Math.floor(Math.random() * 20) + 10} patients</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Moderate Risk:</span>
                    <span className="text-sm">{Math.floor(Math.random() * 30) + 20} patients</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Low Risk:</span>
                    <span className="text-sm">{Math.floor(Math.random() * 40) + 30} patients</span>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Top Risk Factors</h4>
                    <ol className="pl-5 text-sm list-decimal">
                      <li>Hypertension</li>
                      <li>High Cholesterol</li>
                      <li>Smoking</li>
                      <li>Family History</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center pb-2">
                <Droplet className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <CardTitle>Diabetes</CardTitle>
                  <CardDescription>
                    Assessment trends and risk levels
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">High Risk:</span>
                    <span className="text-sm">{Math.floor(Math.random() * 20) + 10} patients</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Moderate Risk:</span>
                    <span className="text-sm">{Math.floor(Math.random() * 30) + 20} patients</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Low Risk:</span>
                    <span className="text-sm">{Math.floor(Math.random() * 40) + 30} patients</span>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Top Risk Factors</h4>
                    <ol className="pl-5 text-sm list-decimal">
                      <li>Obesity</li>
                      <li>Family History</li>
                      <li>Physical Inactivity</li>
                      <li>Poor Diet</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center pb-2">
                <Activity className="h-5 w-5 text-purple-600 mr-2" />
                <div>
                  <CardTitle>Kidney Disease</CardTitle>
                  <CardDescription>
                    Assessment trends and risk levels
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">High Risk:</span>
                    <span className="text-sm">{Math.floor(Math.random() * 20) + 5} patients</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Moderate Risk:</span>
                    <span className="text-sm">{Math.floor(Math.random() * 25) + 15} patients</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Low Risk:</span>
                    <span className="text-sm">{Math.floor(Math.random() * 30) + 25} patients</span>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Top Risk Factors</h4>
                    <ol className="pl-5 text-sm list-decimal">
                      <li>Hypertension</li>
                      <li>Diabetes</li>
                      <li>Family History</li>
                      <li>Smoking</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="risk-factors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Factor Analysis</CardTitle>
              <CardDescription>
                Prevalence of risk factors across different demographics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Age Group Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">30-45 Age Group</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between text-sm">
                          <span>Lack of Exercise:</span>
                          <span>68%</span>
                        </li>
                        <li className="flex justify-between text-sm">
                          <span>Poor Diet:</span>
                          <span>64%</span>
                        </li>
                        <li className="flex justify-between text-sm">
                          <span>Stress:</span>
                          <span>72%</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">46-60 Age Group</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between text-sm">
                          <span>Hypertension:</span>
                          <span>58%</span>
                        </li>
                        <li className="flex justify-between text-sm">
                          <span>High Cholesterol:</span>
                          <span>52%</span>
                        </li>
                        <li className="flex justify-between text-sm">
                          <span>Obesity:</span>
                          <span>45%</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Regional Risk Factor Variations</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium">Mumbai Region</h4>
                      <p className="text-sm text-muted-foreground">30% of users report smoking, compared to the national average of 22%</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Delhi Region</h4>
                      <p className="text-sm text-muted-foreground">42% of users report respiratory issues, likely correlated with air pollution</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Bangalore Region</h4>
                      <p className="text-sm text-muted-foreground">61% of users report high stress levels, compared to the national average of 48%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
          <CardDescription>Latest risk assessments completed by patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Patient ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Disease Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Risk Level</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Region</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {assessments.slice(0, 5).map((assessment) => (
                  <tr key={assessment.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">{assessment.userId.substring(0, 8)}</td>
                    <td className="p-4 align-middle">
                      {assessment.type === 'heartDisease' && <Heart className="h-4 w-4 text-pink-500 inline mr-1" />}
                      {assessment.type === 'diabetes' && <Droplet className="h-4 w-4 text-blue-500 inline mr-1" />}
                      {assessment.type === 'kidneyDisease' && <Activity className="h-4 w-4 text-purple-500 inline mr-1" />}
                      {assessment.type === 'heartDisease' ? 'Heart Disease' : 
                        assessment.type === 'kidneyDisease' ? 'Kidney Disease' : 'Diabetes'}
                    </td>
                    <td className="p-4 align-middle">{new Date(assessment.date).toLocaleDateString()}</td>
                    <td className="p-4 align-middle">
                      <Badge className={
                        assessment.riskLevel === 'high' ? 'bg-red-500' : 
                        assessment.riskLevel === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                      }>
                        {assessment.riskLevel}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">{assessment.region || 'Unknown'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" size="sm">View All Assessments</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminDashboard;


import { useState, useEffect } from 'react';
import { Heart, Droplet, Activity, RefreshCw, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AssessmentType } from "@/lib/types";
import { PatientDetailsDialog } from "./PatientDetailsDialog";
import { toast } from "sonner";

type RecentAssessmentsTableProps = {
  assessments: AssessmentType[];
  onRefresh: () => Promise<any>; 
};

export const RecentAssessmentsTable = ({ assessments, onRefresh }: RecentAssessmentsTableProps) => {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortedAssessments, setSortedAssessments] = useState<AssessmentType[]>([]);
  const [showCount, setShowCount] = useState(5); // Default showing 5 entries
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Effect to sort assessments whenever the assessments prop changes
  useEffect(() => {
    console.log("Assessments data updated:", assessments.length, "records");
    // Sort assessments by date (newest first)
    const sorted = [...assessments].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setSortedAssessments(sorted);
    setLastUpdate(new Date());
    
    // Show a toast notification when new data arrives
    if (sorted.length > 0 && sorted.length !== sortedAssessments.length) {
      toast.success(`Assessment data updated. Now showing ${sorted.length} assessments`);
    }
  }, [assessments]);

  const handleViewDetails = (assessment: AssessmentType) => {
    setSelectedAssessment(assessment);
    setDialogOpen(true);
  };

  const handleShowMore = () => {
    setShowCount(prevCount => prevCount + 5);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast.success("Assessment data refreshed successfully");
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error("Failed to refresh assessment data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh data periodically (every 30 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing assessment data...");
      onRefresh().then(() => {
        setLastUpdate(new Date());
      }).catch(err => {
        console.error("Auto-refresh error:", err);
      });
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [onRefresh]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Assessments</CardTitle>
            <CardDescription>Latest risk assessments completed by patients</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-sm text-muted-foreground mr-2">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="text-sm text-muted-foreground ml-2">
              Showing {Math.min(showCount, sortedAssessments.length)} of {sortedAssessments.length} assessments
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Disease Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAssessments.slice(0, showCount).map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>{assessment.userId.substring(0, 8)}</TableCell>
                    <TableCell>
                      {assessment.type === 'heartDisease' && <Heart className="h-4 w-4 text-pink-500 inline mr-1" />}
                      {assessment.type === 'diabetes' && <Droplet className="h-4 w-4 text-blue-500 inline mr-1" />}
                      {assessment.type === 'kidneyDisease' && <Activity className="h-4 w-4 text-purple-500 inline mr-1" />}
                      {assessment.type === 'heartDisease' ? 'Heart Disease' : 
                        assessment.type === 'kidneyDisease' ? 'Kidney Disease' : 'Diabetes'}
                    </TableCell>
                    <TableCell>{new Date(assessment.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={
                        assessment.riskLevel === 'high' ? 'bg-red-500' : 
                        assessment.riskLevel === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                      }>
                        {assessment.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>{assessment.region}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(assessment)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedAssessments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                      No assessments found. Waiting for patient submissions...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {sortedAssessments.length > showCount && (
            <Button variant="outline" size="sm" onClick={handleShowMore}>
              Show More
            </Button>
          )}
        </CardFooter>
      </Card>

      <PatientDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        assessment={selectedAssessment}
        patientHistory={sortedAssessments.filter(a => a.userId === selectedAssessment?.userId)}
      />
    </>
  );
};


import { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, UserRound } from "lucide-react";
import { AssessmentType } from '@/lib/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useStore } from '@/lib/store';

type UserData = {
  userId: string;
  name: string;
  email: string;
  lastAssessmentDate: string;
  riskLevel: 'low' | 'moderate' | 'high';
  riskScore: number;
  region: string;
  diseaseType: string;
};

type UserManagementTableProps = {
  assessments: AssessmentType[];
};

export const UserManagementTable = ({ assessments }: UserManagementTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const itemsPerPage = 8;
  
  // Process assessments into user data whenever assessments change
  useEffect(() => {
    // Group assessments by userId and get the latest assessment for each user
    const userDataMap = new Map<string, UserData>();
    
    assessments.forEach(assessment => {
      if (!assessment.region) return; // Skip entries without region data
      
      // Validate that the region is in the format "City, State"
      const regionParts = assessment.region.split(',');
      if (regionParts.length !== 2) return; // Skip entries with invalid region format
      
      const existingData = userDataMap.get(assessment.userId);
      const currentDate = new Date(assessment.date);
      
      // Generate user data with pseudo-identifiable info but maintain privacy
      const userData: UserData = {
        userId: assessment.userId,
        name: `Patient ${assessment.userId.substring(0, 4)}`,
        email: `patient${assessment.userId.substring(0, 4)}@healthapp.com`,
        lastAssessmentDate: assessment.date,
        riskLevel: assessment.riskLevel || 'low',
        riskScore: assessment.riskScore || 0,
        region: assessment.region,
        diseaseType: assessment.type
      };
      
      // If no existing data or this assessment is newer, update
      if (!existingData || new Date(existingData.lastAssessmentDate) < currentDate) {
        userDataMap.set(assessment.userId, userData);
      }
    });
    
    // Convert map to array
    setUsersData(Array.from(userDataMap.values()));
  }, [assessments]);
  
  // Apply filters whenever filters or user data changes
  useEffect(() => {
    let filtered = [...usersData];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply risk level filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter(user => user.riskLevel === riskFilter);
    }
    
    // Apply region filter
    if (regionFilter !== 'all') {
      filtered = filtered.filter(user => user.region === regionFilter);
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
    
  }, [usersData, searchTerm, riskFilter, regionFilter]);
  
  // Get unique regions for the filter - only US states
  const regions = [...new Set(assessments.map(a => a.region || 'Unknown'))];
  
  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5" />
          Patient Management
        </CardTitle>
        <CardDescription>View and filter patient risk assessments from US locations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-40">
              <Select 
                value={riskFilter} 
                onValueChange={setRiskFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="moderate">Moderate Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-40">
              <Select 
                value={regionFilter} 
                onValueChange={setRegionFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Last Assessment</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map(user => (
                <TableRow key={user.userId}>
                  <TableCell className="font-mono">{user.userId.substring(0, 8)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-muted-foreground text-sm">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(user.lastAssessmentDate).toLocaleDateString()}</TableCell>
                  <TableCell>{user.riskScore}%</TableCell>
                  <TableCell>
                    <Badge className={
                      user.riskLevel === 'high' ? 'bg-red-500' : 
                      user.riskLevel === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                    }>
                      {user.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.region}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">View Profile</Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    {assessments.length === 0 
                      ? "No patient assessments have been completed yet" 
                      : "No patients found matching the current filters"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {paginatedUsers.length} of {filteredUsers.length} patients
        </div>
        <Button variant="outline" size="sm">Export Data</Button>
      </CardFooter>
    </Card>
  );
};

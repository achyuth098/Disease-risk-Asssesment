
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminFilters } from "@/lib/types";
import { Filter } from "lucide-react";

type FilterControlsProps = {
  filters: AdminFilters;
  onFilterChange: (key: keyof AdminFilters, value: string) => void;
  regions: string[];
}

export const FilterControls = ({ filters, onFilterChange, regions }: FilterControlsProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>
      
      <Select
        value={filters.ageGroup}
        onValueChange={(value) => onFilterChange('ageGroup', value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Age Group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ages</SelectItem>
          <SelectItem value="18-30">18-30</SelectItem>
          <SelectItem value="31-45">31-45</SelectItem>
          <SelectItem value="46-60">46-60</SelectItem>
          <SelectItem value="60+">60+</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.gender}
        onValueChange={(value) => onFilterChange('gender', value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genders</SelectItem>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.region}
        onValueChange={(value) => onFilterChange('region', value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          {regions.map((region) => (
            <SelectItem key={region} value={region}>{region}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.riskLevel}
        onValueChange={(value) => onFilterChange('riskLevel', value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Risk Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Risks</SelectItem>
          <SelectItem value="low">Low Risk</SelectItem>
          <SelectItem value="moderate">Moderate Risk</SelectItem>
          <SelectItem value="high">High Risk</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.diseaseType}
        onValueChange={(value) => onFilterChange('diseaseType', value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Disease Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Diseases</SelectItem>
          <SelectItem value="diabetes">Diabetes</SelectItem>
          <SelectItem value="heartDisease">Heart Disease</SelectItem>
          <SelectItem value="kidneyDisease">Kidney Disease</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

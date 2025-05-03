
import React from 'react';
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface FileUploadProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ file, onFileChange }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">Upload medical reports (optional)</h2>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-700">
            Upload your medical reports to improve assessment accuracy
          </span>
        </div>
        
        <Card className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center bg-white">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop your files here, or click to browse
          </p>
          <Label 
            htmlFor="file-upload" 
            className="cursor-pointer bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
          >
            Browse Files
          </Label>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={onFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          {file && (
            <div className="mt-4 text-sm text-gray-700 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              {file.name}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

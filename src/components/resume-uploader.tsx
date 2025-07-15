'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { UploadCloud, Loader2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ResumeUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ResumeUploader({ onFileUpload, isLoading, disabled = false }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const acceptedFile = acceptedFiles[0];
      if (acceptedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a resume smaller than 5MB.',
        });
        return;
      }
      setFile(acceptedFile);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled: disabled || isLoading,
  });
  
  const handleSubmit = () => {
    if (file) {
      onFileUpload(file);
    } else {
        toast({
            title: 'No file selected',
            description: 'Please select a resume file to analyze.',
        })
    }
  };


  return (
    <Card className="w-full max-w-lg mx-auto p-2 shadow-lg" disabled={disabled}>
      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors',
          isDragActive ? 'border-primary bg-primary/10' : 'border-border',
          disabled ? 'cursor-not-allowed bg-muted/50' : 'cursor-pointer hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold text-foreground">
              {isDragActive ? "Drop your resume here" : "Drag & drop your resume here, or click to select"}
            </p>
            <p className="text-xs text-muted-foreground">PDF or DOCX (max 5MB)</p>
        </div>
      </div>
      
      {file && (
        <div className="mt-4 flex items-center justify-between rounded-md border bg-secondary/50 p-3">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary"/>
              <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
            </div>
          <Button variant="ghost" size="sm" onClick={() => setFile(null)} disabled={isLoading}>Remove</Button>
        </div>
      )}

      <div className="p-4">
        <Button onClick={handleSubmit} disabled={isLoading || !file || disabled} className="w-full font-bold">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Resume'
          )}
        </Button>
      </div>
    </Card>
  );
}

// A placeholder card component to avoid breaking changes if it doesn't exist.
const Card = ({ className, children, disabled }: { className?: string, children: React.ReactNode, disabled?: boolean }) => (
    <div className={cn('bg-card text-card-foreground rounded-xl border', disabled && 'opacity-50', className)}>{children}</div>
)
